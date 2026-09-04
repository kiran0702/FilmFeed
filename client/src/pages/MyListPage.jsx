import { useSelector } from 'react-redux';
import MovieCard from '../components/MovieCard';
import { selectUser } from '../store/authSlice';

export default function MyListPage() {
  const user = useSelector(selectUser);
  const watchlist = user?.watchlist || [];
  const favorites = user?.favorites || [];
  const watchedMovies = user?.watchedMovies || [];

  const renderMovieSection = (title, icon, movies, emptyMessage) => (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-2">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-red-500">{icon}</span> {title}
        </h2>
        <span className="text-sm text-white/50">{movies.length} items</span>
      </div>
      {movies.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
          {movies.map((movie, i) => (
            <MovieCard key={movie.id || movie.title || i} movie={movie} index={i} onClick={() => {}} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-10 text-center text-white/70">
          {emptyMessage}
        </div>
      )}
    </div>
  );

  return (
    <div className="pt-24 pb-10 px-6 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-8">My Lists</h1>
      {renderMovieSection('Watchlist', '🔖', watchlist, 'No movies in your watchlist yet. Tap Watchlist on any movie card to save it here.')}
      {renderMovieSection('Favorites', '❤️', favorites, 'No favorite movies yet. Use the Favorite button on a card to build this list.')}
      {renderMovieSection('Watched Movies', '👁️', watchedMovies, 'No watched movies saved yet. This section will fill as you mark movies as watched.')}
    </div>
  );
}
