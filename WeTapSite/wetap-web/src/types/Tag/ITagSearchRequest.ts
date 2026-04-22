import type { IBaseSearch } from "../aditional.ts";

export interface ITagSearchRequest extends IBaseSearch {
    name?: string;
}
