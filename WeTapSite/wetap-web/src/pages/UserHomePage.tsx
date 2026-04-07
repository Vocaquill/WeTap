import { useNavigate } from 'react-router-dom';
import { Play, TrendingUp } from 'lucide-react';
import { MovieCard } from '../components/movie/MovieCard.tsx';
import { useSearchMoviesQuery } from '../services/api/apiMovies';
import { motion } from 'framer-motion';

function UserHomePage() {
    const navigate = useNavigate();

  const { data, isLoading } = useSearchMoviesQuery({ page: 1, itemPerPage: 6 });

  return (
    <div className="min-h-screen bg-black text-white pb-20">

      <section className="relative h-[80vh] flex items-center px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070"
            className="w-full h-full object-cover opacity-40"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="bg-red-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Новинка</span>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mt-4">
              Watch <span className="text-red-600 font-outline-2">Movies</span> Online
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl max-w-xl mt-6 font-medium">
              Відкрийте для себе світ найкращого кіно у високій якості. Тисячі фільмів чекають на вас.
            </p>
            <div className="flex gap-4 mt-10">
              <button
                onClick={() => navigate('/catalog')}
                className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-sm hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
              >
                <Play size={20} fill="currentColor" /> Дивитися зараз
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 md:px-12 -mt-10 relative z-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-red-600" />
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Останні надходження</h2>
          </div>
          <button
            onClick={() => navigate('/catalog')}
            className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-red-600 transition-colors"
          >
            Дивитися всі
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-zinc-900 rounded-[2.5rem] animate-pulse border border-white/5" />
            ))
          ) : (
            data?.items.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => navigate(`/movie/${movie.slug}`)}
              />
            ))
          )}
        </div>
      </section>

    </div>
  );
}

export default UserHomePage;
