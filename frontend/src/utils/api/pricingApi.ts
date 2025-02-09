import axios from "axios";
import { API_BASE_URL_LOCAL } from "./contentApi";

export const fetchPricing = async () => {
	try {
		const response = await axios.get(`${API_BASE_URL_LOCAL}/api/pricing`);
		return response.data;
	} catch (error) {
		console.error("Error fetching pricing:", error);
		throw new Error("Failed to fetch pricing.");
	}
};
