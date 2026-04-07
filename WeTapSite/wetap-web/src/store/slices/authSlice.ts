import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import type {User} from "../../types/user.ts"

interface AuthState {
    user: User | null;
}


const getUserFromToken = (token: string): User | null => {
    try {
        const decoded: any = jwtDecode(token);
        return {
            name: decoded["name"] ?? decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ?? "",
            email: decoded["email"] ?? decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ?? "",
            image: decoded["image"] ?? "",
            token,
            role: decoded["roles"] ?? null,
        };
    } catch (e) {
        console.error("Invalid token", e);
        return null;
    }
};

const token = localStorage.getItem('token');
const initialUser = token ? getUserFromToken(token) : null;

const initialState: AuthState = {
    user: initialUser,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<string>) => {
            const user = getUserFromToken(action.payload);
            if (user) {
                state.user = user;
                localStorage.setItem('token', action.payload);
            }
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem('token');
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;


export default authSlice.reducer;
