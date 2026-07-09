import {ShieldCheck, Home, Monitor, History, Clock, ThumbsUp, ListVideo, Film, Flame} from 'lucide-react';
import {useAppSelector} from "../../store";
import BaseSidebar, { type SidebarSection } from './BaseSidebar';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

function Sidebar({isOpen, toggleSidebar}: SidebarProps) {
    const {user} = useAppSelector(state => state.auth);

    const sections: SidebarSection[] = [
        {
            items: [
                {name: 'Home', path: '/', icon: <Home size={18}/>, end: true},
                {name: 'Popular', path: '/popular', icon: <Flame size={18}/>},
                {name: 'TV mode', path: '/tv', icon: <Monitor size={18}/>},
            ]
        },
        {
            items: [
                {name: 'History', path: '/history', icon: <History size={18}/>},
                {name: 'Watch Later', path: '/watch-later', icon: <Clock size={18}/>},
                {name: 'Liked Videos', path: '/liked', icon: <ThumbsUp size={18}/>},
                {name: 'Playlists', path: '/playlists', icon: <ListVideo size={18}/>},
            ]
        }
    ];

    if (user?.roles?.includes("Author") || user?.roles?.includes("Admin")) {
        sections.push({
            title: 'Творча студія',
            items: [
                {name: 'Студія', path: '/studio', icon: <Film size={18}/>}
            ]
        });
    }

    if (user?.roles?.includes("Admin")) {
        sections.push({
            title: 'Адміністрування',
            items: [
                {
                    name: 'Панель керування',
                    path: '/admin',
                    icon: <ShieldCheck size={18}/>,
                    isActive: (pathname) => pathname.startsWith('/admin')
                }
            ]
        });
    }

    return (
        <BaseSidebar
            isOpen={isOpen}
            toggleSidebar={toggleSidebar}
            isCollapsible={true}
            sections={sections}
        />
    );
}

export default Sidebar;
