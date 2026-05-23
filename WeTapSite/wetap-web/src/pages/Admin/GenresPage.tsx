import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Link2, X, Loader2 } from 'lucide-react';
import { Button } from '../../components/form/Button';

import AddGenreModal from '../../components/modal/AddGenreModal';
import EditGenreModal from '../../components/modal/EditGenreModal';
import DeleteModal from "../../components/ui/common/DeleteModal.tsx";

import type { IGenreItemResponse as IGenreItem } from '../../types/Genre/IGenreItemResponse';
import type { IGenreSearchRequest as IGenreSearch } from '../../types/Genre/IGenreSearchRequest';
import { useSearchGenresQuery, useDeleteGenreMutation } from '../../services/api/apiGenres';

import { Pagination } from '../../components/ui/common/Pagination';
import { APP_ENV } from "../../env";
import { InputField } from "../../components/form/InputField";

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
    setSearchParams((prev: IGenreSearch) => ({ ...prev, [key]: value, page: 1 }));
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

          <Button
              type="button"
              variant="primary"
              size="md"
              className="rounded-2xl"
              icon={<Plus size={20} strokeWidth={3} />}
              onClick={() => setIsAddOpen(true)}
          >
            ДОДАТИ ЖАНР
          </Button>
        </div>

        <div className="bg-zinc-950 p-4 rounded-[2rem] border border-zinc-800 flex flex-wrap items-center gap-4 shadow-xl">
          <InputField
              value={searchParams.name || ''}
              onChange={(e) => handleSearchChange('name', e.target.value)}
              placeholder="Пошук за назвою..."
              icon={<Search size={18} />}
              inputClassName="text-zinc-200 border-zinc-800 bg-zinc-900 focus:border-red-600/50"
              wrapperClassName="flex-[2] min-w-[240px]"
          />

          <InputField
              value={searchParams.slug || ''}
              onChange={(e) => handleSearchChange('slug', e.target.value)}
              placeholder="Фільтр по slug..."
              icon={<Link2 size={16} />}
              inputClassName="text-xs text-zinc-400 font-mono italic border-zinc-800 bg-zinc-900 focus:border-red-600/50"
              wrapperClassName="flex-1 min-w-[180px]"
          />

          {(searchParams.name || searchParams.slug) && (
              <Button
                  type="button"
                  variant="secondary"
                  className="w-12 h-12 p-0 flex items-center justify-center rounded-xl"
                  onClick={resetFilters}
              >
                <X size={20} />
              </Button>
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
                            <Button
                                type="button"
                                variant="secondary"
                                className="w-10 h-10 p-0 rounded-xl"
                                onClick={() => { setSelectedGenre(genre); setIsEditOpen(true); }}
                            >
                              <Edit2 size={16} />
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                className="w-10 h-10 p-0 rounded-xl hover:bg-red-950/40 text-zinc-500 hover:text-red-500 hover:border-red-950/40"
                                onClick={() => { setSelectedGenre(genre); setIsDeleteOpen(true); }}
                            >
                              <Trash2 size={16} />
                            </Button>
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
                    onChange={(page) => setSearchParams((prev: IGenreSearch) => ({ ...prev, page }))}
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