import type {IBaseSearch} from "../Additional/IBaseSearch.ts";
import type { GenreSortField } from "../../env";

export interface IGenreSearchRequest extends IBaseSearch {
    q?: string;
    name?: string;
    slug?: string;
    sortBy?: GenreSortField;
}