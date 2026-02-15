import { useState, useEffect } from "react";
import PageHeader from "../../../components/common/PageHeader";
import { useSelector } from "react-redux";
import FormInput from "../../../components/common/FormInput";
import notificationService from "../../common/api/notificationService";
import {
    User,
    Mail,
    Smartphone,
    ShieldCheck,
    Bell,
    Check,
    Clock,
    Info,
    AlertCircle
} from "lucide-react";

function Settings() {
    const { user } = useSelector((state) => state.auth);
    const [profile] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || ""
    });

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                // Fetch last 100 notifications for history
                const data = await notificationService.getNotifications(100);
                // Ensure we extract the array correctly based on API response structure
                setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
            } catch (error) {
                console.error("Failed to fetch notification history", error);
                setNotifications([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllRead();
            // Refresh local state to show all as read
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Failed to mark all read", error);
        }
    };

    const getIconForType = (type) => {
        switch (type) {
            case 'attendance': return <Clock size={16} className="text-warning" />;
            case 'marks': return <ShieldCheck size={16} className="text-success" />;
            case 'fee': return <AlertCircle size={16} className="text-danger" />;
            case 'announcement': return <Info size={16} className="text-info" />;
            default: return <Bell size={16} className="text-primary" />;
        }
    };

    return (
        <div className="p-4 animate-fade-in" style={{ minHeight: '100vh' }}>
            <PageHeader title="System Preferences" subtitle="View your identity profile and notification history" />

            <div className="row g-5">
                {/* Identity & Credentials */}
                <div className="col-12 col-xl-6">
                    <div className="card-modern shadow-lg border-0 mb-5 overflow-hidden h-100">
                        <div className="p-4 border-bottom bg-tertiary d-flex align-items-center gap-3" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <div className="bg-primary text-white p-2 rounded-3 shadow-sm">
                                <User size={20} />
                            </div>
                            <h5 className="mb-0 fw-bold">Identity & Professional Profile</h5>
                        </div>
                        <div className="p-5">
                            <div className="row g-4 mb-4">
                                <div className="col-md-6">
                                    <FormInput
                                        label="Professional Title / Name"
                                        name="name"
                                        icon={User}
                                        value={profile.name}
                                        readOnly
                                        disabled
                                    />
                                </div>
                                <div className="col-md-6">
                                    <FormInput
                                        label="Direct Contact Line"
                                        name="phone"
                                        icon={Smartphone}
                                        value={profile.phone}
                                        placeholder="+91 98765 43210"
                                        readOnly
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="mb-0">
                                <label className="form-label small fw-bold text-muted text-uppercase mb-2 px-1 letter-spacing-1">Authenticated Institutional Email</label>
                                <div className="position-relative opacity-75">
                                    <Mail className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={18} />
                                    <input className="form-control ps-5 rounded-3 border-secondary-subtle bg-secondary" style={{ height: '48px', backgroundColor: 'var(--bg-secondary)', cursor: 'not-allowed' }} value={profile.email} disabled />
                                </div>
                                <div className="form-text mt-2 small text-muted opacity-75 d-flex align-items-center gap-1">
                                    <ShieldCheck size={12} />
                                    <span>Institutional email is verified and cannot be altered.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notification History */}
                <div className="col-12 col-xl-6">
                    <div className="card-modern shadow-lg border-0 mb-5 overflow-hidden h-100">
                        <div className="p-4 border-bottom bg-tertiary d-flex align-items-center justify-content-between" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-warning text-dark p-2 rounded-3 shadow-sm">
                                    <Bell size={20} />
                                </div>
                                <h5 className="mb-0 fw-bold">System Notifications & Telemetry</h5>
                            </div>
                            <button onClick={handleMarkAllRead} className="btn btn-sm btn-link text-decoration-none fw-bold d-flex align-items-center gap-1">
                                <Check size={16} /> Mark All Read
                            </button>
                        </div>
                        <div className="p-0" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            {loading ? (
                                <div className="p-5 text-center text-muted">Loading telemetry...</div>
                            ) : notifications.length === 0 ? (
                                <div className="p-5 text-center text-muted opacity-50">
                                    <Bell size={48} className="mb-3" />
                                    <p>No system notifications recorded in the last 24 hours.</p>
                                </div>
                            ) : (
                                <ul className="list-group list-group-flush">
                                    {notifications.map((notif) => (
                                        <li key={notif._id} className={`list-group-item p-4 d-flex align-items-start gap-3 border-bottom-dashed ${!notif.isRead ? 'bg-primary-subtle' : ''}`}>
                                            <div className={`mt-1 flex-shrink-0 p-2 rounded-circle ${!notif.isRead ? 'bg-white shadow-sm' : 'bg-secondary-subtle'}`}>
                                                {getIconForType(notif.type)}
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className={`mb-1 ${!notif.isRead ? 'fw-bold text-primary' : 'text-dark'}`}>
                                                    {notif.message}
                                                </div>
                                                <div className="d-flex align-items-center gap-2 small text-muted">
                                                    <span className="text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>{notif.type}</span>
                                                    <span>•</span>
                                                    <span>{new Date(notif.createdAt).toLocaleString()}</span>
                                                </div>
                                            </div>
                                            {!notif.isRead && <div className="badge bg-primary rounded-circle p-1" style={{ width: 8, height: 8 }}></div>}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
