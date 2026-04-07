import {Outlet, NavLink, useLocation, useNavigate} from 'react-router-dom';
import {LayoutDashboard, Film, Tag, HomeIcon} from 'lucide-react';
import PageTransition from '../components/PageTransition';

function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <div className="flex min-h-screen bg-[#09090b] text-zinc-100">
            {/* Admin Sidebar */}
            <aside className="w-64 border-r border-zinc-800 bg-zinc-950 p-4 flex flex-col">
                <div className="p-6 mb-4">
                    <div className="flex items-center gap-3">
                        {/* Іконка або скорочення на червоному фоні */}
                        <div
                            className="bg-red-600 text-white font-black px-2 py-1 rounded shadow-lg shadow-red-900/40 transform -rotate-3">
                            CW
                        </div>
                        {/* Текст білим */}
                        <h2 className="text-xl font-bold tracking-tight text-white">
                            Admin <span
                            className="text-zinc-500 font-light text-sm uppercase ml-1 tracking-widest">Panel</span>
                        </h2>
                    </div>
                    <div className="h-[1px] w-full bg-gradient-to-r from-zinc-800 to-transparent mt-6"/>
                </div>

                <nav className="flex-1 space-y-8"> {/* Збільшили відступ між групами */}

                    {/* Група: Основне */}
                    <div>
                        <p className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
                            Аналітика
                        </p>
                        <div className="space-y-1">
                            <AdminNavLink to="/admin" icon={<LayoutDashboard size={20}/>} label="Dashboard" end/>
                        </div>
                    </div>

                    {/* Група: Контент */}
                    <div>
                        <p className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
                            Контент
                        </p>
                        <div className="space-y-1">
                            <AdminNavLink to="/admin/movies" icon={<Film size={20}/>} label="Усі фільми"/>
                            <AdminNavLink to="/admin/genres" icon={<Tag size={20}/>} label="Жанри"/>
                        </div>
                    </div>

                    {/* Група: Користувачі (на майбутнє) */}
                    <div>
                        <p className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
                            Система
                        </p>
                        <div className="space-y-1">
                            <AdminNavLink to="/admin/users" icon={<Tag size={20}/>} label="Користувачі"/>
                        </div>
                    </div>

                </nav>

                <button className="flex items-center gap-3 p-3 text-zinc-500 hover:text-white transition-colors"
                        onClick={() => navigate('/')}>
                    <HomeIcon size={20}/> Додому
                </button>
            </aside>

            {/* Контент адмінки */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Хедер адмінки (якщо є) */}

                <div className="flex-1 overflow-y-auto p-8">
                    {/* Анімуємо перехід між сторінками адмінки */}
                    <PageTransition key={location.pathname}>
                        <Outlet/>
                    </PageTransition>
                </div>
            </main>
        </div>
    );
}

// Маленький допоміжний компонент для посилань
function AdminNavLink({to, icon, label, end = false}: any) {
    return (
        <NavLink
            to={to}
            end={end}
            className={({isActive}) => `
        flex items-center gap-3 p-3 rounded-lg transition-all
        outline-none focus:outline-none focus-visible:ring-0 
        ${isActive
                ? 'bg-red-600 text-white'
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
            }
      `}
        >
            {icon} <span>{label}</span>
        </NavLink>
    );
}

export default AdminLayout
