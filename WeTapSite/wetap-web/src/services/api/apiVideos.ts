import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../../utils/createBaseQuery.ts";
import { serialize } from "object-to-formdata";
import type { IVideoItemResponse } from "../../types/Video/IVideoItemResponse.ts";
import type { IVideoPrivacyItemResponse } from "../../types/Video/IVideoPrivacyItemResponse.ts";
import type { IVideoSearchRequest } from "../../types/Video/IVideoSearchRequest.ts";
import type { IVideoCreateRequest } from "../../types/Video/IVideoCreateRequest.ts";
import type { IVideoEditRequest } from "../../types/Video/IVideoEditRequest.ts";
import type { IVideoDeleteRequest } from "../../types/Video/IVideoDeleteRequest.ts";
import type { IVideoProcessingResult } from "../../types/Video/IVideoProcessingResult.ts";
import type { IGetByRequest } from "../../types/Additional/IGetByRequest.ts";
import type { IPagedResult } from "../../types/Additional/IPagedResult.ts";
import type {IVideoReactionRequest} from "../../types/Video/IVideoReactionRequest.ts";

export const apiVideos = createApi({
    reducerPath: "api/videos",
    baseQuery: createBaseQuery("Videos"),
    tagTypes: ["Videos", "Video"],
    endpoints: (builder) => ({

        getAllVideos: builder.query<IVideoItemResponse[], void>({
            query: () => ({
                url: "",
                method: "GET",
            }),
            providesTags: ["Videos"],
        }),

        searchVideos: builder.query<IPagedResult<IVideoItemResponse>, IVideoSearchRequest>({
            query: (params) => ({
                url: "search",
                method: "GET",
                params,
            }),
            providesTags: ["Videos"],
        }),

        getBy: builder.query<IVideoItemResponse, IGetByRequest>({
            query: (par) => ({
                url: "get-by",
                method: "GET",
                params: par,
            }),
            providesTags: (result) =>
                result ? [{ type: "Video", id: result.id }] : ["Video"],
        }),

        createVideo: builder.mutation<IVideoProcessingResult, IVideoCreateRequest>({
            query: (body) => ({
                url: "",
                method: "POST",
                body: serialize(body),
            }),
            invalidatesTags: ["Videos"],
        }),

        editVideo: builder.mutation<IVideoProcessingResult, IVideoEditRequest>({
            query: (body) => ({
                url: "",
                method: "PUT",
                body: serialize(body),
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "Video", id }, "Videos"],
        }),

        deleteVideo: builder.mutation<IVideoItemResponse[], IVideoDeleteRequest>({
            query: (body) => ({
                url: "",
                method: "DELETE",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "Video", id }, "Videos"],
        }),

        getPrivacies: builder.query<IVideoPrivacyItemResponse[], void>({
            query: () => ({
                url: "privacies",
                method: "GET",
            }),
        }),
        reactVideo: builder.mutation<void, IVideoReactionRequest>({
            query: (body) => ({
                url: "react",
                method: "POST",
                body,
            }),
            invalidatesTags: (_result, _error, { videoId }) => [{ type: "Video", id: videoId }, "Videos"],
        }),
        incrementView: builder.mutation<void, number>({
            query: (id) => ({
                url: `${id}/view`,
                method: "POST",
            }),
        }),
    }),
});

export const {
    useGetAllVideosQuery,
    useSearchVideosQuery,
    useGetByQuery,
    useCreateVideoMutation,
    useEditVideoMutation,
    useDeleteVideoMutation,
    useGetPrivaciesQuery,
    useReactVideoMutation,
    useIncrementViewMutation,
} = apiVideos;
