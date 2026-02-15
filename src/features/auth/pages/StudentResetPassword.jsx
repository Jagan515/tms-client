import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../api/authService';
import FormInput from '../../../components/common/FormInput';
import { ShieldCheck, Lock, Key, Hash, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react';

const StudentResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Pre-fill regNo if passed from ForgotPassword
    const [registrationNumber, setRegistrationNumber] = useState(location.state?.registrationNumber || '');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState({ new: '', confirm: '' });
    const [showPasswords, setShowPasswords] = useState(false);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const validatePassword = (pass) => {
        // Basic check: 6 chars minimum for students? Or strong? 
        // Using same strong regex as other roles for consistency
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
            setError('Password must be 8+ chars with mix of types (Upper, Lower, Number, Special).');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await authService.resetPasswordStudent(registrationNumber, otp, password.new);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Invalid OTP or ID.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-body p-0 overflow-hidden">
                <div className="position-absolute top-0 start-50 translate-middle-x rounded-circle opacity-25"
                    style={{ width: '600px', height: '600px', background: 'radial-gradient(circle, var(--bs-primary) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }}></div>

                <div className="card rounded-4 shadow-premium border-0 p-5 text-center animate-scale-in position-relative" style={{ maxWidth: '480px', width: '100%', zIndex: 1 }}>
                    <div className="d-inline-flex p-3 rounded-circle bg-success shadow-lg mb-4 text-white mx-auto">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="fw-bold mb-3 tracking-tight">Access Restored</h2>
                    <p className="text-muted mb-4 px-3">
                        Your institutional identity has been secured with the new credentials.
                    </p>
                    <button onClick={() => navigate('/login')} className="btn btn-premium w-100 rounded-3 py-3 fw-bold shadow-sm">
                        Proceed to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-body p-0 overflow-hidden">
            <div className="position-absolute top-0 start-50 translate-middle-x rounded-circle opacity-25"
                style={{ width: '600px', height: '600px', background: 'radial-gradient(circle, var(--bs-primary) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }}></div>

            <div className="row justify-content-center w-100 m-0 position-relative" style={{ zIndex: 1 }}>
                <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4 p-3 p-md-4">

                    <div className="text-center mb-5 animate-fade-in">
                        <div className="d-inline-flex p-3 rounded-circle bg-primary bg-gradient shadow-lg mb-4 text-white">
                            <Key size={32} />
                        </div>
                        <h2 className="fw-bold mb-1 tracking-tight">Challenge Response</h2>
                        <p className="text-muted small px-4">Enter the OTP provided by your faculty advisor</p>
                    </div>

                    <div className="card rounded-4 shadow-premium border-0 overflow-hidden animate-scale-in">
                        <div className="card-body p-4 p-md-5">

                            {error && (
                                <div className="alert alert-danger rounded-3 border-0 small mb-4 py-3 d-flex align-items-center gap-2" role="alert">
                                    <ShieldCheck size={18} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <FormInput
                                        label="Registration ID"
                                        type="text"
                                        icon={Hash}
                                        value={registrationNumber}
                                        onChange={(e) => setRegistrationNumber(e.target.value)}
                                        required
                                        placeholder="e.g. REG-2024-001"
                                    />
                                </div>

                                <div className="mb-4">
                                    <FormInput
                                        label="One-Time Password (OTP)"
                                        type="text"
                                        icon={Key}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                        placeholder="6-digit code"
                                    />
                                </div>

                                <div className="mb-3">
                                    <FormInput
                                        label="New Password"
                                        type={showPasswords ? "text" : "password"}
                                        icon={Lock}
                                        value={password.new}
                                        onChange={(e) => setPassword({ ...password, new: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <FormInput
                                        label="Confirm Password"
                                        type={showPasswords ? "text" : "password"}
                                        icon={Lock}
                                        value={password.confirm}
                                        onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                                        required
                                    />
                                    <div className="d-flex justify-content-end mt-2">
                                        <button type="button" className="btn btn-link text-decoration-none small p-0 text-muted" onClick={() => setShowPasswords(!showPasswords)}>
                                            {showPasswords ? <EyeOff size={14} /> : <Eye size={14} />} {showPasswords ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-premium w-100 rounded-3 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm transition-all"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="spinner-border spinner-border-sm" role="status"></div>
                                    ) : (
                                        <>
                                            <span>Update Credentials</span>
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentResetPassword;
