//Program
import { Routes, Route } from 'react-router-dom'
//user
import UserHomePage from './pages/home/UserHomePage'
import VideoPage from './pages/video/VideoPage';
import LoginPage from './pages/auth/LoginPage';
import ProfilePage from './pages/profile/ProfilePage';
import EditProfilePage from './pages/profile/EditProfilePage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
//admin
import AdminLayout from './layouts/AdminLayout.tsx'
import GenresPage from './pages/Admin/GenresPage.tsx'
import Dashboard from './pages/Admin/Dashboard.tsx'
//For all 
import AppLayout from './layouts/AppLayout.tsx'
//Rout
// import RequireAdmin from "./components/ProtectedRoute/RequireAdmin.tsx";
import RequireLogin from "./components/auth/RequireLogin";
import NotFoundPage from "./pages/error/NotFoundPage";
import CreateVideoPage from "./pages/video/CreateVideoPage";


function App() {
    return (
        <Routes>

            <Route element={<AppLayout />}>
                <Route path="/" element={<UserHomePage />} />
                <Route path="/video/:slug" element={<VideoPage />} />
                <Route path="/video/add" element={<CreateVideoPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                <Route element={<RequireLogin />}>
                    <Route path="/account" element={<ProfilePage />} />
                    <Route path="/edit-account" element={<EditProfilePage />} />
                </Route>

            </Route>

            {/*<Route path="/admin" element={<RequireAdmin />}>*/}
            <Route path="/admin">
                <Route element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="genres" element={<GenresPage />} />
                </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />

        </Routes>
    )
}

export default App
