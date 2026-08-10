export interface IChannelUpdateModel {
    id: number;
    name: string;
    nickName: string;
    description?: string;
    avatarImage?: File;
    bannerImage?: File;
}