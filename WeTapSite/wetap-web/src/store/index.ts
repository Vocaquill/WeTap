import { configureStore } from '@reduxjs/toolkit';
import { apiVideos } from "../services/api/apiVideos.ts";
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { apiGenres } from "../services/api/apiGenres.ts";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiAccount } from "../services/api/apiAccount.ts";
import { apiTags } from "../services/api/apiTags.ts";
import { apiLanguages } from "../services/api/apiLanguages.ts";
import { apiChannels } from "../services/api/apiChannels.ts";
import { apiComments } from "../services/api/apiComments.ts";


import authReducer from "./slices/authSlice.ts";
import {apiUsers} from "../services/api/apiUsers.ts";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [apiVideos.reducerPath]: apiVideos.reducer,
        [apiGenres.reducerPath]: apiGenres.reducer,
        [apiAccount.reducerPath]: apiAccount.reducer,
        [apiUsers.reducerPath]: apiUsers.reducer,
        [apiTags.reducerPath]: apiTags.reducer,
        [apiLanguages.reducerPath]: apiLanguages.reducer,
        [apiChannels.reducerPath]: apiChannels.reducer,
        [apiComments.reducerPath]: apiComments.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            apiVideos.middleware,
            apiGenres.middleware,
            apiAccount.middleware,
            apiUsers.middleware,
            apiTags.middleware,
            apiLanguages.middleware,
            apiChannels.middleware,
            apiComments.middleware
        )
});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
