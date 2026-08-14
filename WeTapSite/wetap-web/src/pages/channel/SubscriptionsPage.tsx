import { Users, Loader2, UserMinus } from 'lucide-react';
import PageTransition from '../../components/layout/PageTransition';
import { useSearchChannelsQuery } from '../../services/api/apiChannels';
import { useAppSelector } from '../../store';
import { Link } from 'react-router-dom';
import { Button } from '../../components/form/Button';
import { APP_ENV } from '../../env';

function formatSubscribers(count: number): string {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return String(count);
}

export default function SubscriptionsPage() {
    const { user } = useAppSelector(state => state.auth);

    const { data, isLoading } = useSearchChannelsQuery(
        {
            page: 1,
            itemPerPage: 100,
            isSubscribed: true,
        },
        {
            skip: !user,
        }
    );

    return (
        <PageTransition>
            <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 min-h-screen">

                <div className="flex items-center gap-5 bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800">
                    <div className="w-16 h-16 bg-gradient-to-br from-rose-600 to-fuchsia-600 rounded-full flex items-center justify-center shadow-lg shadow-rose-600/20 shrink-0">
                        <Users size={32} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-zinc-100 tracking-wide">Підписки</h1>
                        <p className="text-zinc-400 mt-1">Канали, на які ви підписані</p>
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
                            <UserMinus size={32} className="text-zinc-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-100">Ви ні на кого не підписані</h2>
                        <p className="text-zinc-400 max-w-md">
                            Знайдіть цікаві канали та підпишіться на них, щоб стежити за новим контентом!
                        </p>
                        <Link to="/popular">
                            <Button variant="primary" className="mt-2">
                                Переглянути популярне
                            </Button>
                        </Link>
                    </div>
                )}

                {!isLoading && data?.items && data.items.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
                        {data.items.map((channel) => (
                            <ChannelCard key={channel.id} channel={channel} />
                        ))}
                    </div>
                )}

            </div>
        </PageTransition>
    );
}

interface ChannelCardProps {
    channel: {
        id: number;
        name: string;
        nickName: string;
        subscriberCount: number;
        avatarImage?: string;
        description?: string;
    };
}

function ChannelCard({ channel }: ChannelCardProps) {
    return (
        <div className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col items-center text-center gap-4 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-200 hover:shadow-lg hover:shadow-zinc-950/40">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-700 group-hover:border-rose-600/50 transition-colors duration-200 shrink-0">
                <img
                    src={
                        channel.avatarImage
                            ? `${APP_ENV.IMAGES_400_URL}${channel.avatarImage}`
                            : '/images/user/default.jpg'
                    }
                    alt={channel.name}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex-1 min-w-0 w-full">
                <h3 className="font-bold text-zinc-100 text-base truncate">{channel.name}</h3>
                <p className="text-zinc-500 text-sm mt-0.5">@{channel.nickName}</p>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                    <Users size={13} className="text-zinc-500 shrink-0" />
                    <span className="text-zinc-400 text-xs font-medium">
                        {formatSubscribers(channel.subscriberCount)} підписників
                    </span>
                </div>
            </div>

            <Link to={`/channel/${channel.id}`} className="w-full">
                <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    className="w-full group-hover:border-rose-600/40 group-hover:text-rose-400 transition-colors"
                >
                    Перейти
                </Button>
            </Link>
        </div>
    );
}
