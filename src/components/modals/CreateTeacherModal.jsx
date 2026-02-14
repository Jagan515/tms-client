import { useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../../config/appConfig";
import AppModal from "../common/AppModal";
import FormInput from "../common/FormInput";
import { User, Mail, Send, Info, Phone } from "lucide-react";

function CreateTeacherModal({ show, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await axios.post(
                `${serverEndpoint}/developer/teachers/create`,
                formData,
                { withCredentials: true }
            );

            onSuccess();
            onClose();
            setFormData({ name: "", email: "", phone: "" });

        } catch (err) {
            console.error("Create teacher failed", err);
            setError(err.response?.data?.message || "Internal system error. Please contact infrastructure team.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppModal show={show} title="Provision New Instructor" onClose={onClose}>
            <div className="mb-4 d-flex align-items-center gap-3 p-3 rounded-4 bg-tertiary border-blue-subtle" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid rgba(79, 70, 229, 0.1)' }}>
                <div className="bg-primary-subtle text-primary p-2 rounded-circle">
                    <Info size={18} />
                </div>
                <div className="small text-secondary">
                    Newly created instructors will receive their access credentials via the registered email address instantly.
                </div>
            </div>

            <form onSubmit={handleSubmit} className="animate-fade-in">
                {error && (
                    <div className="alert alert-danger border-0 shadow-sm rounded-3 mb-4 small py-2 fw-medium" role="alert">
                        {error}
                    </div>
                )}

                <FormInput
                    label="Instructor Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={true}
                    placeholder="e.g. Professor Sarah Jenkins"
                    icon={User}
                />

                <FormInput
                    label="Institutional Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required={true}
                    placeholder="s.jenkins@academy.edu"
                    icon={Mail}
                />

                <FormInput
                    label="Contact Intelligence (Phone)"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required={true}
                    placeholder="+91 88888 88888"
                    icon={Phone}
                />

                <div className="d-flex flex-column gap-2 mt-5">
                    <button
                        type="submit"
                        className="btn btn-primary py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-lg"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="spinner-border spinner-border-sm" role="status"></div>
                        ) : (
                            <>
                                <Send size={18} />
                                <span>Create Account & Send Invite</span>
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        className="btn btn-link py-2 text-decoration-none text-muted small fw-bold"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Discard Setup
                    </button>
                </div>
            </form>
        </AppModal>
    );
}

export default CreateTeacherModal;
