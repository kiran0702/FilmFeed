import React, { useState } from "react";
import EditProfileModal from "./EditProfileModal";

const ProfileSidebar = ({ user }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const joinedYear = user?.createdAt ? new Date(user.createdAt).getFullYear() : null;
  // Use passed in user data, with fallbacks for UI
  const profileUser = {
    username: user?.username || "user_" + user?.id?.substring(0, 5),
    name: user?.name || "User",
    bio: user?.bio || "No bio available.",
    avatar: user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=random`,
    stats: {
      watched: user?.watchedMovies?.length || 0,
      watchlist: user?.watchlist?.length || 0,
      favorites: user?.favorites?.length || 0,
      reviews: user?.reviews?.length || 0,
      followers: user?.followers?.length || 0,
      following: user?.following?.length || 0,
    },
  };

  return (
    <aside className="bg-zinc-900 rounded-3xl shadow-2xl p-8 flex flex-col items-center sticky top-24 border border-white/5">
      {/* Avatar */}
      <div className="relative mb-6">
        <img
          src={profileUser.avatar}
          alt={profileUser.name}
          className="w-36 h-36 rounded-full object-cover border-4 border-zinc-800 shadow-md"
        />
      </div>

      {/* User Info */}
      <h2 className="text-2xl font-bold text-white tracking-tight">{profileUser.name}</h2>
      <p className="text-red-500 font-medium text-sm mb-4">@{profileUser.username}</p>
      <p className="text-center text-white/60 text-sm leading-relaxed mb-6">
        {profileUser.bio}
      </p>

      {/* Edit Profile Button */}
      <button 
        type="button" 
        onClick={() => setIsEditModalOpen(true)}
        className="w-full bg-white/10 text-white hover:bg-white/20 font-medium py-2.5 rounded-xl transition-colors duration-200 mb-8 border border-white/10"
      >
        Edit Profile
      </button>

      {isEditModalOpen && (
        <EditProfileModal user={user} onClose={() => setIsEditModalOpen(false)} />
      )}

      {joinedYear && <p className="text-xs text-white/40 mb-4">Joined {joinedYear}</p>}

      {/* Stats Grid */}
      <div className="w-full grid grid-cols-2 gap-y-6 gap-x-4 border-t border-white/10 pt-6">
        <div className="text-center">
          <p className="text-xl font-bold text-white">{profileUser.stats.watched}</p>
          <p className="text-xs text-white/50 uppercase tracking-wider font-semibold mt-1">Watched</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-white">{profileUser.stats.watchlist}</p>
          <p className="text-xs text-white/50 uppercase tracking-wider font-semibold mt-1">Watchlist</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-white">{profileUser.stats.favorites}</p>
          <p className="text-xs text-white/50 uppercase tracking-wider font-semibold mt-1">Favorites</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-white">{profileUser.stats.reviews}</p>
          <p className="text-xs text-white/50 uppercase tracking-wider font-semibold mt-1">Reviews</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-white">{profileUser.stats.followers}</p>
          <p className="text-xs text-white/50 uppercase tracking-wider font-semibold mt-1">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-white">{profileUser.stats.following}</p>
          <p className="text-xs text-white/50 uppercase tracking-wider font-semibold mt-1">Following</p>
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
