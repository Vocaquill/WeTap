import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {Play, CheckCircle2} from 'lucide-react';
import {motion} from 'framer-motion';
import {APP_ENV} from '../../env';
import {useGetAllVideosQuery} from '../../services/api/apiVideos';

function UserHomePage() {
    const navigate = useNavigate();
    const [activeTag, setActiveTag] = useState('All');

    const {data: videos, isLoading} = useGetAllVideosQuery();

    const heroVideo = videos?.[0];
    const gridVideos = videos?.slice(1) || [];
    // Поки що теги статичні потім зроблю динамічні
    const tags = ['All', 'Subscriptions', 'Posts', 'Music', 'Tech', 'Design', 'Comedy', 'Movies'];

    return (
        <div className="min-h-screen bg-[#121213] text-white pb-12">

            {heroVideo && (
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8 pt-2">
                    <div
                        className="lg:col-span-7 aspect-video bg-zinc-900 rounded-[2rem] overflow-hidden relative group border border-white/5 shadow-2xl">
                        <img
                            src={heroVideo.image ? `${APP_ENV.IMAGES_400_URL}${heroVideo.image}` : '/placeholder.jpg'}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                            alt={heroVideo.title}
                        />
                        <div
                            className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                onClick={() => navigate(`/video/${heroVideo.slug}`)}
                                className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                            >
                                <Play size={26} fill="white" className="ml-1 text-white"/>
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-4 pr-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-zinc-100">
                            {heroVideo.title}
                        </h1>

                        <div className="flex items-center gap-2 group cursor-pointer">
                              <span className="font-bold text-zinc-300 hover:text-white transition-colors">
                                {heroVideo.channel?.name || 'Unknown Channel'}
                              </span>
                            <CheckCircle2 size={16} className="text-zinc-400" fill="currentColor"/>
                        </div>

                        <p className="text-zinc-400 text-sm md:text-base font-medium leading-relaxed max-w-md line-clamp-3">
                            {heroVideo.description}
                        </p>

                        <div className="text-zinc-500 text-sm font-semibold">
                            {heroVideo.viewCount} views • {heroVideo.dateCreated}
                        </div>
                    </div>
                </section>
            )}

            <section className="mb-8 flex items-center gap-3 overflow-x-auto pb-3 no-scrollbar">
                <button className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M4 6h16M4 12h10M4 18h7"/>
                    </svg>
                </button>

                {tags.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => setActiveTag(tag)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${activeTag === tag
                            ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                            : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                        }`}
                    >
                        {tag}
                    </button>
                ))}
            </section>

            <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                    {isLoading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="space-y-4 animate-pulse">
                                <div className="aspect-video bg-zinc-900 rounded-[2rem] border border-white/5"/>
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 bg-zinc-900 rounded-full"/>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-zinc-900 rounded w-3/4"/>
                                        <div className="h-3 bg-zinc-900 rounded w-1/2"/>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        gridVideos.map((video) => (
                            <motion.div
                                key={video.id}
                                whileHover={{y: -4}}
                                onClick={() => navigate(`/video/${video.slug}`)}
                                className="group cursor-pointer space-y-4"
                            >
                                <div
                                    className="relative aspect-video bg-zinc-900 rounded-[2rem] overflow-hidden border border-white/5 group-hover:border-rose-500/30 transition-colors duration-500">
                                    <img
                                        src={video.image ? `${APP_ENV.IMAGES_400_URL}${video.image}` : '/placeholder.jpg'}
                                        alt={video.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div
                                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                        <div
                                            className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center shadow-lg">
                                            <Play size={20} fill="white" className="ml-0.5 text-white"/>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 px-1">
                                    <div
                                        className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 shrink-0 border border-white/10">
                                        <img
                                            src={video.channel?.avatarImage ? `${APP_ENV.IMAGES_50_URL}${video.channel.avatarImage}` : '/images/user/default.png'}
                                            alt={video.channel?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0 space-y-1">
                                        <h3 className="font-bold text-base text-zinc-100 group-hover:text-rose-500 transition-colors line-clamp-2 leading-snug">
                                            {video.title}
                                        </h3>

                                        <div
                                            className="flex items-center gap-1 text-zinc-400 hover:text-white text-sm font-medium transition-colors">
                                            <span className="truncate">{video.channel?.name}</span>
                                            <CheckCircle2 size={14} className="text-zinc-500 shrink-0"
                                                          fill="currentColor"/>
                                        </div>

                                        <p className="text-zinc-500 text-xs font-semibold">
                                            {video.viewCount} views • {video.dateCreated}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </section>

        </div>
    );
}

export default UserHomePage;
