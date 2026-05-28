export interface IChannelCreateRequest {
    name: string;
    nickName: string;
    description?: string;
    avatarImage?: File | null;
    bannerImage?: File | null;
}
