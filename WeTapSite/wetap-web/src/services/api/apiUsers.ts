import {createApi} from "@reduxjs/toolkit/query/react";
import {createBaseQuery} from "../../utils/createBaseQuery.ts";
import type {IPagedResult} from "../../types/Additional/IPagedResult.ts";
import type {IBaseSearch} from "../../types/Additional/IBaseSearch.ts";

export interface IUserItemResponse {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    image?: string;
    roles?: string[];
    isLoginGoogle: boolean;
    isLoginPassword: boolean;
    loginTypes: string[];
}

export interface IUserSearchRequest extends IBaseSearch {
    id: number;
    name: string;
    image?: string;
    roles?: string[];
}

export const apiUsers = createApi({
    reducerPath: "api/users",
    baseQuery: createBaseQuery("Users"),
    tagTypes: ["Users", "User"],
    endpoints: (builder) => ({
        
        searchUsers: builder.query<IPagedResult<IUserItemResponse>, IUserSearchRequest>({
            query: (params)=>({
                url: "SearchUsers",
                method: "GET",
                params,
            }),
            providesTags: ["Users"]
        }),
        
    }),
});

export const {
    useSearchUsersQuery,
} = apiUsers;