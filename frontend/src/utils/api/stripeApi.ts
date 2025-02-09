import axios from "axios";
import { API_BASE_URL_LOCAL } from "./contentApi";

export const createSubscription = async (
	priceId: string | undefined,
	email: string | undefined,
	userId: string
) => {
	try {
		const res = await axios.post(
			`${API_BASE_URL_LOCAL}/api/create-subscription`,
			{
				priceId,
				customerEmail: email,
				userId,
			}
		);

		window.location.href = res.data.url; // Redirect to Stripe checkout
	} catch (error) {
		console.error("Error creating subscription:", error);
	}
};

export const openBillingPortal = async (session_id: string | undefined) => {
	try {
		const res = await axios.post(
			`${API_BASE_URL_LOCAL}/api/update-billing`,
			{
				session_id,
			}
		);

		window.location.href = res.data.url; // Redirect user to Stripe portal
	} catch (error) {
		console.error("Error creating subscription:", error);
	}
};

export const cancelSubscription = async (userId: string) => {
	try {
		const res = await axios.post(
			`${API_BASE_URL_LOCAL}/api/cancel-subscription`,
			{
				userId,
			}
		);

		return res.data;
	} catch (error) {
		console.error("Error creating subscription:", error);
	}
};
