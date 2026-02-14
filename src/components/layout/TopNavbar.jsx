import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/redux/authSlice";
import { Sun, Moon, LogOut, Bell, User, Search, Settings, HelpCircle, ShieldCheck, Mail, Check } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useState, useEffect } from "react";
import notificationService from "../../features/common/api/notificationService";

function TopNavbar() {
    const { user, role } = useSelector((state) => state.auth);
    const { theme, toggleTheme } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        loadNotifications();
        const interval = setInterval(loadNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const loadNotifications = async () => {
        try {
            const data = await notificationService.getNotifications();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (err) {
            console.error('Failed to load notifications:', err);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await notificationService.markRead(id);
            loadNotifications();
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <nav className="navbar-modern sticky-top px-4 py-0 border-bottom shadow-sm">
            <div className="container-fluid h-100 d-flex justify-content-between align-items-center">

                {/* Intelligent Search Terminal */}
                <div className="d-none d-lg-flex align-items-center position-relative w-400">
                    <Search className="position-absolute ms-3 text-muted w-4 h-4 flex-shrink-0" />
                    <input
                        type="text"
                        className="form-control ps-5 border-0 rounded-3 shadow-none transition-all focus-ring"
                        placeholder="Search institutional modules, scholars, or records..."
                        style={{ height: '44px', fontSize: '0.85rem', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                    />
                    <div className="position-absolute end-0 me-2 d-none d-xl-flex gap-1">
                        <kbd className="border text-muted small px-1.5 rounded shadow-sm" style={{ fontSize: '0.65rem', backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-default)' }}>⌘</kbd>
                        <kbd className="border text-muted small px-1.5 rounded shadow-sm" style={{ fontSize: '0.65rem', backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-default)' }}>K</kbd>
                    </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                    {/* Command Center Tools */}
                    <div className="d-flex align-items-center p-1 rounded-pill me-2 d-none d-md-flex" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        <button
                            className="btn btn-icon p-2 rounded-circle hover-bg-tertiary transition-all"
                            onClick={toggleTheme}
                            title={`Switch theme (Currently: ${theme})`}
                        >
                            {theme === 'light' && <Sun className="w-4 h-4 text-warning flex-shrink-0 transition-all scale-in" />}
                            {theme === 'dark' && <Moon className="w-4 h-4 text-secondary flex-shrink-0 transition-all scale-in" />}
                            {theme === 'system' && <Monitor className="w-4 h-4 text-primary opacity-75 flex-shrink-0 transition-all scale-in" />}
                        </button>

                        <button className="btn btn-icon p-2 rounded-circle hover-bg-tertiary transition-all position-relative">
                            <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
                            <span className="position-absolute top-1 end-1 p-1 bg-primary border-2 rounded-circle" style={{ borderColor: 'var(--bg-secondary)' }}></span>
                        </button>

                        <div className="dropdown">
                            <button
                                className="btn btn-icon p-2 rounded-circle hover-bg-tertiary transition-all position-relative"
                                type="button"
                                id="notificationDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <Bell className="w-4 h-4 text-secondary flex-shrink-0" />
                                {unreadCount > 0 && (
                                    <span className="position-absolute top-0 end-0 bg-danger text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                        style={{ width: '18px', height: '18px', fontSize: '0.6rem' }}>
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            <ul className="dropdown-menu dropdown-menu-end shadow-premium border-0 mt-3 p-0 rounded-4 animate-scale-in"
                                aria-labelledby="notificationDropdown"
                                style={{ minWidth: '360px', maxHeight: '480px', backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-default)' }}>
                                <li className="p-3 border-bottom d-flex align-items-center justify-content-between">
                                    <div className="fw-bold">Notifications</div>
                                    {unreadCount > 0 && (
                                        <button className="btn btn-sm btn-link text-primary p-0 small" onClick={() => notificationService.markAllRead().then(loadNotifications)}>
                                            Mark all read
                                        </button>
                                    )}
                                </li>
                                <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                                    {notifications.length > 0 ? notifications.slice(0, 10).map(notif => (
                                        <li key={notif._id} className={`p-3 border-bottom hover-bg-tertiary transition-all ${!notif.isRead ? 'bg-primary-subtle' : ''}`}>
                                            <div className="d-flex align-items-start gap-2">
                                                <div className="flex-grow-1">
                                                    <div className="small fw-bold mb-1">{notif.message}</div>
                                                    <div className="text-muted" style={{ fontSize: '0.65rem' }}>
                                                        {new Date(notif.createdAt).toLocaleString()}
                                                    </div>
                                                </div>
                                                {!notif.isRead && (
                                                    <button className="btn btn-sm btn-icon p-1" onClick={() => handleMarkRead(notif._id)} title="Mark as read">
                                                        <Check size={14} className="text-success" />
                                                    </button>
                                                )}
                                            </div>
                                        </li>
                                    )) : (
                                        <li className="p-5 text-center text-muted">
                                            <Bell size={32} className="opacity-25 mb-2" />
                                            <div className="small">No notifications yet</div>
                                        </li>
                                    )}
                                </div>
                            </ul>
                        </div>
                    </div>

                    <div className="vr mx-2 opacity-10 d-none d-md-block" style={{ height: '32px' }}></div>

                    {/* Authorized Identity Profile */}
                    <div className="dropdown">
                        <button
                            className="btn p-1 border-0 d-flex align-items-center gap-x-3 rounded-pill hover-bg-tertiary transition-all"
                            type="button"
                            id="userDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <div className="bg-primary text-white rounded-circle shadow-sm d-flex align-items-center justify-content-center fw-bold transition-all hover-scale"
                                style={{ width: '38px', height: '38px', fontSize: '0.8rem' }}>
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="text-start d-none d-sm-block pe-2">
                                <div className="fw-bold small lh-1 mb-1" style={{ color: 'var(--accent-primary)' }}>{user?.name || 'Authorized'}</div>
                                <div className="text-muted opacity-75 letter-spacing-1 fw-bold" style={{ fontSize: '0.65rem' }}>{role?.toUpperCase()} | LIVE</div>
                            </div>
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end shadow-premium border-0 mt-3 p-3 rounded-4 animate-scale-in"
                            aria-labelledby="userDropdown"
                            style={{ minWidth: '280px', backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-default)' }}>
                            <li className="p-3 mb-2 rounded-4 d-flex align-items-center gap-x-3" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}>
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <div className="overflow-hidden">
                                    <div className="fw-bold text-truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</div>
                                    <div className="small text-muted text-truncate">{user?.email}</div>
                                </div>
                            </li>

                            <li><hr className="dropdown-divider opacity-10" /></li>

                            <li>
                                <button className="dropdown-item rounded-3 py-2.5 d-flex align-items-center gap-x-3 transition-all">
                                    <User className="w-4 h-4 text-primary opacity-50 flex-shrink-0" />
                                    <div className="flex-grow-1">
                                        <div className="fw-bold small">Institutional Profile</div>
                                        <div className="text-muted opacity-75" style={{ fontSize: '0.65rem' }}>Personal identity and verification</div>
                                    </div>
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item rounded-3 py-2.5 d-flex align-items-center gap-x-3 transition-all" onClick={() => navigate(`/${role}/settings`)}>
                                    <Settings className="w-4 h-4 text-primary opacity-50 flex-shrink-0" />
                                    <div className="flex-grow-1">
                                        <div className="fw-bold small">System Security</div>
                                        <div className="text-muted opacity-75" style={{ fontSize: '0.65rem' }}>MFA and credential rotation</div>
                                    </div>
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item rounded-3 py-2.5 d-flex align-items-center gap-x-3 transition-all">
                                    <HelpCircle className="w-4 h-4 text-primary opacity-50 flex-shrink-0" />
                                    <div className="flex-grow-1">
                                        <div className="fw-bold small">Assistance Hub</div>
                                        <div className="text-muted opacity-75" style={{ fontSize: '0.65rem' }}>Documentation and support</div>
                                    </div>
                                </button>
                            </li>

                            <li><hr className="dropdown-divider opacity-10" /></li>

                            <li className="mt-2">
                                <button className="btn btn-outline-danger w-100 rounded-pill py-2.5 d-flex align-items-center justify-content-center gap-x-2 small fw-bold shadow-sm" onClick={handleLogout}>
                                    <LogOut className="w-4 h-4 flex-shrink-0" />
                                    <span>Terminate Session</span>
                                </button>
                            </li>

                            <div className="mt-3 text-center opacity-30 d-flex align-items-center justify-content-center gap-x-2" style={{ fontSize: '0.6rem' }}>
                                <ShieldCheck className="w-3 h-3 flex-shrink-0" />
                                <span className="fw-bold tracking-widest">ENCRYPTED END-TO-END</span>
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default TopNavbar;
