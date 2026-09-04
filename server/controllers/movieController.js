import {
  getMovieCast,
  getMovieDetails,
  getMovieVideos,
  getPopularMovies,
  getSimilarMovies,
  getTopRatedMovies,
  getTrendingMovies,
  getTrendingTVShows,
  getUpcomingMovies,
  searchMovies as searchMoviesFromTmdb,
} from "../services/tmdbService.js";
import asyncHandler from "express-async-handler";

export const gettrdmovie = asyncHandler(async (req, res) => {
  const payload = await getTrendingMovies();
  return res.status(200).json(payload);
});

export const gettrdtv = asyncHandler(async (req, res) => {
  const payload = await getTrendingTVShows();
  return res.status(200).json(payload);
});

export const getpopmovie = asyncHandler(async (req, res) => {
  const payload = await getPopularMovies();
  return res.status(200).json(payload);
});

export const getupcommingmovies = asyncHandler(async (req, res) => {
  const payload = await getUpcomingMovies();
  return res.status(200).json(payload);
});

export const gettoprated = asyncHandler(async (req, res) => {
  const payload = await getTopRatedMovies();
  return res.status(200).json(payload);
});

export const getmoviebyID = asyncHandler(async (req, res) => {
  const movieId = req.params.id;
  const payload = await getMovieDetails(movieId);
  return res.status(200).json(payload);
});

export const searchMovies = asyncHandler(async (req, res) => {
  const searchQuery = (req.query.query || "").trim().toLowerCase();

  if (!searchQuery) {
    return res.status(400).json({ message: "query parameter is required" });
  }

  const payload = await searchMoviesFromTmdb(searchQuery);

  return res.status(200).json(payload);
});

export const getMovieCastDetails = asyncHandler(async (req, res) => {
  const payload = await getMovieCast(req.params.id);
  return res.status(200).json(payload);
});

export const getSimilarMovieList = asyncHandler(async (req, res) => {
  const payload = await getSimilarMovies(req.params.id);
  return res.status(200).json(payload);
});

export const getMovieVideosList = asyncHandler(async (req, res) => {
  const payload = await getMovieVideos(req.params.id);
  return res.status(200).json(payload);
});
