import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import type {User} from "../../types/user.ts"

interface AuthState {
    user: User | null;
}


const getUserFromToken = (token: string): User | null => {
    try {
        const decoded: any = jwtDecode(token);

        let roles: string[] = [];
        if (decoded["roles"]) {
            if (Array.isArray(decoded["roles"])) {
                roles = decoded["roles"];
            } else if (typeof decoded["roles"] === 'string') {
                try {
                    roles = JSON.parse(decoded["roles"]);
                } catch {
                    roles = [decoded["roles"]];
                }
            }
        }

        const idVal = decoded["nameid"] ?? decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

        // ДОДАНО: спроба дістати ID каналу з токена
        const channelIdVal = decoded["channelId"] ?? decoded["ChannelId"];

        return {
            id: idVal ? Number(idVal) : undefined,
            name: decoded["name"] ?? decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ?? "",
            email: decoded["email"] ?? decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ?? "",
            image: decoded["image"] ?? "",
            token,
            roles,
            // ДОДАНО: передаємо ID каналу, якщо він є
            channelId: channelIdVal ? Number(channelIdVal) : undefined,
        };
    } catch (e) {
        console.error("Invalid token", e);
        return null;
    }
};

const initialState: AuthState = {
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<string>) => {
            const user = getUserFromToken(action.payload);
            if (user) {
                state.user = user;
            }
        },
        logout: (state) => {
            state.user = null;
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;


export default authSlice.reducer;
