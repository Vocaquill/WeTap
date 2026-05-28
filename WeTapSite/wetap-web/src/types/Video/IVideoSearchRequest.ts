import type { IBaseSearch } from "../Additional/IBaseSearch";

export interface IVideoSearchRequest extends IBaseSearch {
    q?: string;
    title?: string;
    genreId?: number;
    tagId?: number;
    createYearFrom?: string;
    createYearTo?: string;
    sortBy?: string;
    channelId?: number;
}
