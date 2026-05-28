import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../../utils/createBaseQuery.ts";
import { serialize } from "object-to-formdata";
import type { IChannelItemResponse } from "../../types/Channel/IChannelItemResponse.ts";
import type { IChannelCreateRequest } from "../../types/Channel/IChannelCreateRequest.ts";

export const apiChannels = createApi({
    reducerPath: "api/channels",
    baseQuery: createBaseQuery("Channels"),
    tagTypes: ["Channels", "Channel"],
    endpoints: (builder) => ({
        createChannel: builder.mutation<IChannelItemResponse, IChannelCreateRequest>({
            query: (body) => ({
                url: "",
                method: "POST",
                body: serialize(body),
            }),
            invalidatesTags: ["Channels"],
        }),
    }),
});

export const {
    useCreateChannelMutation,
} = apiChannels;
