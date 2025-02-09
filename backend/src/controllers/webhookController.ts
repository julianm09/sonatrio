import { Request, Response } from "express";
import { stripe } from "../utils/stripe";
import { supabase } from "../utils/supabase";

//webhook
export const handleStripeWebhook = async (
	req: Request,
	res: Response
): Promise<void> => {
	let event = req.body;
	// Replace this endpoint secret with your endpoint's unique secret
	// If you are testing with the CLI, find the secret by running 'stripe listen'
	// If you are using an endpoint defined with the API or dashboard, look in your webhook settings
	// at https://dashboard.stripe.com/webhooks
	const endpointSecret =
		"whsec_56a72e404ae9ab83b112125388f89d4f65a405080a5f0d4462921aee2bd08557";
	// Only verify the event if you have an endpoint secret defined.
	// Otherwise use the basic event deserialized with JSON.parse
	if (endpointSecret) {
		// Get the signature sent by Stripe
		const signature = req.headers["stripe-signature"];
		try {
			event = stripe.webhooks.constructEvent(
				req.body,
				signature,
				endpointSecret
			);
		} catch (err) {
			err instanceof Error &&
				console.log(
					`⚠️  Webhook signature verification failed.`,
					err.message
				);
			res.sendStatus(400);
			return;
		}
	}
	let subscription: any;
	let status: string;

	switch (event.type) {
		case "customer.subscription.created":
		case "customer.subscription.updated":
			subscription = event.data.object;
			status = subscription.status;
			console.log(`Updating subscription status: ${status}`);
			console.log(`subscription`, subscription);

			await updateSubscription(subscription);
			break;

		case "customer.subscription.deleted":
			subscription = event.data.object;
			status = subscription.status;
			console.log(`Subscription deleted: ${status}`);

			await deleteSubscription(subscription);
			break;

		default:
			console.log(`Unhandled event type: ${event.type}`);
	}

	res.sendStatus(200);
};

// Update Subscription
const updateSubscription = async (subscriptions: any) => {
	try {
		const { id, customer, items, status } = subscriptions;
		const priceId = items?.data?.[0]?.price?.id || null;

		if (!customer) {
			throw new Error("Customer ID is missing.");
		}

		// Fetch user's user_id and subscription tier in parallel
		const [
			{ data: userData, error: userError },
			{ data: priceData, error: priceError },
		] = await Promise.all([
			supabase
				.from("users")
				.select("user_id")
				.eq("stripe_customer_id", customer)
				.single(),
			supabase
				.from("pricing")
				.select("tier, transcription_credits")
				.eq("price_id", priceId)
				.single(),
		]);

		if (userError)
			throw new Error("Failed to fetch user data: " + userError.message);
		if (priceError)
			throw new Error(
				"Failed to fetch pricing data: " + priceError.message
			);

		const { user_id } = userData || {};
		const { tier, transcription_credits } = priceData || {};

		// Perform both updates in parallel
		const [{ error: subscriptionError }, { error: userUpdateError }] =
			await Promise.all([
				// Update subscription
				supabase
					.from("subscriptions")
					.update({
						stripe_customer_id: customer,
						stripe_subscription_id: id,
						price_id: priceId,
						status: status,
						updated_at: new Date().toISOString(),
					})
					.eq("stripe_customer_id", customer),

				// Update user tier and reset credits
				supabase
					.from("users")
					.update({
						tier: tier,
						subscription_start_date: new Date().toISOString(),
					})
					.eq("stripe_customer_id", customer),
			]);

		if (subscriptionError)
			throw new Error(
				"Failed to update subscription: " + subscriptionError.message
			);
		if (userUpdateError)
			throw new Error(
				"Failed to update user data: " + userUpdateError.message
			);

		// Reset transcription credits
		const { error: creditsError } = await supabase
			.from("transcription_credits")
			.update({
				month: new Date().toISOString(),
				monthly_credits: transcription_credits,
				used_credits: 0,
			})
			.eq("user_id", user_id);

		if (creditsError)
			throw new Error(
				"Failed to update transcription credits: " +
					creditsError.message
			);

		console.log("Subscription update successful!");
	} catch (error) {
		if (error instanceof Error) console.error(error.message);
	}
};

// Function to delete subscription from Supabase
const deleteSubscription = async (subscription: any) => {
	const { customer } = subscription;

	if (!customer) {
		console.error("No customer ID provided. Cannot proceed.");
		return;
	}

	// Delete the subscription record
	const { error: subscriptionsError } = await supabase
		.from("subscriptions")
		.delete()
		.eq("stripe_customer_id", customer);

	if (subscriptionsError) {
		console.error(
			"Failed to delete subscription in Supabase:",
			subscriptionsError.message
		);
		return;
	}

	// Get User ID associated with the subscription
	const { data: userData, error: userError } = await supabase
		.from("users")
		.select("user_id")
		.eq("stripe_customer_id", customer)
		.single();

	if (userError || !userData) {
		console.error(
			"Failed to get user_id:",
			userError?.message || "User not found."
		);
		return;
	}

	const { user_id } = userData;

	// Reset transcription credits for the user
	const { error: creditsError } = await supabase
		.from("transcription_credits")
		.update({
			month: new Date().toISOString(),
			monthly_credits: 30,
			used_credits: 0,
		})
		.eq("user_id", user_id);

	if (creditsError) {
		console.error(
			"Failed to update credits in Supabase:",
			creditsError.message
		);
		return;
	}

	// Update user tier to "free"
	const { error: tierError } = await supabase
		.from("users")
		.update({ tier: "free" })
		.eq("user_id", user_id);

	if (tierError) {
		console.error("Failed to update user tier:", tierError.message);
		return;
	}

	console.log(
		`Subscription for customer ${customer} deleted, credits reset, and user ${user_id} tier updated to "free".`
	);
};
