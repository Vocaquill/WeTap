import { useEffect, useState } from 'react';
import {
    Calendar,
    ThumbsUp,
    ThumbsDown,
    MoreHorizontal,
    Globe,
    Shield,
    Eye,
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageTransition from '../../components/layout/PageTransition';
import { MoviePlayer } from "../../components/movie/MoviePlayer";
import { APP_ENV } from "../../env/index";
import LoadingOverlay from "../../components/ui/loading/LoadingOverlay";
import { useGetByQuery, useIncrementViewMutation, useReactVideoMutation, useSearchVideosQuery } from "../../services/api/apiVideos";
import { useAppSelector } from '../../store/index';
import {TabButtons} from "../../components/ui/common/TabButton.tsx";

function VideoPage() {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();
    const [isDescExpanded, setIsDescExpanded] = useState(false);

    const { user } = useAppSelector((state) => state.auth);

    const { data: video, isLoading: isVideoLoading } = useGetByQuery(
        { slug: slug! },
        { skip: !slug }
    );

    const { data: recommendations, isLoading: isRecsLoading } = useSearchVideosQuery({
        page: 1,
        itemPerPage: 10
    });

    const [reactVideo, { isLoading: isReacting }] = useReactVideoMutation();
    const [incrementView] = useIncrementViewMutation();

    useEffect(() => {
        if (video?.id) {
            incrementView(video.id);
        }
    }, [video?.id, incrementView]);

    const handleReaction = async (isLike: boolean) => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await reactVideo({ videoId: video!.id, isLike }).unwrap();
        } catch (error) {
            console.error('Помилка при відправці реакції', error);
        }
    };

    const handleTabChange = (tab: string) => {
        console.log('Tab changed to:', tab);
        // TODO: implement tab switching logic
    }

    const handleSubscribe = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        // TODO: implement subscribe logic
    };

    if (isVideoLoading) return <LoadingOverlay />;
    if (!video) return null;

    return (
        <PageTransition>
            <div className="min-h-screen bg-[#121213] text-white">
                <div className="max-w-[1700px] mx-auto flex flex-col xl:flex-row gap-6 p-4 md:p-6">

                    <div className="flex-1 xl:max-w-[calc(100%-400px)]">
                        <div className="w-full bg-zinc-900 rounded-[24px] overflow-hidden shadow-2xl">
                            {video.video && (
                                <MoviePlayer videoName={video.video} />
                            )}
                        </div>

                        <h1 className="video-title mt-4 line-clamp-2">
                            {video.title}
                        </h1>

                        <div
                            className="flex flex-col 2xl:flex-row xl:items-center justify-between gap-8 md:gap-12 mt-4 pb-4 border-b border-zinc-800">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 shrink-0 border border-white/10">
                                    <img
                                        src={video.channel?.avatarImage ? `${APP_ENV.IMAGES_200_URL}${video.channel.avatarImage}` : '/images/user/default.jpg'}
                                        alt={video.channel?.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-col justify-center min-w-0">
                                    <p className="channel-name text-zinc-100">
                                        {video.channel?.name}
                                    </p>
                                    <p className="text-xs text-zinc-400 mt-1">{video.channel?.subscriberCount} підписників</p>
                                </div>
                                <button
                                    onClick={handleSubscribe}
                                    className="ml-2 bg-[#FF2D7A] text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-[#FF2D7A]/90 transition-colors">
                                    Підписатися
                                </button>
                            </div>

                            <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
                                <div className="views-and-date flex items-center gap-4 text-zinc-400 mr-2 flex-nowrap">
                                    <div className="flex items-center gap-1.5">
                                        <Eye size={18} />
                                        <span>{video.viewCount}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                                        <Calendar size={16} />
                                        <span>{video.dateCreated}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center bg-zinc-800 rounded-full overflow-hidden">
                                        <button
                                            onClick={() => handleReaction(true)}
                                            disabled={isReacting}
                                            className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-700 transition-colors border-r border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                            <ThumbsUp size={18} />
                                            <span className="text-sm font-medium">{video.likesCount}</span>
                                        </button>
                                        <button
                                            onClick={() => handleReaction(false)}
                                            disabled={isReacting}
                                            className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                            <ThumbsDown size={18} />
                                            <span className="text-sm font-medium">{video.dislikesCount}</span>
                                        </button>
                                    </div>

                                    <button className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-zinc-800/50 rounded-xl hover:bg-zinc-800 transition-colors group">
                            {(video.language || video.privacy) && (
                                <div className="flex flex-wrap gap-4 text-sm font-bold mb-3">
                                    {video.language && (
                                        <div className="flex items-center gap-1 text-zinc-300 font-medium">
                                            <Globe size={14} />
                                            {video.language.name}
                                        </div>
                                    )}
                                    {video.privacy && (
                                        <div className="flex items-center gap-1 text-zinc-300 font-medium">
                                            <Shield size={14} />
                                            {video.privacy.name}
                                        </div>
                                    )}
                                </div>
                            )}

                            {(video.genres?.length > 0 || video.tags?.length > 0) && (
                                <div className="flex flex-wrap gap-2 mb-4 items-center">
                                    {video.genres?.map((g) => (
                                        <span key={`genre-${g.id}`} className="text-blue-400 text-sm font-medium hover:underline cursor-pointer">
                                            #{g.name.replace(/\s+/g, '')}
                                        </span>
                                    ))}
                                    {video.tags?.map((t) => (
                                        <span key={`tag-${t.id}`} className="text-zinc-300 text-xs bg-zinc-700/50 border border-zinc-600 px-2.5 py-1 rounded-full hover:bg-zinc-600 cursor-pointer transition-colors">
                                            {t.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap text-zinc-200">
                                    {isDescExpanded
                                        ? (video.description || "Опис відсутній.")
                                        : (video.description
                                            ? (video.description.length > 150
                                                ? `${video.description.slice(0, 150)}...`
                                                : video.description)
                                            : "Опис відсутній.")
                                    }
                                </p>
                                {video.description && video.description.length > 150 && (
                                    <button
                                        onClick={() => setIsDescExpanded(!isDescExpanded)}
                                        className="text-xs text-[#FF2D7A] font-bold mt-2 hover:underline focus:outline-none"
                                    >
                                        {isDescExpanded ? "Show less" : "Show more"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-[400px] flex-shrink-0 space-y-3">
                        <TabButtons tabList={["Suggestions", "From this channel"]} onTabChange={handleTabChange} />

                        {isRecsLoading ? (
                            <div className="animate-pulse space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex gap-2">
                                        <div className="w-40 h-24 bg-zinc-800 rounded-lg" />
                                        <div className="flex-1 space-y-2 py-1">
                                            <div className="h-4 bg-zinc-800 rounded w-3/4" />
                                            <div className="h-3 bg-zinc-800 rounded w-1/2" />
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