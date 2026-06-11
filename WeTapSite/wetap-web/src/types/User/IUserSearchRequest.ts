import type {IBaseSearch} from "../Additional/IBaseSearch.ts";
import type {UserSortField} from "../../env";

export interface IUserSearchRequest extends IBaseSearch {
    id: number;
    name?: string;
    image?: string;
    roles?: string[];
    sortBy?: UserSortField;
}