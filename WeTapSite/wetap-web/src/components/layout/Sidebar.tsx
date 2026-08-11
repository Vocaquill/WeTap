import {ShieldCheck, Home, ThumbsUp, Film, Flame, Library, Plus} from 'lucide-react';
import {useAppSelector} from "../../store";
import BaseSidebar, { type SidebarSection } from './BaseSidebar';
import { useSearchGenresQuery } from '../../services/api/apiGenres';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

function Sidebar({isOpen, toggleSidebar}: SidebarProps) {
    const {user} = useAppSelector(state => state.auth);
    const {data: genresData} = useSearchGenresQuery({ page: 1, itemPerPage: 100 });

    const genreSubItems = genresData?.items.map(g => ({
        name: g.name,
        path: `/?genreId=${g.id}`
    })) || [];

    const sections: SidebarSection[] = [
        {
            items: [
                {name: 'Головна', path: '/', end: true, icon: <Home size={18}/>},
                {name: 'Популярне', path: '/popular', icon: <Flame size={18}/>},
                {
                    name: 'Колекції',
                    icon: <Library size={18}/>,
                    subItems: genreSubItems
                },
                {name: 'Вподобані відео', path: '/liked', icon: <ThumbsUp size={18}/>},
            ]
        },
    ];

    if (user?.roles?.includes("Author") || user?.roles?.includes("Admin")) {
        sections.push({
            title: 'Творча студія',
            items: [
                {name: 'Додати відео', path: '/video/add', icon: <Plus size={18}/>},
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
