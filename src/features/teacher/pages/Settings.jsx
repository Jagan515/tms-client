import { useState, useEffect } from "react";
import PageHeader from "../../../components/common/PageHeader";
import { useSelector } from "react-redux";
import teacherService from "../api/teacherService";
import FormInput from "../../../components/common/FormInput";
import SecuritySettings from "../../../components/profile/SecuritySettings";
import {
    User,
    Mail,
    Phone,
    Lock,
    Bell,
    ShieldCheck,
    Save,
    AlertCircle,
    Eye,
    EyeOff,
    ToggleLeft,
    ToggleRight,
    Settings as SettingsIcon,
    Smartphone,
    CreditCard,
    Megaphone,
    CheckSquare
} from "lucide-react";

function Settings() {
    const { user } = useSelector((state) => state.auth);
    const [profile, setProfile] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || ""
    });

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    const [emailPrefs, setEmailPrefs] = useState({
        masterToggle: true,
        attendanceEmails: true,
        marksEmails: true,
        feeEmails: true,
        announcementEmails: true
    });

    useEffect(() => {
        fetchEmailPrefs();
    }, []);

    const fetchEmailPrefs = async () => {
        try {
            const data = await teacherService.getEmailPreferences();
            if (data.success && data.emailPreferences) {
                setEmailPrefs(data.emailPreferences);
            }
        } catch (error) {
            console.error("Fetch email prefs failed", error);
        }
    };

    const handleEmailPrefsUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ type: '', text: '' });
        try {
            await teacherService.updateEmailPreferences(emailPrefs);
            setMsg({ type: 'success', text: 'Institutional telemetry preferences synchronized.' });
        } catch (error) {
            setMsg({ type: 'error', text: 'Synchronization failure. Verification required.' });
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ type: '', text: '' });
        try {
            await teacherService.updateProfile({
                name: profile.name,
                phone: profile.phone
            });
            setMsg({ type: 'success', text: 'Identity profiles updated successfully.' });
        } catch (error) {
            setMsg({ type: 'error', text: 'Profile update rejected by security layer.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 animate-fade-in" style={{ minHeight: '100vh' }}>
            <PageHeader title="System Preferences" subtitle="Configure identity profiles and institutional notifications" />

            {msg.text && (
                <div className={`alert border-0 shadow-sm animate-fade-in-down mb-4 d-flex align-items-center gap-3 py-3 rounded-4 bg-${msg.type === 'error' ? 'danger' : 'success'}-subtle text-${msg.type === 'error' ? 'danger' : 'success'}`} role="alert">
                    {msg.type === 'error' ? <AlertCircle size={20} /> : <ShieldCheck size={20} />}
                    <div className="small fw-bold">{msg.text}</div>
                    <button type="button" className="btn-close ms-auto" onClick={() => setMsg({ type: '', text: '' })}></button>
                </div>
            )}

            <div className="row g-5">
                {/* Identity & Credentials */}
                <div className="col-xl-7">
                    <div className="card-modern shadow-lg border-0 mb-5 overflow-hidden">
                        <div className="p-4 border-bottom bg-tertiary d-flex align-items-center gap-3" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <div className="bg-primary text-white p-2 rounded-3 shadow-sm">
                                <User size={20} />
                            </div>
                            <h5 className="mb-0 fw-bold">Identity & Professional Profile</h5>
                        </div>
                        <div className="p-5">
                            <form onSubmit={handleProfileUpdate}>
                                <div className="row g-4 mb-4">
                                    <div className="col-md-6">
                                        <FormInput label="Professional Title / Name" name="name" icon={User} value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} required />
                                    </div>
                                    <div className="col-md-6">
                                        <FormInput label="Direct Contact Line" name="phone" icon={Smartphone} value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="+91 98765 43210" />
                                    </div>
                                </div>
                                <div className="mb-5">
                                    <label className="form-label small fw-bold text-muted text-uppercase mb-2 px-1 letter-spacing-1">Authenticated Institutional Email</label>
                                    <div className="position-relative opacity-75">
                                        <Mail className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={18} />
                                        <input className="form-control ps-5 rounded-3 border-secondary-subtle bg-secondary" style={{ height: '48px', backgroundColor: 'var(--bg-secondary)', cursor: 'not-allowed' }} value={profile.email} disabled />
                                    </div>
                                    <div className="form-text mt-2 small text-muted opacity-75 d-flex align-items-center gap-1">
                                        <ShieldCheck size={12} />
                                        <span>Institutional email is verified and cannot be altered by users.</span>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary rounded-pill px-5 py-2.5 d-flex align-items-center gap-2 shadow-lg hover-lift" disabled={loading}>
                                    <Save size={18} />
                                    <span className="fw-bold">Synchronize Profile</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    <SecuritySettings />
                </div>

                {/* Automation & Alerts */}
                <div className="col-xl-5">
                    <div className="card-modern shadow-lg border-0 mb-5 overflow-hidden h-100">
                        <div className="p-4 border-bottom bg-tertiary d-flex align-items-center justify-content-center bg-tertiary gap-3" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <div className="bg-success text-white p-2 rounded-3 shadow-sm">
                                <Bell size={20} />
                            </div>
                            <h5 className="mb-0 fw-bold">Telemetry & Alert Automation</h5>
                        </div>
                        <div className="p-5">
                            <div className="alert-callout mb-5 p-4 rounded-4 bg-tertiary border border-dashed text-secondary small d-flex align-items-start gap-3" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                <AlertCircle size={20} className="mt-1 text-primary opacity-50" />
                                <div>
                                    <div className="fw-bold text-primary mb-1">Institutional Notification Protocol</div>
                                    <p className="mb-0 opacity-75">Configuring these settings determines which automated system status reports and telemetry updates you receive via secure transmission.</p>
                                </div>
                            </div>

                            <form onSubmit={handleEmailPrefsUpdate}>
                                <div className="form-check form-switch-modern p-4 rounded-4 bg-tertiary shadow-sm mb-5 transition-all d-flex align-items-center gap-4 border" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                    <div className="switch-wrapper">
                                        <input
                                            className="form-check-input ms-0 custom-switch"
                                            style={{ width: '50px', height: '26px' }}
                                            type="checkbox"
                                            id="masterToggle"
                                            checked={emailPrefs.masterToggle}
                                            onChange={e => setEmailPrefs({ ...emailPrefs, masterToggle: e.target.checked })}
                                        />
                                    </div>
                                    <div>
                                        <label className="form-check-label fw-bold d-block" htmlFor="masterToggle">
                                            Universal Telemetry Engine
                                        </label>
                                        <span className="text-muted small opacity-75">Switch all institutional communication modules</span>
                                    </div>
                                </div>

                                <div className={`d-flex flex-column gap-3 ${!emailPrefs.masterToggle ? 'opacity-30 pointer-events-none grayscale' : 'animate-fade-in'}`}>
                                    {[
                                        { id: 'attendanceEmails', label: 'Attendance Ledgers', icon: SettingsIcon },
                                        { id: 'marksEmails', label: 'Evaluation Metrics', icon: Trophy },
                                        { id: 'feeEmails', label: 'Financial Statements', icon: CreditCard },
                                        { id: 'announcementEmails', label: 'Broadcast Bulletins', icon: Megaphone },
                                    ].map(item => (
                                        <div key={item.id} className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-secondary hover-bg-tertiary transition-all border border-transparent hover-border-subtle" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="text-primary opacity-50"><item.icon size={18} /></div>
                                                <span className="small fw-semibold">{item.label}</span>
                                            </div>
                                            <div className="form-check form-switch m-0">
                                                <input
                                                    className="form-check-input"
                                                    style={{ width: '36px', height: '18px' }}
                                                    type="checkbox"
                                                    id={item.id}
                                                    disabled={!emailPrefs.masterToggle}
                                                    checked={emailPrefs[item.id]}
                                                    onChange={e => setEmailPrefs({ ...emailPrefs, [item.id]: e.target.checked })}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-5 pt-4 border-top">
                                    <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2" disabled={loading}>
                                        <ShieldCheck size={18} />
                                        <span>Synchronize Automation Delta</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

const Trophy = ({ size, className }) => <CheckSquare size={size} className={className} />;

export default Settings;
