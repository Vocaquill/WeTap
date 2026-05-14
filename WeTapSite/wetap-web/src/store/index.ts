import { configureStore } from '@reduxjs/toolkit';
// import genresReducer from './slices/genresSlice';
import { apiVideos } from "../services/api/apiVideos.ts";

import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { apiGenres } from "../services/api/apiGenres.ts";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiAccount } from "../services/api/apiAccount.ts";
import { apiTags } from "../services/api/apiTags.ts";
import { apiLanguages } from "../services/api/apiLanguages.ts";


import authReducer from "./slices/authSlice.ts";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        // genres: genresReducer,
        [apiVideos.reducerPath]: apiVideos.reducer,

        [apiGenres.reducerPath]: apiGenres.reducer,
        [apiAccount.reducerPath]: apiAccount.reducer,
        [apiTags.reducerPath]: apiTags.reducer,
        [apiLanguages.reducerPath]: apiLanguages.reducer,


        //[apiUser.reducerPath]: apiUser.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            apiVideos.middleware,

            apiGenres.middleware,
            apiAccount.middleware,
            apiTags.middleware,
            apiLanguages.middleware


            //apiUser.middleware
        )
});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector