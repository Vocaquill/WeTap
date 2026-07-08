import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../../utils/createBaseQuery.ts";
import type { IStudioOverviewResponse } from "../../types/Channel/IStudioOverviewResponse";
import type { IChannelChartModel } from "../../types/Channel/IChannelChartModel";
import type { IGetChannelChartsRequest } from "../../types/Channel/IGetChannelChartsRequest";
import type { IAdminDashboardResponse } from "../../types/Channel/IAdminDashboardResponse";

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
        getAdminDashboard: builder.query<IAdminDashboardResponse, void>({
            query: () => ({
                url: "admin-dashboard",
                method: "GET",
            }),
            providesTags: ["Studio"],
        }),
    }),
});

export const {
    useGetOverviewQuery,
    useGetChartsQuery,
    useGetAdminDashboardQuery,
} = apiStudio;

