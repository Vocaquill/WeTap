import { Navigate, Outlet } from "react-router-dom";
import {useAppSelector} from "../../store/index";

const RequireLogin = () => {
    const {user} = useAppSelector(state => state.auth);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default RequireLogin;
