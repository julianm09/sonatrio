import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:3000", // Replace with your frontend's URL
        methods: ["GET", "POST"],
        credentials: true,
    })
);

app.use("/api", userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
