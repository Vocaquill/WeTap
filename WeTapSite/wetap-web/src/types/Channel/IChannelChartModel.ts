import type { IChannelChartDataPoint } from "./IChannelChartDataPoint";

export interface IChannelChartModel {
    metric: "Views" | "Subscribers" | "Likes";
    dataPoints: IChannelChartDataPoint[];
}
