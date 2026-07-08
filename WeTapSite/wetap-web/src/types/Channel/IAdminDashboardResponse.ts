import type { IVideoItemResponse } from "../Video/IVideoItemResponse";

export interface IAdminDashboardResponse {
    totalVideos: number;
    totalGenres: number;
    totalUsers: number;
    newUsersLastWeek: number;
    recentVideos: IVideoItemResponse[];
}
