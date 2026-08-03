import { ThumbsUp, Loader2, HeartCrack } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import { VideoCard } from '../../components/video/VideoCard';
import { useSearchVideosQuery } from '../../services/api/apiVideos';
import { useAppSelector } from '../../store';
import { Link } from 'react-router-dom';
import { Button } from '../../components/form/Button';

export default function LikedVideosPage() {
    const { user } = useAppSelector(state => state.auth);

    // Робимо запит з параметром isLiked: true
    const { data, isLoading } = useSearchVideosQuery({
        page: 1,
        itemPerPage: 50,
        isLiked: true,
        sortBy: 'date'
    }, {
        skip: !user
    });

    return (
        <PageTransition>
            <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 min-h-screen">

                <div className="flex items-center gap-5 bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800">
                    <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-rose-600/20 shrink-0">
                        <ThumbsUp size={32} className="text-white fill-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-wide">Вподобані відео</h1>
                        <p className="text-zinc-400 mt-1">Відео, які вам сподобалися</p>
                    </div>
                </div>

                {isLoading && (
                    <div className="py-20 flex justify-center">
                        <Loader2 className="animate-spin text-zinc-500" size={40} />
                    </div>
                )}

                {!isLoading && data?.items.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 bg-zinc-900/30 rounded-[2rem] border border-zinc-800/50">
                        <div className="w-20 h-20 bg-zinc-800/80 rounded-full flex items-center justify-center mb-2">
                            <HeartCrack size={32} className="text-zinc-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-100">Тут поки що порожньо</h2>
                        <p className="text-zinc-400 max-w-md">
                            Ви ще не вподобали жодного відео. Перегляньте головну сторінку, щоб знайти щось цікаве!
                        </p>
                        <Link to="/">
                            <Button variant="primary" className="mt-2">
                                На головну
                            </Button>
                        </Link>
                    </div>
                )}

                {!isLoading && data?.items && data.items.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
                        {data.items.map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                )}

            </div>
        </PageTransition>
    );
}