import { LayoutDashboard, Film, Tag, Hash, HomeIcon, Globe } from 'lucide-react';
import BaseSidebar, { type SidebarSection, type SidebarItem } from './BaseSidebar';

function AdminSidebar() {

  const sections: SidebarSection[] = [
    {
      title: 'Аналітика',
      items: [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} />, end: true }
      ]
    },
    {
      title: 'Контент',
      items: [
        { name: 'Усі відео', path: '/admin/videos', icon: <Film size={20} /> },
        { name: 'Жанри', path: '/admin/genres', icon: <Tag size={20} /> },
        { name: 'Теги', path: '/admin/tags', icon: <Hash size={20} /> },
        { name: 'Мови', path: '/admin/languages', icon: <Globe size={20} /> },
      ]
    },
    {
      title: 'Система',
      items: [
        { name: 'Користувачі', path: '/admin/users', icon: <Tag size={20} /> }
      ]
    }
  ];

  const bottomItems: SidebarItem[] = [
    {
      name: 'Додому',
      icon: <HomeIcon size={20} />,
      path: '/'
    }
  ];

  return (
    <BaseSidebar
      isCollapsible={false}
      sections={sections}
      bottomItems={bottomItems}
    />
  );
}

export default AdminSidebar;
