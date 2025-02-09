"use client";

import styles from "./CancelSubscription.module.scss";
import { useUserContext } from "@/context/UserContext";
import { cancelSubscription } from "@/utils/api/stripeApi";
import { useState } from "react";

const CancelSubscription: React.FC = () => {
	const { user } = useUserContext();
	const [confirm, setConfirm] = useState(false);

	const confirmCancelSubscription = async () => {
		if (user) {
			await cancelSubscription(user.id);
		}
	};

	return (
		<div className={styles["container"]}>
			<div className={styles["button"]} onClick={() => setConfirm(true)}>
				Cancel Subscription
			</div>

			{confirm && (
				<div className={styles["modal"]}>
					<div>Are you sure?</div>
					<div
						className={styles["button"]}
						onClick={confirmCancelSubscription}
					>
						Yes
					</div>
				</div>
			)}
		</div>
	);
};

export default CancelSubscription;
