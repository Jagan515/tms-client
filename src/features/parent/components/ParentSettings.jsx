import { useState } from "react";
import {
    User,
    Mail,
    Phone,
    Lock,
    Bell,
    Settings as SettingsIcon,
    ShieldCheck,
    Key,
    Smartphone,
    CreditCard,
    Trophy,
    CalendarCheck
} from "lucide-react";
import FormInput from "../../../components/common/FormInput";
import SecuritySettings from "../../../components/profile/SecuritySettings";

function ParentSettings({ user }) {
    const [notifications, setNotifications] = useState({
        feeReminders: true,
        attendanceAlerts: true,
        marksUpdates: true
    });

    const handleToggle = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="p-0 animate-fade-in">
            <div className="row g-4">
                {/* Profile Section */}
                <div className="col-md-6">
                    <div className="card-modern shadow-lg border-0 h-100 overflow-hidden">
                        <div className="p-4 border-bottom bg-tertiary d-flex align-items-center gap-x-3" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <div className="bg-primary text-white p-2 rounded-3 shadow-sm d-flex align-items-center justify-content-center">
                                <User className="w-5 h-5 flex-shrink-0" />
                            </div>
                            <h6 className="fw-bold mb-0">Guardian Identity Profile</h6>
                        </div>
                        <div className="p-5">
                            <form className="d-flex flex-column gap-3">
                                <FormInput label="Full Name" icon={User} value={user?.name || "Parent Name"} disabled />
                                <FormInput label="Authorized Email" icon={Mail} value={user?.email || "parent@example.com"} disabled />
                                <FormInput label="Emergency Contact" icon={Smartphone} value={user?.phone || "+91-9876543210"} disabled />
                                <div className="mt-4">
                                    <button className="btn btn-outline-primary rounded-pill px-4 py-2 small fw-bold shadow-sm d-flex align-items-center gap-x-2 border-dashed">
                                        <SettingsIcon className="w-4 h-4 flex-shrink-0" />
                                        <span>Request Identity Update</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Password & Security */}
                <div className="col-md-6">
                    <SecuritySettings />
                </div>

                {/* Notification Preferences */}
                <div className="col-12">
                    <div className="card-modern shadow-lg border-0 overflow-hidden">
                        <div className="p-4 border-bottom bg-tertiary d-flex align-items-center gap-x-3" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <div className="bg-success text-white p-2 rounded-3 shadow-sm d-flex align-items-center justify-content-center">
                                <Bell className="w-5 h-5 flex-shrink-0" />
                            </div>
                            <h6 className="fw-bold mb-0">Telemetry & Notification Automation</h6>
                        </div>
                        <div className="p-5">
                            <div className="row g-4 mb-5">
                                {[
                                    { key: 'feeReminders', label: 'Financial Due Reminders', desc: 'Secure alerts concerning tuition and institutional fees.', icon: CreditCard },
                                    { key: 'attendanceAlerts', label: 'Attendance Variance Alerts', desc: 'Instant transmission of daily attendance sessions.', icon: CalendarCheck },
                                    { key: 'marksUpdates', label: 'Academic Performance Reports', desc: 'Verification of scholar evaluation and grading metrics.', icon: Trophy },
                                ].map((item) => (
                                    <div key={item.key} className="col-lg-4">
                                        <div className="p-4 rounded-4 bg-tertiary border h-100 transition-all hover-shadow-sm d-flex flex-column" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                            <div className="d-flex align-items-start justify-content-between mb-3">
                                                <div className="p-2 bg-secondary rounded-3 text-primary shadow-sm d-flex align-items-center justify-content-center">
                                                    <item.icon className="w-5 h-5 flex-shrink-0" />
                                                </div>
                                                <div className="form-check form-switch m-0">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        style={{ width: '40px', height: '20px' }}
                                                        checked={notifications[item.key]}
                                                        onChange={() => handleToggle(item.key)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="fw-bold small text-secondary mb-1">{item.label}</div>
                                            <p className="text-muted mb-0" style={{ fontSize: '0.75rem', lineHeight: '1.5' }}>{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="btn btn-success rounded-pill px-5 py-2.5 fw-bold shadow-lg shadow-success d-flex align-items-center gap-x-2 hover-lift">
                                <ShieldCheck className="w-4.5 h-4.5 flex-shrink-0" />
                                <span>Synchronize Automation Suite</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ParentSettings;
