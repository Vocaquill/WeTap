import { Film, Tag, Users, PlayCircle, TrendingUp, Clock } from 'lucide-react';

function Dashboard() {
  // Тимчасові дані для статистики
  const stats = [
    { label: 'Всього фільмів', value: '1,240', icon: <Film size={24} />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Жанрів', value: '24', icon: <Tag size={24} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Користувачів', value: '8,500', icon: <Users size={24} />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Переглядів сьогодні', value: '+450', icon: <TrendingUp size={24} />, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-white">Панель керування</h1>
        <p className="text-zinc-500 text-sm">Вітаємо в системі моніторингу контенту</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-sm hover:border-zinc-700 transition-all group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider font-bold mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM SECTION: РЕЦЕНТНІ ФІЛЬМИ ТА АКТИВНІСТЬ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Останні додані фільми (2/3 ширини) */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-zinc-800 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <Clock size={18} className="text-red-500" />
              Останні додані фільми
            </h3>
            <button className="text-xs text-zinc-400 hover:text-white transition-colors">Дивитися всі</button>
          </div>
          <div className="p-0">
            <table className="w-full text-left text-sm">
              <thead className="text-zinc-500 bg-zinc-950/50">
                <tr>
                  <th className="p-4 font-medium">Назва</th>
                  <th className="p-4 font-medium">Дата</th>
                  <th className="p-4 font-medium text-right">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {[1, 2, 3].map((i) => (
                  <tr key={i} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4 flex items-center gap-3 font-medium text-zinc-300">
                      <PlayCircle size={16} className="text-zinc-600" />
                      Фільм {i}
                    </td>
                    <td className="p-4 text-zinc-500 text-xs">13.01.2026</td>
                    <td className="p-4 text-right">
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Швидкі дії або Нотатки (1/3 ширини) */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold mb-4">Швидкі дії</h3>
            <div className="space-y-3">
              <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-3 rounded-xl text-sm font-medium transition-colors text-left px-4 flex justify-between items-center">
                Додати новий фільм <span>→</span>
              </button>
              <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-3 rounded-xl text-sm font-medium transition-colors text-left px-4 flex justify-between items-center">
                Налаштувати жанри <span>→</span>
              </button>
            </div>
          </div>
          <div className="mt-8 p-4 bg-red-600/5 border border-red-600/20 rounded-xl text-xs text-zinc-400">
            <p>Система працює стабільно. Останній бекап бази даних: 2 години тому.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
