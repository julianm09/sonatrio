import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import contentRoutes from "./routes/contentRoutes";
import conversationsRoutes from "./routes/conversationsRoutes";
import messagesRoutes from "./routes/messagesRoutes";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

app.use("/api", contentRoutes);
app.use("/api", conversationsRoutes);
app.use("/api", messagesRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
