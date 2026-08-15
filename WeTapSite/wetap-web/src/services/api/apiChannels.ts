import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../../utils/createBaseQuery.ts";
import { serialize } from "object-to-formdata";
import type { IChannelItemResponse } from "../../types/Channel/IChannelItemResponse.ts";
import type { IChannelCreateRequest } from "../../types/Channel/IChannelCreateRequest.ts";
import type { IChannelUpdateModel } from "../../types/Channel/IChannelUpdateModel.ts";
import type { IGetByRequest } from "../../types/Additional/IGetByRequest.ts";
import type { IPagedResult } from "../../types/Additional/IPagedResult.ts";
import type { IChannelSearchRequest } from "../../types/Channel/IChannelSearchRequest.ts";

export const apiChannels = createApi({
    reducerPath: "api/channels",
    baseQuery: createBaseQuery("Channels"),
    tagTypes: ["Channels", "Channel"],
    endpoints: (builder) => ({
        searchChannels: builder.query<IPagedResult<IChannelItemResponse>, IChannelSearchRequest>({
            query: (params) => ({
                url: "search",
                method: "GET",
                params,
            }),
            providesTags: ["Channels"],
        }),
        createChannel: builder.mutation<IChannelItemResponse, IChannelCreateRequest>({
            query: (body) => ({
                url: "",
                method: "POST",
                body: serialize(body),
            }),
            invalidatesTags: ["Channels"],
        }),
        updateChannel: builder.mutation<IChannelItemResponse, IChannelUpdateModel>({
            query: (body) => ({
                url: "",
                method: "PUT",
                body: serialize(body, { indices: true, nullsAsUndefineds: true }),
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "Channel", id }, "Channels"],
        }),
        getBy: builder.query<IChannelItemResponse, IGetByRequest>({
            query: (par) => ({
                url: "get-by",
                method: "GET",
                params: par,
            }),
            providesTags: (result) =>
                result ? [{ type: "Channel", id: result.id }] : ["Channel"],
        }),
        toggleSubscription: builder.mutation<void, number>({
            query: (channelId) => ({
                url: `subscribe`,
                method: "POST",
                body: { channelId }
            }),
            invalidatesTags: (_result, _error, channelId) => [
                { type: "Channel", id: channelId },
                "Channel",
                "Channels",
            ],
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch({ type: 'api/videos/invalidateTags', payload: ['Video'] });
                } catch {}
            }
        }),
    }),
});

export const {
    useSearchChannelsQuery,
    useCreateChannelMutation,
    useUpdateChannelMutation,
    useGetByQuery,
    useToggleSubscriptionMutation,
} = apiChannels;