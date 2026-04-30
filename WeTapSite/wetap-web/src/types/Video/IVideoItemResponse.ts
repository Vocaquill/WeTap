import type { IGenreItemResponse } from "../Genre/IGenreItemResponse";
import type { ITagItemResponse } from "../Tag/ITagItemResponse";
import type { ILanguageItemResponse } from "../Language/ILanguageItemResponse";

export interface IVideoPrivacyItemResponse {
    id: number;
    name: string;
    systemCode: string;
}

export interface IVideoItemResponse {
    id: number;
    title: string;
    slug: string;
    description?: string;
    viewCount: number;
    image?: string;
    video?: string;
    genres: IGenreItemResponse[];
    tags: ITagItemResponse[];
    privacy?: IVideoPrivacyItemResponse;
    language?: ILanguageItemResponse;
}
