import User from "../models/userModel.js";
import { normalizeMovieSnapshot, sanitizeUser } from "./authController.js";
import asyncHandler from "express-async-handler";
import { logActivity } from "./activityController.js";
export const getCurrentUser = asyncHandler(async (req, res) => {
  const authenticatedUser = await User.findOne({ id: req.user.id });

  if (!authenticatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ user: sanitizeUser(authenticatedUser) });
});

const toggleMovieCollection = (movie, collection = []) => {
  const normalizedMovie = normalizeMovieSnapshot(movie);
  const existingIndex = collection.findIndex(
    (item) => String(item.id) === String(normalizedMovie.id),
  );

  if (existingIndex >= 0) {
    return collection.filter(
      (item) => String(item.id) !== String(normalizedMovie.id),
    );
  }

  return [...collection, normalizedMovie];
};

const toggleListHandler = (field) =>
  asyncHandler(async (req, res) => {
    const movie = req.body?.movie;

    if (!movie?.id || !movie?.title) {
      return res.status(400).json({ message: "movie payload is required" });
    }

    const authenticatedUser = await User.findOne({ id: req.user.id });

    if (!authenticatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const wasAdded = !authenticatedUser[field]?.some(
      (item) => String(item.id) === String(movie.id)
    );

    authenticatedUser[field] = toggleMovieCollection(
      movie,
      authenticatedUser[field] || [],
    );

    await authenticatedUser.save();

    if (wasAdded) {
      let actionType = "WATCHLIST_ADD";
      if (field === "favorites") actionType = "FAVORITE_ADD";
      if (field === "watchedMovies") actionType = "WATCHED_ADD";
      await logActivity(authenticatedUser._id, actionType, movie);
    }

    return res.status(200).json({ user: sanitizeUser(authenticatedUser) });
  });

export const toggleFavorite = toggleListHandler("favorites");

export const toggleWatchlist = toggleListHandler("watchlist");

export const toggleWatched = toggleListHandler("watchedMovies");

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: 1 });

  return res.status(200).json({
    count: users.length,
    users: users.map(sanitizeUser),
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ id: req.user.id });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.name = req.body.name || user.name;
  user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
  user.username = req.body.username || user.username;

  if (req.body.avatarUrl) {
    user.avatar = req.body.avatarUrl;
  } else if (req.file) {
    user.avatar = req.file.path;
  }

  await user.save();
  return res.status(200).json({ user: sanitizeUser(user) });
});

export const followUser = asyncHandler(async (req, res) => {
  const userToFollow = await User.findById(req.params.id);
  const currentUser = await User.findOne({ id: req.user.id });

  if (userToFollow && currentUser) {
    if (!currentUser.following.includes(userToFollow._id)) {
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);
      await currentUser.save();
      await userToFollow.save();
    }
    return res.status(200).json({ message: "Successfully followed user", user: sanitizeUser(currentUser) });
  }
  res.status(404).json({ message: "User not found" });
});

export const unfollowUser = asyncHandler(async (req, res) => {
  const userToUnfollow = await User.findById(req.params.id);
  const currentUser = await User.findOne({ id: req.user.id });

  if (userToUnfollow && currentUser) {
    currentUser.following = currentUser.following.filter(id => id.toString() !== userToUnfollow._id.toString());
    userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== currentUser._id.toString());
    
    await currentUser.save();
    await userToUnfollow.save();
    return res.status(200).json({ message: "Successfully unfollowed user", user: sanitizeUser(currentUser) });
  }
  res.status(404).json({ message: "User not found" });
});
