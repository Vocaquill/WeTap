//Program
import { Routes, Route } from 'react-router-dom'
//user
import UserHomePage from './pages/UserHomePage.tsx'
import VideoPage from './pages/VideoPage';
import LoginPage from './pages/LoginPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import EditProfilePage from './pages/EditProfilePage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.tsx';
import ResetPasswordPage from './pages/ResetPasswordPage.tsx';
//admin
import AdminLayout from './layouts/AdminLayout.tsx'
import GenresPage from './pages/Admin/GenresPage.tsx'
import Dashboard from './pages/Admin/Dashboard.tsx'
//For all 
import AppLayout from './layouts/AppLayout.tsx'
//Rout
// import RequireAdmin from "./components/ProtectedRoute/RequireAdmin.tsx";
import RequireLogin from "./components/ProtectedRoute/RequireLogin.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import CreateVideoPage from "./pages/CreateVideoPage.tsx";


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
