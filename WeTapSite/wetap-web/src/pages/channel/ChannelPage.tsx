import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetByQuery } from '../../services/api/apiChannels';
import { useSearchVideosQuery } from '../../services/api/apiVideos';
import { VideoCard } from "../../components/video/VideoCard.tsx";
import { TabButtons } from '../../components/ui/common/TabButton';
import { Button } from '../../components/form/Button';
import { APP_ENV } from '../../env';
import { Loader2 } from 'lucide-react';

export default function ChannelPage() {
    const { slug } = useParams<{ slug: string }>();
    const [activeTab, setActiveTab] = useState<string>('Home');
    const [sortBy, setSortBy] = useState<string>('newest'); // 'popular', 'newest', 'oldest'

    // Отримуємо дані каналу
    const { data: channel, isLoading: isChannelLoading } = useGetByQuery(
        { id: Number(slug) },
        { skip: !slug }
    );

    // Отримуємо відео каналу
    const { data: videosData, isLoading: isVideosLoading } = useSearchVideosQuery(
        {
            channelId: channel?.id,
            sortBy: sortBy,
            page: 1,
            itemPerPage: 20
        },
        { skip: !channel?.id }
    );

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

            {/* Банер каналу */}
            <div className="w-full h-48 md:h-64 bg-zinc-800 rounded-[2rem] overflow-hidden">
                {channel.bannerImage ? (
                    <img
                        src={`${APP_ENV.IMAGES_1200_URL}${channel.bannerImage}`}
                        alt="Channel Banner"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-zinc-700/50" /> // Заглушка, як на скріншоті
                )}
            </div>

            {/* Інформація про канал */}
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
                        <h1 className="text-3xl font-bold text-white mb-1">{channel.name}</h1>
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <span className="font-medium text-zinc-300">@{channel.nickName}</span>
                            <span>•</span>
                            <span>{channel.subscriberCount} subscribers</span>
                            {/* Якщо є поле кількості відео, можна вивести його тут */}
                            {channel.description && (
                                <>
                                    <span>•</span>
                                    <span className="line-clamp-1 max-w-md">{channel.description}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Кнопка підписки */}
                <div className="shrink-0">
                    <Button variant="secondary" size="lg" className="rounded-full">
                        Subscribed
                    </Button>
                </div>
            </div>

            {/* Навігація (Tabs) */}
            <div className="border-b border-white/5 pb-2">
                <TabButtons
                    tabList={['Home', 'Videos', 'Posts', 'Shorts', 'Playlists', 'About']}
                    onTabChange={setActiveTab}
                />
            </div>

            {/* Контент активної вкладки */}
            {activeTab === 'Videos' && (
                <div className="space-y-6">
                    {/* Фільтри сортування (тільки для вкладки Videos) */}
                    <div className="flex items-center gap-3">
                        <Button variant={sortBy === 'popular' ? 'chip' : 'ghost'} onClick={() => setSortBy('popular')} className={sortBy === 'popular' ? 'bg-zinc-800 text-white' : ''} size="sm">
                            Popular
                        </Button>
                        <Button variant={sortBy === 'newest' ? 'chip' : 'ghost'} onClick={() => setSortBy('newest')} className={sortBy === 'newest' ? 'bg-zinc-800 text-white' : ''} size="sm">
                            Newest
                        </Button>
                        <Button variant={sortBy === 'oldest' ? 'chip' : 'ghost'} onClick={() => setSortBy('oldest')} className={sortBy === 'oldest' ? 'bg-zinc-800 text-white' : ''} size="sm">
                            Oldest
                        </Button>
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
                    {/* Тут можна зробити кастомну вибірку найпопулярніших відео, або просто показати сітку */}
                    <h2 className="text-xl font-bold text-white">Uploads</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
                        {videosData?.items.slice(0, 5).map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                </div>
            )}

            {/* Заглушка для інших вкладок */}
            {!['Home', 'Videos'].includes(activeTab) && (
                <div className="py-20 text-center text-zinc-500">
                    Вкладка {activeTab} знаходиться в розробці
                </div>
            )}

        </div>
    );
}