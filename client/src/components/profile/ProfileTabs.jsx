import React from "react";

const tabs = ["Activity", "Watchlist", "Favorites", "Reviews", "Lists"];

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="flex space-x-6 lg:space-x-8 border-b border-white/10 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-4 text-sm font-semibold transition-all duration-200 whitespace-nowrap px-1 relative ${
            activeTab === tab
              ? "text-red-500"
              : "text-white/50 hover:text-white"
          }`}
        >
          {tab}
          {activeTab === tab && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 rounded-t-full"></span>
          )}
        </button>
      ))}
    </nav>
  );
};

export default ProfileTabs;
