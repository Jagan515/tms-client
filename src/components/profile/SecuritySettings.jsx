import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, AlertCircle, CheckSquare, Eye, EyeOff } from 'lucide-react';
import authService from '../../features/auth/api/authService'; // Adjust path as needed
import FormInput from '../common/FormInput'; // Adjust path
// import ConfirmationModal from '../common/ConfirmationModal'; // If needed for email change warning

const SecuritySettings = () => {
    const [password, setPassword] = useState({ current: "", new: "", confirm: "" });
    const [showPasswords, setShowPasswords] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    // Password Policy Check (Frontend)
    const validatePassword = (pass) => {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(pass);
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if (password.new !== password.confirm) {
            setMsg({ type: 'error', text: 'New passwords do not match.' });
            return;
        }

        if (!validatePassword(password.new)) {
            setMsg({ type: 'error', text: 'Password must be 8+ chars, with uppercase, lowercase, number, and special char.' });
            return;
        }

        setLoading(true);
        setMsg({ type: '', text: '' });

        try {
            await authService.changePassword({
                currentPassword: password.current,
                newPassword: password.new
            });
            setMsg({ type: 'success', text: 'Password updated successfully.' });
            setPassword({ current: "", new: "", confirm: "" });
        } catch (error) {
            console.error("Change Password Error:", error);
            setMsg({ type: 'error', text: error.response?.data?.message || 'Failed to update password.' });
        } finally {
            setLoading(false);
        }
    };

    const [isChangingEmail, setIsChangingEmail] = useState(false);
    const [emailForm, setEmailForm] = useState({ newEmail: '', currentPassword: '' });

    const handleEmailChangeSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ type: '', text: '' });
        try {
            await authService.requestEmailChange(emailForm);
            setMsg({ type: 'success', text: 'Verification link sent to new email. Please check your inbox.' });
            setIsChangingEmail(false);
            setEmailForm({ newEmail: '', currentPassword: '' });
        } catch (error) {
            setMsg({ type: 'error', text: error.response?.data?.message || 'Failed to initiate email change.' });
        } finally {
            setLoading(false);
        }
    };

    // Placeholder for Email Change Logic
    // const handleEmailChange = ...

    return (
        <div className="card-modern shadow-lg border-0 overflow-hidden h-100">
            <div className="p-4 border-bottom bg-tertiary d-flex align-items-center gap-x-3" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="bg-warning text-dark p-2 rounded-3 shadow-sm d-flex align-items-center justify-content-center">
                    <Lock className="w-5 h-5 flex-shrink-0" />
                </div>
                <h5 className="mb-0 fw-bold">Credential Security</h5>
            </div>

            <div className="p-5">
                {msg.text && (
                    <div className={`alert border-0 shadow-sm mb-4 d-flex align-items-center gap-x-3 py-3 rounded-4 bg-${msg.type === 'error' ? 'danger' : 'success'}-subtle text-${msg.type === 'error' ? 'danger' : 'success'}`} role="alert">
                        {msg.type === 'error' ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <ShieldCheck className="w-5 h-5 flex-shrink-0" />}
                        <div className="small fw-bold">{msg.text}</div>
                        <button type="button" className="btn-close ms-auto" onClick={() => setMsg({ type: '', text: '' })}></button>
                    </div>
                )}

                <form onSubmit={handlePasswordUpdate}>
                    <div className="mb-4">
                        <FormInput
                            label="Current Password"
                            type={showPasswords ? "text" : "password"}
                            icon={Lock}
                            value={password.current}
                            onChange={e => setPassword({ ...password, current: e.target.value })}
                            required
                        />
                    </div>
                    <div className="row g-4 mb-4">
                        <div className="col-md-6">
                            <FormInput
                                label="New Password"
                                type={showPasswords ? "text" : "password"}
                                icon={ShieldCheck}
                                value={password.new}
                                onChange={e => setPassword({ ...password, new: e.target.value })}
                                required
                            />
                            <div className="form-text small mt-1">
                                8+ chars, Upper, Lower, Number, Special
                            </div>
                        </div>
                        <div className="col-md-6">
                            <FormInput
                                label="Confirm New Password"
                                type={showPasswords ? "text" : "password"}
                                icon={CheckSquare}
                                value={password.confirm}
                                onChange={e => setPassword({ ...password, confirm: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <button type="submit" className="btn btn-warning rounded-pill px-5 py-2.5 d-flex align-items-center gap-x-2 shadow-lg hover-lift" disabled={loading}>
                            {loading ? <span className="spinner-border spinner-border-sm" aria-hidden="true"></span> : <Lock className="w-4.5 h-4.5 flex-shrink-0" />}
                            <span className="fw-bold">{loading ? 'Updating...' : 'Update Password'}</span>
                        </button>
                        <button type="button" className="btn btn-link text-muted text-decoration-none small fw-bold d-flex align-items-center gap-x-2 p-0" onClick={() => setShowPasswords(!showPasswords)}>
                            {showPasswords ? <EyeOff className="w-4.5 h-4.5 flex-shrink-0" /> : <Eye className="w-4.5 h-4.5 flex-shrink-0" />}
                            <span>{showPasswords ? 'Hide' : 'Show'}</span>
                        </button>
                    </div>
                </form>

                <hr className="my-5" />

                {/* Email Change Section (Placeholder/Future) */}
                {/* Email Change Section */}
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <h6 className="fw-bold mb-1">Email Address</h6>
                        <p className="small text-muted mb-0">Update your email address securely.</p>
                    </div>
                    {!isChangingEmail && (
                        <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setIsChangingEmail(true)}>
                            Change Email
                        </button>
                    )}
                </div>

                {isChangingEmail && (
                    <form onSubmit={handleEmailChangeSubmit} className="mt-4 p-4 rounded-4 bg-tertiary border border-dashed animate-fade-in" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                        <div className="mb-3">
                            <FormInput
                                label="New Email Address"
                                type="email"
                                icon={Mail}
                                value={emailForm.newEmail}
                                onChange={e => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <FormInput
                                label="Current Password (for verification)"
                                type="password"
                                icon={Lock}
                                value={emailForm.currentPassword}
                                onChange={e => setEmailForm({ ...emailForm, currentPassword: e.target.value })}
                                required
                            />
                        </div>
                        <div className="d-flex align-items-center gap-x-3">
                            <button type="submit" className="btn btn-primary rounded-pill px-4 shadow-sm" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Verification Link'}
                            </button>
                            <button type="button" className="btn btn-link text-muted text-decoration-none" onClick={() => setIsChangingEmail(false)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

            </div>
        </div>
    );
};

export default SecuritySettings;
