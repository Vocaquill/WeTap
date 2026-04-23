import type {IBaseSearch} from "../Additional/IBaseSearch.ts";

export interface IGenreSearchRequest extends IBaseSearch {
    q?: string;
    name?: string;
    slug?: string;
    sortBy?: "name" | "slug";
}