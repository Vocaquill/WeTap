import { Flame, Loader2, TrendingUp, Hash } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import { VideoCard } from '../../components/video/VideoCard';
import { useSearchVideosQuery } from '../../services/api/apiVideos';
import { useSearchGenresQuery } from '../../services/api/apiGenres';

interface CategoryRowProps {
    title: string;
    genreId?: number;
    icon?: React.ReactNode;
}

function CategoryRow({ title, genreId, icon }: CategoryRowProps) {
    const { data, isLoading } = useSearchVideosQuery({
        sortBy: 'views',
        genreId: genreId,
        page: 1,
        itemPerPage: 5
    });

    if (isLoading) {
        return (
            <div className="py-8 flex justify-center">
                <Loader2 className="animate-spin text-zinc-500" size={32} />
            </div>
        );
    }

    if (!data?.items || data.items.length === 0) {
        return null;
    }

    return (
        <section className="space-y-6">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2 border-b border-zinc-800/60 pb-3">
                {icon}
                {title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
                {data.items.map((video) => (
                    <VideoCard key={video.id} video={video} />
                ))}
            </div>
        </section>
    );
}

export default function PopularPage() {
    const { data: genresData } = useSearchGenresQuery({ page: 1, itemPerPage: 5 });

    return (
        <PageTransition>
            <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12 min-h-screen">

                <div className="flex items-center gap-5 bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800">
                    <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-rose-600/20 shrink-0">
                        <Flame size={32} className="text-white fill-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-wide">В тренді</h1>
                        <p className="text-zinc-400 mt-1">Найпопулярніші відео на WeTap</p>
                    </div>
                </div>

                <div className="space-y-12">
                    <CategoryRow
                        title="Головні хіти"
                        icon={<TrendingUp className="text-[#FF2D7A]" size={24} />}
                    />

                    {genresData?.items.map((genre) => (
                        <CategoryRow
                            key={genre.id}
                            title={`Популярне: ${genre.name}`}
                            genreId={genre.id}
                            icon={<Hash className="text-zinc-500" size={20} />}
                        />
                    ))}
                </div>

            </div>
        </PageTransition>
    );
}