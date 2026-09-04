import User from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";

const normalizeEmail = (email) => email.trim().toLowerCase();

export const normalizeMovieSnapshot = (movie = {}) => ({
  id: movie.id,
  title: movie.title,
  posterPath: movie.posterPath ?? movie.poster_path ?? null,
  backdropPath: movie.backdropPath ?? movie.backdrop_path ?? null,
  rating: Number(movie.rating ?? movie.vote_average ?? 0),
  releaseYear:
    movie.releaseYear ??
    (movie.release_date ? Number(String(movie.release_date).slice(0, 4)) : null),
  overview: movie.overview ?? "",
  genres: Array.isArray(movie.genres)
    ? movie.genres
    : movie.genres?.map?.((genre) => genre.name).filter(Boolean) || [],
  category: movie.category ?? "movie",
});

const normalizeMovieCollection = (movies = []) =>
  movies
    .filter(Boolean)
    .map((movie) => normalizeMovieSnapshot(movie));

export const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  username: user.username,
  avatar: user.avatar,
  bio: user.bio,
  role: user.role,
  createdAt: user.createdAt,
  favorites: normalizeMovieCollection(user.favorites),
  watchlist: normalizeMovieCollection(user.watchlist),
  watchedMovies: normalizeMovieCollection(user.watchedMovies),
  followers: user.followers || [],
  following: user.following || [],
});

export const findUserById = async (id) => User.findOne({ id });

export const findUserByEmail = async (email) =>
  User.findOne({ email: normalizeEmail(email) });

export const signup = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body || {};

  const displayName = (name || username || "").trim();
  const userName = (username || name || "").trim();

  if (!displayName || !email || !password) {
    return res
      .status(400)
      .json({ message: "name/username, email, and password are required" });
  }

  const normalizedEmail = normalizeEmail(email);
  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const user = await User.create({
    name: displayName,
    username: userName,
    email: normalizedEmail,
    password,
    role: "user",
  });

  return res.status(201).json({
    message: "user created",
    user: sanitizeUser(user),
    token: generateToken(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const passwordMatches = await user.matchPassword(password);

  if (!passwordMatches) {
    const legacyPasswordMatches = user.password === password;

    if (!legacyPasswordMatches) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
  }

  return res.status(200).json({
    message: "user logged in",
    user: sanitizeUser(user),
    token: generateToken(user),
  });
});

export const logout = asyncHandler(async (req, res) => {
  return res.status(200).json({ message: "user logged out" });
});
