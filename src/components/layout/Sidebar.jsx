import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
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
    Clock,
    BookOpen,
    ShieldCheck,
    Mail,
    MessagesSquare,
    Zap,
    LifeBuoy,
    ChevronLeft,
    ChevronRight,
    Search,
    LogOut
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/redux/authSlice";

const NavGroup = ({ title, children, isCollapsed }) => (
    <div className="mb-4 animate-fade-in">
        {!isCollapsed && (
            <div className="text-uppercase small fw-bold text-muted mb-3 px-3 opacity-50 letter-spacing-2" style={{ fontSize: '0.6rem' }}>
                {title}
            </div>
        )}
        <ul className="nav flex-column gap-y-1">
            {children}
        </ul>
    </div>
);

const Sidebar = () => {
    const { role, user } = useSelector((state) => state.auth);
    const { theme } = useTheme();
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
    // const isStudent = role === "student";
    // const isParent = role === "parent";

    const navItemClass = ({ isActive }) =>
        `nav-link d-flex align-items-center gap-x-3 px-3 py-2.5 rounded-3 mb-1 transition-all ${isActive
            ? 'bg-primary text-white shadow-primary text-active fw-bold'
            : 'text-secondary hover-bg-tertiary fw-medium'
        } ${isCollapsed ? 'justify-content-center px-0' : ''}`;

    return (
        <aside
            className={`sidebar-modern vh-100 sticky-top d-flex flex-column transition-all duration-300 shadow-sm ${isCollapsed ? 'collapsed' : ''}`}
            style={{
                backgroundColor: 'var(--sidebar-bg)',
                borderRight: '1px solid var(--sidebar-border)'
            }}
        >

            {/* Premium Header */}
            <div className={`p-4 d-flex align-items-center justify-content-between border-bottom ${isCollapsed ? 'justify-content-center' : ''}`} style={{ height: '70px' }}>
                {!isCollapsed && (
                    <div className="d-flex align-items-center gap-x-2 animate-fade-in">
                        <div className="bg-primary rounded-3 p-1.5 d-flex align-items-center justify-content-center shadow-lg">
                            <GraduationCap className="w-5 h-5 text-white flex-shrink-0" />
                        </div>
                        <h6 className="mb-0 fw-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                            NOMAD<span className="text-secondary opacity-75">Pulse</span>
                        </h6>
                    </div>
                )}
                {isCollapsed && (
                    <div className="bg-primary rounded-3 p-1.5 shadow-lg">
                        <GraduationCap className="w-5 h-5 text-white flex-shrink-0" />
                    </div>
                )}
                <button
                    className="btn btn-icon btn-sm rounded-circle hover-bg-tertiary transition-all d-none d-lg-flex align-items-center justify-content-center"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4 flex-shrink-0" /> : <ChevronLeft className="w-4 h-4 flex-shrink-0" />}
                </button>
            </div>

            <div className="flex-grow-1 overflow-auto custom-scrollbar p-3 pt-4">
                <NavGroup title="Main" isCollapsed={isCollapsed}>
                    <li className="nav-item">
                        <NavLink to={`/${role}/dashboard`} className={navItemClass}>
                            <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && <span>Dashboard</span>}
                        </NavLink>
                    </li>
                    {isTeacher && (
                        <li className="nav-item">
                            <NavLink to="/teacher/messages" className={navItemClass}>
                                <MessagesSquare className="w-5 h-5 flex-shrink-0" />
                                {!isCollapsed && <span>Messages</span>}
                            </NavLink>
                        </li>
                    )}
                </NavGroup>

                {isDeveloper && (
                    <NavGroup title="Developer Tools" isCollapsed={isCollapsed}>
                        <li className="nav-item">
                            <NavLink to="/developer/teachers" className={navItemClass}>
                                <Users className="w-5 h-5 flex-shrink-0" />
                                {!isCollapsed && <span>Teachers</span>}
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/developer/audit-logs" className={navItemClass}>
                                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                                {!isCollapsed && <span>Audit Logs</span>}
                            </NavLink>
                        </li>
                    </NavGroup>
                )}

                {isTeacher && (
                    <NavGroup title="Management" isCollapsed={isCollapsed}>
                        <li className="nav-item">
                            <NavLink to="/teacher/students" className={navItemClass}>
                                <Users className="w-5 h-5 flex-shrink-0" />
                                {!isCollapsed && <span>Students</span>}
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/teacher/batches" className={navItemClass}>
                                <ClipboardList className="w-5 h-5 flex-shrink-0" />
                                {!isCollapsed && <span>Batches</span>}
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/teacher/attendance" className={navItemClass}>
                                <UserCheck className="w-5 h-5 flex-shrink-0" />
                                {!isCollapsed && <span>Attendance</span>}
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/teacher/marks" className={navItemClass}>
                                <FileSpreadsheet className="w-5 h-5 flex-shrink-0" />
                                {!isCollapsed && <span>Marks</span>}
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/teacher/fees" className={navItemClass}>
                                <CreditCard className="w-5 h-5 flex-shrink-0" />
                                {!isCollapsed && <span>Fees</span>}
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/teacher/announcements" className={navItemClass}>
                                <Megaphone className="w-5 h-5 flex-shrink-0" />
                                {!isCollapsed && <span>Announcements</span>}
                            </NavLink>
                        </li>
                    </NavGroup>
                )}

                <NavGroup title="System" isCollapsed={isCollapsed}>
                    <li className="nav-item">
                        <NavLink to={`/${role}/settings`} className={navItemClass}>
                            <Settings className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && <span>Settings</span>}
                        </NavLink>
                    </li>
                </NavGroup>
            </div>

            {/* Premium Footer - User Profile Mini */}
            <div className="p-3 border-top mt-auto" style={{ borderTopColor: 'var(--sidebar-border) !important', backgroundColor: 'var(--bg-secondary)' }}>
                <div className={`d-flex align-items-center gap-x-3 ${isCollapsed ? 'justify-content-center' : ''}`}>
                    <div className="avatar-mini rounded-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-sm fw-bold" style={{ width: '36px', height: '36px', fontSize: '0.75rem' }}>
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    {!isCollapsed && (
                        <div className="flex-grow-1 overflow-hidden animate-fade-in d-flex justify-content-between align-items-center">
                            <div className="overflow-hidden">
                                <div className="fw-bold small text-truncate text-secondary" style={{ color: 'var(--bs-primary-color)' }}>{user?.name || 'Administrator'}</div>
                                <div className="text-muted text-truncate" style={{ fontSize: '0.65rem' }}>{role?.toUpperCase()} | VERIFIED</div>
                            </div>
                            <button className="btn btn-icon btn-sm text-danger hover-bg-danger-subtle rounded-3 transition-all d-flex align-items-center justify-content-center" onClick={handleLogout} title="Terminate Session">
                                <LogOut className="w-4 h-4 flex-shrink-0" />
                            </button>
                        </div>
                    )}
                    {isCollapsed && (
                        <button className="btn btn-icon btn-sm text-danger hover-bg-danger-subtle rounded-3 transition-all position-absolute d-flex align-items-center justify-content-center"
                            onClick={handleLogout}
                            style={{ bottom: '20px' }}>
                            <LogOut className="w-4 h-4 flex-shrink-0" />
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
