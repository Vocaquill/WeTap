import {
    Calendar,
    ThumbsUp,
    ThumbsDown,
    Share2,
    MoreHorizontal,
} from 'lucide-react';
import {
    useParams,
    //useNavigate,
    Link
} from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import {MoviePlayer} from "../components/movie/MoviePlayer.tsx";
import {APP_ENV} from "../env";
import LoadingOverlay from "../components/LoadingOverlay.tsx";
import {useGetByQuery, useSearchVideosQuery} from "../services/api/apiVideos.ts";

function VideoPage() {
    //const navigate = useNavigate();
    const {slug} = useParams<{ slug: string }>();

    const {data: video, isLoading: isVideoLoading} = useGetByQuery(
        {slug: slug!},
        {skip: !slug}
    );

    const {data: recommendations, isLoading: isRecsLoading} = useSearchVideosQuery({
        page: 1,
        itemPerPage: 10
    });

    if (isVideoLoading) return <LoadingOverlay/>;
    if (!video) return null;

    return (
        <PageTransition>
            <div className="min-h-screen bg-black text-white">
                <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row gap-6 p-4 md:p-6">

                    <div className="flex-1 lg:max-w-[calc(100%-400px)]">
                        <div className="w-full bg-zinc-900 rounded-xl overflow-hidden shadow-2xl">
                            {video.video && (
                                <MoviePlayer videoName={video.video}/>
                            )}
                        </div>

                        <h1 className="text-xl md:text-2xl font-bold mt-4 line-clamp-2">
                            {video.title}
                        </h1>

                        <div
                            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4 pb-4 border-b border-zinc-800">
                            <div className="flex items-center gap-3">
                                {video.channel?.avatarImage ? (
                                    <img
                                        alt={video.channel?.name}
                                        src={APP_ENV.IMAGES_200_URL + video.channel?.avatarImage}
                                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                    />
                                ) : (
                                    <div
                                        className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-purple-700 flex-shrink-0"/>
                                )}
                                <div>
                                    <p className="font-bold text-zinc-100">{video.channel?.name}</p>
                                    <p className="text-xs text-zinc-400">{video.channel?.subscriberCount}</p>
                                </div>
                                <button
                                    className="ml-4 bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-zinc-200 transition-colors">
                                    Підписатися
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center bg-zinc-800 rounded-full overflow-hidden">
                                    <button
                                        className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-700 transition-colors border-r border-zinc-700">
                                        <ThumbsUp size={18}/>
                                        <span className="text-sm font-medium">0</span>
                                    </button>
                                    <button
                                        className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-700 transition-colors border-r border-zinc-700">
                                        <ThumbsDown size={18}/>
                                        <span className="text-sm font-medium">0</span>
                                    </button>
                                </div>
                                <button
                                    className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-full hover:bg-zinc-700 transition-colors">
                                    <Share2 size={18}/>
                                    <span className="hidden sm:inline text-sm font-medium">Поділитися</span>
                                </button>
                                <button className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700">
                                    <MoreHorizontal size={18}/>
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 p-3 bg-zinc-800/50 rounded-xl hover:bg-zinc-800 transition-colors group">
                            <div className="flex gap-3 text-sm font-bold mb-1">
                                <span>{video.viewCount} переглядів</span>
                                <div className="flex items-center gap-1">
                                    <Calendar size={14}/>
                                    {video.dateCreated}
                                </div>
                            </div>
                            <div className="flex gap-2 mb-2">
                                {video.genres.map((g) => (
                                    <span key={g.id} className="text-blue-400 text-sm hover:underline cursor-pointer">
                    #{g.name.replace(/\s+/g, '')}
                  </span>
                                ))}
                            </div>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {video.description || "Опис відсутній."}
                            </p>
                        </div>
                    </div>

                    <div className="w-full lg:w-[400px] flex-shrink-0 space-y-3">
                        <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-zinc-400">Рекомендації</h3>

                        {isRecsLoading ? (
                            <div className="animate-pulse space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex gap-2">
                                        <div className="w-40 h-24 bg-zinc-800 rounded-lg"/>
                                        <div className="flex-1 space-y-2 py-1">
                                            <div className="h-4 bg-zinc-800 rounded w-3/4"/>
                                            <div className="h-3 bg-zinc-800 rounded w-1/2"/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            recommendations?.items.map((item) => (
                                <Link
                                    key={item.id}
                                    to={`/video/${item.slug}`}
                                    className="flex gap-2 group cursor-pointer"
                                >
                                    <div
                                        className="relative w-40 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-900">
                                        <img
                                            src={item.image ? APP_ENV.IMAGES_1200_URL + item.image : '/placeholder.jpg'}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            alt={item.title}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h4 className="text-sm font-bold line-clamp-2 group-hover:text-red-500 transition-colors">
                                            {item.title}
                                        </h4>
                                        <p className="text-xs text-zinc-400">Назва каналу</p>
                                        <div className="text-[11px] text-zinc-500 flex items-center gap-1">
                                            <span>{item.dateCreated}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>

                </div>
            </div>
        </PageTransition>
    );
}

export default VideoPage;