"use client";

import { createSubscription, openBillingPortal } from "@/utils/api/stripeApi";
import styles from "./page.module.scss";
import { useUserContext } from "@/context/UserContext";

const PricingPage: React.FC = () => {
	const { user } = useUserContext();

	const handleCreate = async () => {
		if (user) {
			const checkoutSession = await createSubscription(
				"price_1Qn3NaAIYD4tVP6JmWMZqiDx",
				"juliantmayes@gmail.com",
				user.id
			);

			console.log(checkoutSession);
		}
	};

    const handlePro = async () => {
		if (user) {
			const checkoutSession = await createSubscription(
				"price_1Qn3NuAIYD4tVP6Js765RV2u",
				"juliantmayes@gmail.com",
				user.id
			);

			console.log(checkoutSession);
		}
	};

	const handleBilling = async () => {
		const checkoutSession = await openBillingPortal(
			"cs_test_a1kxl0bnDZhhj7KMrJqDCWY4h6ou97KrABX9b1nbfyArNB5fRghd3k286f"
		);

		console.log(checkoutSession);
	};

	return (
		<div className={styles["container"]}>
			pricing
			<button onClick={() => handleCreate()}>10</button>
            <button onClick={() => handlePro()}>30</button>
			<button onClick={() => handleBilling()}>billing</button>
		</div>
	);
};

export default PricingPage;
