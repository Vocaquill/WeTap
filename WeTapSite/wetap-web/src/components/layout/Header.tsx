import {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {Menu, X, Bell, Search, Mic, Settings, Plus, Users, ChevronDown} from 'lucide-react';
import {useAppSelector} from "../../store/index";
import {APP_ENV} from "../../env/index";

interface HeaderProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

function Header({ isOpen, toggleSidebar }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const { user } = useAppSelector(state => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`h-14 sticky top-0 z-[40] px-4 flex items-center justify-between transition-all duration-300 ${scrolled ? 'bg-[#0f0f11]/90 backdrop-blur-xl shadow-lg shadow-black/20' : 'bg-transparent'
        }`}
    >
      {/* ЛІВА ЧАСТИНА: Бургер-кнопка */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-zinc-900 rounded-xl text-zinc-300 hover:text-white transition-all active:scale-95"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {!isHomePage && (
          <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400 hidden md:block">
            Результати <span className="text-rose-500">пошуку</span>
          </h2>
        )}
      </div>

      {/* ЦЕНТРАЛЬНА ЧАСТИНА: Більший рядок пошуку, але щільніший відступ */}
      <div className="flex-1 max-w-xl mx-4 flex items-center gap-2">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-zinc-900/90 border border-zinc-800/60 rounded-xl py-2 pl-5 pr-12 text-sm font-medium focus:outline-none focus:border-rose-500/50 focus:bg-zinc-900 transition-all text-zinc-100 placeholder-zinc-500"
          />
          <button className="absolute right-4 top-2.5 text-zinc-400 hover:text-white transition-colors">
            <Search size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Кнопка мікрофону (іконка 20px) */}
        <button className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-zinc-300 hover:text-white transition-colors shrink-0">
          <Mic size={20} />
        </button>
      </div>

      {/* ПРАВА ЧАСТИНА: Більші іконки (22px) та компактна кнопка профілю */}
      <div className="flex items-center gap-2">
        <button className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-xl transition-all relative">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-[#0f0f11]"></span>
        </button>

        <button className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-xl transition-all">
          <Settings size={22} />
        </button>

        <button className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-xl transition-all">
          <Plus onClick={() => navigate('/video/add')} size={22} />
        </button>

        <span className="w-px h-6 bg-zinc-800 mx-1" />

        <button className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-xl transition-all mr-1">
          <Users size={22} />
        </button>

        {/* Користувацький блок або кнопка логіну */}
        {user ? (
          <button
            onClick={() => navigate('/account')}
            className="flex items-center gap-2.5 p-1 pr-3 bg-gradient-to-r from-zinc-900 to-rose-950/20 hover:to-rose-900/30 rounded-xl border border-zinc-800/60 transition-all group"
          >
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-rose-500/30">
              <img
                src={user.image ? `${APP_ENV.IMAGES_50_URL}${user.image}` : '/images/user/default.png'}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors">
              {user.name}
            </span>
            <ChevronDown size={14} className="text-zinc-500" />
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2.5 p-2 px-4 bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:opacity-90 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
