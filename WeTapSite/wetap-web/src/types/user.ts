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
    name: string;
    email: string;
    image: string;
    token: string;
    role: string;
}

export interface IUserEdit {
    firstName: string;
    lastName: string;
    email: string;
    image?: File;
    roles?: string[];
}

export interface IUserHasPasswordResponse {
    hasPassword: boolean;
}

export interface IUserDelete {
    id: number;
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