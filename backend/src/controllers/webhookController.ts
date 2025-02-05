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

// Function to update Supabase subscriptions table
const updateSubscription = async (subscription: any) => {
	const { id, customer, items, status } = subscription;
	const priceId = items.data[0]?.price.id || null;

	const { error } = await supabase
		.from("subscriptions")
		.update({
			stripe_customer_id: customer,
			stripe_subscription_id: id,
			price_id: priceId,
			status: status,
			updated_at: new Date().toISOString(),
		})
		.eq("stripe_customer_id", customer);

	if (error) {
		console.error(
			"Failed to update subscription in Supabase:",
			error.message
		);
	} else {
		console.log(`Subscription ${id} updated successfully.`);
	}
};

// Function to delete subscription from Supabase
const deleteSubscription = async (subscription: any) => {
	const { customer } = subscription;

	// Delete the subscription record
	const { error } = await supabase
		.from("subscriptions")
		.delete()
		.eq("stripe_customer_id", customer);

	if (error) {
		console.error("Failed to delete subscription in Supabase:", error.message);
	} else {
		console.log(`Subscription for customer ${customer} deleted successfully.`);
	}
};

