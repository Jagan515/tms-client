import { useState } from "react";
import AppModal from "../../../components/common/AppModal";
import FormInput from "../../../components/common/FormInput";
import {
    FileText,
    Book,
    Hash,
    Activity,
    AlertCircle,
    CheckSquare,
    Send,
    X,
    Info,
    Calendar
} from "lucide-react";

function SubmitMarksModal({ show, onClose, onSubmit, loading }) {
    const [formData, setFormData] = useState({
        subject: "",
        unitName: "",
        marksObtained: "",
        totalMarks: "",
        examDate: new Date().toISOString().split('T')[0]
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!show) return null;

    return (
        <AppModal show={show} title="Academic Record Submission" onClose={onClose}>
            <form onSubmit={handleSubmit} className="animate-fade-in p-2">
                <div className="alert-callout mb-4 d-flex align-items-start gap-3 p-3 rounded-4 bg-primary-subtle border-primary-subtle text-primary" style={{ backgroundColor: 'rgba(79, 70, 229, 0.08)' }}>
                    <div className="bg-white p-1.5 rounded-circle shadow-sm d-flex align-items-center justify-content-center">
                        <Info className="w-4 h-4 flex-shrink-0" />
                    </div>
                    <div>
                        <div className="fw-bold small mb-1">Teacher Verification Required</div>
                        <p className="mb-0 small opacity-75" style={{ fontSize: '0.75rem' }}>Submitted school marks will be marked as PENDING until verified by your instructor.</p>
                    </div>
                </div>

                <div className="row g-4 mb-4">
                    <div className="col-md-6">
                        <FormInput
                            label="Subject Name"
                            name="subject"
                            icon={Book}
                            placeholder="e.g. Mathematics"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <FormInput
                            label="Unit / Exam Title"
                            name="unitName"
                            icon={Activity}
                            placeholder="e.g. Half Yearly Exam"
                            value={formData.unitName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="row g-4 mb-4">
                    <div className="col-md-6">
                        <FormInput
                            label="Marks Obtained"
                            type="number"
                            name="marksObtained"
                            icon={CheckSquare}
                            value={formData.marksObtained}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <FormInput
                            label="Full Marks (Total)"
                            type="number"
                            name="totalMarks"
                            icon={Hash}
                            value={formData.totalMarks}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="mb-5">
                    <FormInput
                        label="Date of Examination"
                        type="date"
                        name="examDate"
                        icon={Calendar}
                        value={formData.examDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="d-flex flex-column gap-2">
                    <button type="submit" className="btn btn-primary py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-lg hover-lift" disabled={loading}>
                        {loading ? (
                            <div className="spinner-border spinner-border-sm" role="status"></div>
                        ) : (
                            <>
                                <Send className="w-4.5 h-4.5 flex-shrink-0" />
                                <span>Submit for Verification</span>
                            </>
                        )}
                    </button>
                    <button type="button" className="btn btn-link py-2 text-decoration-none text-muted small fw-bold" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </form>
        </AppModal>
    );
}

export default SubmitMarksModal;
