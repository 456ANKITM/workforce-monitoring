import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { initSocket } from "./socket.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import connectCloudinary from "./config/cloudinary.js";


dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "https://workforce-monitoring.vercel.app",  "https://workforce-monitoring-whtu.vercel.app"],
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("The DATABASE is connected and BACKEND is Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

const startServer = async () => {
  try {
    await connectDB();
    await connectCloudinary();


    const server = http.createServer(app);

    initSocket(server);

    server.listen(PORT,()=>{
      console.log(`Server running on port ${PORT}`)
    })
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();