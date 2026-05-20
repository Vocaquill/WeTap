import { Project } from 'ts-morph';
import path from 'path';
import fs from 'fs';

const project = new Project({
    tsConfigFilePath: 'tsconfig.app.json'
});
project.addSourceFilesAtPaths("src/**/*.{ts,tsx}");

const root = process.cwd();

function moveFile(oldRelative, newRelative) {
    const oldAbsolute = path.resolve(root, oldRelative);
    const newAbsolute = path.resolve(root, newRelative);
    
    // Create new folder if it doesn't exist
    const newDir = path.dirname(newAbsolute);
    if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir, { recursive: true });
    }

    const sourceFile = project.getSourceFile(oldAbsolute);
    if (sourceFile) {
        sourceFile.move(newAbsolute, { overwrite: true });
        console.log(`Moved ${oldRelative} to ${newRelative}`);
    } else {
        console.warn(`Could not find ${oldRelative}`);
    }
}

// 1. Hook
moveFile('src/utils/useFormServerErrors.ts', 'src/hooks/useFormServerErrors.ts');

// 2. Components
moveFile('src/components/Header.tsx', 'src/components/layout/Header.tsx');
moveFile('src/components/Footer.tsx', 'src/components/layout/Footer.tsx');
moveFile('src/components/Sidebar.tsx', 'src/components/layout/Sidebar.tsx');
moveFile('src/components/PageTransition.tsx', 'src/components/layout/PageTransition.tsx');
moveFile('src/components/Pagination.tsx', 'src/components/ui/common/Pagination.tsx');
moveFile('src/components/AddGenreModal.tsx', 'src/components/modal/AddGenreModal.tsx');
moveFile('src/components/EditGenreModal.tsx', 'src/components/modal/EditGenreModal.tsx');
moveFile('src/components/ProtectedRoute/RequireAdmin.tsx', 'src/components/auth/RequireAdmin.tsx');
moveFile('src/components/ProtectedRoute/RequireLogin.tsx', 'src/components/auth/RequireLogin.tsx');
moveFile('src/components/LoadingOverlay.tsx', 'src/components/ui/loading/LoadingOverlay.tsx');

// 3. Pages
moveFile('src/pages/LoginPage.tsx', 'src/pages/auth/LoginPage.tsx');
moveFile('src/pages/RegisterPage.tsx', 'src/pages/auth/RegisterPage.tsx');
moveFile('src/pages/ForgotPasswordPage.tsx', 'src/pages/auth/ForgotPasswordPage.tsx');
moveFile('src/pages/ResetPasswordPage.tsx', 'src/pages/auth/ResetPasswordPage.tsx');

moveFile('src/pages/ProfilePage.tsx', 'src/pages/profile/ProfilePage.tsx');
moveFile('src/pages/EditProfilePage.tsx', 'src/pages/profile/EditProfilePage.tsx');

moveFile('src/pages/VideoPage.tsx', 'src/pages/video/VideoPage.tsx');
moveFile('src/pages/CreateVideoPage.tsx', 'src/pages/video/CreateVideoPage.tsx');

moveFile('src/pages/UserHomePage.tsx', 'src/pages/home/UserHomePage.tsx');
moveFile('src/pages/NotFoundPage.tsx', 'src/pages/error/NotFoundPage.tsx');

moveFile('src/pages/Admin/Dashboard.tsx', 'src/pages/admin/Dashboard.tsx');
moveFile('src/pages/Admin/GenresPage.tsx', 'src/pages/admin/GenresPage.tsx');

project.saveSync();
console.log('Refactoring complete!');
