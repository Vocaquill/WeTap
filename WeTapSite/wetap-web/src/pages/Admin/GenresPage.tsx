import {useState, useEffect} from 'react';
import {Plus} from 'lucide-react';
import {Button} from '../../components/form/Button';
import {GENRE_SORT_FIELDS, type GenreSortField} from '../../env';

import AddGenreModal from '../../components/modal/genre/AddGenreModal';
import EditGenreModal from '../../components/modal/genre/EditGenreModal';
import DeleteModal from "../../components/modal/common/DeleteModal.tsx";

import type {IGenreItemResponse as IGenreItem} from '../../types/Genre/IGenreItemResponse';
import type {IGenreSearchRequest as IGenreSearch} from '../../types/Genre/IGenreSearchRequest';
import {useDeleteGenreMutation, useSearchGenresQuery} from '../../services/api/apiGenres';

import {Pagination} from '../../components/ui/common/Pagination';

import {FilterBar} from '../../components/ui/common/FilterBar';
import {GenericTable} from '../../components/ui/common/GenericTable';
import {SelectField} from '../../components/form/SelectField';
import {useSearchState} from '../../hooks/useSearchState';

const perPageOptions = [
    {id: 5, name: '5'},
    {id: 10, name: '10'},
    {id: 20, name: '20'},
    {id: 50, name: '50'},
];

const DEFAULT_GENRE_PARAMS: IGenreSearch = {
    name: '',
    slug: '',
    page: 1,
    itemPerPage: 10,
    sortBy: undefined,
};

function GenresPage() {
    const {searchParams, setSearchParams, handleSearchChange, resetFilters, clampPage} =
        useSearchState<IGenreSearch>(DEFAULT_GENRE_PARAMS);

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState<IGenreItem | null>(null);

    const {data, isFetching, isError} = useSearchGenresQuery(searchParams);
    const [deleteGenre, {isLoading: isDeleting}] = useDeleteGenreMutation();

    useEffect(() => {
        if (data) clampPage(data.pagination.totalPages);
    }, [data?.pagination.totalPages]);

    const handleSortChange = (key: string | undefined) => {
        setSearchParams((prev) => ({
            ...prev,
            sortBy: key as GenreSortField | undefined,
            page: 1,
        }));
    };

    const handleDelete = async () => {
        if (!selectedGenre) return;
        try {
            await deleteGenre({id: selectedGenre.id}).unwrap();
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
                    icon={<Plus size={20} strokeWidth={3}/>}
                    onClick={() => setIsAddOpen(true)}
                >
                    ДОДАТИ ЖАНР
                </Button>
            </div>

            <FilterBar
                searchParams={searchParams}
                onSearchChange={handleSearchChange}
                onReset={resetFilters}
            />

            <GenericTable
                data={data?.items}
                isFetching={isFetching}
                isError={isError}
                emptyMessage="Жанрів не знайдено"
                sortBy={searchParams.sortBy}
                sortableFields={[...GENRE_SORT_FIELDS]}
                onSortChange={handleSortChange}
                onEdit={(genre) => {
                    setSelectedGenre(genre);
                    setIsEditOpen(true);
                }}
                onDelete={(genre) => {
                    setSelectedGenre(genre);
                    setIsDeleteOpen(true);
                }}
            />

            {data && (
                <div className="p-6 border border-zinc-800 bg-zinc-950/20 rounded-[2rem] shadow-xl">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <Pagination
                            currentPage={data.pagination.currentPage}
                            totalPages={data.pagination.totalPages}
                            onChange={(page) => setSearchParams((prev) => ({...prev, page}))}
                        />
                        <div
                            className="flex items-center gap-2 text-zinc-500 text-xs uppercase tracking-wider font-black">
                            <span>Елементів на сторінці:</span>
                            <SelectField
                                name="itemPerPage"
                                value={searchParams.itemPerPage}
                                options={perPageOptions}
                                onChange={(e) => handleSearchChange('itemPerPage', Number(e.target.value))}
                                selectClassName="py-2 text-xs font-bold border-zinc-800 focus:border-red-600/50 hover:border-zinc-700 w-20 shrink-0"
                                wrapperClassName="shrink-0"
                            />
                        </div>
                    </div>
                </div>
            )}

            <AddGenreModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)}/>

            <EditGenreModal
                isOpen={isEditOpen}
                genre={selectedGenre}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedGenre(null);
                }}
            />

            <DeleteModal
                isOpen={isDeleteOpen}
                title="Видалити жанр?"
                description={`Ви впевнені, що хочете видалити "${selectedGenre?.name}"? Всі фільми втратять цей зв'язок.`}
                isLoading={isDeleting}
                onConfirm={handleDelete}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedGenre(null);
                }}
            />
        </div>
    );
}

export default GenresPage;