import Movie from "../models/movieModel.js";

const sendMovieList = async (res, category) => {
  const results = await Movie.find({ category }).sort({
    releaseYear: -1,
    title: 1,
  });

  return res.status(200).json({
    count: results.length,
    results,
  });
};

export const gettrdmovie = async (req, res) => {
  return sendMovieList(res, "trending");
};

export const getpopmovie = async (req, res) => {
  return sendMovieList(res, "popular");
};

export const getupcommingmovies = async (req, res) => {
  return sendMovieList(res, "upcoming");
};

export const gettoprated = async (req, res) => {
  return sendMovieList(res, "toprated");
};

export const getmoviebyID = async (req, res) => {
  const movieId = req.params.id;
  const movie = await Movie.findOne({ id: movieId });

  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  return res.status(200).json({ movie });
};

export const searchMovies = async (req, res) => {
  const searchQuery = (req.query.query || "").trim().toLowerCase();

  if (!searchQuery) {
    return res.status(400).json({ message: "query parameter is required" });
  }

  const movies = await Movie.find().sort({ releaseYear: -1, title: 1 });
  const results = movies.filter((movie) => {
    const searchableText =
      `${movie.title} ${movie.overview} ${movie.genres.join(" ")}`.toLowerCase();

    return searchableText.includes(searchQuery);
  });

  return res.status(200).json({
    query: searchQuery,
    count: results.length,
    results,
  });
};
