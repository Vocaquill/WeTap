import type { IGenreItemResponse } from "../Genre/IGenreItemResponse";
import type { ITagItemResponse } from "../Tag/ITagItemResponse";
import type { ILanguageItemResponse } from "../Language/ILanguageItemResponse";
import type {IChannelItemResponse} from "../Channel/IChannelItemResponse.ts";

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
    dateCreated?: string;
    viewCount: number;
    image?: string;
    video?: string;
    channel: IChannelItemResponse;
    genres: IGenreItemResponse[];
    tags: ITagItemResponse[];
    privacy?: IVideoPrivacyItemResponse;
    language?: ILanguageItemResponse;
    likesCount: number;
    dislikesCount: number;
}
