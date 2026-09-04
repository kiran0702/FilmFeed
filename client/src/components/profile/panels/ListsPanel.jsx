import React from "react";

const ListsPanel = ({ lists = {} }) => {
  const summary = [
    { id: "watchlist", title: "Watchlist", count: lists.watchlist?.length || 0, description: "Movies you want to see next." },
    { id: "favorites", title: "Favorites", count: lists.favorites?.length || 0, description: "Movies you’ve marked as favorites." },
    { id: "watched", title: "Watched", count: lists.watchedMovies?.length || 0, description: "Movies you’ve already watched." },
  ];

  return (
    <div className="animate-fade-in">
      <h3 className="text-xl font-bold text-white mb-6">Your Library</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {summary.map((list) => (
          <div key={list.id} className="group cursor-pointer bg-zinc-900 p-6 rounded-2xl border border-white/5 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-red-500/10 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <h4 className="font-bold text-white text-lg mb-1">{list.title}</h4>
              <p className="text-white/50 text-sm font-medium">{list.count} Movies</p>
              <p className="text-white/40 text-sm mt-3 leading-relaxed">{list.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListsPanel;
