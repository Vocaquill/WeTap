import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../../utils/createBaseQuery.ts";
import type { IVideoProcessingResult, IVideoCreateModel } from "../../types/video.ts";
import { serialize } from "object-to-formdata";

export const apiVideos = createApi({
  reducerPath: "api/videos",
  baseQuery: createBaseQuery("Videos"),
  tagTypes: ["Videos"],
  endpoints: (builder) => ({
    createVideo: builder.mutation<IVideoProcessingResult, IVideoCreateModel>({
      query: (body) => ({
        url: "",
        method: "POST",
        body: serialize(body),
      }),
      invalidatesTags: ["Videos"],
    }),
  }),
});

export const { useCreateVideoMutation } = apiVideos;
