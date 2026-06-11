export interface IUserItemResponse {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    image?: string;
    roles?: string[];
    isLoginGoogle: boolean;
    isLoginPassword: boolean;
    loginTypes: string[];
}