import BaseLayout from './BaseLayout';
import AdminSidebar from '../components/layout/AdminSidebar';

function AdminLayout() {
    return (
        <BaseLayout
            sidebar={<AdminSidebar />}
            mainClassName="flex-1 flex flex-col min-w-0 h-screen overflow-hidden pb-16 md:pb-0"
            contentClassName="flex-1 overflow-y-auto p-8"
        />
    );
}

export default AdminLayout;
