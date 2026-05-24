import RequireRole from './RequireRole';

const RequireAdmin = () => <RequireRole allowedRoles={['Admin']} fallback="/" />;

export default RequireAdmin;
