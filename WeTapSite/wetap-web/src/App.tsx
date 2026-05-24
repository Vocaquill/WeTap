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
import CreateChannelPage from './pages/channel/CreateChannelPage';

import Dashboard from './pages/Admin/Dashboard.tsx';
import GenresPage from './pages/Admin/GenresPage.tsx';

import AppLayout from './layouts/AppLayout.tsx';
import AdminLayout from './layouts/AdminLayout.tsx';

import RequireLogin from './components/auth/RequireLogin';
import RequireAuthor from './components/auth/RequireAuthor';
import RequireAdmin from './components/auth/RequireAdmin';

function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="/" element={<UserHomePage />} />
                <Route path="/video/:slug" element={<VideoPage />} />
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
                </Route>

            </Route>

            <Route element={<RequireAdmin />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="genres" element={<GenresPage />} />
                </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;
