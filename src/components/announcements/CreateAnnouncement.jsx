import { useState } from "react";
import { Send, Layout, Type, Users, Info } from "lucide-react";
import FormInput from "../common/FormInput";

function CreateAnnouncement({ onSubmit, onCancel, loading }) {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        targetAudience: "all"
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="animate-fade-in">
            <div className="mb-4 d-flex align-items-center gap-3 p-3 rounded-4 bg-tertiary border-blue-subtle" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid rgba(79, 70, 229, 0.1)' }}>
                <div className="bg-primary-subtle text-primary p-2 rounded-circle">
                    <Info size={18} />
                </div>
                <div className="small text-secondary">
                    Your broadcast will be immediately visible on the digital bulletin board of the targeted recipients.
                </div>
            </div>

            <FormInput
                label="Announcement Headline"
                name="title"
                placeholder="e.g. Annual Cultural Symposium Details"
                value={formData.title}
                onChange={handleChange}
                required
                icon={Type}
            />

            <div className="mb-4">
                <label className="form-label small fw-bold text-muted text-uppercase mb-2 px-1 letter-spacing-1">Detailed Message</label>
                <div className="position-relative">
                    <Layout className="position-absolute top-0 mt-3 ms-3 text-muted opacity-50" size={18} />
                    <textarea
                        className="form-control ps-5 py-3 rounded-3 border-secondary-subtle bg-tertiary-hover transition-all"
                        name="content"
                        rows="5"
                        placeholder="Compose your institutional message here..."
                        value={formData.content}
                        onChange={handleChange}
                        required
                        style={{
                            backgroundColor: 'var(--bg-tertiary)',
                            borderColor: 'var(--border-default)',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem'
                        }}
                    ></textarea>
                </div>
            </div>

            <div className="mb-5">
                <label className="form-label small fw-bold text-muted text-uppercase mb-2 px-1 letter-spacing-1">Target Distribution</label>
                <div className="position-relative">
                    <Users className="position-absolute top-50 translate-middle-y ms-3 text-primary opacity-50" size={18} />
                    <select
                        className="form-select ps-5 py-2.5 rounded-3 border-secondary-subtle bg-tertiary-hover transition-all"
                        name="targetAudience"
                        value={formData.targetAudience}
                        onChange={handleChange}
                        style={{
                            backgroundColor: 'var(--bg-tertiary)',
                            borderColor: 'var(--border-default)',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem'
                        }}
                    >
                        <option value="all">Consolidated (Students & Guardians)</option>
                        <option value="students">Scholars Only</option>
                        <option value="parents">Guardians Only</option>
                    </select>
                </div>
            </div>

            <div className="d-flex flex-column gap-2">
                <button
                    type="submit"
                    className="btn btn-primary py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-lg hover-lift"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="spinner-border spinner-border-sm" role="status"></div>
                    ) : (
                        <>
                            <Send size={18} />
                            <span>Authorize Broadcast</span>
                        </>
                    )}
                </button>
                <button
                    type="button"
                    className="btn btn-link py-2 text-decoration-none text-muted small fw-bold"
                    onClick={onCancel}
                >
                    Discard Draft
                </button>
            </div>

        </form>
    );
}

export default CreateAnnouncement;
