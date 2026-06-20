export interface IRegister
{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    imageFile?: File;
}

export interface ILogin
{
    email: string;
    password: string;
}

export interface User {
    id?: number;
    name: string;
    email: string;
    image: string;
    token: string;
    roles: string[];
    channelId?: number;
}

export interface IUserHasPasswordResponse {
    hasPassword: boolean;
}

export interface ServerError {
    status: number;
    data: {
        errors: Record<string, string[]>;
    };
}

export interface INewPasswords {
    oldPassword?: string;
    newPassword: string;
    confirmPassword: string
}