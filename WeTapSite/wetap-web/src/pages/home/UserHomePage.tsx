import {useNavigate} from 'react-router-dom';

import {Play, CheckCircle2} from 'lucide-react';
import {APP_ENV} from '../../env';
import {useSearchVideosQuery} from '../../services/api/apiVideos';
import {TabButtons} from "../../components/ui/common/TabButton.tsx";
import { Button } from '../../components/form/Button';

import { VideoCard } from '../../components/video/VideoCard';

function UserHomePage() {
    const navigate = useNavigate();

    const {data: data, isLoading} = useSearchVideosQuery({itemPerPage: 30, page: 1});
    const videos = data?.items;

    const heroVideo = videos?.[0];
    const gridVideos = videos?.slice(1) || [];

    const tags = ['All', 'Subscriptions', 'Posts', 'Music', 'Tech', 'Design', 'Comedy', 'Movies'];

    const handleTabChange = (tab: string) => {
        console.log('Tab changed to:', tab);
        // TODO: implement tab switching logic
    }

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
                            <Button
                                variant="play"
                                onClick={() => navigate(`/video/${heroVideo.slug}`)}
                            >
                                <Play size={26} fill="white" className="ml-1 text-white"/>
                            </Button>
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
                <TabButtons tabList={tags} onTabChange={handleTabChange} />
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
                            <VideoCard key={video.id} video={video} />
                        ))
                    )}
                </div>
            </section>

        </div>
    );
}

export default UserHomePage;
