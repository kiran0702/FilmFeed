import React, { useState, useRef } from 'react';
import { fetchSearch } from '../api';

function Spinner({ sm }) {
  return (
    <div className={`flex items-center justify-center gap-1 ${sm ? '' : 'py-12'}`}>
      {[0, 1, 2].map((i) => (
        <div key={i} className={`rounded-full bg-red-500 animate-pulse ${sm ? 'w-1.5 h-1.5' : 'w-2 h-2'}`} />
      ))}
    </div>
  );
}

export default function SearchBar({ onResults, onClear }) {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const timer = useRef(null);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(timer.current);
    if (!val.trim()) { onClear(); return; }
    timer.current = setTimeout(async () => {
      setSearching(true);
      try { 
        const r = await fetchSearch(val); 
        if (onResults) onResults(r.results || [], val); 
      } catch (_) {}
      setSearching(false);
    }, 600);
  };

  return (
    <div className="relative">
      <input type="text" value={query} onChange={handleChange} placeholder="Search movies..."
        className="w-48 lg:w-60 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white text-sm placeholder-white/40 outline-none focus:border-red-500/60 focus:bg-white/15 transition-all pr-8" />
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        {searching ? <Spinner sm /> : (
          <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </div>
    </div>
  );
}
