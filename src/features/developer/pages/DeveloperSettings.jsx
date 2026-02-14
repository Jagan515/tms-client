import { useState } from "react";
import PageHeader from "../../../components/common/PageHeader";
import { useSelector } from "react-redux";
import FormInput from "../../../components/common/FormInput";
import {
    User,
    Mail,
    Lock,
    ShieldCheck,
    AlertCircle,
    Eye,
    EyeOff,
    CheckSquare
} from "lucide-react";
import SecuritySettings from "../../../components/profile/SecuritySettings";

function DeveloperSettings() {
    const { user } = useSelector((state) => state.auth);

    // Developer profile is read-only for now as per backend capabilities
    const profile = {
        name: user?.name || "",
        email: user?.email || "",
        role: "System Administrator"
    };

    const [msg, setMsg] = useState({ type: '', text: '' });


    return (
        <div className="p-4 animate-fade-in" style={{ minHeight: '100vh' }}>
            <PageHeader title="System Configuration" subtitle="Administrator identity and security protocols" />

            {msg.text && (
                <div className={`alert border-0 shadow-sm animate-fade-in-down mb-4 d-flex align-items-center gap-3 py-3 rounded-4 bg-${msg.type === 'error' ? 'danger' : 'success'}-subtle text-${msg.type === 'error' ? 'danger' : 'success'}`} role="alert">
                    {msg.type === 'error' ? <AlertCircle size={20} /> : <ShieldCheck size={20} />}
                    <div className="small fw-bold">{msg.text}</div>
                    <button type="button" className="btn-close ms-auto" onClick={() => setMsg({ type: '', text: '' })}></button>
                </div>
            )}

            <div className="row g-5">
                {/* Identity Profile (Read-Only) */}
                <div className="col-xl-6">
                    <div className="card-modern shadow-lg border-0 mb-5 overflow-hidden h-100">
                        <div className="p-4 border-bottom bg-tertiary d-flex align-items-center gap-3" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <div className="bg-primary text-white p-2 rounded-3 shadow-sm">
                                <User size={20} />
                            </div>
                            <h5 className="mb-0 fw-bold">Admin Identity Profile</h5>
                        </div>
                        <div className="p-5">
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted text-uppercase mb-2 px-1">Administrator Name</label>
                                <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-tertiary border" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                    <User className="text-primary" size={20} />
                                    <span className="fw-bold">{profile.name}</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted text-uppercase mb-2 px-1">Authenticated Email</label>
                                <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-tertiary border" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                    <Mail className="text-primary" size={20} />
                                    <span className="fw-bold">{profile.email}</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted text-uppercase mb-2 px-1">System Role</label>
                                <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-tertiary border" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                    <ShieldCheck className="text-success" size={20} />
                                    <span className="fw-bold text-success">Root Administrator</span>
                                </div>
                            </div>
                            <div className="alert alert-info border-0 bg-info-subtle text-info-emphasis d-flex align-items-center gap-3 rounded-3 mt-4">
                                <AlertCircle size={18} />
                                <span className="small">Identity details are managed by the core infrastructure team. Contact support for modifications.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Management */}
                <div className="col-xl-6">
                    <SecuritySettings />

                    {/* New Recovery Configuration Section */}
                    <div className="card-modern shadow-lg border-0 mt-5 overflow-hidden animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div className="p-4 border-bottom bg-tertiary d-flex align-items-center gap-3" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <div className="bg-info text-white p-2 rounded-3 shadow-sm">
                                <ShieldCheck size={20} />
                            </div>
                            <h5 className="mb-0 fw-bold">System Access Recovery</h5>
                        </div>
                        <div className="p-4">
                            <p className="small text-muted mb-4">
                                Authentication recovery protocols have been migrated from the public portal to this secure administrative cluster.
                            </p>

                            <div className="bg-tertiary rounded-3 p-3 border border-dashed mb-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                <div className="d-flex align-items-start gap-3">
                                    <AlertCircle className="text-warning mt-1" size={20} />
                                    <div>
                                        <h6 className="small fw-bold mb-1 uppercase">Recovery Protocol Alpha</h6>
                                        <p className="small text-muted mb-0">
                                            Password reset links are only dispatchable via internal administrative terminals. External recovery attempts are now restricted.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="d-grid gap-3">
                                <a href="/forgot-password" className="btn btn-outline-primary rounded-3 py-2.5 d-flex align-items-center justify-content-center gap-2 fw-bold">
                                    <Lock size={18} />
                                    <span>Initialize Recovery Sequence</span>
                                </a>
                                <p className="text-center x-small text-muted mb-0">
                                    Secure URL: <code className="text-primary">/forgot-password</code>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default DeveloperSettings;
