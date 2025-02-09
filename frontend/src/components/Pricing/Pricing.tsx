"use client";

import styles from "./Pricing.module.scss";
import { useUserContext } from "@/context/UserContext";
import { useUserSubscription } from "@/hooks/useUserSubscription";
import { useUserProfile } from "@/hooks/useUserProfile";
import { createSubscription, openBillingPortal } from "@/utils/api/stripeApi";
import CancelSubscription from "../CancelSubscription/CancelSubscription";

const pricingPlans = [
	{
		title: "Free",
		tier: "free",
		price: "Free",
		features: ["30 Credits", "1 Hours"],
	},
	{
		title: "Standard",
		tier: "standard",
		price: "$10 USD",
		features: ["1200 Credits", "20 Hours"],
		priceId: "price_1Qn3NaAIYD4tVP6JmWMZqiDx",
	},
	{
		title: "Pro",
		tier: "pro",
		price: "$30 USD",
		features: ["3600 Credits", "50 Hours"],
		priceId: "price_1Qn3NuAIYD4tVP6Js765RV2u",
	},
];

const Pricing: React.FC = () => {
	const { user } = useUserContext();
	const { profile } = useUserProfile();
	const { subscription } = useUserSubscription();

	const handleSubscription = async (priceId: string | undefined) => {
		if (user) {
			await createSubscription(priceId, user.email, user.id);
		}
	};

	const handleBilling = async () => {
		await openBillingPortal(subscription?.stripe_session_id);
	};

	return (
		<div className={styles["pricingContainer"]}>
			{pricingPlans.map((plan, index) => (
				<div key={index} className={styles["card"]}>
					<h3 className={styles["title"]}>{plan.title}</h3>
					<p className={styles["price"]}>{plan.price}</p>
					<ul className={styles["features"]}>
						{plan.features.map((feature, i) => (
							<li key={i}>{feature}</li>
						))}
					</ul>

					{profile?.tier === plan.tier && (
						<button
							className={`${styles["button"]} ${styles["disabled"]}`}
						>
							You have this plan
						</button>
					)}

					{subscription &&
						subscription.status === "active" &&
						profile?.tier !== plan.tier && (
							<button
								className={`${styles["button"]}`}
								onClick={handleBilling}
							>
								Update Plan
							</button>
						)}

					{(subscription?.status === "pending" || !subscription) &&
						profile?.tier !== plan.tier && (
							<button
								className={`${styles["button"]}`}
								onClick={() => handleSubscription(plan.priceId)}
							>
								Choose this plan
							</button>
						)}
				</div>
			))}

			<CancelSubscription />
		</div>
	);
};

export default Pricing;
