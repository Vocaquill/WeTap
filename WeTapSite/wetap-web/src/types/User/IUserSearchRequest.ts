import type {IBaseSearch} from "../Additional/IBaseSearch.ts";
import type {UserSortField} from "../../env";

export interface IUserSearchRequest extends IBaseSearch {
    query?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    image?: string;
    roles?: string[];
    sortBy?: UserSortField;
}