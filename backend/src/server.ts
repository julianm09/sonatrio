import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import contentRoutes from "./routes/contentRoutes";
import conversationsRoutes from "./routes/conversationsRoutes";
import messagesRoutes from "./routes/messagesRoutes";
import testRoutes from "./routes/test";
import startCronJobs from "./cron/scheduler";
import stripeRoutes from "./routes/stripeRoutes";
import webhookRoutes from "./routes/webhookRoutes";
import creditsRoutes from "./routes/creditsRoutes";
import pricingRoutes from "./routes/pricingRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const prod = "https://sonatrio-julian-mayes-projects.vercel.app";
const local = "http://localhost:3000";

app.use(
	cors({
		origin: local, // Frontend URL - No trailing slash
		methods: ["GET", "POST"],
		credentials: true,
	})
);

app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api", webhookRoutes);

app.use(express.json({ limit: "10mb" }));

app.use("/api", contentRoutes);
app.use("/api", conversationsRoutes);
app.use("/api", messagesRoutes);
app.use("/test", testRoutes);
app.use("/api", stripeRoutes);
app.use("/api", creditsRoutes);
app.use("/api", pricingRoutes);

// ✅ Start cron jobs
startCronJobs();

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
