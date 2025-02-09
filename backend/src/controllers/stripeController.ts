import { Request, Response } from "express";
import { stripe } from "../utils/stripe";
import { supabase } from "../utils/supabase";

export const createSubscription = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { priceId, customerEmail, userId } = req.body;

		console.log(userId);

		// Check if customer already exists
		const existingCustomers = await stripe.customers.list({
			email: customerEmail,
			limit: 1, // We only need one matching customer
		});

		let customer =
			existingCustomers.data.length > 0
				? existingCustomers.data[0] // Use existing customer
				: await stripe.customers.create({ email: customerEmail }); // Create new customer if not found

		// Store stripe_customer_id in Supabase
		const user = await supabase
			.from("users") // Assuming you have a 'users' table
			.update({ stripe_customer_id: customer.id })
			.eq("user_id", userId);

		if (!user) {
			console.error("Error storing stripe_customer_id:");
			res.status(500).json({ error: "Failed to update user record" });
			return;
		}

		// Step 2: Check if customer already has an active subscription
		const subscriptions = await stripe.subscriptions.list({
			customer: customer.id,
			status: "active",
			limit: 1,
		});

		if (subscriptions.data.length > 0) {
			res.status(400).json({
				error: "You already have an active subscription.",
			});

			return;
		}

		// Create Checkout Session
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			mode: "subscription",
			customer: customer.id,
			line_items: [
				{
					price: priceId, // This is the price ID from your Stripe dashboard
					quantity: 1,
				},
			],
			success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.FRONTEND_URL}/cancel`,
		});

		console.log(priceId);

		const subscription = await supabase.from("subscriptions").upsert(
			{
				user_id: userId,
				stripe_session_id: session.id,
				stripe_customer_id: session.customer,
				price_id: priceId, // Ensure this updates
				status: "pending",
				created_at: new Date().toISOString(), // Only relevant for new rows
				updated_at: new Date().toISOString(),
			},
			{ onConflict: "stripe_customer_id" }
		);

		console.log(subscription);

		res.json({ url: session.url });
	} catch (err) {
		err instanceof Error && res.status(500).json({ error: err.message });
	}
};

export const updateBilling = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { session_id } = req.body;

		console.log("Received session ID:", session_id);

		// Retrieve the Checkout session to get the customer ID
		const checkoutSession = await stripe.checkout.sessions.retrieve(
			session_id
		);

		if (!checkoutSession.customer) {
			res.status(400).json({ error: "Customer ID not found in session" });
			return;
		}

		// The return URL after user finishes managing their billing
		const returnUrl = process.env.FRONTEND_URL || "http://localhost:3000";

		// Create a billing portal session
		const portalSession = await stripe.billingPortal.sessions.create({
			customer: checkoutSession.customer.toString(),
			return_url: returnUrl,
		});

		res.json({ url: portalSession.url });
	} catch (err) {
		console.error("Error creating Billing Portal session:", err);
		err instanceof Error && res.status(500).json({ error: err.message });
	}
};

export const cancelSubscription = async (
	req: Request,
	res: Response
): Promise<void> => {
	const userId = req.body.userId;
	if (!userId) {
		console.error("No user ID provided. Cannot proceed.");
		return;
	}

	// Get the customer ID associated with the user
	const { data: userData, error: userError } = await supabase
		.from("users")
		.select("stripe_customer_id")
		.eq("user_id", userId)
		.single();

	if (userError || !userData) {
		console.error(
			"Failed to get customer ID:",
			userError?.message || "User not found."
		);
		return;
	}

	const { stripe_customer_id: customer } = userData;

	if (!customer) {
		console.error("No Stripe customer ID found for the user.");
		return;
	}

	// Cancel the subscription in Stripe
	try {
		const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
		const subscriptions = await stripe.subscriptions.list({ customer });

		for (const subscription of subscriptions.data) {
			await stripe.subscriptions.cancel(subscription.id);
		}
	} catch (error: any) {
		console.error(
			"Failed to cancel subscription in Stripe:",
			error.message
		);
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

	// Reset transcription credits for the user
	const { error: creditsError } = await supabase
		.from("transcription_credits")
		.update({
			month: new Date().toISOString(),
			monthly_credits: 30,
			used_credits: 0,
		})
		.eq("user_id", userId);

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
		.eq("user_id", userId);

	if (tierError) {
		console.error("Failed to update user tier:", tierError.message);
		return;
	}

	res.status(200).json({
		message: `Subscription for user ${userId} canceled in Stripe, deleted in Supabase, credits reset, and tier updated to "free".`,
	});
};
