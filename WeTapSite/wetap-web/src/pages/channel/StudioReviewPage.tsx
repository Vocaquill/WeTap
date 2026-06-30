import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store';
import { useGetOverviewQuery } from '../../services/api/apiStudio';
import { APP_ENV } from '../../env';
import { Loader2 } from 'lucide-react';

function StudioReviewPage() {
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const { data: overviewData, isLoading } = useGetOverviewQuery(
        { channelId: user?.channelId },
        { skip: !user?.channelId }
    );

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-[#ff2d7a]" size={40} />
            </div>
        );
    }

    const overview = overviewData?.overview;
    const popularVideo = overviewData?.mostPopularVideo;

    return (
        <div className="p-8 space-y-10 animate-in fade-in duration-500 max-w-6xl mx-auto bg-[#121214] min-h-screen">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Панель керування каналом</h1>
                <p className="text-zinc-500 mt-1">Огляд вашої активності та аналітики каналу</p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* 1. Channel analytics */}
                {overview && (
                    <div className="bg-[#1c1c20] border border-zinc-800 rounded-[1.5rem] overflow-hidden flex flex-col h-[320px]">
                        <div className="bg-gradient-to-b from-[#ec4899] to-[#500724] px-6 py-4 flex items-center shrink-0">
                            <h3 className="font-bold text-white text-base">Аналітика каналу</h3>
                        </div>
                        <div className="p-6 flex-grow flex flex-col justify-between text-sm">
                            <div className="space-y-4">
                                {overview.subscriberCount !== undefined && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-300">Підписники</span>
                                        <div className="flex-1 border-b border-zinc-700 mx-2 mb-1"></div>
                                        <span className="text-white font-medium">{overview.subscriberCount.toLocaleString('uk-UA')}</span>
                                    </div>
                                )}
                                {overview.totalViewCount !== undefined && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-300">Перегляди</span>
                                        <div className="flex-1 border-b border-zinc-700 mx-2 mb-1"></div>
                                        <span className="text-white font-medium">{overview.totalViewCount.toLocaleString('uk-UA')}</span>
                                    </div>
                                )}
                                {overview.monthlyViewCount !== undefined && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-300">Перегляди за місяць</span>
                                        <div className="flex-1 border-b border-zinc-700 mx-2 mb-1"></div>
                                        <span className="text-white font-medium">{overview.monthlyViewCount.toLocaleString('uk-UA')}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <span className="text-zinc-300">Час перегляду (в годинах)</span>
                                    <div className="flex-1 border-b border-zinc-700 mx-2 mb-1"></div>
                                    <span className="text-white font-medium">0,6</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Most popular content */}
                <div className="bg-[#1c1c20] border border-zinc-800 rounded-[1.5rem] overflow-hidden flex flex-col h-[320px]">
                    <div className="bg-gradient-to-b from-[#ec4899] to-[#500724] px-6 py-4 flex items-center shrink-0">
                        <h3 className="font-bold text-white text-base">Найпопулярніший контент</h3>
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between text-sm">
                        <div className="space-y-4">
                            <div className="text-xs text-zinc-400 font-medium">Останні 48 годин · Перегляди</div>
                            {popularVideo ? (
                                <div className="flex items-center justify-between">
                                    <span className="text-zinc-200 truncate font-semibold max-w-[70%]">{popularVideo.title}</span>
                                    <span className="text-zinc-400 font-medium text-xs shrink-0">{popularVideo.viewCount.toLocaleString('uk-UA')} переглядів</span>
                                </div>
                            ) : (
                                <div className="text-zinc-500 py-2">
                                    Немає доступної статистики
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={(e) => e.preventDefault()}
                            className="bg-[#ec4899] hover:bg-[#db2777] text-white font-bold py-2.5 px-6 rounded-full text-xs uppercase tracking-wider transition-all duration-200 self-start active:scale-[0.98]"
                        >
                            Перейти до аналітики каналу
                        </button>
                    </div>
                </div>

                {/* 3. Video analytics */}
                <div className="bg-[#1c1c20] border border-zinc-800 rounded-[1.5rem] overflow-hidden flex flex-col h-[320px]">
                    <div className="bg-gradient-to-b from-[#ec4899] to-[#500724] px-6 py-4 flex items-center shrink-0">
                        <h3 className="font-bold text-white text-base">Аналітика відео</h3>
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between text-sm">
                        {popularVideo ? (
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-28 h-16 rounded-xl bg-zinc-900 border border-zinc-800/60 overflow-hidden shrink-0">
                                        {popularVideo.image ? (
                                            <img
                                                src={APP_ENV.IMAGES_400_URL + popularVideo.image}
                                                alt={popularVideo.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-700 text-[10px] font-black uppercase">
                                                No Pic
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-center min-w-0">
                                        <h4 className="font-bold text-zinc-200 truncate">{popularVideo.title}</h4>
                                        <p className="text-zinc-500 text-xs mt-1 truncate">{popularVideo.description || 'Немає опису'}</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-xs pt-2">
                                    <div className="flex justify-between text-zinc-400">
                                        <span>Перегляди:</span>
                                        <span className="text-zinc-200 font-bold">{popularVideo.viewCount.toLocaleString('uk-UA')}</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-400">
                                        <span>Оцінки:</span>
                                        <span className="text-zinc-200 font-bold">👍 {popularVideo.likesCount} / 👎 {popularVideo.dislikesCount}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-grow flex flex-col justify-center py-4">
                                <p className="text-zinc-400 leading-relaxed text-sm">
                                    Бажаєте переглянути показники свого останнього відео? Щоб почати, завантажте й опублікуйте його.
                                </p>
                            </div>
                        )}

                        {popularVideo ? (
                            <button
                                disabled
                                className="w-full bg-zinc-900/50 text-zinc-500 font-bold py-2.5 px-4 rounded-xl cursor-not-allowed text-xs uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 border border-zinc-800"
                            >
                                Перейти до аналітики відео
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => navigate('/video/add')}
                                className="bg-[#ec4899] hover:bg-[#db2777] text-white font-bold py-2.5 px-6 rounded-full text-xs uppercase tracking-wider transition-all duration-200 self-start active:scale-[0.98]"
                            >
                                Завантажити відео
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default StudioReviewPage;
