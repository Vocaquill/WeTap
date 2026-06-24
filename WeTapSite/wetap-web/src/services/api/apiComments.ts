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
            providesTags: ["Comments"],
        }),

        getCommentReplies: builder.query<IPagedResult<ICommentItemResponse>, { parentId: number; params?: IBaseSearch }>({
            query: ({ parentId, params }) => ({
                url: `${parentId}/replies`,
                method: "GET",
                params,
            }),
            providesTags: ["Comments"],
        }),

        createComment: builder.mutation<ICommentItemResponse, ICreateCommentRequest>({
            query: (body) => ({
                url: "",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Comments"],
        }),

        updateComment: builder.mutation<ICommentItemResponse, IUpdateCommentRequest>({
            query: ({ id, ...body }) => ({
                url: `${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "Comment", id }, "Comments"],
        }),

        deleteComment: builder.mutation<void, number>({
            query: (id) => ({
                url: `${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Comments"],
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
