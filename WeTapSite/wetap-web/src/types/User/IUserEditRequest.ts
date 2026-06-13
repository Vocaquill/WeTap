export interface IUserEditRequest {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    image?: File;
    roles?: string[];
}