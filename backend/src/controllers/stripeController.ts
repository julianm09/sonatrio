import { Request, Response } from "express";
import { stripe } from "../utils/stripe";
import { supabase } from "../utils/supabase";

export const createSubscription = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { priceId, customerEmail, userId } = req.body;

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
		const { error } = await supabase
			.from("users") // Assuming you have a 'users' table
			.update({ stripe_customer_id: customer.id })
			.eq("user_id", userId);

		if (error) {
			console.error("Error storing stripe_customer_id:", error.message);
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
