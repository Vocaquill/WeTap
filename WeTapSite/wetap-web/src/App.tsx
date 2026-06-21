import { Routes, Route } from 'react-router-dom';

import UserHomePage from './pages/home/UserHomePage';
import VideoPage from './pages/video/VideoPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import NotFoundPage from './pages/error/NotFoundPage';

import ProfilePage from './pages/profile/ProfilePage';
import EditProfilePage from './pages/profile/EditProfilePage';

import CreateVideoPage from './pages/video/CreateVideoPage';
import EditVideoPage from './pages/video/EditVideoPage';
import CreateChannelPage from './pages/channel/CreateChannelPage';
import StudioPage from './pages/channel/StudioPage.tsx';
import ChannelPage from './pages/channel/ChannelPage.tsx';

import Dashboard from './pages/Admin/Dashboard.tsx';
import GenresPage from './pages/Admin/GenresPage.tsx';
import TagsPage from './pages/Admin/TagsPage.tsx';
import LanguagesPage from './pages/Admin/LanguagesPage.tsx';
import UsersPage from "./pages/Admin/UsersPage.tsx";

import AppLayout from './layouts/AppLayout.tsx';
import AdminLayout from './layouts/AdminLayout.tsx';

import RequireLogin from './components/auth/RequireLogin';
import RequireAuthor from './components/auth/RequireAuthor';
import RequireAdmin from './components/auth/RequireAdmin';
import { useEffect, useState } from 'react';
import { useRefreshTokenMutation } from './services/api/apiAccount';

function App() {
    const [refreshToken] = useRefreshTokenMutation();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await refreshToken().unwrap();
            } catch (e) {
                // Ignore auth failures on startup
            } finally {
                setIsCheckingAuth(false);
            }
        };
        checkAuth();
    }, [refreshToken]);

    if (isCheckingAuth) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#121213] text-zinc-100 font-sans">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-zinc-800 rounded-full" />
                    <div className="absolute top-0 left-0 w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="/" element={<UserHomePage />} />
                <Route path="/video/:slug" element={<VideoPage />} />
                <Route path="/channel/:slug" element={<ChannelPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                <Route element={<RequireLogin />}>
                    <Route path="/account" element={<ProfilePage />} />
                    <Route path="/edit-account" element={<EditProfilePage />} />
                    <Route path="/channel/create" element={<CreateChannelPage />} />
                </Route>

                <Route element={<RequireAuthor />}>
                    <Route path="/video/add" element={<CreateVideoPage />} />
                    <Route path="/video/edit/:id" element={<EditVideoPage />} />
                    <Route path="/studio" element={<StudioPage />} />
                </Route>

            </Route>

            <Route element={<RequireAdmin />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="genres" element={<GenresPage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="tags" element={<TagsPage />} />
                    <Route path="languages" element={<LanguagesPage />} />
                </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;
