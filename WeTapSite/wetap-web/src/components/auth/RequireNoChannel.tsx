import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store/index';


const RequireNoChannel = () => {
    const { user } = useAppSelector((state) => state.auth);

    if (user?.channelId) {
        return <Navigate to={`/channel/${user.channelId}`} replace />;
    }

    return <Outlet />;
};

export default RequireNoChannel;
