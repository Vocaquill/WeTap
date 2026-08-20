import { useState } from "react";
import { useGetChartsQuery } from "../../services/api/apiStudio";
import { StudioDateRangePicker } from "../../components/ui/common/StudioDateRangePicker";
import { Button } from "../../components/form/Button";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import LoadingOverlay from "../../components/ui/loading/LoadingOverlay.tsx";
import type { MetricType } from "../../env";
import { formatMetricName, formatNumber } from "../../utils/statsUtils.ts";
import { GenericTable } from "../../components/ui/common/GenericTable";
import type { IColumnConfig } from "../../types/Additional/IColumnConfig";

interface AnalyticsTableRow {
    id: string;
    date: string;
    views: number;
    comments: number;
    likes: number;
    subscribers: number;
}

const columns: IColumnConfig<AnalyticsTableRow>[] = [
    {
        key: 'date',
        label: 'Дата',
        render: (item) => <span className="font-medium text-zinc-100">{item.date}</span>,
    },
    {
        key: 'views',
        label: 'Перегляди',
        render: (item) => <span>{formatNumber(item.views)}</span>,
    },
    {
        key: 'comments',
        label: 'Коментарі',
        render: (item) => <span>{item.comments === 0 ? '-' : formatNumber(item.comments)}</span>,
    },
    {
        key: 'likes',
        label: 'Вподобайки',
        render: (item) => <span>{formatNumber(item.likes)}</span>,
    },
    {
        key: 'subscribers',
        label: 'Підписки',
        render: (item) => (
            <span>
                {item.subscribers > 0 ? `+${formatNumber(item.subscribers)}` : formatNumber(item.subscribers)}
            </span>
        ),
    },
];

export default function StudioAnalyticsPage() {
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
            from: dateRange.from,
            to: dateRange.to
        }
    );

    const handleDateChange = (from: string, to: string) => {
        setDateRange({ from, to });
    };

    if (isLoading) {
        return (
            <LoadingOverlay />
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

    const tableData: AnalyticsTableRow[] = [...allDates].reverse().map((date) => {
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
            id: date,
            date: formattedDate,
            views: viewsVal,
            likes: likesVal,
            subscribers: subsVal,
            comments: 0
        };
    });

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-10 animate-in fade-in duration-500 max-w-6xl mx-auto bg-theme-bg min-h-screen text-zinc-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-100">
                        Аналітика каналу – {formatMetricName(activeMetric)}
                    </h1>
                </div>
                
                <StudioDateRangePicker
                    from={dateRange.from}
                    to={dateRange.to}
                    onChange={handleDateChange}
                />
            </div>
 
            <div className="flex gap-2 sm:gap-4 border-b border-zinc-800 pb-2 overflow-x-auto">
                {(["Views", "Likes", "Subscribers"] as MetricType[]).map((metric) => (
                    <Button
                        key={metric}
                        onClick={() => setActiveMetric(metric)}
                        className={`pb-2 px-1 text-sm font-bold border-b-2 transition-all ${
                            activeMetric === metric
                                ? "border-[#ec4899] text-zinc-100"
                                : "border-transparent text-zinc-500 hover:text-zinc-300"
                        }`}
                    >
                        {formatMetricName(metric)}
                    </Button>
                ))}
            </div>
 
            <div className="h-[350px] sm:h-[400px] w-full bg-zinc-900 p-4 sm:p-6 rounded-[1.5rem] border border-zinc-800/80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartDisplayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-zinc-800))" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="rgb(var(--color-zinc-500))"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="rgb(var(--color-zinc-500))"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={formatNumber}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgb(var(--color-zinc-900))",
                                border: "1px solid rgb(var(--color-zinc-800))",
                                borderRadius: "0.75rem",
                                color: "rgb(var(--color-zinc-100))"
                            }}
                            labelStyle={{ color: "rgb(var(--color-zinc-400))", fontSize: 11, fontWeight: "bold" }}
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
 
            <GenericTable
                data={tableData}
                columns={columns}
                emptyMessage="Немає даних за вибраний період"
            />
        </div>
    );
}
