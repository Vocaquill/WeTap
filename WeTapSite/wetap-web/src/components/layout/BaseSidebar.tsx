import React from 'react';
import {Link, NavLink, useLocation} from 'react-router-dom';
import {Menu} from 'lucide-react';
import logoImg from '../../layouts/logo.png';
import {Button} from '../form/Button';

export interface SidebarItem {
    name: string;
    path?: string;
    icon: React.ReactNode;
    onClick?: () => void;
    end?: boolean;
    isActive?: boolean | ((pathname: string) => boolean);
}

export interface SidebarSection {
    title?: string;
    items: SidebarItem[];
}

interface BaseSidebarProps {
    isOpen?: boolean;
    toggleSidebar?: () => void;
    isCollapsible?: boolean;
    sections: SidebarSection[];
    bottomItems?: SidebarItem[];
    headerContent?: React.ReactNode;
}

export function BaseSidebar({
                                isOpen = true,
                                toggleSidebar,
                                isCollapsible = true,
                                sections,
                                bottomItems = [],
                                headerContent,
                            }: BaseSidebarProps) {
    const location = useLocation();

    const getNavLinkClasses = (isActive: boolean) => {
        return `
      flex items-center p-2.5 rounded-xl transition-all duration-200 relative group text-sm
      ${isOpen ? 'px-3 mx-1' : 'justify-center mx-1'}
      ${isActive
            ? 'bg-gradient-to-r from-zinc-900 via-rose-600/20 to-pink-500/50 text-white font-bold'
            : 'text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200'
        }
    `;
    };

    const renderActiveIndicator = (isActive: boolean) => {
        if (!isActive) return null;
        return (
            <span
                className="absolute right-0 top-2 bottom-2 w-1 bg-gradient-to-b from-rose-500 to-pink-500 rounded-l-full shadow-[0_0_12px_rgba(244,63,94,0.6)]"/>
        );
    };

    const checkActive = (item: SidebarItem) => {
        if (item.isActive !== undefined) {
            return typeof item.isActive === 'function' ? item.isActive(location.pathname) : item.isActive;
        }
        if (!item.path) return false;
        return item.end ? location.pathname === item.path : location.pathname.startsWith(item.path);
    };

    return (
        <aside
            className={`bg-zinc-950 p-3 transition-all duration-300 flex flex-col justify-between select-none z-[50] sticky top-0 h-screen
        ${isCollapsible
                ? (isOpen ? 'w-[18.2vw] max-w-[350px] min-w-[220px]' : 'w-18')
                : 'w-64 border-r border-zinc-800'
            }`}
        >
            <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
                {/* Header/Logo Section */}
                <div className={`h-14 flex items-center mb-4 gap-3 shrink-0 transition-all duration-300 
          ${isCollapsible
                    ? (isOpen ? 'px-2 justify-start' : 'justify-center')
                    : 'p-6 mb-4'
                }`}
                >
                    {isCollapsible && toggleSidebar && (
                        <Button
                            variant="icon"
                            onClick={toggleSidebar}
                            className="text-zinc-400 hover:text-white transition-colors"
                        >
                            <Menu size={24}/>
                        </Button>
                    )}

                    {(!isCollapsible || isOpen) && (
                        <Link to="/"
                              className="flex items-center active:scale-[0.98] cursor-pointer animate-fadeIn">
                            <div className="h-11 w-auto flex items-center justify-center shrink-0">
                                <img
                                    src={logoImg}
                                    alt="WeTap Logo"
                                    className="h-full object-contain"
                                />
                            </div>

                            <style>{`
                @keyframes shimmer-move {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
              `}</style>

                            <h2
                                className="ml-3 text-xl font-black tracking-tight whitespace-nowrap bg-clip-text text-transparent"
                                style={{
                                    backgroundImage: 'linear-gradient(to right, #f43f5e, #ec4899, #a855f7, #6366f1, #3b82f6)',
                                    backgroundSize: '300% auto',
                                    animation: 'shimmer-move 15s ease infinite',
                                }}
                            >
                                WeTap
                            </h2>
                        </Link>
                    )}
                </div>

                {headerContent && (
                    <>
                        {headerContent}
                        <div className="h-[1px] w-full bg-gradient-to-r from-zinc-800/80 to-transparent mb-3 mx-1"/>
                    </>
                )}

                {/* Navigation Sections */}
                <nav className="flex-1 space-y-4">
                    {sections.map((section, sectionIdx) => (
                        <div key={sectionIdx} className="space-y-1">
                            {section.title && (!isCollapsible || isOpen) && (
                                <p className="px-3 mb-1 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                                    {section.title}
                                </p>
                            )}

                            <div className="space-y-1">
                                {section.items.map((item, itemIdx) => {
                                    const isActive = checkActive(item);

                                    if (item.onClick) {
                                        return (
                                            <Button
                                                key={itemIdx}
                                                variant="ghost"
                                                className={`${getNavLinkClasses(isActive)} w-full justify-start`}
                                                onClick={item.onClick}
                                            >
                        <span
                            className={`min-w-[24px] flex items-center justify-center ${isActive ? 'text-rose-500' : 'text-zinc-400'}`}>
                          {item.icon}
                        </span>
                                                {(!isCollapsible || isOpen) && (
                                                    <span className="ml-4">
                            {item.name}
                          </span>
                                                )}
                                            </Button>
                                        );
                                    }

                                    return (
                                        <NavLink
                                            key={itemIdx}
                                            to={item.path || '#'}
                                            end={item.end}
                                            className={getNavLinkClasses(isActive)}
                                        >
                                            {renderActiveIndicator(isActive)}
                                            <span
                                                className={`min-w-[24px] flex items-center justify-center ${isActive ? 'text-rose-500' : 'text-zinc-400'}`}>
                        {item.icon}
                      </span>
                                            {(!isCollapsible || isOpen) && (
                                                <span className="transition-all duration-300 ml-4">
                          {item.name}
                        </span>
                                            )}
                                        </NavLink>
                                    );
                                })}
                            </div>

                            {sectionIdx < sections.length - 1 && (
                                <hr className="border-zinc-500/60 my-3 mx-1"/>
                            )}
                        </div>
                    ))}
                </nav>
            </div>

            {/* Bottom Items */}
            {bottomItems.length > 0 && (
                <div className="pt-2 border-t border-zinc-900/60">
                    {bottomItems.map((item, idx) => {
                        const isActive = checkActive(item);
                        if (item.onClick) {
                            return (
                                <Button
                                    key={idx}
                                    variant="ghost"
                                    className="gap-3 p-3 justify-start w-full"
                                    icon={item.icon}
                                    onClick={item.onClick}
                                >
                                    {item.name}
                                </Button>
                            );
                        }
                        return (
                            <NavLink
                                key={idx}
                                to={item.path || '#'}
                                className={getNavLinkClasses(isActive)}
                            >
                <span className="min-w-[24px] flex items-center justify-center text-zinc-400">
                  {item.icon}
                </span>
                                {(!isCollapsible || isOpen) && (
                                    <span className="transition-all duration-300 ml-4">
                    {item.name}
                  </span>
                                )}
                            </NavLink>
                        );
                    })}
                </div>
            )}
        </aside>
    );
}

export default BaseSidebar;