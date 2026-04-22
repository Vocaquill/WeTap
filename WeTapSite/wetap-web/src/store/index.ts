import { configureStore } from '@reduxjs/toolkit';
// import genresReducer from './slices/genresSlice';
import {apiMovies} from "../services/api/apiMovies.ts";
import {type TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {apiGenres} from "../services/api/apiGenres.ts";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import {apiAccount} from "../services/api/apiAccount.ts";
import {apiVideos} from "../services/api/apiVideos.ts";
import {apiTags} from "../services/api/apiTags.ts";

import authReducer from "./slices/authSlice.ts";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        // genres: genresReducer,
        [apiMovies.reducerPath]: apiMovies.reducer,
        [apiGenres.reducerPath]: apiGenres.reducer,
        [apiAccount.reducerPath]: apiAccount.reducer,
        [apiVideos.reducerPath]: apiVideos.reducer,
        [apiTags.reducerPath]: apiTags.reducer,

        //[apiUser.reducerPath]: apiUser.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            apiMovies.middleware,
            apiGenres.middleware,
            apiAccount.middleware,
            apiVideos.middleware,
            apiTags.middleware

            //apiUser.middleware
        )
});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector