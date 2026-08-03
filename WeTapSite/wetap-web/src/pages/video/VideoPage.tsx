import { useEffect, useState } from 'react';
import {
    Calendar,
    ThumbsUp,
    ThumbsDown,
    Globe,
    Shield,
    Eye,
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageTransition from '../../components/layout/PageTransition';
import { MoviePlayer } from "../../components/movie/MoviePlayer";
import { APP_ENV } from "../../env/index";
import LoadingOverlay from "../../components/ui/loading/LoadingOverlay";
import { useGetByQuery,
    useGetRecommendationsQuery, useIncrementViewMutation, useReactVideoMutation } from "../../services/api/apiVideos";
import { useToggleSubscriptionMutation } from "../../services/api/apiChannels";
import { useAppSelector } from '../../store/index';
import {Button} from "../../components/form/Button.tsx";
import {CommentsSection} from "../../components/video/CommentsSection";

function VideoPage() {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();
    const [isDescExpanded, setIsDescExpanded] = useState(false);

    const { user } = useAppSelector((state) => state.auth);

    const { data: video, isLoading: isVideoLoading } = useGetByQuery(
        { slug: slug! },
        { skip: !slug }
    );

    const { data: recommendations, isLoading: isRecsLoading } = useGetRecommendationsQuery(
        { videoId: video?.id as number },
        { skip: !video?.id }
    );

    const [reactVideo, { isLoading: isReacting }] = useReactVideoMutation();
    const [incrementView] = useIncrementViewMutation();

    const [toggleSubscription, { isLoading: isSubscribing }] = useToggleSubscriptionMutation();

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

    const handleSubscribe = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (video?.channel?.id) {
            try {
                await toggleSubscription(video.channel.id).unwrap();
            } catch (error) {
                console.error('Помилка при зміні підписки', error);
            }
        }
    };

    if (isVideoLoading) return <LoadingOverlay />;
    if (!video) return null;

    return (
        <PageTransition>
            <div className="min-h-screen bg-theme-bg text-zinc-100">
                <div className="max-w-[1700px] mx-auto flex flex-col xl:flex-row gap-6 p-0 sm:p-4 md:p-6">

                    <div className="flex-1 xl:max-w-[calc(100%-400px)]">
                        <div className="w-full bg-zinc-900 rounded-none sm:rounded-[24px] overflow-hidden shadow-2xl">
                            {video.video && (
                                <MoviePlayer videoName={video.video} />
                            )}
                        </div>

                        <div className="px-4 sm:px-0">
                            <h1 className="video-title mt-4 line-clamp-2">
                                {video.title}
                            </h1>

                            <div className="flex flex-col 2xl:flex-row xl:items-center justify-between gap-4 mt-4 pb-4 border-b border-zinc-800">
                                <div className="flex items-center justify-between w-full 2xl:w-auto gap-3">
                                    <Link to={`/channel/${video.channel?.id}`} className="flex items-center gap-3 group cursor-pointer">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 shrink-0 border border-zinc-500/20 group-hover:border-[#FF2D7A] transition-colors">
                                            <img
                                                src={video.channel?.avatarImage ? `${APP_ENV.IMAGES_200_URL}${video.channel.avatarImage}` : '/images/user/default.jpg'}
                                                alt={video.channel?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col justify-center min-w-0">
                                            <p className="channel-name text-zinc-100 group-hover:text-[#FF2D7A] transition-colors">
                                                {video.channel?.name}
                                            </p>
                                            <p className="text-xs text-zinc-400 mt-1">{video.channel?.subscriberCount} підписників</p>
                                        </div>
                                    </Link>

                                    <Button
                                        onClick={handleSubscribe}
                                        size="sm"
                                        variant={video.channel?.isSubscribed ? "secondary" : "primary"}
                                        disabled={isSubscribing}
                                        className="ml-2 shrink-0"
                                    >
                                        {video.channel?.isSubscribed ? "Відписатися" : "Підписатися"}
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between w-full 2xl:w-auto gap-4 flex-wrap md:flex-nowrap">
                                    <div className="views-and-date flex items-center gap-4 text-zinc-400 flex-nowrap">
                                        <div className="flex items-center gap-1.5">
                                            <Eye size={18} />
                                            <span>{video.viewCount}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                                            <Calendar size={16} />
                                            <span>{video.dateCreated}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center bg-zinc-800 rounded-full overflow-hidden shrink-0">
                                        <Button
                                            variant="reaction"
                                            onClick={() => handleReaction(true)}
                                            disabled={isReacting}
                                            className={`border-r border-zinc-700 transition-colors ${
                                                video.isLiked === true
                                                    ? 'text-[#FF2D7A] bg-zinc-700/30'
                                                    : 'text-zinc-300 hover:text-zinc-50'
                                            }`}
                                            icon={<ThumbsUp size={18} fill={video.isLiked === true ? "currentColor" : "none"} />}
                                        >
                                            <span>{video.likesCount}</span>
                                        </Button>
                                        <Button
                                            variant="reaction"
                                            onClick={() => handleReaction(false)}
                                            disabled={isReacting}
                                            className={`transition-colors ${
                                                video.isLiked === false
                                                    ? 'text-[#FF2D7A] bg-zinc-700/30'
                                                    : 'text-zinc-300 hover:text-zinc-50'
                                            }`}
                                            icon={<ThumbsDown size={18} fill={video.isLiked === false ? "currentColor" : "none"} />}
                                        >
                                            <span>{video.dislikesCount}</span>
                                        </Button>
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
                                            <Link
                                                to={`/?genreId=${g.id}`}
                                                key={`genre-${g.id}`}
                                                className="text-zinc-300 text-xs bg-zinc-700/50 border border-zinc-600 px-2.5 py-1 rounded-full hover:bg-zinc-600 cursor-pointer transition-colors"
                                            >
                                                {g.name}
                                            </Link>
                                        ))}
                                        {video.tags?.map((t) => (
                                            <Link
                                                to={`/search?q=${encodeURIComponent(t.name)}`}
                                                key={`tag-${t.id}`}
                                                className="text-blue-400 text-sm font-medium hover:underline cursor-pointer"
                                            >
                                                #{t.name.replace(/\s+/g, '')}
                                            </Link>
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
                                        <Button
                                            variant="linkAccent"
                                            className="mt-2"
                                            onClick={() => setIsDescExpanded(!isDescExpanded)}
                                        >
                                            {isDescExpanded ? "Show less" : "Show more"}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div id="comments-section">
                                <CommentsSection videoId={video.id} currentUser={user} />
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-[400px] flex-shrink-0 space-y-3 px-4 sm:px-0">
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
                            recommendations?.map((item) => (
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
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                            {item.channel?.name || "Назва каналу"}
                                        </p>
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