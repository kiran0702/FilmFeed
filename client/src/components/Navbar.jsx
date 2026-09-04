import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clearToken } from '../api';
import { clearUser, selectUser } from '../store/authSlice';
import SearchBar from './SearchBar';

export default function Navbar({ onLogout }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'TV Shows', path: '/tv-shows' },
    { name: 'Trending', path: '/trending' },
    { name: 'My List', path: '/my-list' }
  ];

  const initial = user?.name ? user.name[0].toUpperCase() : 'U';

  const handleLogout = () => {
    clearToken();
    dispatch(clearUser());
    if (onLogout) onLogout();
    navigate('/');
  };

  const handleSearchResults = () => {
    // For a real app, this might navigate to a search results page
    // For now, we'll keep it simple
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-linear-to-b from-black/95 to-transparent backdrop-blur-md border-b border-white/5">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center gap-4 md:gap-8">
          {/* Mobile Menu Button */}
          <button 
            type="button"
            className="md:hidden text-white/80 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="FilmFeed" className="h-8 object-contain cursor-pointer" />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link key={item.name} to={item.path}
                className={`text-sm font-medium transition-colors ${location.pathname === item.path ? 'text-white border-b-2 border-red-500 pb-0.5' : 'text-white/50 hover:text-white'}`}>
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden sm:block">
            <SearchBar onResults={handleSearchResults} onClear={() => { }} />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu((v) => !v)}
              className="w-8 h-8 rounded-full bg-linear-to-br from-red-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white hover:ring-2 hover:ring-red-500/60 transition-all"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.name || 'User'} avatar`}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                initial
              )}
            </button>
            <AnimatePresence>
              {showUserMenu && (
                <motion.div initial={{ opacity: 0, y: 6, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }} transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-zinc-700">
                    <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
                    <p className="text-zinc-500 text-xs">{user?.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setShowUserMenu(false); navigate('/profile'); }}
                    className="w-full text-left px-4 py-3 text-sm text-white hover:bg-zinc-800 transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowUserMenu(false); handleLogout(); }}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-zinc-800 transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-zinc-900 border-b border-white/5"
          >
            <div className="flex flex-col px-4 py-3 gap-3">
              <div className="sm:hidden mb-2">
                <SearchBar onResults={() => { }} onClear={() => { }} />
              </div>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium py-2 ${location.pathname === item.path ? 'text-white' : 'text-white/50'}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
