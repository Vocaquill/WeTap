import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../../utils/createBaseQuery.ts";
import type { IPagedResult } from "../../types/aditional.ts";
import type {
  IMovieCommentCreate,
  IMovieGetBySlug,
  IMovieItem,
  IMovieSearch,
  IMovieCreate,
  IMovieEdit,
  IMovieDelete,
  IMovieReaction,
} from "../../types/movie.ts";
import { serialize } from "object-to-formdata";

export const apiMovies = createApi({
  reducerPath: "api/movies",
  baseQuery: createBaseQuery("Movies"),
  tagTypes: ["Movies", "Movie"],
  endpoints: (builder) => ({
    searchMovies: builder.query<IPagedResult<IMovieItem>, IMovieSearch>({
      query: (params) => ({
        url: "Search",
        method: "GET",
        params,
      }),
      providesTags: ["Movies"],
    }),

    getBySlug: builder.query<IMovieItem, IMovieGetBySlug>({
      query: ({ slug }) => ({
        url: "BySlug",
        method: "GET",
        params: { slug },
      }),
      providesTags: (result) =>
        result ? [{ type: "Movie", id: result.id }] : ["Movie"],
    }),

    addComment: builder.mutation<void, IMovieCommentCreate>({
      query: (body) => ({
        url: "AddComment",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Movie"],
    }),

    createMovie: builder.mutation<IMovieItem, IMovieCreate>({
      query: (body) => ({
        url: "",
        method: "POST",
        body: serialize(body),
      }),
      invalidatesTags: ["Movies"],
    }),

    editMovie: builder.mutation<IMovieItem, IMovieEdit>({
      query: (body) => ({
        url: "",
        method: "PUT",
        body: serialize(body),
      }),
      invalidatesTags: (result) =>
        result ? [{ type: "Movie", id: result.id }] : ["Movies"],
    }),

    deleteMovie: builder.mutation<void, IMovieDelete>({
      query: (body) => ({
        url: "",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Movies"],
    }),

    reactMovie: builder.mutation<void, IMovieReaction>({
      query: (body) => ({
        url: "React",
        method: "POST",
        body,
      }),
      //@ts-ignore
      invalidatesTags: (result, error, { movieId }) => [{ type: "Movie", id: movieId }],
    }),
  }),
});

export const {
  useSearchMoviesQuery,
  useGetBySlugQuery,
  useAddCommentMutation,
  useCreateMovieMutation,
  useEditMovieMutation,
  useDeleteMovieMutation,
  useReactMovieMutation,
} = apiMovies;
