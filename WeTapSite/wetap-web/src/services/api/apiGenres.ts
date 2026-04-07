import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../../utils/createBaseQuery.ts";
import type { IPagedResult } from "../../types/aditional.ts";
import type {
    IGenreItem,
    IGenreSearch,
    IGenreCreate,
    IGenreEdit,
    IGenreDelete,
    IGenreGetBySlug,
} from "../../types/genre.ts";
import { serialize } from "object-to-formdata";

export const apiGenres = createApi({
    reducerPath: "api/genres",
    baseQuery: createBaseQuery("Genres"),
    tagTypes: ["Genres", "Genre"],
    endpoints: (builder) => ({

        searchGenres: builder.query<IPagedResult<IGenreItem>, IGenreSearch>({
            query: (params) => ({
                url: "Search",
                method: "GET",
                params,
            }),
            providesTags: ["Genres"],
        }),

        getBySlug: builder.query<IGenreItem, IGenreGetBySlug>({
            query: ({ slug }) => ({
                url: "BySlug",
                method: "GET",
                params: { slug },
            }),
            providesTags: (result) =>
                result ? [{ type: "Genre", id: result.id }] : ["Genre"],
        }),

        createGenre: builder.mutation<IGenreItem, IGenreCreate>({
            query: (body) => ({
                url: "",
                method: "POST",
                body: serialize(body),
            }),
            invalidatesTags: ["Genres"],
        }),

        editGenre: builder.mutation<IGenreItem, IGenreEdit>({
            query: (body) => ({
                url: "",
                method: "PUT",
                body: serialize(body),
            }),
            invalidatesTags: ["Genres"],
        }),

        deleteGenre: builder.mutation<void, IGenreDelete>({
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
    useGetBySlugQuery,
    useCreateGenreMutation,
    useEditGenreMutation,
    useDeleteGenreMutation,
} = apiGenres;
