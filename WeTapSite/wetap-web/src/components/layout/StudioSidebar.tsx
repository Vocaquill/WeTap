import { Link, NavLink, useLocation } from 'react-router-dom';
import { Film, Star, BarChart2, ArrowLeft, Menu } from 'lucide-react';
import logoImg from '../../layouts/logo.png';
import { Button } from '../form/Button';

interface StudioSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const studioTabs = [
  {
    labelUa: 'Контент',
    path: '/studio/content',
    icon: <Film size={18} />,
  },
  {
    labelUa: 'Огляд',
    path: '/studio/review',
    icon: <Star size={18} />,
  },
  {
    labelUa: 'Аналітика',
    path: '/studio/analytics',
    icon: <BarChart2 size={18} />,
  },
];

function StudioSidebar({ isOpen, toggleSidebar }: StudioSidebarProps) {
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
      <span className="absolute right-0 top-2 bottom-2 w-1 bg-gradient-to-b from-rose-500 to-pink-500 rounded-l-full shadow-[0_0_12px_rgba(244,63,94,0.6)]" />
    );
  };

  return (
    <aside
      className={`bg-zinc-950 p-3 transition-all duration-300 ${isOpen ? 'w-[18.2vw] max-w-[350px] min-w-[220px]' : 'w-18'} sticky top-0 h-screen flex flex-col justify-between select-none z-[50]`}
    >
      <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
        {/* Шапка сайдбару */}
        <div className={`h-14 flex items-center mb-4 gap-3 shrink-0 transition-all duration-300 ${isOpen ? 'px-2 justify-start' : 'justify-center'}`}>
          <Button
            variant="icon"
            onClick={toggleSidebar}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <Menu size={24} />
          </Button>

          {isOpen && (
            <Link to="/" className="flex items-center active:scale-[0.98] cursor-pointer animate-fadeIn">
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

        {/* Вкладки */}
        <nav className="space-y-1">
          {studioTabs.map((tab) => {
            const isActive = location.pathname.startsWith(tab.path);
            return (
              <NavLink key={tab.path} to={tab.path} className={getNavLinkClasses(isActive)}>
                {renderActiveIndicator(isActive)}
                <span className={`min-w-[24px] flex items-center justify-center ${isActive ? 'text-rose-500' : 'text-zinc-400'}`}>{tab.icon}</span>
                <span className={`ml-4 transition-all duration-300 ${isOpen ? 'opacity-100 block' : 'opacity-0 hidden w-0'}`}>
                  {tab.labelUa}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* На головну */}
      <div className="pt-2 border-t border-zinc-900/60">
        <NavLink to="/" className={getNavLinkClasses(false)}>
          <span className="min-w-[24px] flex items-center justify-center text-zinc-400"><ArrowLeft size={18} /></span>
          <span className={`ml-4 transition-all duration-300 ${isOpen ? 'opacity-100 block' : 'opacity-0 hidden w-0'}`}>
            На головну
          </span>
        </NavLink>
      </div>
    </aside>
  );
}

export default StudioSidebar;
