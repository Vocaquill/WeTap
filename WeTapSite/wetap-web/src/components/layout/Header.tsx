import {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import { Bell, Mic, Settings, Plus, Users } from 'lucide-react';
import { useAppSelector } from "../../store/index";
import { APP_ENV } from "../../env/index";
import { Button } from '../form/Button';
import { themes, applyTheme, getActiveTheme } from '../../themes';
import { SearchAutocomplete } from '../form/SearchAutocomplete';

function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [activeTheme, setActiveTheme] = useState(getActiveTheme());
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

    const handleMyChannelClick = () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.channelId) {
            navigate(`/channel/${user.channelId}`);
        } else {
            navigate('/channel/create');
        }
    };

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nextTheme = e.target.value;
        applyTheme(nextTheme);
        setActiveTheme(nextTheme);
    };

    return (
        <header
            className={`h-14 sticky top-0 z-[40] px-4 flex items-center justify-between transition-all duration-300 ${scrolled ? 'bg-theme-bg/90 backdrop-blur-xl shadow-lg shadow-black/20' : 'bg-transparent'}`}
        >
            <div className="flex items-center min-w-[50px]">
                {!isHomePage && (
                    <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400 hidden md:block">
                        Результати <span className="text-rose-500">пошуку</span>
                    </h2>
                )}
            </div>

            <div className="flex-1 max-w-xl mx-4 flex items-center gap-2">
                <SearchAutocomplete />

                <Button type="button" variant="iconFilled">
                    <Mic size={20} />
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-zinc-800 p-0.5 rounded-full border border-zinc-700/40">
                    <Button variant="icon"
                            className="relative hover:bg-zinc-800/50 rounded-full p-2 text-zinc-300 hover:text-white transition-all">
                        <Bell size={20}/>
                        <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                    </Button>

                    <Button variant="icon"
                            className="hover:bg-zinc-800/50 rounded-full p-2 text-zinc-300 hover:text-white transition-all">
                        <Settings size={20}/>
                    </Button>

                    <Button variant="icon" onClick={() => navigate('/video/add')}
                            className="hover:bg-zinc-800/50 rounded-full p-2 text-zinc-300 hover:text-white transition-all">
                        <Plus size={20}/>
                    </Button>
                </div>

                <div className="relative">
                    <select
                        value={activeTheme}
                        onChange={handleThemeChange}
                        className="bg-zinc-800 text-zinc-300 hover:text-zinc-100 text-xs font-bold py-2.5 pl-4 pr-9 rounded-full border border-zinc-700/40 outline-none cursor-pointer appearance-none transition-all hover:bg-zinc-700"
                        style={{
                            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 12px center',
                            backgroundSize: '14px'
                        }}
                    >
                        {themes.map(t => (
                            <option key={t.id} value={t.id} className="bg-zinc-900 text-zinc-300">
                                {t.name}
                            </option>
                        ))}
                    </select>
                </div>

                <Button
                    variant="icon"
                    onClick={handleMyChannelClick}
                    className="flex items-center justify-center bg-zinc-800 p-3 rounded-full border border-zinc-700/40 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 transition-all"
                >
                    <Users size={20}/>
                </Button>

                {user ? (
                    <Button
                        variant="profile"
                        onClick={() => navigate('/account')}
                        className="group flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 py-1.5 px-3 rounded-full border border-zinc-700 transition-all"
                    >
                        <div className="w-6 h-6 rounded-md overflow-hidden border border-rose-500/30">
                            <img
                                src={user.image ? `${APP_ENV.IMAGES_50_URL}${user.image}` : '/images/user/default.png'}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors">
                            {user.name}
                        </span>
                    </Button>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="relative text-xs font-extrabold tracking-wider uppercase px-5 py-2.5 rounded-full text-white overflow-hidden transition-all duration-300 active:scale-95 group shadow-[0_0_15px_rgba(236,72,153,0.15)] hover:shadow-[0_0_25px_rgba(236,72,153,0.35)]"
                        style={{
                            background: 'rgb(var(--color-bg))',
                            padding: '3px',
                            backgroundImage: 'linear-gradient(to right, #f43f5e, #ec4899, #a855f7)',
                        }}
                    >
                        <span
                            className="block px-5 py-2 rounded-full bg-theme-bg text-zinc-200 group-hover:text-white group-hover:bg-theme-bg/80 transition-all duration-300">
                          Sign In
                        </span>
                    </button>
                )}
            </div>
        </header>
    );
}

export default Header;