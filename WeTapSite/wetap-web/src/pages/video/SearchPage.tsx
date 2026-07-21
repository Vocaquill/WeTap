import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
    Play,
    CheckCircle2,
    ThumbsUp,
    ThumbsDown,
    Eye,
    Calendar,
    Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { APP_ENV } from '../../env';
import { useSearchVideosQuery } from '../../services/api/apiVideos';
import { useSearchGenresQuery } from '../../services/api/apiGenres';
import { useSearchTagsQuery } from '../../services/api/apiTags';
import { Pagination } from '../../components/ui/common/Pagination';
import PageTransition from '../../components/layout/PageTransition';
import { SelectField } from '../../components/form/SelectField';

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const query = searchParams.get('q') || '';
    const genreId = searchParams.get('genreId') ? Number(searchParams.get('genreId')) : undefined;
    const tagId = searchParams.get('tagId') ? Number(searchParams.get('tagId')) : undefined;
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

    const minPossibleYear = 2010;
    const maxPossibleYear = new Date().getFullYear();

    const urlYearFrom = searchParams.get('createYearFrom') ? Number(searchParams.get('createYearFrom')) : minPossibleYear;
    const urlYearTo = searchParams.get('createYearTo') ? Number(searchParams.get('createYearTo')) : maxPossibleYear;

    const [yearFrom, setYearFrom] = useState(urlYearFrom);
    const [yearTo, setYearTo] = useState(urlYearTo);

    const [prevUrlFrom, setPrevUrlFrom] = useState(urlYearFrom);
    const [prevUrlTo, setPrevUrlTo] = useState(urlYearTo);

    if (urlYearFrom !== prevUrlFrom || urlYearTo !== prevUrlTo) {
        setYearFrom(urlYearFrom);
        setYearTo(urlYearTo);
        setPrevUrlFrom(urlYearFrom);
        setPrevUrlTo(urlYearTo);
    }

    const { data: genresData } = useSearchGenresQuery({ page: 1, itemPerPage: 100 });
    const { data: tagsData } = useSearchTagsQuery({ page: 1, itemPerPage: 100 });

    const searchRequestParams = {
        page,
        itemPerPage: 10,
        q: query || undefined,
        genreId,
        tagId,
        sortBy: sortBy !== 'relevance' ? sortBy : undefined,
        createYearFrom: yearFrom > minPossibleYear ? yearFrom.toString() : undefined,
        createYearTo: yearTo < maxPossibleYear ? yearTo.toString() : undefined,
    };

    const { data: videosData, isLoading, isFetching } = useSearchVideosQuery(searchRequestParams);

    const updateUrlParam = (key: string, value: string | number | undefined) => {
        const nextParams = new URLSearchParams(searchParams);
        if (value === undefined || value === '' || value === 'all' || value === 'relevance') {
            nextParams.delete(key);
        } else {
            nextParams.set(key, value.toString());
        }
        nextParams.set('page', '1');
        setSearchParams(nextParams);
    };

    const handleYearChange = (from: number, to: number) => {
        const nextParams = new URLSearchParams(searchParams);
        if (from > minPossibleYear) {
            nextParams.set('createYearFrom', from.toString());
        } else {
            nextParams.delete('createYearFrom');
        }

        if (to < maxPossibleYear) {
            nextParams.set('createYearTo', to.toString());
        } else {
            nextParams.delete('createYearTo');
        }
        nextParams.set('page', '1');
        setSearchParams(nextParams);
    };

    const handlePageChange = (newPage: number) => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('page', newPage.toString());
        setSearchParams(nextParams);
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-theme-bg text-zinc-100 pb-16 px-4 md:px-8">

                <div className="flex flex-wrap items-center gap-4 pt-6 mb-8">

                    <SelectField
                        name="genreId"
                        value={genreId || 'all'}
                        onChange={(e) => updateUrlParam('genreId', e.target.value === 'all' ? undefined : Number(e.target.value))}
                        options={[
                            { id: 'all', name: 'Жанр: Всі' },
                            ...(genresData?.items.map((g) => ({ id: g.id, name: g.name })) || [])
                        ]}
                        variant="filter"
                    />

                    <SelectField
                        name="tagId"
                        value={tagId || 'all'}
                        onChange={(e) => updateUrlParam('tagId', e.target.value === 'all' ? undefined : Number(e.target.value))}
                        options={[
                            { id: 'all', name: 'Особливості: Будь-які' },
                            ...(tagsData?.items.map((t) => ({ id: t.id, name: t.name })) || [])
                        ]}
                        variant="filter"
                    />

                    <SelectField
                        name="sortBy"
                        value={sortBy}
                        onChange={(e) => updateUrlParam('sortBy', e.target.value)}
                        options={[
                            { id: 'relevance', name: 'Сортувати за: Релевантністю' },
                            { id: 'date', name: 'Сортувати за: Датою завантаження' },
                            { id: 'views', name: 'Сортувати за: Переглядами' },
                            { id: 'likes', name: 'Сортувати за: Лайками' }
                        ]}
                        variant="filter"
                    />

                    <div className="flex items-center gap-3 bg-zinc-800/60 rounded-full py-1.5 px-4 text-sm font-medium text-zinc-200">
                        <span className="text-xs text-zinc-400 shrink-0 select-none">Роки:</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="range"
                                min={minPossibleYear}
                                max={maxPossibleYear}
                                value={yearFrom}
                                onChange={(e) => {
                                    const val = Math.min(Number(e.target.value), yearTo);
                                    setYearFrom(val);
                                    handleYearChange(val, yearTo);
                                }}
                                className="w-16 md:w-24 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-rose-500 focus:outline-none"
                            />
                            <span className="text-xs font-bold text-rose-500 min-w-[65px] text-center select-none">
                                {yearFrom === minPossibleYear && yearTo === maxPossibleYear ? 'Будь-які' : `${yearFrom}-${yearTo}`}
                            </span>
                            <input
                                type="range"
                                min={minPossibleYear}
                                max={maxPossibleYear}
                                value={yearTo}
                                onChange={(e) => {
                                    const val = Math.max(Number(e.target.value), yearFrom);
                                    setYearTo(val);
                                    handleYearChange(yearFrom, val);
                                }}
                                className="w-16 md:w-24 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-rose-500 focus:outline-none"
                            />
                        </div>
                    </div>

                </div>

                <div className="space-y-6">
                    {isLoading || isFetching ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="flex flex-col md:flex-row gap-6 p-4 bg-zinc-900/30 rounded-3xl border border-white/5 animate-pulse">
                                <div className="w-full md:w-80 aspect-video bg-zinc-900 rounded-2xl shrink-0" />
                                <div className="flex-1 space-y-4 py-2">
                                    <div className="h-6 bg-zinc-900 rounded w-3/4" />
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-zinc-900" />
                                        <div className="h-4 bg-zinc-900 rounded w-1/4" />
                                    </div>
                                    <div className="h-4 bg-zinc-900 rounded w-1/2" />
                                    <div className="h-12 bg-zinc-900 rounded w-5/6" />
                                </div>
                            </div>
                        ))
                    ) : videosData?.items && videosData.items.length > 0 ? (
                        <div className="space-y-6">
                            {videosData.items.map((video) => (
                                <motion.div
                                    key={video.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="group relative flex flex-col md:flex-row gap-6 p-4 hover:bg-zinc-900/40 rounded-3xl border border-transparent hover:border-zinc-800/40 transition-all duration-300"
                                >
                                    <Link
                                        to={`/video/${video.slug}`}
                                        className="absolute inset-0 z-10 rounded-3xl"
                                        aria-label={`Дивитися відео: ${video.title}`}
                                    />

                                    <div className="w-full md:w-80 aspect-video bg-zinc-900 rounded-2xl overflow-hidden relative shrink-0 border border-white/5 group-hover:border-rose-500/20 transition-all duration-500 shadow-md">
                                        <img
                                            src={video.image ? `${APP_ENV.IMAGES_400_URL}${video.image}` : '/placeholder.jpg'}
                                            alt={video.title}
                                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                            <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center shadow-lg">
                                                <Play size={20} fill="white" className="ml-0.5 text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                        <div>
                                            <h3 className="font-extrabold text-xl text-zinc-100 group-hover:text-rose-500 transition-colors line-clamp-2 leading-snug">
                                                {video.title}
                                            </h3>

                                            <div className="flex items-center gap-2 mt-2.5 relative z-20 w-fit">
                                                <Link
                                                    to={`/channel/${video.channel?.id}`}
                                                    className="w-7 h-7 rounded-full overflow-hidden bg-zinc-850 border border-white/10 shrink-0 block"
                                                >
                                                    <img
                                                        src={video.channel?.avatarImage ? `${APP_ENV.IMAGES_50_URL}${video.channel.avatarImage}` : '/images/user/default.jpg'}
                                                        alt={video.channel?.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </Link>
                                                <Link to={`/channel/${video.channel?.id}`} className="font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 text-sm transition-colors cursor-pointer truncate">
                                                    {video.channel?.name}
                                                </Link>
                                                <CheckCircle2 size={13} className="text-zinc-500 shrink-0" fill="currentColor" />
                                            </div>

                                            <p className="text-zinc-500 text-xs font-semibold mt-2 flex items-center gap-1.5">
                                                <Eye size={13} />
                                                <span>{video.viewCount} переглядів</span>
                                                <span className="text-zinc-700">•</span>
                                                <Calendar size={13} />
                                                <span>{video.dateCreated}</span>
                                            </p>

                                            <p className="text-zinc-400 text-sm font-medium leading-relaxed mt-3 line-clamp-2 max-w-2xl">
                                                {video.description || "Опис відсутній для цього відео."}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 mt-4 relative z-20 w-fit">
                                            <div className="flex items-center bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/80 text-zinc-400">
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border-r border-zinc-800/85">
                                                    <ThumbsUp size={14} />
                                                    <span>{video.likesCount}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold">
                                                    <ThumbsDown size={14} />
                                                    <span>{video.dislikesCount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 px-4 bg-zinc-900/20 border border-zinc-800/30 rounded-3xl text-center">
                            <Search size={48} className="text-zinc-600 mb-4" />
                            <h3 className="text-lg font-bold text-zinc-300">Нічого не знайдено</h3>
                            <p className="text-zinc-500 text-sm mt-1 max-w-sm">Спробуйте інші ключові слова або змініть фільтри пошуку.</p>
                        </div>
                    )}
                </div>

                {videosData && videosData.pagination.totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                        <Pagination
                            currentPage={page}
                            totalPages={videosData.pagination.totalPages}
                            onChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </PageTransition>
    );
}