import { useSelector } from "react-redux";

function Can({ permission = "", children }) {

    const user = useSelector((state) => state.userDetails);

    if (!user || !user.permissions) return null;

    if (!user.permissions.includes(permission)) {
        return null;
    }

    return children;
}

export default Can;
