import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/form/Button';
import { Pagination } from '../../components/ui/common/Pagination';
import { FilterBar } from '../../components/ui/common/FilterBar';
import { GenericTable } from '../../components/ui/common/GenericTable';
import { SelectField } from '../../components/form/SelectField';
import { useDeleteTagMutation, useSearchTagsQuery } from "../../services/api/apiTags.ts";
import type { ITagSearchRequest } from "../../types/Tag/ITagSearchRequest.ts";
import type { ITagItemResponse } from "../../types/Tag/ITagItemResponse.ts";
import type { IColumnConfig } from '../../types/Additional/IColumnConfig';

import AddTagModal from '../../components/modal/tag/AddTagModal';
import EditTagModal from '../../components/modal/tag/EditTagModal';
import DeleteModal from '../../components/modal/common/DeleteModal';

const perPageOptions = [
    { id: 5, name: '5' },
    { id: 10, name: '10' },
    { id: 20, name: '20' },
    { id: 50, name: '50' },
];

function TagsPage() {
    const [searchParams, setSearchParams] = useState<ITagSearchRequest>({
        name: '',
        page: 1,
        itemPerPage: 10,
    });

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState<ITagItemResponse | null>(null);

    const { data, isFetching, isError } = useSearchTagsQuery(searchParams);
    const [deleteTag, { isLoading: isDeleting }] = useDeleteTagMutation();

    const handleSearchChange = <K extends keyof ITagSearchRequest>(key: K, value: ITagSearchRequest[K]) => {
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
        if (!selectedTag) return;
        try {
            await deleteTag({ id: selectedTag.id }).unwrap();
            setIsDeleteOpen(false);
            setSelectedTag(null);
        } catch (e) {
            console.error('Помилка видалення тегу:', e);
        }
    };

    const columns: IColumnConfig<ITagItemResponse>[] = [
        {
            key: 'id',
            label: 'ID',
            headerClassName: 'w-24 text-center',
            className: 'text-center text-zinc-600 font-mono text-xs italic',
            render: (item) => `#${item.id}`,
        },
        {
            key: 'name',
            label: 'Назва тегу',
            sortable: true,
            sortKey: 'name',
            render: (item) => (
                <span className="font-bold text-zinc-200 group-hover:text-white transition-colors">
                    {item.name}
                </span>
            ),
        },
        {
            key: 'slug',
            label: 'Slug',
            render: (item) => (
                <span className="px-3 py-1 bg-zinc-900 text-zinc-500 rounded-lg text-xs font-mono border border-zinc-800">
                    /{item.slug}
                </span>
            ),
        },
    ];

    return (
        <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Теги</h1>
                    <p className="text-zinc-500 mt-1">Керування тегами відео та їх відображенням</p>
                </div>

                <Button
                    type="button"
                    variant="primary"
                    size="md"
                    className="rounded-2xl"
                    icon={<Plus size={20} strokeWidth={3} />}
                    onClick={() => setIsAddOpen(true)}
                >
                    ДОДАТИ ТЕГ
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
                emptyMessage="Тегів не знайдено"
                onEdit={(tag) => {
                    setSelectedTag(tag);
                    setIsEditOpen(true);
                }}
                onDelete={(tag) => {
                    setSelectedTag(tag);
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

            <AddTagModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />

            <EditTagModal
                isOpen={isEditOpen}
                tag={selectedTag}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedTag(null);
                }}
            />

            <DeleteModal
                isOpen={isDeleteOpen}
                title="Видалити тег?"
                description={`Ви впевнені, що хочете видалити "${selectedTag?.name}"? Всі відео втратять цей тег.`}
                isLoading={isDeleting}
                onConfirm={handleDelete}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setSelectedTag(null);
                }}
            />
        </div>
    );
}

export default TagsPage;