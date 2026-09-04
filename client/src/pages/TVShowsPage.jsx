import { useEffect, useMemo, useState } from 'react';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import { fetchTrendingTV } from '../api';

export default function TVShowsPage() {
  const [shows, setShows] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadShows = async () => {
      setLoading(true);
      try {
        const response = await fetchTrendingTV();
        if (active) {
          setShows(response.results || []);
        }
      } catch (error) {
        if (active) {
          setShows([]);
          console.error(error);
        }
      }

      if (active) {
        setLoading(false);
      }
    };

    loadShows();

    return () => {
      active = false;
    };
  }, []);

  const displayShows = useMemo(() => {
    const source = searchResults ?? shows;

    if (filter === 'All') {
      return source;
    }

    return source.filter((show) =>
      (show.genres || []).some((genre) => genre.toLowerCase() === filter.toLowerCase()),
    );
  }, [filter, searchResults, shows]);

  return (
    <div className="pt-24 pb-10 px-6 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">TV Shows</h1>
          <p className="text-white/60 text-sm mt-1">Live picks, search results, and genre filters from the current feed.</p>
        </div>
        <div className="w-full md:w-auto">
          <SearchBar onResults={(res) => setSearchResults(res)} onClear={() => setSearchResults(null)} />
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto mb-8 scrollbar-hide">
        {['All', 'Action', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller'].map((cat) => (
          <button 
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${filter === cat ? 'bg-red-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {(() => {
        if (loading) {
          return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
              {Array.from({ length: 14 }).map((_, i) => <div key={`tv-skeleton-${i}`} className="h-72 rounded-xl bg-white/5 animate-pulse" />)}
            </div>
          );
        }

        if (displayShows.length) {
          return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
              {displayShows.map((show, i) => (
                <MovieCard key={show.id || show.title || i} movie={show} index={i} onClick={() => {}} />
              ))}
            </div>
          );
        }

        return (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-10 text-center text-white/70">
            No shows found for this selection.
          </div>
        );
      })()}
    </div>
  );
}
