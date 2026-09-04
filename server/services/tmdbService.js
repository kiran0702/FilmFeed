import Movie from "../models/movieModel.js";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const getAuthHeaders = () => {
  const readAccessToken = process.env.TMDB_READ_ACCESS_TOKEN;

  if (!readAccessToken) {
    return null;
  }

  return {
    Authorization: `Bearer ${readAccessToken}`,
    Accept: "application/json",
  };
};

const TMDB_GENRES = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};

const buildUrl = (path, params = {}) => {
  const url = new URL(`${TMDB_BASE_URL}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      url.searchParams.set(key, value);
    }
  });

  const apiKey = process.env.TMDB_API_KEY;

  if (apiKey && !getAuthHeaders()) {
    url.searchParams.set("api_key", apiKey);
  }

  return url;
};

const fetchTmdb = async (path, params = {}) => {
  const response = await fetch(buildUrl(path, params), {
    headers: getAuthHeaders() || undefined,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      payload.status_message || payload.message || "TMDB request failed",
    );

    error.statusCode = response.status;
    throw error;
  }

  return payload;
};

const mapLocalMovie = (movie) => ({
  id: movie.id,
  title: movie.title,
  category: movie.category,
  genres: movie.genres || [],
  rating: movie.rating,
  releaseYear: movie.releaseYear,
  overview: movie.overview,
});

const mapMovie = (movie) => ({
  id: movie.id,
  title: movie.title || movie.name,
  category: movie.category,
  genres: movie.genres?.map((genre) => genre.name) || movie.genre_ids?.map((id) => TMDB_GENRES[id] || String(id)) || [],
  rating: movie.vote_average,
  releaseYear: movie.release_date
    ? Number(movie.release_date.slice(0, 4))
    : movie.first_air_date ? Number(movie.first_air_date.slice(0, 4)) : null,
  overview: movie.overview,
  posterPath: movie.poster_path,
  backdropPath: movie.backdrop_path,
  originalLanguage: movie.original_language,
});

const mapMovieDetails = (movie) => ({
  id: movie.id,
  title: movie.title,
  overview: movie.overview,
  genres: movie.genres?.map((genre) => genre.name) || [],
  rating: movie.vote_average,
  releaseDate: movie.release_date,
  releaseYear: movie.release_date
    ? Number(movie.release_date.slice(0, 4))
    : null,
  runtime: movie.runtime,
  status: movie.status,
  tagline: movie.tagline,
  posterPath: movie.poster_path,
  backdropPath: movie.backdrop_path,
  homepage: movie.homepage,
  imdbId: movie.imdb_id,
});

const getLocalMoviesByCategory = async (category) => {
  const results = await Movie.find({ category }).sort({
    releaseYear: -1,
    title: 1,
  });

  return {
    count: results.length,
    results: results.map(mapLocalMovie),
  };
};

const getLocalSearchResults = async (query) => {
  const movies = await Movie.find().sort({ releaseYear: -1, title: 1 });
  const results = movies.filter((movie) => {
    const searchableText =
      `${movie.title} ${movie.overview} ${movie.genres.join(" ")}`.toLowerCase();

    return searchableText.includes(query.toLowerCase());
  });

  return {
    query,
    count: results.length,
    results: results.map(mapLocalMovie),
  };
};

const getLocalMovieDetails = async (id) => {
  const movie = await Movie.findOne({ id });

  if (!movie) {
    const error = new Error("Movie not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    movie: {
      ...mapLocalMovie(movie),
      releaseDate: movie.releaseYear ? `${movie.releaseYear}-01-01` : null,
      runtime: null,
      status: "Released",
      tagline: null,
      posterPath: null,
      backdropPath: null,
      homepage: null,
      imdbId: null,
    },
  };
};

const getLocalCast = async (id) => {
  const movie = await Movie.findOne({ id });

  if (!movie) {
    const error = new Error("Movie not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    movieId: id,
    cast: [],
    crew: [],
    note: `Local fallback data for ${movie.title}; cast details are available only through TMDB.`,
  };
};

const getLocalSimilarMovies = async (id) => {
  const movie = await Movie.findOne({ id });

  if (!movie) {
    const error = new Error("Movie not found");
    error.statusCode = 404;
    throw error;
  }

  const similarMovies = await Movie.find({
    category: movie.category,
    id: { $ne: movie.id },
  }).sort({ releaseYear: -1, title: 1 });

  return {
    movieId: id,
    count: similarMovies.length,
    results: similarMovies.map(mapLocalMovie),
  };
};

const getLocalVideos = async (id) => {
  const movie = await Movie.findOne({ id });

  if (!movie) {
    const error = new Error("Movie not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    movieId: id,
    count: 0,
    results: [],
    note: `Local fallback data for ${movie.title}; trailer data is available only through TMDB.`,
  };
};

const withFallback = async (primaryAction, fallbackAction) => {
  try {
    return await primaryAction();
  } catch (error) {
    if (error.statusCode && error.statusCode !== 500) {
      throw error;
    }

    return fallbackAction();
  }
};

export const getTrendingMovies = async () => {
  return withFallback(
    async () => {
      const data = await fetchTmdb("/trending/movie/week");
      return {
        count: data.results?.length || 0,
        results: (data.results || []).map((movie) => ({
          ...mapMovie(movie),
          category: "trending",
        })),
      };
    },
    () => getLocalMoviesByCategory("trending"),
  );
};

export const getTrendingTVShows = async () => {
  return withFallback(
    async () => {
      const data = await fetchTmdb("/trending/tv/week");
      return {
        count: data.results?.length || 0,
        results: (data.results || []).map((show) => ({
          ...mapMovie(show),
          category: "trending",
        })),
      };
    },
    () => getLocalMoviesByCategory("trending"),
  );
};

export const getPopularMovies = async () => {
  return withFallback(
    async () => {
      const data = await fetchTmdb("/movie/popular");
      return {
        count: data.results?.length || 0,
        results: (data.results || []).map((movie) => ({
          ...mapMovie(movie),
          category: "popular",
        })),
      };
    },
    () => getLocalMoviesByCategory("popular"),
  );
};

export const getUpcomingMovies = async () => {
  return withFallback(
    async () => {
      const data = await fetchTmdb("/movie/upcoming");
      return {
        count: data.results?.length || 0,
        results: (data.results || []).map((movie) => ({
          ...mapMovie(movie),
          category: "upcoming",
        })),
      };
    },
    () => getLocalMoviesByCategory("upcoming"),
  );
};

export const getTopRatedMovies = async () => {
  return withFallback(
    async () => {
      const data = await fetchTmdb("/movie/top_rated");
      return {
        count: data.results?.length || 0,
        results: (data.results || []).map((movie) => ({
          ...mapMovie(movie),
          category: "toprated",
        })),
      };
    },
    () => getLocalMoviesByCategory("toprated"),
  );
};

export const searchMovies = async (query) => {
  return withFallback(
    async () => {
      const data = await fetchTmdb("/search/movie", {
        query,
        include_adult: "false",
      });

      return {
        query,
        count: data.results?.length || 0,
        results: (data.results || []).map((movie) => ({
          ...mapMovie(movie),
          category: "search",
        })),
      };
    },
    () => getLocalSearchResults(query),
  );
};

export const getMovieDetails = async (id) => {
  return withFallback(
    async () => {
      const movie = await fetchTmdb(`/movie/${id}`);
      return { movie: mapMovieDetails(movie) };
    },
    () => getLocalMovieDetails(id),
  );
};

export const getMovieCast = async (id) => {
  return withFallback(
    async () => {
      const data = await fetchTmdb(`/movie/${id}/credits`);

      return {
        movieId: id,
        cast: (data.cast || []).map((member) => ({
          id: member.id,
          name: member.name,
          character: member.character,
          profilePath: member.profile_path,
          order: member.order,
        })),
        crew: (data.crew || []).map((member) => ({
          id: member.id,
          name: member.name,
          job: member.job,
          department: member.department,
          profilePath: member.profile_path,
        })),
      };
    },
    () => getLocalCast(id),
  );
};

export const getSimilarMovies = async (id) => {
  return withFallback(
    async () => {
      const data = await fetchTmdb(`/movie/${id}/similar`);

      return {
        movieId: id,
        count: data.results?.length || 0,
        results: (data.results || []).map((movie) => ({
          ...mapMovie(movie),
          category: "similar",
        })),
      };
    },
    () => getLocalSimilarMovies(id),
  );
};

export const getMovieVideos = async (id) => {
  return withFallback(
    async () => {
      const data = await fetchTmdb(`/movie/${id}/videos`);

      return {
        movieId: id,
        count: data.results?.length || 0,
        results: (data.results || []).map((video) => ({
          id: video.id,
          key: video.key,
          name: video.name,
          site: video.site,
          type: video.type,
          official: video.official,
          publishedAt: video.published_at,
        })),
      };
    },
    () => getLocalVideos(id),
  );
};
