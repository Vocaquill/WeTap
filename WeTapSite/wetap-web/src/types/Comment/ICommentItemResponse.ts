export interface ICommentItemResponse {
    id: number;
    content: string;
    dateCreated: string;
    likesCount: number;
    dislikeCount: number;
    repliesCount: number;
    isEdited: boolean;
    userId: number;
    userName: string;
    userImage: string | null;
}
