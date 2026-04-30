import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../../utils/createBaseQuery.ts";
import type { ILanguageItemResponse } from "../../types/Language/ILanguageItemResponse.ts";
import type { ILanguageSearchRequest } from "../../types/Language/ILanguageSearchRequest.ts";
import type { IGetByRequest } from "../../types/Additional/IGetByRequest.ts";
import type { ILanguageCreateRequest } from "../../types/Language/ILanguageCreateRequest.ts";
import type { ILanguageEditRequest } from "../../types/Language/ILanguageEditRequest.ts";
import type { ILanguageDeleteRequest } from "../../types/Language/ILanguageDeleteRequest.ts";
import type { IPagedResult } from "../../types/Additional/IPagedResult.ts";

export const apiLanguages = createApi({
    reducerPath: "api/languages",
    baseQuery: createBaseQuery("Languages"),
    tagTypes: ["Languages", "Language"],
    endpoints: (builder) => ({

        searchLanguages: builder.query<IPagedResult<ILanguageItemResponse>, ILanguageSearchRequest>({
            query: (params) => ({
                url: "search",
                method: "GET",
                params,
            }),
            providesTags: ["Languages"],
        }),

        getBy: builder.query<ILanguageItemResponse, IGetByRequest>({
            query: (par) => ({
                url: "get-by",
                method: "GET",
                params: par,
            }),
            providesTags: (result) =>
                result ? [{ type: "Language", id: result.id }] : ["Language"],
        }),

        createLanguage: builder.mutation<ILanguageItemResponse, ILanguageCreateRequest>({
            query: (body) => ({
                url: "",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Languages"],
        }),

        editLanguage: builder.mutation<ILanguageItemResponse, ILanguageEditRequest>({
            query: (body) => ({
                url: "",
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Languages"],
        }),

        deleteLanguage: builder.mutation<void, ILanguageDeleteRequest>({
            query: (body) => ({
                url: "",
                method: "DELETE",
                body,
            }),
            invalidatesTags: ["Languages"],
        }),
    }),
});

export const {
    useSearchLanguagesQuery,
    useGetByQuery,
    useCreateLanguageMutation,
    useEditLanguageMutation,
    useDeleteLanguageMutation,
} = apiLanguages;
