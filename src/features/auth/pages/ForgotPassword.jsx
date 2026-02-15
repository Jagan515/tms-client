import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../api/authService';
import FormInput from '../../../components/common/FormInput';
import { Mail, ArrowRight, ArrowLeft, CheckCircle, ShieldCheck, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
    const [identifier, setIdentifier] = useState('');
    const [role, setRole] = useState('teacher');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authService.forgotPassword({ role, identifier });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        if (role === 'student') {
            return (
                <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-body p-0 overflow-hidden">
                    <div className="position-absolute top-0 start-50 translate-middle-x rounded-circle opacity-25"
                        style={{ width: '600px', height: '600px', background: 'radial-gradient(circle, var(--bs-primary) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }}></div>

                    <div className="card rounded-4 shadow-premium border-0 p-5 text-center animate-scale-in position-relative" style={{ maxWidth: '480px', width: '100%', zIndex: 1 }}>
                        <div className="d-inline-flex p-3 rounded-circle bg-warning shadow-lg mb-4 text-white mx-auto">
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="fw-bold mb-3 tracking-tight">Authorization Pending</h2>
                        <p className="text-muted mb-4 px-3">
                            A secure One-Time Password (OTP) has been dispatched to your Faculty Advisor for verification.
                        </p>
                        <button onClick={() => navigate('/student/reset-password', { state: { registrationNumber: identifier } })} className="btn btn-premium w-100 rounded-3 py-3 fw-bold shadow-sm">
                            Enter Secured OTP
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-body p-0 overflow-hidden">
                <div className="position-absolute top-0 start-50 translate-middle-x rounded-circle opacity-25"
                    style={{ width: '600px', height: '600px', background: 'radial-gradient(circle, var(--bs-primary) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }}></div>

                <div className="card rounded-4 shadow-premium border-0 p-5 text-center animate-scale-in position-relative" style={{ maxWidth: '480px', width: '100%', zIndex: 1 }}>
                    <div className="d-inline-flex p-3 rounded-circle bg-success shadow-lg mb-4 text-white mx-auto">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="fw-bold mb-3 tracking-tight">Transmission Sent</h2>
                    <p className="text-muted mb-4 px-3">
                        If an account exists for <span className="text-primary fw-bold">{identifier}</span>, a recovery link has been dispatched to the registered terminal.
                    </p>
                    <button onClick={() => navigate('/login')} className="btn btn-premium w-100 rounded-3 py-3 fw-bold shadow-sm">
                        Return to Portal
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-body p-0 overflow-hidden">
            {/* Background Decorative Element */}
            <div className="position-absolute top-0 start-50 translate-middle-x rounded-circle opacity-25"
                style={{ width: '600px', height: '600px', background: 'radial-gradient(circle, var(--bs-primary) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }}></div>

            <div className="row justify-content-center w-100 m-0 position-relative" style={{ zIndex: 1 }}>
                <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4 p-3 p-md-4">

                    {/* Header */}
                    <div className="text-center mb-5 animate-fade-in">
                        <div className="d-inline-flex p-3 rounded-circle bg-primary bg-gradient shadow-lg mb-4 text-white">
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="fw-bold mb-1 tracking-tight">Access Recovery</h2>
                        <p className="text-muted small px-4">Initiate institutional identity restoration protocol</p>
                    </div>

                    <div className="card rounded-4 shadow-premium border-0 overflow-hidden animate-scale-in">
                        <div className="card-body p-4 p-md-5">

                            {error && (
                                <div className="alert alert-danger rounded-3 border-0 small mb-4 py-3 d-flex align-items-center gap-2" role="alert">
                                    <AlertCircle size={18} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4 text-center">
                                    <label className="form-label small fw-bold text-muted text-uppercase tracking-wider mb-3 d-block">Infrastructure Role</label>
                                    <div className="d-flex gap-2">
                                        {['student', 'teacher', 'parent', 'developer'].map((r) => (
                                            <button
                                                key={r}
                                                type="button"
                                                className={`btn btn-sm flex-fill py-2 rounded-3 border transition-all ${role === r ? 'btn-primary shadow-sm fw-bold' : 'btn-outline-secondary border-opacity-25'}`}
                                                onClick={() => setRole(r)}
                                            >
                                                {r.charAt(0).toUpperCase() + r.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="form-text small mt-3 bg-tertiary-subtle p-2 rounded-2 text-muted">
                                        {role === 'student' ? 'Reset authorization requires faculty approval.' : 'Institutional identity verification required.'}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-muted mb-2">{role === 'student' ? 'Registration Identity' : 'Registered Email Identity'}</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-transparent border-end-0 text-muted ps-3">
                                            <Mail size={18} />
                                        </span>
                                        <input
                                            type={role === 'student' ? 'text' : 'email'}
                                            className="form-control form-control-lg border-start-0 ps-0"
                                            placeholder={role === 'student' ? 'e.g. REG-2024-001' : 'identity@tms.edu'}
                                            value={identifier}
                                            onChange={(e) => setIdentifier(e.target.value)}
                                            required
                                        />
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
                                            <span>Dispatch Reset Link</span>
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="text-center mt-5 pt-4 border-top">
                                <button onClick={() => navigate('/login')} className="btn btn-link text-muted text-decoration-none small fw-bold d-inline-flex align-items-center gap-2 hover-primary transition-all">
                                    <ArrowLeft size={16} /> Back to Authentication Portal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
