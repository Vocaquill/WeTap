import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetByQuery, useToggleSubscriptionMutation } from '../../services/api/apiChannels';
import { useSearchVideosQuery } from '../../services/api/apiVideos';
import { VideoCard } from "../../components/video/VideoCard.tsx";
import { TabButtons } from '../../components/ui/common/TabButton';
import { Button } from '../../components/form/Button';
import { APP_ENV } from '../../env';
import { Loader2 } from 'lucide-react';
import { useAppSelector } from '../../store/index';

export default function ChannelPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const [activeTab, setActiveTab] = useState<string>('Home');
    const [sortBy, setSortBy] = useState<string>('date');

    const { data: channel, isLoading: isChannelLoading } = useGetByQuery(
        { id: Number(slug) },
        { skip: !slug }
    );

    const [toggleSubscription, { isLoading: isSubscribing }] = useToggleSubscriptionMutation();

    const { data: videosData, isLoading: isVideosLoading } = useSearchVideosQuery(
        {
            channelId: channel?.id,
            sortBy: sortBy,
            page: 1,
            itemPerPage: 20
        },
        { skip: !channel?.id || activeTab !== 'Videos' }
    );

    const { data: popularVideosData, isLoading: isPopularLoading } = useSearchVideosQuery(
        {
            channelId: channel?.id,
            sortBy: 'views',
            page: 1,
            itemPerPage: 5
        },
        { skip: !channel?.id || activeTab !== 'Home' }
    );

    const handleSubscribe = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (channel?.id) {
            try {
                await toggleSubscription(channel.id).unwrap();
            } catch (error) {
                console.error('Помилка підписки', error);
            }
        }
    };

    if (isChannelLoading) {
        return (
            <div className="flex h-full items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-[#FF2D7A]" size={40} />
            </div>
        );
    }

    if (!channel) {
        return <div className="p-8 text-center text-zinc-400">Канал не знайдено</div>;
    }

    return (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

            <div className="w-full h-48 md:h-64 bg-zinc-800 rounded-[2rem] overflow-hidden">
                {channel.bannerImage ? (
                    <img
                        src={`${APP_ENV.IMAGES_1200_URL}${channel.bannerImage}`}
                        alt="Channel Banner"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-zinc-700/50" />
                )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-zinc-800 shrink-0 border-4 border-[#121213]">
                        <img
                            src={channel.avatarImage ? `${APP_ENV.IMAGES_400_URL}${channel.avatarImage}` : '/images/user/default.jpg'}
                            alt={channel.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-100 mb-1">{channel.name}</h1>
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <span className="font-medium text-zinc-300">@{channel.nickName}</span>
                            <span>•</span>
                            <span>{channel.subscriberCount} subscribers</span>
                            {channel.description && (
                                <>
                                    <span>•</span>
                                    <span className="line-clamp-1 max-w-md">{channel.description}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="shrink-0">
                    <Button
                        variant={channel.isSubscribed ? "secondary" : "primary"}
                        size="lg"
                        className="rounded-full"
                        onClick={handleSubscribe}
                        disabled={isSubscribing}
                    >
                        {channel.isSubscribed ? "Subscribed" : "Subscribe"}
                    </Button>
                </div>
            </div>

            <div className="border-b border-white/5 pb-2">
                <TabButtons
                    tabList={['Home', 'Videos', 'Posts', 'Shorts', 'Playlists', 'About']}
                    onTabChange={setActiveTab}
                />
            </div>

            {activeTab === 'Videos' && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3">
                            <Button
                                variant={sortBy === 'views' ? 'chip' : 'ghost'}
                                onClick={() => setSortBy('views')}
                                className={sortBy === 'views' ? 'bg-zinc-800 text-white' : ''}
                                size="sm"
                            >
                                Popular
                            </Button>
                            <Button
                                variant={sortBy === 'date' ? 'chip' : 'ghost'}
                                onClick={() => setSortBy('date')}
                                className={sortBy === 'date' ? 'bg-zinc-800 text-white' : ''}
                                size="sm"
                            >
                                Newest
                            </Button>
                            <Button
                                variant={sortBy === 'rating' ? 'chip' : 'ghost'}
                                onClick={() => setSortBy('rating')}
                                className={sortBy === 'rating' ? 'bg-zinc-800 text-white' : ''}
                                size="sm"
                            >
                                Top Rated
                            </Button>
                        </div>
                    </div>

                    {isVideosLoading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="animate-spin text-zinc-500" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
                            {videosData?.items.map((video) => (
                                <VideoCard key={video.id} video={video} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'Home' && (
                <div className="space-y-8">
                    <h2 className="text-xl font-bold text-zinc-100">Popular Uploads</h2>
                    {isPopularLoading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="animate-spin text-zinc-500" />
                        </div>
                    ) : popularVideosData?.items.length === 0 ? (
                        <div className="text-zinc-500">Немає відео на цьому каналі.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
                            {popularVideosData?.items.map((video) => (
                                <VideoCard key={video.id} video={video} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {!['Home', 'Videos'].includes(activeTab) && (
                <div className="py-20 text-center text-zinc-500">
                    Вкладка {activeTab} знаходиться в розробці
                </div>
            )}

        </div>
    );
}