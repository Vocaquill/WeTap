import {createApi} from "@reduxjs/toolkit/query/react";
import {createBaseQuery} from "../../utils/createBaseQuery.ts";
import type {IPagedResult} from "../../types/Additional/IPagedResult.ts";
import type {IUserItemResponse} from "../../types/User/IUserItemResponse.ts";
import type {IUserSearchRequest} from "../../types/User/IUserSearchRequest.ts";

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