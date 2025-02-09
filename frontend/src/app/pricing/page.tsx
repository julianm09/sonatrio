import styles from "./page.module.scss";
import Pricing from "@/components/Pricing/Pricing";

const PricingPage: React.FC = () => {
	return (
		<div className={styles["container"]}>
			<Pricing />
		</div>
	);
};

export default PricingPage;
