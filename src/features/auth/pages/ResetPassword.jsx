import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import authService from '../api/authService';
import FormInput from '../../../components/common/FormInput';
import { Lock, ShieldCheck, CheckSquare, Eye, EyeOff, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState({ new: '', confirm: '' });
    const [showPasswords, setShowPasswords] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const validatePassword = (pass) => {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(pass);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.new !== password.confirm) {
            setError('Passwords do not match');
            return;
        }

        if (!validatePassword(password.new)) {
            setError('Password must meet complexity requirements.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await authService.resetPassword(token, password.new);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Link may be expired.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="card shadow-lg border-0 p-5 text-center" style={{ maxWidth: '450px', width: '100%' }}>
                    <div className="mb-4 text-success">
                        <CheckCircle size={64} />
                    </div>
                    <h2 className="fw-bold mb-3">Password Reset!</h2>
                    <p className="text-muted mb-4">
                        Your password has been successfully updated. You can now login with your new credentials.
                    </p>
                    <Link to="/login" className="btn btn-primary w-100 rounded-pill fw-bold">
                        Proceed to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card shadow-lg border-0 overflow-hidden" style={{ maxWidth: '450px', width: '100%' }}>
                <div className="p-4 p-md-5">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold">Set New Password</h2>
                        <p className="text-muted small">Create a strong password for your account.</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger small py-2 mb-4 text-center border-0 bg-danger-subtle text-danger">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <FormInput
                                label="New Password"
                                type={showPasswords ? "text" : "password"}
                                icon={ShieldCheck}
                                value={password.new}
                                onChange={(e) => setPassword({ ...password, new: e.target.value })}
                                required
                            />
                            <div className="form-text small mt-1">
                                8+ chars, Upper, Lower, Number, Special
                            </div>
                        </div>

                        <div className="mb-4">
                            <FormInput
                                label="Confirm Password"
                                type={showPasswords ? "text" : "password"}
                                icon={CheckSquare}
                                value={password.confirm}
                                onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <button type="button" className="btn btn-link text-decoration-none small p-0 text-muted" onClick={() => setShowPasswords(!showPasswords)}>
                                {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />} {showPasswords ? 'Hide details' : 'Show details'}
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100 rounded-pill py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : <>Reset Password <Lock size={18} /></>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
