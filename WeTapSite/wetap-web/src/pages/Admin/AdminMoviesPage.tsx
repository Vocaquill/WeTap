import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Plus } from 'lucide-react';
import type { IMovieSearch } from '../../types/movie';
import { useDeleteMovieMutation, useSearchMoviesQuery } from '../../services/api/apiMovies';
import { MovieSearchFilters } from '../../components/movie/MovieSearchFilters';
import { Pagination } from "../../components/Pagination.tsx";
import DeleteModal from "../../components/ui/common/DeleteModal.tsx";

function AdminMoviesPage() {
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useState<IMovieSearch>({
        title: '',
        page: 1,
        itemPerPage: 10,
    });

    const { data, isFetching, isError } = useSearchMoviesQuery(searchParams);

    const [deleteMovie, { isLoading: isDeleting }] = useDeleteMovieMutation();

    const [movieToDelete, setMovieToDelete] = useState<{ id: number; title: string } | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDelete = async () => {
        if (!movieToDelete) return;
        try {
            await deleteMovie({ id: movieToDelete.id }).unwrap();
            setIsDeleteModalOpen(false);
            setMovieToDelete(null);
        } catch (e) {
            console.error('Помилка при видаленні:', e);
        }
    };

    const handleSearchChange = <K extends keyof IMovieSearch>(key: K, value: IMovieSearch[K]) => {
        setSearchParams(prev => ({
            ...prev,
            [key]: value,
            page: 1,
        }));
    };

    return (
        <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Фільми</h1>
                    <p className="text-zinc-500 mt-1">Керування вашою бібліотекою контенту</p>
                </div>
                <button
                    onClick={() => navigate('/admin/movies/add')}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-2xl text-white font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-600/20"
                >
                    <Plus size={20} strokeWidth={3} />
                    ДОДАТИ ФІЛЬМ
                </button>
            </div>

            <MovieSearchFilters searchParams={searchParams} onChange={handleSearchChange} />

            <div className="overflow-hidden bg-zinc-950 border border-zinc-800 rounded-[2rem] shadow-2xl relative">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-zinc-900/50 text-zinc-500 text-[11px] uppercase tracking-[0.2em] font-black">
                    <tr>
                        <th className="p-5 border-b border-zinc-800 w-24 text-center">ID</th>
                        <th className="p-5 border-b border-zinc-800">Назва</th>
                        <th className="p-5 border-b border-zinc-800">Slug</th>
                        <th className="p-5 border-b border-zinc-800">Дата релізу</th>
                        <th className="p-5 border-b border-zinc-800 text-right">Дії</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                    {isFetching && !data ? (
                        <tr><td colSpan={5} className="p-20 text-center text-zinc-500 font-bold animate-pulse">Завантаження бази...</td></tr>
                    ) : isError ? (
                        <tr><td colSpan={5} className="p-20 text-center text-red-500 font-bold">Помилка завантаження даних</td></tr>
                    ) : data?.items.length === 0 ? (
                        <tr><td colSpan={5} className="p-20 text-center text-zinc-600 italic">Схоже, тут порожньо...</td></tr>
                    ) : (
                        data?.items.map((movie) => (
                            <tr key={movie.id} className="hover:bg-zinc-900/40 transition-all group">
                                <td className="p-5 text-center text-zinc-600 font-mono text-xs italic">#{movie.id}</td>
                                <td className="p-5">
                                        <span className="font-bold text-zinc-200 group-hover:text-white transition-colors">
                                            {movie.title}
                                        </span>
                                </td>
                                <td className="p-5 font-mono text-xs text-zinc-500">{movie.slug}</td>
                                <td className="p-5 text-sm text-zinc-400">
                                    {new Date(movie.releaseDate).toLocaleDateString('uk-UA', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </td>
                                <td className="p-5 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/movies/edit/${movie.slug}`)}
                                            className="w-10 h-10 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all border border-zinc-800"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setMovieToDelete({ id: movie.id, title: movie.title });
                                                setIsDeleteModalOpen(true);
                                            }}
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
                <div className="flex justify-center pt-4">
                    <Pagination
                        currentPage={data.pagination.currentPage}
                        totalPages={data.pagination.totalPages}
                        range={1}
                        onChange={(page) => setSearchParams(prev => ({ ...prev, page }))}
                    />
                </div>
            )}

            <DeleteModal
                isOpen={isDeleteModalOpen}
                title="Видалити фільм?"
                description={`Ви впевнені, що хочете видалити "${movieToDelete?.title}"? Це назавжди видалить відео та всі дані.`}
                isLoading={isDeleting}
                onConfirm={handleDelete}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setMovieToDelete(null);
                }}
            />
        </div>
    );
}

export default AdminMoviesPage;