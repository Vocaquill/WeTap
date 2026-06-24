import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../../utils/createBaseQuery.ts";
import type { ICommentItemResponse } from "../../types/Comment/ICommentItemResponse.ts";
import type { ICreateCommentRequest } from "../../types/Comment/ICreateCommentRequest.ts";
import type { IUpdateCommentRequest } from "../../types/Comment/IUpdateCommentRequest.ts";
import type { IBaseSearch } from "../../types/Additional/IBaseSearch.ts";
import type { IPagedResult } from "../../types/Additional/IPagedResult.ts";

export const apiComments = createApi({
    reducerPath: "api/comments",
    baseQuery: createBaseQuery("Comments"),
    tagTypes: ["Comments", "Comment"],
    endpoints: (builder) => ({
        getVideoComments: builder.query<IPagedResult<ICommentItemResponse>, { videoId: number; params?: IBaseSearch }>({
            query: ({ videoId, params }) => ({
                url: `video/${videoId}`,
                method: "GET",
                params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.items.map(({ id }) => ({ type: "Comment" as const, id })),
                        { type: "Comment" as const, id: "VIDEO_LIST" },
                      ]
                    : [{ type: "Comment" as const, id: "VIDEO_LIST" }],
        }),

        getCommentReplies: builder.query<IPagedResult<ICommentItemResponse>, { parentId: number; params?: IBaseSearch }>({
            query: ({ parentId, params }) => ({
                url: `${parentId}/replies`,
                method: "GET",
                params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.items.map(({ id }) => ({ type: "Comment" as const, id })),
                        { type: "Comment" as const, id: "REPLIES_LIST" },
                      ]
                    : [{ type: "Comment" as const, id: "REPLIES_LIST" }],
        }),

        createComment: builder.mutation<ICommentItemResponse, ICreateCommentRequest>({
            query: (body) => ({
                url: "",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Comment", id: "VIDEO_LIST" }],
        }),

        updateComment: builder.mutation<ICommentItemResponse, IUpdateCommentRequest>({
            query: ({ id, ...body }) => ({
                url: `${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Comment", id },
                { type: "Comment", id: "VIDEO_LIST" },
                { type: "Comment", id: "REPLIES_LIST" },
            ],
        }),

        deleteComment: builder.mutation<void, number>({
            query: (id) => ({
                url: `${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: "Comment", id },
                { type: "Comment", id: "VIDEO_LIST" },
                { type: "Comment", id: "REPLIES_LIST" },
            ],
        }),
    }),
});

export const {
    useGetVideoCommentsQuery,
    useGetCommentRepliesQuery,
    useLazyGetCommentRepliesQuery,
    useCreateCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
} = apiComments;
