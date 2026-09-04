import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { imgUrl, toggleFavoriteMovie, toggleWatchlistMovie, toggleWatchedMovie } from '../api';
import { selectUser, setUser } from '../store/authSlice';

function Rating({ value }) {
  const v = Number(value).toFixed(1);
  let color = 'text-red-400';

  if (value >= 7) {
    color = 'text-green-400';
  } else if (value >= 5) {
    color = 'text-yellow-400';
  }

  return <span className={`font-semibold text-xs ${color}`}>★ {v}</span>;
}

function ActionIcon({ type }) {
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
}

export default function MovieCard({ movie, onClick, index }) {
  const [hovered, setHovered] = useState(false);
  const [saving, setSaving] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const poster = imgUrl(movie.posterPath, 'w300');
  const movieId = String(movie.id);
  const isFavorite = Boolean(user?.favorites?.some((item) => String(item.id) === movieId));
  const isWatchlist = Boolean(user?.watchlist?.some((item) => String(item.id) === movieId));
  const isWatched = Boolean(user?.watchedMovies?.some((item) => String(item.id) === movieId));

  const updateUser = (updatedUser) => {
    if (updatedUser) {
      dispatch(setUser(updatedUser));
    }
  };

  const handleFavorite = async (event) => {
    event.stopPropagation();
    setSaving('favorite');
    try {
      updateUser(await toggleFavoriteMovie(movie));
    } finally {
      setSaving(null);
    }
  };

  const handleWatchlist = async (event) => {
    event.stopPropagation();
    setSaving('watchlist');
    try {
      updateUser(await toggleWatchlistMovie(movie));
    } finally {
      setSaving(null);
    }
  };

  const handleWatched = async (event) => {
    event.stopPropagation();
    setSaving('watched');
    try {
      updateUser(await toggleWatchedMovie(movie));
    } finally {
      setSaving(null);
    }
  };

  const getButtonState = (type, active, activeClass) => {
    const labelMap = {
      favorite: 'Favorite',
      watchlist: 'Watchlist',
      watched: 'Watched',
    };

    let className = 'bg-black/75 text-white/85 hover:bg-black/90 hover:text-white ring-1 ring-white/10';

    if (saving === type) {
      className = 'bg-white/20 text-white animate-pulse ring-2 ring-white/20';
    } else if (active) {
      className = activeClass;
    }

    return {
      label: labelMap[type],
      className,
    };
  };

  const favoriteButton = getButtonState('favorite', isFavorite, 'bg-red-500 text-white');
  const watchlistButton = getButtonState('watchlist', isWatchlist, 'bg-emerald-500 text-white');
  const watchedButton = getButtonState('watched', isWatched, 'bg-sky-500 text-white');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 10) * 0.04 }}
      className="relative rounded-xl overflow-hidden cursor-pointer shrink-0 w-36 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick?.(movie)}
    >
      <div className="h-52 bg-zinc-800 relative">
        {poster ? (
          <img src={poster} alt={movie.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-3 text-center">
            <span className="text-white/60 text-xs font-medium">{movie.title}</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-md px-1.5 py-0.5">
          <Rating value={movie.rating} />
        </div>
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 flex flex-col justify-end p-3"
            >
              <p className="text-white text-xs font-semibold leading-tight mb-1">{movie.title}</p>
              <p className="text-white/60 text-xs">{movie.releaseYear} &middot; {movie.genres?.[0]}</p>
              <p className="text-white/50 text-xs mt-1 line-clamp-3">{movie.overview}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="bg-zinc-900 px-2 py-2">
        <p className="text-white text-xs font-medium truncate">{movie.title}</p>
        <div className="flex items-center justify-between gap-2 mt-2">
          <div className="flex gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={handleFavorite}
              aria-label={favoriteButton.label}
              title={favoriteButton.label}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${favoriteButton.className}`}
            >
              <ActionIcon type="favorite" />
            </button>
            <button
              type="button"
              onClick={handleWatchlist}
              aria-label={watchlistButton.label}
              title={watchlistButton.label}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${watchlistButton.className}`}
            >
              <ActionIcon type="watchlist" />
            </button>
            <button
              type="button"
              onClick={handleWatched}
              aria-label={watchedButton.label}
              title={watchedButton.label}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${watchedButton.className}`}
            >
              <ActionIcon type="watched" />
            </button>
          </div>
          <p className="text-zinc-500 text-xs">{movie.releaseYear}</p>
        </div>
      </div>
    </motion.div>
  );
}
