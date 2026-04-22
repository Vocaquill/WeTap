import type {IBaseSearch} from "../aditional.ts";

export interface IGenreSearchRequest extends IBaseSearch {
    q?: string;
    name?: string;
    slug?: string;
    sortBy?: "name" | "slug";
}