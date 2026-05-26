import { useState, useEffect } from 'react';
import { Plus, Film } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/form/Button';
import { useAppSelector } from '../../store';
import { APP_ENV } from '../../env';

import DeleteModal from "../../components/ui/common/DeleteModal.tsx";

import type { IVideoItemResponse } from '../../types/Video/IVideoItemResponse';
import type { IVideoSearchRequest } from '../../types/Video/IVideoSearchRequest';
import { useSearchVideosQuery, useDeleteVideoMutation } from '../../services/api/apiVideos';

import { Pagination } from '../../components/ui/common/Pagination';
import { FilterBar } from '../../components/ui/common/FilterBar';
import { GenericTable } from '../../components/ui/common/GenericTable';
import { SelectField } from '../../components/form/SelectField';
import type { IColumnConfig } from '../../types/Additional/IColumnConfig';

const perPageOptions = [
  { id: 5, name: '5' },
  { id: 10, name: '10' },
  { id: 20, name: '20' },
  { id: 50, name: '50' },
];

function StudioPage() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const [searchParams, setSearchParams] = useState<IVideoSearchRequest>({
    title: '',
    page: 1,
    itemPerPage: 10,
    sortBy: undefined,
    channelId: user?.id || 0,
  });

  useEffect(() => {
    if (user?.id) {
      setSearchParams((prev) => ({ ...prev, channelId: user.id }));
    }
  }, [user?.id]);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<IVideoItemResponse | null>(null);

  const { data, isFetching, isError } = useSearchVideosQuery(searchParams, {
    skip: !searchParams.channelId,
  });
  const [deleteVideo, { isLoading: isDeleting }] = useDeleteVideoMutation();

  const handleSearchChange = <K extends keyof IVideoSearchRequest>(key: K, value: IVideoSearchRequest[K]) => {
    setSearchParams((prev: IVideoSearchRequest) => ({ ...prev, [key]: value, page: 1 }));
  };

  const resetFilters = () => {
    setSearchParams({
      title: '',
      page: 1,
      itemPerPage: searchParams.itemPerPage,
      sortBy: undefined,
      channelId: user?.id || 0,
    });
  };

  const handleSortChange = (key: string | undefined) => {
    setSearchParams((prev: IVideoSearchRequest) => ({
      ...prev,
      sortBy: key,
      page: 1,
    }));
  };

  const handleDelete = async () => {
    if (!selectedVideo) return;
    try {
      await deleteVideo({ id: selectedVideo.id }).unwrap();
      setIsDeleteOpen(false);
      setSelectedVideo(null);
    } catch (e) {
      console.error('Помилка видалення відео:', e);
    }
  };

  const columns: IColumnConfig<IVideoItemResponse>[] = [
    {
      key: 'image',
      label: "Прев'ю",
      headerClassName: 'w-28',
      render: (item) => (
        <div className="w-16 h-10 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden shadow-inner group-hover:border-zinc-700 transition-colors">
          {item.image ? (
            <img
              src={APP_ENV.IMAGES_400_URL + item.image}
              alt="Preview"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-700 uppercase text-[9px] font-black">No Pic</div>
          )}
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Назва відео',
      render: (item) => (
        <div className="flex flex-col max-w-xs md:max-w-md">
          <span className="font-bold text-zinc-200 group-hover:text-white transition-colors truncate">
            {item.title}
          </span>
          {item.description && (
            <span className="text-xs text-zinc-500 truncate mt-0.5">
              {item.description}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'viewCount',
      label: 'Перегляди',
      render: (item) => (
        <span className="text-zinc-300 font-medium">{item.viewCount}</span>
      ),
    },
    {
      key: 'likesCount',
      label: 'Оцінки',
      render: (item) => (
        <span className="text-zinc-400 text-xs">
          👍 {item.likesCount} / 👎 {item.dislikesCount}
        </span>
      ),
    },
    {
      key: 'privacy',
      label: 'Приватність',
      render: (item) => (
        <span className="px-2 py-0.5 bg-zinc-900 text-zinc-400 rounded-md text-xs font-semibold border border-zinc-800">
          {item.privacy?.name || 'Публічне'}
        </span>
      ),
    },
    {
      key: 'dateCreated',
      label: 'Дата завантаження',
      sortable: true,
      sortKey: 'date',
      render: (item) => {
        if (!item.dateCreated) return <span className="text-zinc-600">-</span>;
        const date = new Date(item.dateCreated);
        return (
          <span className="text-zinc-400 text-xs font-medium">
            {date.toLocaleDateString('uk-UA')}
          </span>
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-600/10 rounded-2xl text-red-500 border border-red-500/10">
            <Film size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Студія автора</h1>
            <p className="text-zinc-500 mt-1">Керування завантаженими відео та перегляд статистики</p>
          </div>
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          className="rounded-2xl"
          icon={<Plus size={20} strokeWidth={3} />}
          onClick={() => navigate('/video/add')}
        >
          ДОДАТИ ВІДЕО
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
        emptyMessage="Відео не знайдено"
        sortBy={searchParams.sortBy}
        onSortChange={handleSortChange}
        onDelete={(video) => {
          setSelectedVideo(video);
          setIsDeleteOpen(true);
        }}
      />

      {data && (
        <div className="p-6 border border-zinc-800 bg-zinc-950/20 rounded-[2rem] shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Pagination
              currentPage={data.pagination.currentPage}
              totalPages={data.pagination.totalPages}
              onChange={(page) => setSearchParams((prev: IVideoSearchRequest) => ({ ...prev, page }))}
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

      <DeleteModal
        isOpen={isDeleteOpen}
        title="Видалити відео?"
        description={`Ви впевнені, що хочете видалити відео "${selectedVideo?.title}"? Цю дію неможливо скасувати.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedVideo(null);
        }}
      />
    </div>
  );
}

export default StudioPage;
