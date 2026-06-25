export interface ICreateCommentRequest {
    content: string;
    videoId: number;
    parentId?: number | null;
}
