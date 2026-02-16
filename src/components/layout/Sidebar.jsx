import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    LayoutDashboard,
    Users,
    ClipboardList,
    UserCheck,
    FileSpreadsheet,
    CreditCard,
    Megaphone,
    Settings,
    GraduationCap,
    ShieldCheck,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Search
} from "lucide-react";
import { logout } from "../../features/auth/redux/authSlice";
import "./Sidebar.css";

const NavGroup = ({ title, children, isCollapsed }) => (
    <div className="nav-group">
        {!isCollapsed && (
            <div className="nav-group-title animate-fade-in">
                {title}
            </div>
        )}
        <nav className="nav flex-column gap-y-1">
            {children}
        </nav>
    </div>
);

const Sidebar = ({ mobileOpen }) => {
    const { role, user } = useSelector((state) => state.auth);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const isDeveloper = role === "developer";
    const isTeacher = role === "teacher";
    const isStudent = role === "student";
    const isParent = role === "parent";

    // Helper to render NavLinks with consistent styling
    const renderNavLink = (to, Icon, label, end = false) => (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            title={isCollapsed ? label : ""}
        >
            <Icon className="nav-icon" />
            {!isCollapsed && <span>{label}</span>}
        </NavLink>
    );

    return (
        <aside className={`sidebar-modern ${isCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>

            {/* Header Section */}
            <div className="sidebar-header">
                <div className="d-flex align-items-center gap-2">
                    <div className="brand-icon">
                        <GraduationCap size={20} className="text-white" />
                    </div>
                    {!isCollapsed && (
                        <div className="brand-text animate-fade-in">
                            SL<span>Hub</span>
                        </div>
                    )}
                </div>

                {/* Desktop Toggle Button */}
                <button
                    className="sidebar-toggle d-none d-lg-flex"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    aria-label="Toggle Sidebar"
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="sidebar-content">
                <NavGroup title="Main" isCollapsed={isCollapsed}>
                    {(isDeveloper || isTeacher) && renderNavLink(`/${role}/dashboard`, LayoutDashboard, "Dashboard")}

                    {isStudent && renderNavLink(`/student/dashboard?tab=dashboard`, LayoutDashboard, "Overview", true)}

                    {isParent && renderNavLink(`/parent/dashboard?tab=overview`, LayoutDashboard, "Overview", true)}
                </NavGroup>

                {isDeveloper && (
                    <NavGroup title="Developer Tools" isCollapsed={isCollapsed}>
                        {renderNavLink("/developer/teachers", Users, "Teachers")}
                        {renderNavLink("/developer/audit-logs", ShieldCheck, "Audit Logs")}
                    </NavGroup>
                )}

                {isTeacher && (
                    <NavGroup title="Management" isCollapsed={isCollapsed}>
                        {renderNavLink("/teacher/students", Users, "Students")}
                        {renderNavLink("/teacher/batches", ClipboardList, "Batches")}
                        {renderNavLink("/teacher/attendance", UserCheck, "Attendance")}
                        {renderNavLink("/teacher/marks", FileSpreadsheet, "Marks")}
                        {renderNavLink("/teacher/fees", CreditCard, "Fees")}
                        {renderNavLink("/teacher/announcements", Megaphone, "Announcements")}
                    </NavGroup>
                )}

                {isParent && (
                    <NavGroup title="Academic Records" isCollapsed={isCollapsed}>
                        {renderNavLink("/parent/dashboard?tab=attendance", UserCheck, "Attendance")}
                        {renderNavLink("/parent/dashboard?tab=marks", FileSpreadsheet, "Evaluation")}
                        {renderNavLink("/parent/dashboard?tab=fees", CreditCard, "Financials")}
                        {renderNavLink("/parent/dashboard?tab=notices", Megaphone, "Notices")}
                    </NavGroup>
                )}

                {isStudent && (
                    <NavGroup title="Student Portal" isCollapsed={isCollapsed}>
                        {renderNavLink("/student/dashboard?tab=attendance", UserCheck, "Attendance")}
                        {renderNavLink("/student/dashboard?tab=marks", FileSpreadsheet, "Performance")}
                        {renderNavLink("/student/dashboard?tab=announcements", Megaphone, "Notices")}
                        {renderNavLink("/student/dashboard?tab=profile", UserCheck, "Profile")}
                    </NavGroup>
                )}

                <NavGroup title="System" isCollapsed={isCollapsed}>
                    {renderNavLink(`/${role}/settings`, Settings, "Settings")}
                </NavGroup>
            </div>

            {/* Footer User Section */}
            <div className="sidebar-footer">
                <div className="user-profile-mini">
                    <div className="avatar-circle">
                        {user?.name?.charAt(0) || 'U'}
                    </div>

                    {!isCollapsed && (
                        <div className="user-info animate-fade-in">
                            <div className="user-name">{user?.name || 'User'}</div>
                            <div className="user-role">{role || 'GUEST'}</div>
                        </div>
                    )}

                    {!isCollapsed && (
                        <button
                            className="logout-btn-mini ms-auto"
                            onClick={handleLogout}
                            title="Sign Out"
                        >
                            <LogOut size={16} />
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
