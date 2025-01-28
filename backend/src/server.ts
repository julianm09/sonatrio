import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import contentRoutes from "./routes/contentRoutes"

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

app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ limit: '1000mb', extended: true }));

app.use("/api", contentRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
