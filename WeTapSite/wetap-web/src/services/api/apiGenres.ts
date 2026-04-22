import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../../utils/createBaseQuery.ts";
import type { IPagedResult } from "../../types/aditional.ts";
import { serialize } from "object-to-formdata";
import type {IGenreItemResponse} from "../../types/Genre/IGenreItemResponse.ts";
import type {IGenreSearchRequest} from "../../types/Genre/IGenreSearchRequest.ts";
import type {IGetByRequest} from "../../types/Additional/IGetByRequest.ts";
import type {IGenreCreateRequest} from "../../types/Genre/IGenreCreateRequest.ts";
import type {IGenreEditRequest} from "../../types/Genre/IGenreEditRequest.ts";
import type {IGenreDeleteRequest} from "../../types/Genre/IGenreDeleteRequest.ts";

export const apiGenres = createApi({
    reducerPath: "api/genres",
    baseQuery: createBaseQuery("Genres"),
    tagTypes: ["Genres", "Genre"],
    endpoints: (builder) => ({

        searchGenres: builder.query<IPagedResult<IGenreItemResponse>, IGenreSearchRequest>({
            query: (params) => ({
                url: "search",
                method: "GET",
                params,
            }),
            providesTags: ["Genres"],
        }),

        getBy: builder.query<IGenreItemResponse, IGetByRequest>({
            query: (par) => ({
                url: "get-by",
                method: "GET",
                params: par,
            }),
            providesTags: (result) =>
                result ? [{ type: "Genre", id: result.id }] : ["Genre"],
        }),

        createGenre: builder.mutation<IGenreItemResponse, IGenreCreateRequest>({
            query: (body) => ({
                url: "",
                method: "POST",
                body: serialize(body),
            }),
            invalidatesTags: ["Genres"],
        }),

        editGenre: builder.mutation<IGenreItemResponse, IGenreEditRequest>({
            query: (body) => ({
                url: "",
                method: "PUT",
                body: serialize(body),
            }),
            invalidatesTags: ["Genres"],
        }),

        deleteGenre: builder.mutation<void, IGenreDeleteRequest>({
            query: (body) => ({
                url: "",
                method: "DELETE",
                body,
            }),
            invalidatesTags: ["Genres"],
        }),
    }),
});

export const {
    useSearchGenresQuery,
    useGetByQuery,
    useCreateGenreMutation,
    useEditGenreMutation,
    useDeleteGenreMutation,
} = apiGenres;
