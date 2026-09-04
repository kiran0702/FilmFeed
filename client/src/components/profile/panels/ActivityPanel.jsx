import React, { useState, useEffect, useRef } from "react";
import { apiGetUserActivity } from "../../../api";

const ActivityPanel = ({ user }) => {
  const [activities, setActivities] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const data = await apiGetUserActivity(page);
        if (page === 1) {
          setActivities(data.activities);
        } else {
          setActivities(prev => [...prev, ...data.activities]);
        }
        setHasMore(data.page < data.pages);
      } catch (err) {
        console.error("Failed to fetch activity", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [hasMore, loading]);

  const getActionText = (type) => {
    switch (type) {
      case "WATCHLIST_ADD": return "added to watchlist";
      case "FAVORITE_ADD": return "marked as favorite";
      case "WATCHED_ADD": return "marked as watched";
      case "REVIEW_ADD": return "reviewed";
      default: return "interacted with";
    }
  };

  return (
    <div className="animate-fade-in">
      <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
      {activities.length ? (
        <div className="space-y-4">
          {activities.map((entry) => (
            <div key={entry.id} className="bg-zinc-900 p-5 rounded-2xl border border-white/5 shadow-md flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 font-bold shrink-0 overflow-hidden">
                {entry.movie?.posterPath ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w92${entry.movie.posterPath}`}
                    alt={entry.movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "🎬"
                )}
              </div>
              <div>
                <p className="text-white font-medium">
                  You {getActionText(entry.actionType)} <span className="text-red-500 font-bold">{entry.movie?.title}</span>
                </p>
                <p className="text-white/50 text-sm mt-1">{entry.movie?.releaseYear || 'Recent'} • {new Date(entry.createdAt).toLocaleDateString()}</p>
                <p className="text-white/70 mt-2 text-sm line-clamp-2">{entry.movie?.overview}</p>
              </div>
            </div>
          ))}
          {hasMore && (
            <div ref={observerTarget} className="h-10 mt-4 flex items-center justify-center">
               <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-10 text-center text-white/70">
          Your activity feed will appear here after you save or favorite movies.
        </div>
      )}
    </div>
  );
};

export default ActivityPanel;
