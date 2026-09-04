import React, { useState, useEffect, useRef } from "react";
import { apiGetReviews } from "../../../api";

const ReviewsPanel = ({ user }) => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef(null);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user?._id && !user?.id) return;
      try {
        setLoading(true);
        // Fallback to user.id if user._id is not available
        const userId = user._id || user.id; 
        const data = await apiGetReviews(userId, page);
        if (page === 1) {
          setReviews(data.reviews);
        } else {
          setReviews(prev => [...prev, ...data.reviews]);
        }
        setHasMore(data.page < data.pages);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [page, user]);

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

  return (
    <div className="animate-fade-in">
      <h3 className="text-xl font-bold text-white mb-6">Your Reviews</h3>
      {reviews.length ? (
        <div className="grid gap-6 md:grid-cols-2">
          {reviews.map((review) => (
            <div key={review.id} className="bg-zinc-900 p-6 rounded-2xl border border-white/5 shadow-md flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-white text-lg">Movie ID: {review.movieId}</h4>
                <span className="bg-red-500/20 text-red-500 px-2 py-1 rounded-md text-xs font-bold">
                  ⭐ {review.rating}/10
                </span>
              </div>
              <p className="text-white/70 flex-1 whitespace-pre-wrap">{review.reviewText || 'No review text provided.'}</p>
              <p className="text-white/40 text-xs mt-4">{new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
          {hasMore && (
             <div ref={observerTarget} className="col-span-full h-10 mt-4 flex items-center justify-center">
               <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
             </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-10 text-center text-white/70">
          No reviews yet. Write a review on a movie page to see it here!
        </div>
      )}
    </div>
  );
};

export default ReviewsPanel;
