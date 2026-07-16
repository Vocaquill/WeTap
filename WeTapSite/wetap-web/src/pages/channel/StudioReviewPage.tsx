import { useNavigate } from "react-router-dom";
import { useGetOverviewQuery } from "../../services/api/apiStudio";
import { Button } from "../../components/form/Button";
import { APP_ENV } from "../../env";
import { Loader2 } from "lucide-react";

function StudioReviewPage() {
    const navigate = useNavigate();

    const { data: overviewData, isLoading } = useGetOverviewQuery({});

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center min-h-[50vh]">
                <Loader2 className="animate-spin text-[#ff2d7a]" size={40} />
            </div>
        );
    }

    const overview = overviewData?.overview;
    const popularVideo = overviewData?.mostPopularVideo;
    const subscribers = overviewData?.recentSubscribers || [];

    return (
        <div className="p-8 space-y-10 animate-in fade-in duration-500 max-w-6xl mx-auto bg-theme-bg min-h-screen text-zinc-100">
            <div>
                <h1 className="text-3xl font-black text-zinc-50 tracking-tight">Панель керування каналом</h1>
                <p className="text-zinc-500 mt-1">Огляд вашої активності та аналітики каналу</p>
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {overview && (
                    <div className="bg-zinc-900 border border-zinc-800/80 rounded-[1.5rem] overflow-hidden flex flex-col h-[360px]">
                        <div className="bg-gradient-to-b from-[#ec4899] to-[#500724] px-6 py-4 flex items-center shrink-0">
                            <h3 className="font-bold text-white text-base">Аналітика каналу</h3>
                        </div>
                        <div className="p-6 flex-grow flex flex-col justify-between text-xs md:text-sm overflow-hidden">
                            <div className="space-y-2.5 overflow-y-auto pr-1">
                                {overview.subscriberCount !== undefined && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-300">Підписники</span>
                                        <div className="flex-1 border-b border-zinc-700 mx-2 mb-1"></div>
                                        <span className="text-zinc-50 font-medium">{overview.subscriberCount.toLocaleString("uk-UA")}</span>
                                    </div>
                                )}
                                {overview.totalViewCount !== undefined && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-300">Перегляди</span>
                                        <div className="flex-1 border-b border-zinc-700 mx-2 mb-1"></div>
                                        <span className="text-zinc-50 font-medium">{overview.totalViewCount.toLocaleString("uk-UA")}</span>
                                    </div>
                                )}
                                {overview.monthlyViewCount !== undefined && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-300">Перегляди за місяць</span>
                                        <div className="flex-1 border-b border-zinc-700 mx-2 mb-1"></div>
                                        <span className="text-zinc-50 font-medium">{overview.monthlyViewCount.toLocaleString("uk-UA")}</span>
                                    </div>
                                )}
                                {overview.totalVideoCount !== undefined && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-300">Всього відео</span>
                                        <div className="flex-1 border-b border-zinc-700 mx-2 mb-1"></div>
                                        <span className="text-zinc-50 font-medium">{overview.totalVideoCount.toLocaleString("uk-UA")}</span>
                                    </div>
                                )}
                                {overview.totalLikesCount !== undefined && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-300">Всього лайків</span>
                                        <div className="flex-1 border-b border-zinc-700 mx-2 mb-1"></div>
                                        <span className="text-zinc-50 font-medium">👍 {overview.totalLikesCount.toLocaleString("uk-UA")}</span>
                                    </div>
                                )}
                                {overview.averageViewsPerVideo !== undefined && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-300">Сер. перегляди відео</span>
                                        <div className="flex-1 border-b border-zinc-700 mx-2 mb-1"></div>
                                        <span className="text-zinc-50 font-medium">{overview.averageViewsPerVideo.toLocaleString("uk-UA")}</span>
                                    </div>
                                )}
                            </div>
                            <Button
                                type="button"
                                onClick={() => navigate("/studio/analytics")}
                                className="bg-[#ec4899] hover:bg-[#db2777] text-white font-bold py-2 px-4 rounded-full text-xs uppercase tracking-wider transition-all duration-200 self-start active:scale-[0.98] mt-4 flex-shrink-0"
                            >
                                Перейти до аналітики каналу
                            </Button>
                        </div>
                    </div>
                )}
 
                <div className="bg-zinc-900 border border-zinc-800/80 rounded-[1.5rem] overflow-hidden flex flex-col h-[360px]">
                    <div className="bg-gradient-to-b from-[#ec4899] to-[#500724] px-6 py-4 flex items-center shrink-0">
                        <h3 className="font-bold text-white text-base">Аналітика відео</h3>
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between text-sm">
                        {popularVideo ? (
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-28 h-16 rounded-xl bg-zinc-900 border border-zinc-850 overflow-hidden shrink-0">
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
                                        <p className="text-zinc-500 text-xs mt-1 truncate">{popularVideo.description || "Немає опису"}</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-xs pt-2">
                                    <div className="flex justify-between text-zinc-400">
                                        <span>Перегляди:</span>
                                        <span className="text-zinc-200 font-bold">{popularVideo.viewCount.toLocaleString("uk-UA")}</span>
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
                            <Button
                                type="button"
                                onClick={() => navigate("/studio/analytics")}
                                className="bg-[#ec4899] hover:bg-[#db2777] text-white font-bold py-2 px-4 rounded-full text-xs uppercase tracking-wider transition-all duration-200 self-start active:scale-[0.98]"
                            >
                                Перейти до аналітики каналу
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={() => navigate("/video/add")}
                                className="bg-[#ec4899] hover:bg-[#db2777] text-white font-bold py-2.5 px-6 rounded-full text-xs uppercase tracking-wider transition-all duration-200 self-start active:scale-[0.98]"
                            >
                                Завантажити відео
                            </Button>
                        )}
                    </div>
                </div>
 
                <div className="bg-zinc-900 border border-zinc-800/80 rounded-[1.5rem] overflow-hidden flex flex-col h-[360px]">
                    <div className="bg-gradient-to-b from-[#ec4899] to-[#500724] px-6 py-4 flex items-center shrink-0">
                        <h3 className="font-bold text-white text-base">Останні підписки</h3>
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between text-sm overflow-hidden">
                        {subscribers.length > 0 ? (
                            <div className="space-y-3 overflow-y-auto pr-1 flex-grow">
                                {subscribers.map((sub, index) => (
                                    <div key={index} className="flex items-center justify-between py-1">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0 flex items-center justify-center border border-zinc-700">
                                                {sub.avatarImage ? (
                                                    <img
                                                        src={APP_ENV.IMAGES_100_URL + sub.avatarImage}
                                                        alt={sub.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-xs font-bold text-zinc-400">
                                                        {sub.name ? sub.name[0] : (sub.nickName ? sub.nickName[0] : "?")}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-zinc-200 font-medium truncate leading-none mb-1">{sub.name || sub.nickName}</div>
                                                <div className="text-zinc-500 text-xs truncate">@{sub.nickName}</div>
                                            </div>
                                        </div>
                                        <span className="text-zinc-50 text-xs whitespace-nowrap shrink-0">
                                            {new Date(sub.dateSubscribed).toLocaleDateString("uk-UA")}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-grow flex items-center justify-center">
                                <span className="text-zinc-500 italic">поки підписок немає</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudioReviewPage;