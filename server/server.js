import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import templateRoutes from "./routes/templateRoutes.js";
import path from "path";
import env from "dotenv";
import { fileURLToPath } from "url";
env.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "public")));
app.use("/api", templateRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
