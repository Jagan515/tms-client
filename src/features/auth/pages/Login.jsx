import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { login, clearError } from "../redux/authSlice";
import { Mail, Landmark, Lock, ShieldCheck, UserCheck, Users, GraduationCap, ArrowRight } from "lucide-react";

const RoleSelector = ({ id, label, icon: RoleIcon, active, onSelect }) => (
    <div className="col-6">
        <button
            type="button"
            className={`role-card rounded-4 p-3 text-center h-100 w-100 ${active ? 'active' : ''}`}
            onClick={() => onSelect(id)}
            aria-pressed={active}
            aria-label={`Select ${label} role`}
        >
            <div className="icon-box rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center">
                <RoleIcon className="w-5 h-5 flex-shrink-0" />
            </div>
            <div className="small fw-bold">{label}</div>
        </button>
    </div>
);

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { isAuthenticated, role: authRole, error, loading } = useSelector((state) => state.auth);

    const [role, setRole] = useState('student');
    const isStudent = role === 'student';

    const [formData, setFormData] = useState({
        email: "",
        registrationNumber: "",
        password: ""
    });

    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname;
            if (from) {
                navigate(from, { replace: true });
            } else {
                if (authRole === 'developer') navigate("/developer/dashboard");
                else if (authRole === 'teacher') navigate("/teacher/dashboard");
                else if (authRole === 'student') navigate("/student/dashboard");
                else if (authRole === 'parent') navigate("/parent/dashboard");
                else navigate("/login");
            }
        }
    }, [isAuthenticated, authRole, navigate, location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: "" }));
        }
        if (error) dispatch(clearError());
    };

    const handleRoleChange = (selectedRole) => {
        setRole(selectedRole);
        setValidationErrors({});
        if (error) dispatch(clearError());
        setFormData({
            email: "",
            registrationNumber: "",
            password: formData.password // Preserve password
        });
    };

    const validate = () => {
        let isValid = true;
        let newErrors = {};

        if (isStudent) {
            if (!formData.registrationNumber) {
                newErrors.registrationNumber = "Registration Number is required";
                isValid = false;
            }
        } else {
            if (!formData.email) {
                newErrors.email = "Email is required";
                isValid = false;
            }
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
            isValid = false;
        }

        setValidationErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const password = (formData.password || '').trim();
            const credentials = isStudent
                ? { password, registrationNumber: (formData.registrationNumber || '').trim() }
                : { password, email: (formData.email || '').trim().toLowerCase() };
            dispatch(login({ role, credentials }));
        }
    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-body p-0">
            {/* Background Decorative Element */}
            <div className="position-absolute top-0 start-50 translate-middle-x rounded-circle opacity-25"
                style={{ width: '600px', height: '600px', background: 'radial-gradient(circle, var(--bs-primary) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }}></div>

            <div className="row justify-content-center w-100 m-0 position-relative" style={{ zIndex: 1 }}>
                <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4 p-3 p-md-4">

                    {/* Header */}
                    <div className="text-center mb-5 animate-fade-in">
                        <div className="d-inline-flex p-3 rounded-circle bg-primary bg-gradient shadow-lg mb-4 text-white">
                            <GraduationCap className="w-8 h-8 flex-shrink-0" />
                        </div>
                        <h2 className="fw-bold mb-1">Portal Authentication</h2>
                        <p className="text-muted small">Access your institutional workspace below</p>
                    </div>

                    {/* Login Card */}
                    <div className="card rounded-4 shadow-premium border-0 overflow-hidden animate-scale-in">
                        <div className="card-body p-4 p-md-5">

                            {error && (
                                <div className="alert alert-danger rounded-3 border-0 small mb-4 py-2" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Role Selection */}
                                <div className="row g-3">
                                    <RoleSelector id="student" label="Student" icon={UserCheck} active={isStudent} onSelect={handleRoleChange} />
                                    <RoleSelector id="teacher" label="Teacher" icon={Users} active={role === 'teacher'} onSelect={handleRoleChange} />
                                    <RoleSelector id="parent" label="Parent" icon={Landmark} active={role === 'parent'} onSelect={handleRoleChange} />
                                    <RoleSelector id="developer" label="Developer" icon={ShieldCheck} active={role === 'developer'} onSelect={handleRoleChange} />
                                </div>

                                {/* Identity Input - Student: Registration Number only; Others: Email */}
                                <div className="mt-5 mb-3">
                                    <label className="form-label small fw-bold text-muted" htmlFor="identifier">
                                        {isStudent ? 'Registration Number' : 'Email'}
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-transparent border-end-0 text-muted ps-3">
                                            {isStudent ? <Landmark className="w-5 h-5 flex-shrink-0" /> : <Mail className="w-5 h-5 flex-shrink-0" />}
                                        </span>
                                        <input
                                            type={isStudent ? 'text' : 'email'}
                                            name={isStudent ? 'registrationNumber' : 'email'}
                                            id="identifier"
                                            inputMode={isStudent ? 'numeric' : 'email'}
                                            autoComplete={isStudent ? 'off' : 'email'}
                                            className={`form-control form-control-lg border-start-0 ps-0 ${validationErrors.registrationNumber || validationErrors.email ? 'is-invalid' : ''}`}
                                            placeholder={isStudent ? 'e.g. 022501' : 'e.g. teacher@school.com'}
                                            value={isStudent ? formData.registrationNumber : formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {isStudent && (
                                        <div className="form-text small text-muted mt-1">Use your registration number only — not email.</div>
                                    )}
                                    {(validationErrors.registrationNumber || validationErrors.email) && (
                                        <div className="invalid-feedback d-block small mt-1">
                                            {validationErrors.registrationNumber || validationErrors.email}
                                        </div>
                                    )}
                                </div>

                                {/* Password Input */}
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between">
                                        <label className="form-label small fw-bold text-muted" htmlFor="password">Security Key</label>
                                    </div>
                                    <div className="input-group">
                                        <span className="input-group-text bg-transparent border-end-0 text-muted ps-3">
                                            <Lock className="w-5 h-5 flex-shrink-0" />
                                        </span>
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            className={`form-control form-control-lg border-start-0 ps-0 ${validationErrors.password ? 'is-invalid' : ''}`}
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {validationErrors.password && (
                                        <div className="invalid-feedback d-block small mt-1">
                                            {validationErrors.password}
                                        </div>
                                    )}
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg w-100 rounded-3 py-3 d-flex align-items-center justify-content-center gap-2"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="spinner-border spinner-border-sm" role="status"></div>
                                    ) : (
                                        <>
                                            <span className="fw-bold">Authenticate Session</span>
                                            <ArrowRight className="w-5 h-5 flex-shrink-0" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    <p className="text-center mt-4 small text-muted">
                        Secured by nomadic enterprise infrastructure.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
