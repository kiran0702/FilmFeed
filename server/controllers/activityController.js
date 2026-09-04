import asyncHandler from "express-async-handler";
import Activity from "../models/activityModel.js";

export const getUserActivity = asyncHandler(async (req, res) => {
  const userId = req.user._id; // assume auth middleware populates req.user
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  const startIndex = (page - 1) * limit;

  const activities = await Activity.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  const total = await Activity.countDocuments({ user: userId });

  res.status(200).json({
    activities,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

export const logActivity = async (userId, actionType, movie) => {
  try {
    await Activity.create({
      user: userId,
      actionType,
      movie: {
        id: movie.id,
        title: movie.title,
        posterPath: movie.posterPath,
        releaseYear: movie.releaseYear,
        overview: movie.overview,
      }
    });
  } catch (error) {
    console.error("Failed to log activity", error);
  }
};
