import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../../utils/createBaseQuery.ts";

export interface IChannelOverviewModel {
    subscriberCount: number;
    totalViewCount: number;
    monthlyViewCount: number;
    totalVideoCount: number;
    totalLikesCount: number;
    averageViewsPerVideo: number;
}

export interface IChannelSubscriberItemModel {
    name: string;
    nickName: string;
    avatarImage?: string;
    dateSubscribed: string;
}

export interface IStudioOverviewResponse {
    overview: IChannelOverviewModel;
    recentSubscribers: IChannelSubscriberItemModel[];
    mostPopularVideo?: {
        id: number;
        title: string;
        description?: string;
        image?: string;
        viewCount: number;
        likesCount: number;
        dislikesCount: number;
        dateCreated?: string;
    };
}

export interface IChannelChartDataPoint {
    date: string;
    value: number;
}

export interface IChannelChartModel {
    metric: "Views" | "Subscribers" | "Likes";
    dataPoints: IChannelChartDataPoint[];
}

export interface IGetChannelChartsRequest {
    channelId?: number;
    from: string;
    to: string;
}

export const apiStudio = createApi({
    reducerPath: "api/studio",
    baseQuery: createBaseQuery("Studio"),
    tagTypes: ["Studio"],
    endpoints: (builder) => ({
        getOverview: builder.query<IStudioOverviewResponse, { channelId?: number }>({
            query: (params) => ({
                url: "overview",
                method: "GET",
                params,
            }),
            providesTags: ["Studio"],
        }),
        getCharts: builder.query<IChannelChartModel[], IGetChannelChartsRequest>({
            query: (params) => ({
                url: "charts",
                method: "GET",
                params,
            }),
            providesTags: ["Studio"],
        }),
    }),
});

export const {
    useGetOverviewQuery,
    useGetChartsQuery,
} = apiStudio;
