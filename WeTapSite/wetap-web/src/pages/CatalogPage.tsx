import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Loader2, ChevronDown } from 'lucide-react';
import { MovieCard } from '../components/movie/MovieCard.tsx';
import { Pagination } from "../components/Pagination.tsx";
import { MovieSearchFilters } from "../components/movie/MovieSearchFilters.tsx";
import PageTransition from '../components/PageTransition';
import { useSearchMoviesQuery } from '../services/api/apiMovies';
import type { IMovieSearch } from '../types/movie';

function CatalogPage() {
  const navigate = useNavigate();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false); // Стейт для показу фільтрів

  const [searchParams, setSearchParams] = useState<IMovieSearch>({
    title: '',
    page: 1,
    itemPerPage: 12,
  });

  const { data, isFetching } = useSearchMoviesQuery(searchParams);

  const handleChange = <K extends keyof IMovieSearch>(
    key: K,
    value: IMovieSearch[K]
  ) => {
    setSearchParams((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white p-6 md:p-12 pt-24">
        <div className="max-w-[1600px] mx-auto space-y-8">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-zinc-500/20 p-8 rounded-[3rem] border border-white/5 backdrop-blur-md">
            <div className="flex-1">
              <h1 className="text-4xl font-black uppercase italic tracking-tighter">
                Каталог <span className="text-red-600 font-outline-1 text-transparent">фільмів</span>
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <div className="relative group w-full sm:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-600 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Назва фільму..."
                  value={searchParams.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-red-600 transition-all text-sm"
                />
              </div>

              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border ${isFiltersOpen
                  ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20"
                  : "bg-zinc-800 border-white/5 text-zinc-400 hover:text-white"
                  }`}
              >
                <SlidersHorizontal size={16} />
                Фільтри
                <ChevronDown size={14} className={`transition-transform duration-300 ${isFiltersOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {isFiltersOpen && (
            <div className="animate-in slide-in-from-top duration-500 fade-in">
              <div className="bg-zinc-900/40 p-8 rounded-[2.5rem] border border-white/5 shadow-inner">
                <MovieSearchFilters
                  searchParams={searchParams}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <div className="min-h-[400px]">
            {isFetching ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="animate-spin text-red-600" size={48} />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 animate-pulse">Оновлення бази...</p>
              </div>
            ) : data?.items.length === 0 ? (
              <div className="text-center py-32 border border-dashed border-white/5 rounded-[3rem]">
                <p className="text-zinc-500 font-bold uppercase tracking-[0.3em]">Фільмів не знайдено</p>
                <button
                  onClick={() => setSearchParams({ title: '', page: 1, itemPerPage: 12 })}
                  className="mt-4 text-red-600 text-xs font-black uppercase tracking-widest hover:underline"
                >
                  Скинути все
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-10">
                {data?.items.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={() => navigate(`/movie/${movie.slug}`)}
                  />
                ))}
              </div>
            )}
          </div>

          {data && data.pagination.totalPages > 1 && (
            <div className="pt-12 border-t border-white/5 flex justify-center">
              <Pagination
                currentPage={data.pagination.currentPage}
                totalPages={data.pagination.totalPages}
                onChange={(page) => handleChange('page', page)}
              />
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

export default CatalogPage;
