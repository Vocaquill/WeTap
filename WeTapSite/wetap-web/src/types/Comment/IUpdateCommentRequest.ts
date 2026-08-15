export interface IUpdateCommentRequest {
    id: number;
    content: string;
    videoId: number;
    parentId?: number | null;
}
