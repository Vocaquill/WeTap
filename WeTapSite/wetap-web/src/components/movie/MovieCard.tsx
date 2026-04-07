import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Star } from 'lucide-react';

import type { IMovieItem } from '../../types/movie.ts';
import {APP_ENV} from "../../env";

interface MovieCardProps {
  movie: IMovieItem;
  onClick?: () => void;
  compact?: boolean;
}

export function MovieCard({ movie, onClick, compact = false }: MovieCardProps) {
  const navigate = useNavigate();

  const year = movie.releaseDate
      ? new Date(movie.releaseDate).getFullYear()
      : '—';

  const primaryGenre = movie.genres?.[0]?.name ?? 'Unknown';

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/movie/${movie.slug}`);
    }
  };

  return (
      <motion.div
          whileHover={{ y: -8 }}
          onClick={handleClick}
          className="group cursor-pointer space-y-3 relative"
      >
        <div
            className="relative aspect-[2/3] bg-zinc-900 rounded-[2rem] overflow-hidden
                   border border-white/5 transition-all duration-500
                   group-hover:border-red-600
                   group-hover:shadow-[0_0_40px_rgba(220,38,38,0.25)]"
        >
          <img
              src={
                movie.image
                    ? APP_ENV.IMAGES_400_URL + movie.image
                    : '/placeholder.jpg'
              }
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-700
             group-hover:scale-110 group-hover:opacity-50"
          />

          <div className="absolute inset-0 flex items-center justify-center
                        opacity-0 group-hover:opacity-100
                        transition-all duration-300 bg-black/20">
            <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center
                          shadow-2xl shadow-red-600
                          transform scale-50 group-hover:scale-100
                          transition-all duration-500">
              <Play size={24} fill="white" className="ml-1 text-white" />
            </div>
          </div>

          {movie.imdbRating && (
              <div className="absolute top-4 right-4 px-2.5 py-1.5 bg-black/80 backdrop-blur-xl
                          rounded-xl flex items-center gap-1.5
                          border border-white/10 shadow-2xl">
                <Star size={12} fill="#FFD700" className="text-yellow-400" />
                <span className="text-[11px] font-black text-white">
              {movie.imdbRating}
            </span>
              </div>
          )}
        </div>

        <div className="px-2">
          <h3
              className={`font-black uppercase italic text-white transition-colors truncate
                      tracking-tight group-hover:text-red-500
                      ${compact ? 'text-xs' : 'text-base'}`}
          >
            {movie.title}
          </h3>

          <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            {year}
          </span>
            <span className="w-1 h-1 bg-red-600 rounded-full" />
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
            {primaryGenre}
          </span>
          </div>
        </div>
      </motion.div>
  );
}
