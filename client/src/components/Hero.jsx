import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { backdropUrl, toggleWatchlistMovie } from '../api';
import { selectUser, setUser } from '../store/authSlice';

function Rating({ value }) {
  const v = Number(value).toFixed(1);
  const color = value >= 7 ? 'text-green-400' : value >= 5 ? 'text-yellow-400' : 'text-red-400';
  return <span className={`font-semibold text-xs ${color}`}>★ {v}</span>;
}

export default function Hero({ movies, onMovieClick }) {
  const [idx, setIdx] = useState(0);
  const [saving, setSaving] = useState(false);
  const hero = movies[idx];
  
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isWatchlist = Boolean(user?.watchlist?.some((item) => String(item.id) === String(hero?.id)));

  const handleWatchlist = async (event) => {
    event.stopPropagation();
    if (!hero || saving) return;
    setSaving(true);
    try {
      const updatedUser = await toggleWatchlistMovie(hero);
      if (updatedUser) dispatch(setUser(updatedUser));
    } catch (err) {
      console.error('Failed to toggle watchlist:', err);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!movies.length) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % movies.length), 8000);
    return () => clearInterval(t);
  }, [movies.length]);

  if (!hero) return (
    <div className="relative h-[520px] mx-6 mb-10 rounded-2xl bg-zinc-900 animate-pulse" />
  );

  const bg = backdropUrl(hero.backdropPath);

  return (
    <div className="relative h-[520px] mx-6 mb-10 rounded-2xl overflow-hidden mt-20">
      <AnimatePresence mode="wait">
        <motion.div key={hero.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }} className="absolute inset-0 bg-black">
          {bg ? (
            <img src={bg} alt={hero.title} className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
          )}
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-center px-12">
        <AnimatePresence mode="wait">
          <motion.div key={hero.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-semibold uppercase tracking-wide">Featured</span>
              <span className="text-white/60 text-sm">{hero.genres?.[0]} &middot; {hero.releaseYear}</span>
            </div>
            <h1 className="text-5xl font-black text-white mb-2 leading-tight max-w-lg">{hero.title}</h1>
            <div className="flex items-center gap-3 mb-3">
              <Rating value={hero.rating} />
              <span className="text-white/40 text-xs">|</span>
              <span className="text-white/60 text-xs">{hero.originalLanguage?.toUpperCase()}</span>
            </div>
            <p className="text-white/70 max-w-md text-sm leading-relaxed mb-6 line-clamp-3">{hero.overview}</p>
            <div className="flex items-center gap-3">
              <button onClick={() => onMovieClick && onMovieClick(hero)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                View Details
              </button>
              <button 
                onClick={handleWatchlist}
                disabled={saving}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-colors backdrop-blur-sm ${isWatchlist ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                {isWatchlist ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                )}
                {isWatchlist ? 'In My List' : 'My List'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-5 right-8 flex gap-1.5">
        {movies.slice(0, 5).map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-red-500' : 'w-1.5 bg-white/30'}`} />
        ))}
      </div>
    </div>
  );
}
