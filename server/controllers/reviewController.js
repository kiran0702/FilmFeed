import asyncHandler from "express-async-handler";
import Review from "../models/reviewModel.js";
import { logActivity } from "./activityController.js";
import User from "../models/userModel.js"; // Needed for checking if user exists

export const createReview = asyncHandler(async (req, res) => {
  const { movieId, rating, reviewText, movieDetails } = req.body;
  const userId = req.user._id;

  const review = await Review.create({
    user: userId,
    movieId,
    rating,
    reviewText,
  });

  if (movieDetails) {
     await logActivity(userId, "REVIEW_ADD", movieDetails);
  }

  res.status(201).json(review);
});

export const getUserReviews = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  const startIndex = (page - 1) * limit;

  const reviews = await Review.find({ user: userId })
    .populate('user', 'name username avatar')
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  const total = await Review.countDocuments({ user: userId });

  res.status(200).json({
    reviews,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

export const getMovieReviews = asyncHandler(async (req, res) => {
  const movieId = req.params.movieId;
  
  const reviews = await Review.find({ movieId })
    .populate('user', 'name username avatar')
    .sort({ createdAt: -1 });

  res.status(200).json(reviews);
});
