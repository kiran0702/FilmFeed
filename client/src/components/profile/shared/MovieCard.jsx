import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "../../../store/authSlice";
import { toggleFavoriteMovie, toggleWatchlistMovie, toggleWatchedMovie } from "../../../api";

const ActionIcon = ({ type }) => {
  if (type === 'favorite') {
    return (
      <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A5.5 5.5 0 0 1 7.5 3c1.74 0 3.41.81 4.5 2.09A6.1 6.1 0 0 1 16.5 3 5.5 5.5 0 0 1 22 8.5c0 3.78-3.4 6.86-8.55 11.53L12 21.35Z" />
      </svg>
    );
  }

  if (type === 'watchlist') {
    return (
      <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-3-7 3V4a1 1 0 0 1 1-1Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
};

const MovieCard = ({ movie }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isFavorite = Boolean(user?.favorites?.some((item) => String(item.id) === String(movie.id)));
  const isWatchlist = Boolean(user?.watchlist?.some((item) => String(item.id) === String(movie.id)));
  const isWatched = Boolean(user?.watchedMovies?.some((item) => String(item.id) === String(movie.id)));

  const updateUser = (updatedUser) => {
    if (updatedUser) {
      dispatch(setUser(updatedUser));
    }
  };

  const handleFavorite = async (event) => {
    event.stopPropagation();
    updateUser(await toggleFavoriteMovie(movie));
  };

  const handleWatchlist = async (event) => {
    event.stopPropagation();
    updateUser(await toggleWatchlistMovie(movie));
  };

  const handleWatched = async (event) => {
    event.stopPropagation();
    updateUser(await toggleWatchedMovie(movie));
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-zinc-900">
      <div className="aspect-2/3 w-full overflow-hidden">
        <img
          src={movie.posterPath ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` : 'https://placehold.co/500x750/111111/ffffff?text=No+Poster'}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <h3 className="text-white font-bold text-sm leading-tight line-clamp-2">{movie.title}</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-red-400 font-semibold text-xs">⭐ {movie.rating?.toFixed(1)}</span>
          <span className="text-white/60 text-xs">{movie.releaseYear}</span>
        </div>
        <div className="flex gap-2 mt-3">
          <button type="button" onClick={handleFavorite} aria-label="Favorite" title="Favorite" className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isFavorite ? 'bg-red-500 text-white ring-2 ring-red-300/30' : 'bg-black/75 text-white/85 ring-1 ring-white/10 hover:bg-black/90 hover:text-white'}`}>
            <ActionIcon type="favorite" />
          </button>
          <button type="button" onClick={handleWatchlist} aria-label="Watchlist" title="Watchlist" className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isWatchlist ? 'bg-emerald-500 text-white ring-2 ring-emerald-300/30' : 'bg-black/75 text-white/85 ring-1 ring-white/10 hover:bg-black/90 hover:text-white'}`}>
            <ActionIcon type="watchlist" />
          </button>
          <button type="button" onClick={handleWatched} aria-label="Watched" title="Watched" className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isWatched ? 'bg-sky-500 text-white ring-2 ring-sky-300/30' : 'bg-black/75 text-white/85 ring-1 ring-white/10 hover:bg-black/90 hover:text-white'}`}>
            <ActionIcon type="watched" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
