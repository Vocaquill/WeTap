import RequireRole from './RequireRole';

const RequireAuthor = () => (
    <RequireRole allowedRoles={['Author', 'Admin']} fallback="/channel/create" />
);

export default RequireAuthor;
