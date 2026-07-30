import { Film, Tag, Users, PlayCircle, Clock, UserPlus } from 'lucide-react';
import { useGetAdminDashboardQuery } from '../../services/api/apiStudio';
import { Link } from "react-router-dom";

function Dashboard() {
    const { data: dashboardData, isLoading, isError } = useGetAdminDashboardQuery();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (isError || !dashboardData) {
        return (
            <div className="p-6 bg-red-900/20 border border-red-800 rounded-2xl text-center text-red-500">
                Помилка при завантаженні даних дашборду.
            </div>
        );
    }

    const stats = [
        { label: 'Всього відео', value: dashboardData.totalVideos.toLocaleString(), icon: <Film size={24} />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Жанрів', value: dashboardData.totalGenres.toLocaleString(), icon: <Tag size={24} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Користувачів', value: dashboardData.totalUsers.toLocaleString(), icon: <Users size={24} />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { label: 'Нових користувачів (тиждень)', value: dashboardData.newUsersLastWeek.toLocaleString(), icon: <UserPlus size={24} />, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-2xl font-bold text-zinc-100">Панель керування</h1>
                <p className="text-zinc-500 text-sm">Вітаємо в системі моніторингу контенту</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-zinc-800 border border-zinc-700 p-6 rounded-2xl shadow-sm hover:border-zinc-600 transition-all group">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-zinc-500 text-xs uppercase tracking-wider font-bold mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-zinc-100">{stat.value}</h3>
                            </div>
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-zinc-800 border border-zinc-700 rounded-2xl overflow-hidden">
                    <div className="p-5 border-b border-zinc-700 flex justify-between items-center">
                        <h3 className="font-bold text-zinc-100 flex items-center gap-2">
                            <Clock size={18} className="text-red-500" />
                            Останні додані відео
                        </h3>
                    </div>
                    <div className="p-0">
                        {dashboardData.recentVideos.length === 0 ? (
                            <div className="p-8 text-center text-zinc-500">Немає доданих відео.</div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead className="text-zinc-500 bg-zinc-950/50">
                                    <tr>
                                        <th className="p-4 font-medium">Назва</th>
                                        <th className="p-4 font-medium">Дата</th>
                                        <th className="p-4 font-medium text-right">Статус</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {dashboardData.recentVideos.map((video) => (
                                        <tr key={video.id} className="hover:bg-zinc-800/30 transition-colors">
                                            <td className="p-4 flex items-center gap-3 font-medium text-zinc-300">
                                                <PlayCircle size={16} className="text-zinc-600 shrink-0" />
                                                <Link
                                                    to={`/video/${video.slug}`}
                                                    className="hover:text-white hover:underline truncate transition-colors"
                                                >
                                                    {video.title}
                                                </Link>
                                            </td>
                                            <td className="p-4 text-zinc-500 text-xs">{video.dateCreated}</td>
                                            <td className="p-4 text-right">
                                                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20">
                                                    {video.privacy?.name || 'Active'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold mb-4">Швидкі дії</h3>
                        <div className="space-y-3 flex flex-col">
                            <Link
                                to="/video/add/"
                                className="w-full flex items-center justify-between bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-3 px-4 rounded-xl text-sm font-medium"
                            >
                                <span>Додати нове відео</span>
                                <span>→</span>
                            </Link>

                            <Link
                                to="/admin/genres"
                                className="w-full flex items-center justify-between bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-3 px-4 rounded-xl text-sm font-medium"
                            >
                                <span>Налаштувати жанри</span>
                                <span>→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
