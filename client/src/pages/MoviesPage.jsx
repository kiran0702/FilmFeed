import { useEffect, useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import { fetchPopular } from '../api';

const SKELETON_KEYS = [
  'skeleton-1',
  'skeleton-2',
  'skeleton-3',
  'skeleton-4',
  'skeleton-5',
  'skeleton-6',
  'skeleton-7',
  'skeleton-8',
  'skeleton-9',
  'skeleton-10',
  'skeleton-11',
  'skeleton-12',
  'skeleton-13',
  'skeleton-14',
];

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadMovies = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetchPopular();

        if (!active) {
          return;
        }

        setMovies(response.results || []);
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to load movies');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadMovies();

    return () => {
      active = false;
    };
  }, []);

  const displayMovies = useMemo(() => {
    const source = searchResults ?? movies;

    if (filter === 'All') {
      return source;
    }

    return source.filter((movie) =>
      (movie.genres || []).some((genre) => genre.toLowerCase() === filter.toLowerCase()),
    );
  }, [filter, searchResults, movies]);

  const hasNoResults = !loading && displayMovies.length === 0;

  return (
    <div className="pt-24 pb-10 px-6 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">All Movies</h1>
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

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {hasNoResults ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-10 text-center text-white/70">
          No movies found.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
          {loading
            ? SKELETON_KEYS.map((key) => <div key={key} className="h-72 rounded-xl bg-white/5 animate-pulse" />)
            : displayMovies.map((movie, i) => (
                <MovieCard key={movie.id || movie.title || i} movie={movie} index={i} onClick={() => {}} />
              ))}
        </div>
      )}
      
      {/* Pagination placeholder */}
      <div className="mt-12 flex justify-center">
        <div className="flex gap-2">
          <button type="button" className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors">Previous</button>
          <button type="button" className="px-4 py-2 bg-red-600 text-white rounded-lg">1</button>
          <button type="button" className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors">2</button>
          <button type="button" className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors">3</button>
          <button type="button" className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors">Next</button>
        </div>
      </div>
    </div>
  );
}
