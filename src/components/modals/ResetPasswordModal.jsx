import { useState, useEffect } from "react";
import axios from "axios";
import { serverEndpoint } from "../../config/appConfig";
import AppModal from "../common/AppModal";
import FormInput from "../common/FormInput";
import { ShieldAlert, Mail, RefreshCcw, CheckCircle2 } from "lucide-react";

function ResetPasswordModal({ show, onClose, emailToReset }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (show && emailToReset) {
            setEmail(emailToReset);
        }
    }, [show, emailToReset]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage(null);

        try {
            await axios.post(
                `${serverEndpoint}/developer/users/reset-password`,
                { email },
                { withCredentials: true }
            );

            setMessage("Access credentials successfully regenerated. Transmission complete.");
            setTimeout(() => {
                onClose();
                setMessage(null);
            }, 2500);

        } catch (err) {
            console.error("Reset password failed", err);
            setError(err.response?.data?.message || "Security protocol failure. Verify administrative privileges.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppModal show={show} title="Security Protocol: Password Reset" onClose={onClose}>
            {!message ? (
                <form onSubmit={handleSubmit} className="animate-fade-in">
                    <div className="mb-4 d-flex align-items-start gap-3 p-3 rounded-4 bg-warning-subtle border-warning-subtle" style={{ backgroundColor: 'rgba(255, 193, 7, 0.05)', border: '1px solid rgba(255, 193, 7, 0.2)' }}>
                        <ShieldAlert size={22} className="text-warning mt-1" />
                        <div>
                            <div className="fw-bold text-warning small text-uppercase letter-spacing-1 mb-1">Warning</div>
                            <div className="small text-muted" style={{ lineHeight: '1.4' }}>
                                This action will immediately invalidate the current password for <strong>{email}</strong> and generate a temporary credential set.
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-danger border-0 shadow-sm rounded-3 mb-4 small py-2 fw-medium" role="alert">
                            {error}
                        </div>
                    )}

                    <FormInput
                        label="Target Account Email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required={true}
                        placeholder="verified.user@academy.edu"
                        icon={Mail}
                    />

                    <div className="d-flex flex-column gap-2 mt-5">
                        <button
                            type="submit"
                            className="btn btn-warning py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-lg hover-lift"
                            disabled={loading || !email}
                        >
                            {loading ? (
                                <div className="spinner-border spinner-border-sm" role="status"></div>
                            ) : (
                                <>
                                    <RefreshCcw size={18} />
                                    <span>Regenerate Credentials</span>
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            className="btn btn-link py-2 text-decoration-none text-muted small fw-bold"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Abort Operation
                        </button>
                    </div>
                </form>
            ) : (
                <div className="text-center py-4 animate-fade-in">
                    <div className="bg-success-subtle text-success p-3 rounded-circle d-inline-block mb-3">
                        <CheckCircle2 size={40} />
                    </div>
                    <h5 className="fw-bold mb-2">Operation Successful</h5>
                    <p className="text-muted small px-4">{message}</p>
                </div>
            )}

        </AppModal>
    );
}

export default ResetPasswordModal;
