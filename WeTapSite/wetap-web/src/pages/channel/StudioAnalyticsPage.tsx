import { useState } from "react";
import { useAppSelector } from "../../store";
import { useGetChartsQuery } from "../../services/api/apiStudio";
import { StudioDateRangePicker } from "../../components/ui/common/StudioDateRangePicker";
import { Loader2 } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

type MetricType = "Views" | "Subscribers" | "Likes";

export default function StudioAnalyticsPage() {
    const { user } = useAppSelector((state) => state.auth);

    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const formatDate = (date: Date) => {
        return date.toISOString().split("T")[0];
    };

    const [dateRange, setDateRange] = useState({
        from: formatDate(thirtyDaysAgo),
        to: formatDate(today)
    });

    const [activeMetric, setActiveMetric] = useState<MetricType>("Views");

    const { data: chartData, isLoading } = useGetChartsQuery(
        {
            channelId: user?.channelId,
            from: dateRange.from,
            to: dateRange.to
        },
        { skip: !user?.channelId }
    );

    const handleDateChange = (from: string, to: string) => {
        setDateRange({ from, to });
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center min-h-[60vh] bg-[#0c0c0e]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-[#ec4899]" size={48} />
                    <p className="text-zinc-400 text-sm font-medium">Завантаження аналітики...</p>
                </div>
            </div>
        );
    }

    const viewsMetric = chartData?.find((m) => m.metric === "Views")?.dataPoints || [];
    const likesMetric = chartData?.find((m) => m.metric === "Likes")?.dataPoints || [];
    const subscribersMetric = chartData?.find((m) => m.metric === "Subscribers")?.dataPoints || [];

    const allDates = Array.from(
        new Set([
            ...viewsMetric.map((dp) => dp.date),
            ...likesMetric.map((dp) => dp.date),
            ...subscribersMetric.map((dp) => dp.date)
        ])
    ).sort();

    const chartDisplayData = allDates.map((date) => {
        const viewsVal = viewsMetric.find((dp) => dp.date === date)?.value || 0;
        const likesVal = likesMetric.find((dp) => dp.date === date)?.value || 0;
        const subsVal = subscribersMetric.find((dp) => dp.date === date)?.value || 0;
        
        let displayValue = viewsVal;
        if (activeMetric === "Likes") displayValue = likesVal;
        if (activeMetric === "Subscribers") displayValue = subsVal;

        const dateObj = new Date(date);
        const formattedDate = dateObj.toLocaleDateString("uk-UA", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });

        return {
            date: formattedDate,
            rawDate: date,
            value: displayValue
        };
    });

    const tableData = [...allDates].reverse().map((date) => {
        const viewsVal = viewsMetric.find((dp) => dp.date === date)?.value || 0;
        const likesVal = likesMetric.find((dp) => dp.date === date)?.value || 0;
        const subsVal = subscribersMetric.find((dp) => dp.date === date)?.value || 0;

        const dateObj = new Date(date);
        const formattedDate = dateObj.toLocaleDateString("uk-UA", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });

        return {
            date: formattedDate,
            views: viewsVal,
            likes: likesVal,
            subscribers: subsVal,
            comments: 0
        };
    });

    const formatMetricName = (metric: MetricType) => {
        if (metric === "Views") return "Перегляди";
        if (metric === "Likes") return "Вподобайки";
        return "Підписки";
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + "M";
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + "K";
        }
        return num.toString();
    };

    return (
        <div className="p-8 space-y-10 animate-in fade-in duration-500 max-w-6xl mx-auto bg-[#121214] min-h-screen text-zinc-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black tracking-tight text-white">
                        Аналітика каналу – {formatMetricName(activeMetric)}
                    </h1>
                </div>
                
                <StudioDateRangePicker
                    from={dateRange.from}
                    to={dateRange.to}
                    onChange={handleDateChange}
                />
            </div>

            <div className="flex gap-4 border-b border-zinc-800 pb-2">
                {(["Views", "Likes", "Subscribers"] as MetricType[]).map((metric) => (
                    <button
                        key={metric}
                        onClick={() => setActiveMetric(metric)}
                        className={`pb-2 px-1 text-sm font-bold border-b-2 transition-all ${
                            activeMetric === metric
                                ? "border-[#ec4899] text-white"
                                : "border-transparent text-zinc-500 hover:text-zinc-300"
                        }`}
                    >
                        {formatMetricName(metric)}
                    </button>
                ))}
            </div>

            <div className="h-[400px] w-full bg-[#1c1c20] p-6 rounded-[1.5rem] border border-zinc-800">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartDisplayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#71717a"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#71717a"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={formatNumber}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#18181b",
                                border: "1px solid #27272a",
                                borderRadius: "0.75rem",
                                color: "#f4f4f5"
                            }}
                            labelStyle={{ color: "#a1a1aa", fontSize: 11, fontWeight: "bold" }}
                            itemStyle={{ color: "#ec4899", fontSize: 12, fontWeight: "bold" }}
                            formatter={(value: any) => [formatNumber(Number(value || 0)), formatMetricName(activeMetric)]}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#ec4899"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6, strokeWidth: 0, fill: "#ec4899" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-[#1c1c20] border border-zinc-800 rounded-[1.5rem] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-800 text-zinc-400 font-bold text-xs uppercase tracking-wider">
                                <th className="p-4 border-r border-zinc-800">Дата</th>
                                <th className="p-4 border-r border-zinc-800">Перегляди</th>
                                <th className="p-4 border-r border-zinc-800">Коментарі</th>
                                <th className="p-4 border-r border-zinc-800">Вподобайки</th>
                                <th className="p-4">Підписки</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.length > 0 ? (
                                tableData.map((row, idx) => (
                                    <tr
                                        key={idx}
                                        className="border-b border-zinc-800/50 hover:bg-zinc-800/20 text-zinc-300 transition-colors"
                                    >
                                        <td className="p-4 border-r border-zinc-800 font-medium">{row.date}</td>
                                        <td className="p-4 border-r border-zinc-800">{formatNumber(row.views)}</td>
                                        <td className="p-4 border-r border-zinc-800">{row.comments === 0 ? "-" : row.comments}</td>
                                        <td className="p-4 border-r border-zinc-800">{formatNumber(row.likes)}</td>
                                        <td className="p-4">
                                            {row.subscribers > 0 ? `+${formatNumber(row.subscribers)}` : row.subscribers}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-zinc-500 italic">
                                        Немає даних за вибраний період
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
