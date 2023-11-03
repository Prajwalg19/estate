import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

function PrivateRoute() {
    const { currentUser } = useSelector((store) => {
        return store.user;
    });

    return <>{currentUser ? <Outlet /> : <Navigate to={"/signin"} />}</>;
}

export default PrivateRoute;
