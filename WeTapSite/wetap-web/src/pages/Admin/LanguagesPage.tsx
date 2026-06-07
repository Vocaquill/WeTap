import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/form/Button';
import { Pagination } from '../../components/ui/common/Pagination';
import { FilterBar } from '../../components/ui/common/FilterBar';
import { GenericTable } from '../../components/ui/common/GenericTable';
import { SelectField } from '../../components/form/SelectField';
import { useDeleteLanguageMutation, useSearchLanguagesQuery } from "../../services/api/apiLanguages.ts";
import type { ILanguageSearchRequest } from "../../types/Language/ILanguageSearchRequest.ts";
import type { ILanguageItemResponse } from "../../types/Language/ILanguageItemResponse.ts";
import type { IColumnConfig } from '../../types/Additional/IColumnConfig';

import AddLanguageModal from '../../components/modal/language/AddLanguageModal';
import EditLanguageModal from '../../components/modal/language/EditLanguageModal';
import DeleteModal from '../../components/modal/common/DeleteModal';

const perPageOptions = [
    { id: 5, name: '5' },
    { id: 10, name: '10' },
    { id: 20, name: '20' },
    { id: 50, name: '50' },
];

function LanguagesPage() {
    const [searchParams, setSearchParams] = useState<ILanguageSearchRequest>({
        name: '',
        page: 1,
        itemPerPage: 10,
    });

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<ILanguageItemResponse | null>(null);

    const { data, isFetching, isError } = useSearchLanguagesQuery(searchParams);
    const [deleteLanguage, { isLoading: isDeleting }] = useDeleteLanguageMutation();

    const handleSearchChange = <K extends keyof ILanguageSearchRequest>(key: K, value: ILanguageSearchRequest[K]) => {
        setSearchParams((prev) => ({ ...prev, [key]: value, page: 1 }));
    };

    const resetFilters = () => {
        setSearchParams({
            name: '',
            page: 1,
            itemPerPage: searchParams.itemPerPage,
        });
    };

    const handleDelete = async () => {
        if (!selectedLanguage) return;
        try {
            await deleteLanguage({ id: selectedLanguage.id }).unwrap();
            setIsDeleteOpen(false);
            setSelectedLanguage(null);
        } catch (e) {
            console.error('Помилка видалення мови:', e);
        }
    };

    const columns: IColumnConfig<ILanguageItemResponse>[] = [
        {
            key: 'id',
            label: 'ID',
            headerClassName: 'w-24 text-center',
            className: 'text-center text-zinc-600 font-mono text-xs italic',
            render: (item) => `#${item.id}`,
        },
        {
            key: 'name',
            label: 'Назва мови',
            sortable: true,
            sortKey: 'name',
            render: (item) => (
                <span className="font-bold text-zinc-200 group-hover:text-white transition-colors">
                    {item.name}
                </span>
            ),
        },
        {
            key: 'languageCode',
            label: 'Код мови',
            render: (item) => (
                <span className="px-3 py-1 bg-zinc-900 text-zinc-500 rounded-lg text-xs font-mono border border-zinc-800 uppercase">
                    {item.languageCode}
                </span>
            ),
        },
    ];

    return (
        <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Мови</h1>
                    <p className="text-zinc-500 mt-1">Керування мовами відео та їх відображенням</p>
                </div>

                <Button
                    type="button"
                    variant="primary"
                    size="md"
                    className="rounded-2xl"
                    icon={<Plus size={20} strokeWidth={3} />}
                    onClick={() => setIsAddOpen(true)}
                >
                    ДОДАТИ МОВУ
                </Button>
            </div>

            <FilterBar
                searchParams={searchParams}
                onSearchChange={handleSearchChange}
                onReset={resetFilters}
            />

            <GenericTable
                data={data?.items}
                columns={columns}
                isFetching={isFetching}
                isError={isError}
                emptyMessage="Мов не знайдено"
                onEdit={(language) => {
                    setSelectedLanguage(language);
                    setIsEditOpen(true);
                }}
                onDelete={(language) => {
                    setSelectedLanguage(language);
                    setIsDeleteOpen(true);
                }}
            />

            {data && (
                <div className="p-6 border border-zinc-800 bg-zinc-950/20 rounded-[2rem] shadow-xl">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <Pagination
                            currentPage={data.pagination.currentPage}
                            totalPages={data.pagination.totalPages}
                            onChange={(page) => setSearchParams((prev) => ({ ...prev, page }))}
                        />
                        <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase tracking-wider font-black">
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

            <AddLanguageModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />

            <EditLanguageModal
                isOpen={isEditOpen}
                language={selectedLanguage}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedLanguage(null);
                }}
            />

            <DeleteModal
                isOpen={isDeleteOpen}
                title="Видалити мову?"
                description={`Ви впевнені, що хочете видалити "${selectedLanguage?.name}"? Всі відео втратять цю мову.`}
                isLoading={isDeleting}
                onConfirm={handleDelete}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedLanguage(null);
                }}
            />
        </div>
    );
}

export default LanguagesPage;
