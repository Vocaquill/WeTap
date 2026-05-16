import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSearchVideosQuery } from '../services/api/apiVideos';
import { APP_ENV } from '../env';
import { Play, Eye, TrendingUp } from 'lucide-react';

function UserHomePage() {
  const navigate = useNavigate();

    const { data, isLoading } = useSearchVideosQuery({
        page: 1,
        itemPerPage: 20
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050505] p-6 md:p-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <div className="aspect-video bg-zinc-900 rounded-2xl animate-pulse border border-white/5" />
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-zinc-900 animate-pulse flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-zinc-900 rounded w-full animate-pulse" />
                                    <div className="h-3 bg-zinc-900 rounded w-2/3 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 pb-20">
            <header className="mb-12 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-600/10 rounded-xl">
                        <TrendingUp className="text-red-600" size={24} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic">
                        Рекомендовані <span className="text-red-600">відео</span>
                    </h1>
                </div>
                <div className="hidden md:block">
                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest bg-zinc-900/50 px-4 py-2 rounded-full border border-white/5">
                        {data?.pagination.totalCount || 0} відео знайдено
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                {data?.items.map((video, index) => (
                    <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: Math.min(index * 0.05, 1) }}
                        className="group cursor-pointer"
                        onClick={() => navigate(`/video/${video.slug}`)}
                    >
                        <div className="relative aspect-video rounded-[1.5rem] overflow-hidden mb-4 bg-zinc-900 shadow-2xl ring-1 ring-white/5">
                            <img
                                src={video.image ? APP_ENV.IMAGES_800_URL + video.image : 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974'}
                                alt={video.title}
                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                            />

                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="bg-red-600 p-4 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.5)]"
                                >
                                    <Play fill="white" size={28} className="ml-1" />
                                </motion.div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 mt-1">
                                <div className="relative group/avatar">
                                    {video.channel?.avatarImage ? (
                                        <img
                                            src={APP_ENV.IMAGES_100_URL + video.channel.avatarImage}
                                            alt={video.channel.name}
                                            className="w-11 h-11 rounded-2xl object-cover ring-2 ring-zinc-800 transition-all group-hover:ring-red-600"
                                        />
                                    ) : (
                                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center font-bold text-xs ring-2 ring-zinc-800">
                                            {video.channel?.name?.charAt(0) || 'W'}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-[16px] leading-tight line-clamp-2 group-hover:text-red-500 transition-colors mb-1.5">
                                    {video.title}
                                </h3>

                                <div className="flex flex-col gap-0.5">
                                    <span className="text-zinc-400 text-[13px] font-bold hover:text-white transition-colors truncate">
                                        {video.channel?.name || 'Невідомий канал'}
                                    </span>

                                    <div className="flex items-center gap-2 text-zinc-500 text-[12px] font-medium">
                                        <span className="flex items-center gap-1">
                                            <Eye size={12} strokeWidth={3} /> {video.viewCount.toLocaleString()}
                                        </span>
                                        <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                                        <span>{video.dateCreated}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {!isLoading && (!data?.items || data.items.length === 0) && (
                <div className="flex flex-col items-center justify-center py-40 text-center">
                    <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 border border-white/5">
                        <Play size={40} className="text-zinc-700 opacity-20" />
                    </div>
                    <h2 className="text-2xl font-black text-zinc-400 uppercase italic tracking-tighter">Відео не знайдено</h2>
                    <p className="text-zinc-600 mt-2 max-w-xs">Завітайте пізніше або спробуйте змінити фільтри пошуку.</p>
                </div>
            )}
        </div>
    );
}

export default UserHomePage;
