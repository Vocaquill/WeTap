import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShieldCheck, Home, Compass, Monitor, History, Clock, ThumbsUp, ListVideo, LogOut } from 'lucide-react';
import logoImg from '../../layouts/logo.png';
import {useAppSelector} from "../../store";
interface SidebarProps {
  isOpen: boolean;
}

function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();
  const { user } = useAppSelector(state => state.auth);

  const mainItems = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Popular', path: '/popular', icon: <Compass size={18} /> },
    { name: 'TV mode', path: '/tv', icon: <Monitor size={18} /> },
  ];

  const libraryItems = [
    { name: 'History', path: '/history', icon: <History size={18} /> },
    { name: 'Watch Later', path: '/watch-later', icon: <Clock size={18} /> },
    { name: 'Liked Videos', path: '/liked', icon: <ThumbsUp size={18} /> },
    { name: 'Playlists', path: '/playlists', icon: <ListVideo size={18} /> },
  ];

  return (
    <aside
      className={`bg-[#0f0f11] p-4 transition-all duration-300 ${isOpen ? 'w-52' : 'w-24'
        } sticky top-0 h-screen flex flex-col justify-between select-none z-[50]`}
    >
      <div>
        <div className={`h-14 flex items-center mb-4 overflow-hidden ${isOpen ? 'px-2' : 'justify-center'}`}>
          {/* Розмір фото буде змінена!*/}

          <div className={`flex items-center justify-center transition-all duration-300 ${isOpen ? 'w-[120px] h-[120px]' : 'w-10 h-10'
            }`}>
            <img
              src={logoImg}
              alt="WeTap Logo"
              className="w-full h-full object-contain"
              style={{ imageRendering: 'pixelated' }} // ДОДАТКОВО: зберігає чіткі пікселі при розтягуванні, якщо це піксель-арт
            />
          </div>

          <h2
            className={`ml-3 text-xl font-black tracking-tight transition-all duration-300 whitespace-nowrap bg-gradient-to-r from-red-500 via-purple-600 to-blue-500 bg-clip-text text-transparent ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none w-0'
              }`}
            style={{
              backgroundSize: '200% auto',
              animation: 'shimmer 6s linear infinite',
            }}
          >
            WeTap
          </h2>
        </div>

        {/* ОСНОВНА НАВІГАЦІЯ */}
        <nav className="space-y-1">
          {mainItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center p-3 rounded-xl transition-all relative group
                ${isActive
                  ? 'bg-gradient-to-r from-rose-500/20 to-transparent text-white font-bold'
                  : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {/* Рожева риска активного стану з правого боку як на фото */}
                  {isActive && <span className="absolute right-0 top-3 bottom-3 w-1 bg-rose-500 rounded-l-full" />}
                  <span className={`min-w-[24px] ${isActive ? 'text-rose-500' : 'text-zinc-400'}`}>{item.icon}</span>
                  <span className={`ml-4 text-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          ))}

          <hr className="border-zinc-900 my-4 mx-2" />

          {/* БЛОК БІБЛІОТЕКИ */}
          {libraryItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center p-3 rounded-xl transition-all relative
                ${isActive
                  ? 'bg-gradient-to-r from-rose-500/20 to-transparent text-white font-bold'
                  : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute right-0 top-3 bottom-3 w-1 bg-rose-500 rounded-l-full" />}
                  <span className={`min-w-[24px] ${isActive ? 'text-rose-500' : 'text-zinc-400'}`}>{item.icon}</span>
                  <span className={`ml-4 text-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* АДМІН ПАНЕЛЬ */}
        {user?.role === "Admin" && (
          <div className="pt-4 mt-4 border-t border-zinc-900 space-y-1">
            {isOpen && (
              <p className="px-3 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                Адміністрування
              </p>
            )}
            <Link
              to="/admin/genres"
              className={`flex items-center p-3 rounded-xl transition-all ${location.pathname.startsWith('/admin')
                ? 'bg-zinc-900 text-white border border-zinc-800'
                : 'text-zinc-500 hover:bg-rose-500/5 hover:text-rose-400'
                }`}
            >
              <span className="min-w-[24px]"><ShieldCheck size={18} /></span>
              {isOpen && <span className="ml-4 text-sm font-medium">Панель керування</span>}
            </Link>
          </div>
        )}
      </div>

      {/* КНОПКА ВИХОДУ ЗНИЗУ */}
      <button className="flex items-center p-3 rounded-xl text-zinc-500 hover:bg-zinc-900/60 hover:text-rose-400 transition-all w-full mt-auto">
        <span className="min-w-[24px]"><LogOut size={18} /></span>
        {isOpen && <span className="ml-4 text-sm font-bold">Log Out</span>}
      </button>
    </aside>
  );
}

export default Sidebar;
