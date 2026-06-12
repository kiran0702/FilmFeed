import dotenv from "dotenv";
import express from "express";
import movieRoutes from "./routes/movieRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import { seedDatabase } from "./config/seed.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
dotenv.config();
const PORT = process.env.PORT || 5001;
const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use("/api/movies", movieRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log("Server Started Successfully");
    });
  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
