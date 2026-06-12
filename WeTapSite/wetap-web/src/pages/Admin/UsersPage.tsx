import {useState} from 'react';
import {Plus} from 'lucide-react';
import {Button} from '../../components/form/Button';
import type {UserSortField} from '../../env';

import AddGenreModal from '../../components/modal/AddGenreModal';
import EditGenreModal from '../../components/modal/EditGenreModal';
import DeleteModal from "../../components/ui/common/DeleteModal.tsx";

import {Pagination} from '../../components/ui/common/Pagination';

import {FilterBar} from '../../components/ui/common/FilterBar';
import {GenericTable} from '../../components/ui/common/GenericTable';
import {SelectField} from '../../components/form/SelectField';
import type {IUserSearchRequest} from "../../types/User/IUserSearchRequest.ts";
import type {IUserItemResponse} from "../../types/User/IUserItemResponse.ts";
import {useDeleteUserMutation, useSearchUsersQuery} from "../../services/api/apiUsers.ts";

const perPageOptions = [
    {id: 5, name: '5'},
    {id: 10, name: '10'},
    {id: 20, name: '20'},
    {id: 50, name: '50'},
];

function UsersPage() {
    const [searchParams, setSearchParams] = useState<IUserSearchRequest>({
        firstName: '',
        lastName: '',
        email: '',
        page: 1,
        itemPerPage: 10,
        sortBy: undefined,
    });

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState<IUserItemResponse | null>(null);

    const {data, isFetching, isError} = useSearchUsersQuery(searchParams);
    const [deleteGenre, {isLoading: isDeleting}] = useDeleteUserMutation();

    const handleSearchChange = <K extends keyof IUserSearchRequest>(key: K, value: IUserSearchRequest[K]) => {
        setSearchParams((prev: IUserSearchRequest) => ({...prev, [key]: value, page: 1}));
    };

    const resetFilters = () => {
        setSearchParams({
            firstName: '',
            lastName: '',
            email: '',
            page: 1,
            itemPerPage: searchParams.itemPerPage,
            sortBy: undefined,
        });
    };

    const handleSortChange = (key: string | undefined) => {
        setSearchParams((prev: IUserSearchRequest) => ({
            ...prev,
            sortBy: key as UserSortField | undefined,
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
                    <h1 className="text-4xl font-black text-white tracking-tight">Користувачі</h1>
                    <p className="text-zinc-500 mt-1">Керування користувачами та їх відображенням</p>
                </div>

                <Button
                    type="button"
                    variant="primary"
                    size="md"
                    className="rounded-2xl"
                    icon={<Plus size={20} strokeWidth={3}/>}
                    onClick={() => setIsAddOpen(true)}
                >
                    ДОДАТИ КОРИСТУВАЧА
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
                emptyMessage="Користувачів не знайдено"
                sortBy={searchParams.sortBy}
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
                            onChange={(page) => setSearchParams((prev: IUserSearchRequest) => ({...prev, page}))}
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
                title="Видалити користувача?"
                description={`Ви впевнені, що хочете видалити "${selectedGenre?.lastName + " " + selectedGenre?.firstName}"?`}
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

export default UsersPage;