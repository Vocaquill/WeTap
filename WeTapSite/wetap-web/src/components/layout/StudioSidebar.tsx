import {Film, Star, BarChart2, ArrowLeft} from 'lucide-react';
import BaseSidebar, {type SidebarSection, type SidebarItem} from './BaseSidebar';
import {useAppSelector} from '../../store';
import {useGetByQuery} from '../../services/api/apiChannels';
import {APP_ENV} from '../../env';

interface StudioSidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

function StudioSidebar({isOpen, toggleSidebar}: StudioSidebarProps) {
    const {user} = useAppSelector((state) => state.auth);
    const channelId = user?.channelId ?? user?.id;
    const {data: channel} = useGetByQuery({id: channelId}, {skip: !channelId});

    const sections: SidebarSection[] = [
        {
            items: [
                {
                    name: 'Огляд',
                    path: '/studio/review',
                    icon: <Star size={18}/>,
                },
                {
                    name: 'Контент',
                    path: '/studio/content',
                    icon: <Film size={18}/>,
                },
                {
                    name: 'Аналітика',
                    path: '/studio/analytics',
                    icon: <BarChart2 size={18}/>,
                },
            ]
        }
    ];

    const bottomItems: SidebarItem[] = [
        {
            name: 'На головну',
            path: '/',
            icon: <ArrowLeft size={18}/>,
        }
    ];

    const channelHeader = (
        <div
            className={`flex flex-col items-center gap-1 py-3 transition-all duration-300 ${isOpen ? 'px-2' : 'px-0'}`}
        >
            <div className={`relative shrink-0 transition-all duration-300 ${isOpen ? 'w-32 h-32' : 'w-9 h-9'}`}>
                {channel?.avatarImage ? (
                    <img
                        src={APP_ENV.IMAGES_200_URL + channel.avatarImage}
                        alt={channel.name}
                        className="w-full h-full rounded-full object-cover ring-2 ring-rose-500/40 shadow-lg shadow-rose-900/20"
                    />
                ) : (
                    <div
                        className="w-full h-full rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-900/20 ring-2 ring-rose-500/40"
                    >
                        <span className={`font-bold text-white ${isOpen ? 'text-xl' : 'text-sm'}`}>
                            {channel?.name?.[0]?.toUpperCase() ?? user?.name?.[0]?.toUpperCase() ?? '?'}
                        </span>
                    </div>
                )}
            </div>

            {isOpen && (
                <div className="flex flex-col items-center gap-0.5 mt-1 w-full px-1 transition-all duration-200">
                    <span className="text-sm font-semibold text-zinc-50 leading-tight text-center truncate w-full">
                        {channel?.name ?? user?.name ?? '—'}
                    </span>
                    <span className="text-[11px] text-zinc-500 leading-tight text-center truncate w-full">
                        @{channel?.nickName ?? '...'}
                    </span>
                </div>
            )}
        </div>
    );

    return (
        <BaseSidebar
            isOpen={isOpen}
            toggleSidebar={toggleSidebar}
            isCollapsible={true}
            sections={sections}
            bottomItems={bottomItems}
            headerContent={channelHeader}
        />
    );
}

export default StudioSidebar;
