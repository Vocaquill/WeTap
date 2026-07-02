import type {MetricType} from "../env";

export const formatMetricName = (metric: MetricType) => {
    if (metric === "Views") return "Перегляди";
    if (metric === "Likes") return "Вподобайки";
    return "Підписки";
};

export const formatNumber = (num: number) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
};