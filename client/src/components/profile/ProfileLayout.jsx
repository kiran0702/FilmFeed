import React, { useState } from "react";
import ProfileSidebar from "./ProfileSidebar";
import ProfileTabs from "./ProfileTabs";
import ActivityPanel from "./panels/ActivityPanel";
import WatchlistPanel from "./panels/WatchlistPanel";
import FavoritesPanel from "./panels/FavoritesPanel";
import ReviewsPanel from "./panels/ReviewsPanel";
import ListsPanel from "./panels/ListsPanel";

const ProfileLayout = ({ user }) => {
  const [activeTab, setActiveTab] = useState("Activity");
  const lists = {
    watchlist: user?.watchlist || [],
    favorites: user?.favorites || [],
    watchedMovies: user?.watchedMovies || [],
  };

  const renderPanel = () => {
    switch (activeTab) {
      case "Activity":
        return <ActivityPanel user={user} />;
      case "Watchlist":
        return <WatchlistPanel movies={lists.watchlist} />;
      case "Favorites":
        return <FavoritesPanel movies={lists.favorites} />;
      case "Reviews":
        return <ReviewsPanel user={user} />;
      case "Lists":
        return <ListsPanel lists={lists} />;
      default:
        return <ActivityPanel user={user} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 lg:w-1/4">
        <ProfileSidebar user={user} />
      </div>

      {/* Main Content Area */}
      <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col">
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-6 flex-1">{renderPanel()}</div>
      </div>
    </div>
  );
};

export default ProfileLayout;
