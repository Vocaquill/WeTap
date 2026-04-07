import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Link2, X, Loader2 } from 'lucide-react';

import AddGenreModal from '../../components/AddGenreModal';
import EditGenreModal from '../../components/EditGenreModal';
import DeleteModal from "../../components/ui/common/DeleteModal.tsx";

import type { IGenreItem, IGenreSearch } from '../../types/genre';
import { useSearchGenresQuery, useDeleteGenreMutation } from '../../services/api/apiGenres';

import { Pagination } from '../../components/Pagination';
import { APP_ENV } from "../../env";

function GenresPage() {
  const [searchParams, setSearchParams] = useState<IGenreSearch>({
    name: '',
    slug: '',
    page: 1,
    itemPerPage: 10, // збільшив до 10 для кращого вигляду
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<IGenreItem | null>(null);

  const { data, isFetching, isError } = useSearchGenresQuery(searchParams);
  const [deleteGenre, { isLoading: isDeleting }] = useDeleteGenreMutation();

  const handleSearchChange = <K extends keyof IGenreSearch>(key: K, value: IGenreSearch[K]) => {
    setSearchParams((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const resetFilters = () => {
    setSearchParams({ name: '', slug: '', page: 1, itemPerPage: searchParams.itemPerPage });
  };

  const handleDelete = async () => {
    if (!selectedGenre) return;
    try {
      await deleteGenre({ id: selectedGenre.id }).unwrap();
      setIsDeleteOpen(false);
      setSelectedGenre(null);
    } catch (e) {
      console.error('Помилка видалення:', e);
    }
  };

  return (
      <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Жанри</h1>
            <p className="text-zinc-500 mt-1">Керування категоріями фільмів та їх відображенням</p>
          </div>

          <button
              onClick={() => setIsAddOpen(true)}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-2xl text-white font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-600/20"
          >
            <Plus size={20} strokeWidth={3} />
            ДОДАТИ ЖАНР
          </button>
        </div>

        <div className="bg-zinc-950 p-4 rounded-[2rem] border border-zinc-800 flex flex-wrap items-center gap-4 shadow-xl">
          <div className="relative flex-[2] min-w-[240px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
                value={searchParams.name || ''}
                onChange={(e) => handleSearchChange('name', e.target.value)}
                placeholder="Пошук за назвою..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-zinc-200 focus:border-red-600/50 outline-none transition-all"
            />
          </div>

          <div className="relative flex-1 min-w-[180px]">
            <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
            <input
                value={searchParams.slug || ''}
                onChange={(e) => handleSearchChange('slug', e.target.value)}
                placeholder="Фільтр по slug..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-xs text-zinc-400 font-mono italic outline-none focus:border-red-600/50 transition-all"
            />
          </div>

          {(searchParams.name || searchParams.slug) && (
              <button
                  onClick={resetFilters}
                  className="w-12 h-12 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-xl transition-colors border border-zinc-800"
              >
                <X size={20} />
              </button>
          )}
        </div>

        <div className="overflow-hidden bg-zinc-950 border border-zinc-800 rounded-[2rem] shadow-2xl relative">
          {isFetching && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                <Loader2 className="animate-spin text-red-600" size={40} />
              </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-zinc-900/50 text-zinc-500 text-[11px] uppercase tracking-[0.2em] font-black">
              <tr>
                <th className="p-5 w-24 text-center">ID</th>
                <th className="p-5 w-28">Прев'ю</th>
                <th className="p-5">Назва жанру</th>
                <th className="p-5">Slug</th>
                <th className="p-5 text-right">Дії</th>
              </tr>
              </thead>

              <tbody className="divide-y divide-zinc-900">
              {isError ? (
                  <tr><td colSpan={5} className="p-20 text-center text-red-500 font-bold">Помилка завантаження даних</td></tr>
              ) : data?.items.length === 0 ? (
                  <tr><td colSpan={5} className="p-20 text-center text-zinc-600 italic">Жанрів не знайдено</td></tr>
              ) : (
                  data?.items.map((genre: IGenreItem) => (
                      <tr key={genre.id} className="hover:bg-zinc-900/40 transition-all group">
                        <td className="p-5 text-center text-zinc-600 font-mono text-xs italic">#{genre.id}</td>

                        <td className="p-5">
                          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-inner group-hover:border-zinc-700 transition-colors">
                            {genre.image ? (
                                <img
                                    src={APP_ENV.IMAGES_400_URL + genre.image}
                                    alt={genre.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-700 uppercase text-[10px] font-black">No Pic</div>
                            )}
                          </div>
                        </td>

                        <td className="p-5">
                      <span className="font-bold text-zinc-200 group-hover:text-white transition-colors">
                        {genre.name}
                      </span>
                        </td>

                        <td className="p-5">
                      <span className="px-3 py-1 bg-zinc-900 text-zinc-500 rounded-lg text-xs font-mono border border-zinc-800">
                        /{genre.slug}
                      </span>
                        </td>

                        <td className="p-5 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                                onClick={() => { setSelectedGenre(genre); setIsEditOpen(true); }}
                                className="w-10 h-10 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all border border-zinc-800"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => { setSelectedGenre(genre); setIsDeleteOpen(true); }}
                                className="w-10 h-10 flex items-center justify-center bg-zinc-900 hover:bg-red-950/40 rounded-xl text-zinc-500 hover:text-red-500 transition-all border border-zinc-800"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                  ))
              )}
              </tbody>
            </table>
          </div>

          {data && (
              <div className="p-6 border-t border-zinc-900 bg-zinc-900/20">
                <Pagination
                    currentPage={data.pagination.currentPage}
                    totalPages={data.pagination.totalPages}
                    onChange={(page) => setSearchParams((prev) => ({ ...prev, page }))}
                />
              </div>
          )}
        </div>

        <AddGenreModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />

        <EditGenreModal
            isOpen={isEditOpen}
            genre={selectedGenre}
            onClose={() => { setIsEditOpen(false); setSelectedGenre(null); }}
        />

        <DeleteModal
            isOpen={isDeleteOpen}
            title="Видалити жанр?"
            description={`Ви впевнені, що хочете видалити "${selectedGenre?.name}"? Всі фільми втратять цей зв'язок.`}
            isLoading={isDeleting}
            onConfirm={handleDelete}
            onClose={() => { setIsDeleteOpen(false); setSelectedGenre(null); }}
        />
      </div>
  );
}

export default GenresPage;