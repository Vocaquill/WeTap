export interface IChannelItemResponse {
    id: number;
    name: string;
    nickName: string;
    subscriberCount: number;
    description?: string;
    avatarImage?: string;
    bannerImage?: string;
}