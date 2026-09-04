import React, { useRef } from 'react';
import MovieCard from './MovieCard';

export default function MovieSection({ title, movies, loading, onMovieClick }) {
  const rowRef = useRef(null);
  const scroll = (dir) => rowRef.current?.scrollBy({ left: dir * 600, behavior: 'smooth' });

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4 px-6">
        <h2 className="text-white font-semibold text-lg tracking-tight">{title}</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={() => scroll(1)} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      {loading ? (
        <div className="flex gap-4 px-6">
          {[...Array(7)].map((_, i) => <div key={i} className="w-36 h-52 rounded-xl bg-white/5 animate-pulse flex-shrink-0" />)}
        </div>
      ) : (
        <div ref={rowRef} className="flex gap-4 overflow-x-auto px-6 pb-2 scroll-smooth" style={{ scrollbarWidth: 'none' }}>
          {movies.map((m, i) => <MovieCard key={m.id || i} movie={m} index={i} onClick={onMovieClick} />)}
        </div>
      )}
    </div>
  );
}
