import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { backdropUrl, fetchCast, fetchDetails, fetchSimilar, fetchVideos, imgUrl } from '../api';

function Spinner({ sm }) {
  return (
    <div className={`flex items-center justify-center gap-1 ${sm ? '' : 'py-12'}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`rounded-full bg-red-500 ${sm ? 'w-1.5 h-1.5' : 'w-2 h-2'}`}
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

function Rating({ value }) {
  const v = Number(value).toFixed(1);
  let color = 'text-red-400';

  if (value >= 7) {
    color = 'text-green-400';
  } else if (value >= 5) {
    color = 'text-yellow-400';
  }

  return <span className={`font-semibold text-xs ${color}`}>★ {v}</span>;
}

export default function MovieModal({ movie, onClose }) {
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchDetails(movie.id), fetchCast(movie.id), fetchVideos(movie.id), fetchSimilar(movie.id)])
      .then(([d, c, v, s]) => {
        setDetails(d.movie);
        setCast(c.cast?.slice(0, 8) || []);
        setVideos(v.results?.filter((x) => x.site === 'YouTube') || []);
        setSimilar(s.results?.slice(0, 8) || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [movie.id]);

  const trailer = videos.find((v) => v.type === 'Trailer') || videos[0];
  const backdrop = backdropUrl(details?.backdropPath || movie.backdropPath);
  const poster = imgUrl(details?.posterPath || movie.posterPath, 'w342');
  let content = null;

  if (!loading && tab === 'overview') {
    content = (
      <div>
        <p className="text-white/70 text-sm leading-relaxed">{details?.overview || movie.overview}</p>
        <div className="mt-6">
          <h3 className="text-white text-sm font-semibold mb-3">Cast</h3>
          {cast.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {cast.map((member) => {
                const profile = imgUrl(member.profilePath, 'w185');

                return (
                  <div key={member.id} className="flex items-center gap-2 min-w-0">
                    {profile ? (
                      <img src={profile} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-xs shrink-0">
                        {member.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-white/90 text-xs font-medium truncate">{member.name}</p>
                      <p className="text-white/45 text-xs truncate">{member.character}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-white/40 text-sm">No cast information available.</p>
          )}
        </div>
      </div>
    );
  } else if (!loading && tab === 'trailer') {
    content = trailer ? (
      <div className="aspect-video rounded-xl overflow-hidden bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${trailer.key}`}
          title={trailer.name}
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    ) : (
      <p className="text-white/40 text-sm">No trailer available.</p>
    );
  } else if (!loading && tab === 'similar') {
    content = similar.length ? (
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {similar.map((m, i) => (
          <button
            key={m.id || i}
            type="button"
            className="shrink-0 w-28 cursor-pointer text-left"
            onClick={() => { onClose(); setTimeout(() => onClose(m), 100); }}
          >
            <div className="h-40 rounded-lg overflow-hidden bg-zinc-800">
              {imgUrl(m.posterPath, 'w200') && <img src={imgUrl(m.posterPath, 'w200')} alt={m.title} className="w-full h-full object-cover" />}
            </div>
            <p className="text-white/70 text-xs mt-1 truncate">{m.title}</p>
          </button>
        ))}
      </div>
    ) : (
      <p className="text-white/40 text-sm">No similar movies found.</p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.93, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-3xl max-h-[90vh] bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-56 shrink-0">
          {backdrop ? <img src={backdrop} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-zinc-800" />}
          <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-black/40 to-transparent" />
          <button type="button" onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1" style={{ scrollbarWidth: 'none' }}>
          <div className="flex flex-col md:flex-row gap-5 px-6 pt-5 mb-5">
            {poster && (
              <div className="w-40 md:w-56 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-black/40">
                <img src={poster} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="pt-4 md:pt-10">
              <h2 className="text-2xl font-black text-white leading-tight">{details?.title || movie.title}</h2>
              {details?.tagline && <p className="text-red-400 text-sm italic mt-1">{details.tagline}</p>}
              <div className="flex flex-wrap gap-2 mt-2">
                {details?.genres?.map((g) => <span key={g} className="px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-xs">{g}</span>)}
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-white/50">
                {details?.releaseYear && <span>{details.releaseYear}</span>}
                {details?.runtime && <span>{Math.floor(details.runtime / 60)}h {details.runtime % 60}m</span>}
                <Rating value={details?.rating || movie.rating} />
              </div>
            </div>
          </div>

          <div className="flex gap-1 px-6 mb-5 border-b border-white/10 pb-0">
            {['overview', 'trailer', 'similar'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${tab === t ? 'border-red-500 text-white' : 'border-transparent text-white/40 hover:text-white/70'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="px-6 pb-6">
            {loading ? <Spinner /> : content}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
