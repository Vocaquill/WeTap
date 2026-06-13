import {createApi} from "@reduxjs/toolkit/query/react";
import {createBaseQuery} from "../../utils/createBaseQuery.ts";
import type {IPagedResult} from "../../types/Additional/IPagedResult.ts";
import type {IUserItemResponse} from "../../types/User/IUserItemResponse.ts";
import type {IUserSearchRequest} from "../../types/User/IUserSearchRequest.ts";
import type {IUserDeleteRequest} from "../../types/User/IUserDeleteRequest.ts";
import type {IUserEditRequest} from "../../types/User/IUserEditRequest.ts";
import {serialize} from "object-to-formdata";

export const apiUsers = createApi({
    reducerPath: "api/users",
    baseQuery: createBaseQuery("Users"),
    tagTypes: ["Users", "User"],
    endpoints: (builder) => ({

        searchUsers: builder.query<IPagedResult<IUserItemResponse>, IUserSearchRequest>({
            query: (params) => ({
                url: "SearchUsers",
                method: "GET",
                params,
            }),
            providesTags: ["Users"]
        }),

        editUser: builder.mutation<{ token: string }, IUserEditRequest>({
            query: (body) => ({
                url: "EditUser",
                method: "PUT",
                body: serialize(body),
            }),
            invalidatesTags: ["Users"]
        }),

        deleteUser: builder.mutation<void, IUserDeleteRequest>({
            query: (body) => ({
                url: "DeleteUser",
                method: "DELETE",
                body,
            }),
            invalidatesTags: ["Users"]
        }),
    }),
});

export const {
    useSearchUsersQuery,
    useDeleteUserMutation,
    useEditUserMutation,
} = apiUsers;