import {Film, Star, BarChart2, ArrowLeft} from 'lucide-react';
import BaseSidebar, { type SidebarSection, type SidebarItem } from './BaseSidebar';

interface StudioSidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

function StudioSidebar({isOpen, toggleSidebar}: StudioSidebarProps) {
    const sections: SidebarSection[] = [
        {
            items: [
                {
                    name: 'Контент',
                    path: '/studio/content',
                    icon: <Film size={18}/>,
                },
                {
                    name: 'Огляд',
                    path: '/studio/review',
                    icon: <Star size={18}/>,
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

    return (
        <BaseSidebar
            isOpen={isOpen}
            toggleSidebar={toggleSidebar}
            isCollapsible={true}
            variant="default"
            logoType="default"
            sections={sections}
            bottomItems={bottomItems}
        />
    );
}

export default StudioSidebar;
