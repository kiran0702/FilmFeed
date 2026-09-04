import React, { useState, useEffect } from 'react';
import { fetchTrending } from '../api';
import MovieSection from '../components/MovieSection';

export default function TrendingPage() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrending()
      .then((res) => {
        setTrending(res.results || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="pt-24 pb-10 min-h-screen">
      <div className="px-6 mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Trending Now</h1>
        <p className="text-white/60">Discover the most popular movies everyone is talking about.</p>
      </div>

      <MovieSection title="Trending Today" movies={trending.slice(0, 10)} loading={loading} onMovieClick={() => {}} />
      <div className="mt-12">
        <MovieSection title="Trending This Week" movies={trending.slice(10, 20)} loading={loading} onMovieClick={() => {}} />
      </div>
    </div>
  );
}
