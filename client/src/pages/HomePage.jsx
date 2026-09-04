import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { fetchTrending, fetchPopular, fetchTopRated, fetchUpcoming } from '../api';
import Hero from '../components/Hero';
import MovieSection from '../components/MovieSection';
import MovieModal from '../components/MovieModal';

export default function HomePage() {
  const [data, setData] = useState({ trending: [], popular: [], toprated: [], upcoming: [] });
  const [loadState, setLoadState] = useState({ trending: true, popular: true, toprated: true, upcoming: true });
  const [selectedMovie, setSelectedMovie] = useState(null);

  const load = useCallback(async (key, fetcher) => {
    try {
      const res = await fetcher();
      setData((d) => ({ ...d, [key]: res.results || [] }));
    } catch (_) {}
    setLoadState((s) => ({ ...s, [key]: false }));
  }, []);

  useEffect(() => {
    load('trending', fetchTrending);
    load('popular', fetchPopular);
    load('toprated', fetchTopRated);
    load('upcoming', fetchUpcoming);
  }, [load]);

  return (
    <div className="pt-20 pb-10">
      <Hero movies={data.trending} onMovieClick={setSelectedMovie} />
      <MovieSection title="Trending This Week" movies={data.trending} loading={loadState.trending} onMovieClick={setSelectedMovie} />
      <MovieSection title="Popular Now" movies={data.popular} loading={loadState.popular} onMovieClick={setSelectedMovie} />
      <MovieSection title="Top Rated All Time" movies={data.toprated} loading={loadState.toprated} onMovieClick={setSelectedMovie} />
      <MovieSection title="Coming Soon" movies={data.upcoming} loading={loadState.upcoming} onMovieClick={setSelectedMovie} />
      
      {/* Movie Detail Modal */}
      <AnimatePresence>
        {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
      </AnimatePresence>
    </div>
  );
}
