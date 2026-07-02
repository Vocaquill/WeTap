import type { IChannelOverviewModel } from "./IChannelOverviewModel";
import type { IChannelSubscriberItemModel } from "./IChannelSubscriberItemModel";

export interface IStudioOverviewResponse {
    overview: IChannelOverviewModel;
    recentSubscribers: IChannelSubscriberItemModel[];
    mostPopularVideo?: {
        id: number;
        title: string;
        description?: string;
        image?: string;
        viewCount: number;
        likesCount: number;
        dislikesCount: number;
        dateCreated?: string;
    };
}
