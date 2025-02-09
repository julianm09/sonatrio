"use client";

import styles from "./page.module.scss";
import { useUserContext } from "@/context/UserContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SuccessPage: React.FC = () => {
	const { user } = useUserContext();

	const router = useRouter();

	useEffect(() => {
		if (user){
			router.push("/")
		}
			router.push("/")
		},[user, router])

	return (
		<div className={styles["container"]}>
			Success
		</div>
	);
};

export default SuccessPage;
