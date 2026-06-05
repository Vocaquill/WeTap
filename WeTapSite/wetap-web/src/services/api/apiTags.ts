import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../../utils/createBaseQuery.ts";
import type { ITagItemResponse } from "../../types/Tag/ITagItemResponse.ts";
import type { ITagSearchRequest } from "../../types/Tag/ITagSearchRequest.ts";
import type { IGetByRequest } from "../../types/Additional/IGetByRequest.ts";
import type { ITagCreateRequest } from "../../types/Tag/ITagCreateRequest.ts";
import type { ITagEditRequest } from "../../types/Tag/ITagEditRequest.ts";
import type { ITagDeleteRequest } from "../../types/Tag/ITagDeleteRequest.ts";
import type { IPagedResult } from "../../types/Additional/IPagedResult.ts";

export const apiTags = createApi({
    reducerPath: "api/tags",
    baseQuery: createBaseQuery("Tags"),
    tagTypes: ["Tags", "Tag"],
    endpoints: (builder) => ({

        searchTags: builder.query<IPagedResult<ITagItemResponse>, ITagSearchRequest>({
            query: (params) => ({
                url: "search",
                method: "GET",
                params,
            }),
            providesTags: ["Tags"],
        }),

        getBy: builder.query<ITagItemResponse, IGetByRequest>({
            query: (par) => ({
                url: "get-by",
                method: "GET",
                params: par,
            }),
            providesTags: (result) =>
                result ? [{ type: "Tag", id: result.id }] : ["Tag"],
        }),

        createTag: builder.mutation<ITagItemResponse, ITagCreateRequest>({
            query: (body) => ({
                url: "",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Tags"],
        }),

        editTag: builder.mutation<ITagItemResponse, ITagEditRequest>({
            query: (body) => ({
                url: "",
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Tags"],
        }),

        deleteTag: builder.mutation<void, ITagDeleteRequest>({
            query: (body) => ({
                url: "",
                method: "DELETE",
                body,
            }),
            invalidatesTags: ["Tags"],
        }),
    }),
});

export const {
    useSearchTagsQuery,
    useGetByQuery,
    useCreateTagMutation,
    useEditTagMutation,
    useDeleteTagMutation,
} = apiTags;
