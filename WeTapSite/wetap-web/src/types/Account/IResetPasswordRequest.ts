export interface IResetPasswordRequest {
    newPassword: string;
    token: string;
    email: string;
}