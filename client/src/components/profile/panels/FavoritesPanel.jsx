import React, { useState, useEffect, useRef } from "react";
import MovieCard from "../shared/MovieCard";

const FavoritesPanel = ({ movies = [] }) => {
  const [limit, setLimit] = useState(12);
  const observerTarget = useRef(null);
  
  const favorites = movies;
  const visibleMovies = favorites.slice(0, limit);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && limit < favorites.length) {
          setLimit((prev) => prev + 12);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [limit, favorites.length]);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-end mb-6">
        <h3 className="text-xl font-bold text-white">Favorite Films</h3>
        <p className="text-sm text-white/50 font-medium">{favorites.length} Movies</p>
      </div>
      
      {favorites.length ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {visibleMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          {limit < favorites.length && (
            <div ref={observerTarget} className="h-10 mt-4 flex items-center justify-center">
               <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-10 text-center text-white/70">
          Your favorite movies will show up here.
        </div>
      )}
    </div>
  );
};

export default FavoritesPanel;
