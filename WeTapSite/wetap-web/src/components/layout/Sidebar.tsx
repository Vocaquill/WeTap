import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShieldCheck, Home, Monitor, History, Clock, ThumbsUp, ListVideo, Film, Flame, Menu } from 'lucide-react';
import logoImg from '../../layouts/logo.png';
import { useAppSelector } from "../../store";
import { Button } from '../form/Button';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const location = useLocation();
  const { user } = useAppSelector(state => state.auth);

  const mainItems = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Popular', path: '/popular', icon: <Flame size={18} /> },
    { name: 'TV mode', path: '/tv', icon: <Monitor size={18} /> },
  ];

  const libraryItems = [
    { name: 'History', path: '/history', icon: <History size={18} /> },
    { name: 'Watch Later', path: '/watch-later', icon: <Clock size={18} /> },
    { name: 'Liked Videos', path: '/liked', icon: <ThumbsUp size={18} /> },
    { name: 'Playlists', path: '/playlists', icon: <ListVideo size={18} /> },
  ];

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
        {/* ФІКС БАГУ: Адаптивне вирівнювання шапки сайдбару */}
        <div className={`h-14 flex items-center mb-4 gap-3 shrink-0 transition-all duration-300 ${isOpen ? 'px-2 justify-start' : 'justify-center'}`}>
          <Button
            variant="icon"
            onClick={toggleSidebar}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <Menu size={24} />
          </Button>

          {/* Логотип та текст рендеримо тільки тоді, коли сайдбар ВІДКРИТИЙ. Це повністю прибирає кашу з елементів */}
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

        <nav className="space-y-1">
          {mainItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => getNavLinkClasses(isActive)}>
              {({ isActive }) => (
                <>
                  {renderActiveIndicator(isActive)}
                  <span className={`min-w-[24px] flex items-center justify-center ${isActive ? 'text-rose-500' : 'text-zinc-400'}`}>{item.icon}</span>
                  <span className={`ml-4 transition-all duration-300 ${isOpen ? 'opacity-100 block' : 'opacity-0 hidden w-0'}`}>
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          ))}

          <hr className="border-zinc-500/60 my-3 mx-1" />

          {libraryItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => getNavLinkClasses(isActive)}>
              {({ isActive }) => (
                <>
                  {renderActiveIndicator(isActive)}
                  <span className={`min-w-[24px] flex items-center justify-center ${isActive ? 'text-rose-500' : 'text-zinc-400'}`}>{item.icon}</span>
                  <span className={`ml-4 transition-all duration-300 ${isOpen ? 'opacity-100 block' : 'opacity-0 hidden w-0'}`}>
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          ))}

          {(user?.roles?.includes("Author") || user?.roles?.includes("Admin")) && (
            <div className="pt-2 mt-2 border-t border-zinc-900/60 space-y-1">
              {isOpen && (
                <p className="px-3 mb-1 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                  Творча студія
                </p>
              )}
              <NavLink to="/studio" className={({ isActive }) => getNavLinkClasses(isActive)}>
                {({ isActive }) => (
                  <>
                    {renderActiveIndicator(isActive)}
                    <span className={`min-w-[24px] flex items-center justify-center ${isActive ? 'text-rose-500' : 'text-zinc-400'}`}><Film size={18} /></span>
                    <span className={`ml-4 transition-all duration-300 ${isOpen ? 'opacity-100 block' : 'opacity-0 hidden w-0'}`}>
                      Студія
                    </span>
                  </>
                )}
              </NavLink>
            </div>
          )}

          {user?.roles?.includes("Admin") && (
            <div className="pt-2 mt-2 border-t border-zinc-900/60 space-y-1">
              {isOpen && (
                <p className="px-3 mb-1 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                  Адміністрування
                </p>
              )}
              <Link
                to="/admin"
                className={`flex items-center p-2.5 rounded-xl transition-all relative ${isOpen ? 'px-3 mx-1' : 'justify-center mx-1'} ${location.pathname.startsWith('/admin')
                  ? 'bg-gradient-to-r from-zinc-900 via-rose-950/20 to-rose-600/10 text-white font-bold'
                  : 'text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200'
                  }`}
              >
                {location.pathname.startsWith('/admin') && renderActiveIndicator(true)}
                <span className={`min-w-[24px] flex items-center justify-center ${location.pathname.startsWith('/admin') ? 'text-rose-500' : 'text-zinc-400'}`}><ShieldCheck size={18} /></span>
                {isOpen && <span className="ml-4 font-medium">Панель керування</span>}
              </Link>
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
