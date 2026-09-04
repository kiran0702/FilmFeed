import express from "express";
import { createReview, getUserReviews, getMovieReviews } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/user/:userId", getUserReviews);
router.get("/movie/:movieId", getMovieReviews);

export default router;
