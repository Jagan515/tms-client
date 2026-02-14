import { Link } from "react-router-dom";
import TopNavbar from "./TopNavbar";

function UserLayout({ children }) {

    return (
        <div className="container-fluid p-0">

            <TopNavbar />

            <div className="container mt-4">
                {children}
            </div>

        </div>
    );
}

export default UserLayout;
