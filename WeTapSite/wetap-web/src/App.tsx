//Program
import { Routes, Route } from 'react-router-dom'
//user
import UserHomePage from './pages/UserHomePage.tsx'
import MoviePage from './pages/MoviePage';
import VideoPage from './pages/VideoPage';
import LoginPage from './pages/LoginPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import EditProfilePage from './pages/EditProfilePage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import CatalogPage from './pages/CatalogPage.tsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.tsx';
import ResetPasswordPage from './pages/ResetPasswordPage.tsx';
//admin
import AdminLayout from './layouts/AdminLayout.tsx'
import GenresPage from './pages/Admin/GenresPage.tsx'
import Dashboard from './pages/Admin/Dashboard.tsx'
import AdminMoviesPage from "./pages/Admin/AdminMoviesPage.tsx";
import CreateMoviePage from "./pages/Admin/CreateMoviePage.tsx";
import EditMoviePage from "./pages/Admin/EditMoviePage.tsx";
//For all 
import AppLayout from './layouts/AppLayout.tsx'
import SearchPage from './pages/SearchPage'
//Rout
// import RequireAdmin from "./components/ProtectedRoute/RequireAdmin.tsx";
import RequireLogin from "./components/ProtectedRoute/RequireLogin.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import VideoUploadTest from './pages/VideoUploadTest.tsx';


function App() {
    return (
        <Routes>

            <Route element={<AppLayout />}>
                <Route path="/" element={<UserHomePage />} />
                <Route path="/movie/:slug" element={<MoviePage />} />
                <Route path="/video/:slug" element={<VideoPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/video-upload-test" element={<VideoUploadTest />} /> {/*тичасово*/}

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
                    <Route path="movies">
                        <Route index element={<AdminMoviesPage />} />
                        <Route path="add" element={<CreateMoviePage />} />
                        <Route path="edit/:slug" element={<EditMoviePage />} />
                    </Route>
                </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />

        </Routes>
    )
}

export default App
