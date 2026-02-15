import { useState } from "react";
import SubmitMarksModal from "./SubmitMarksModal";
import {
    FileText,
    Plus,
    Trophy,
    School,
    CheckCircle2,
    Clock,
    Activity,
    ChevronRight,
    TrendingUp,
    ShieldCheck,
    AlertCircle,
    XCircle
} from "lucide-react";

function StudentMarks({ schoolMarks = [], tuitionMarks = [], onSubmitSchoolMarks }) {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data) => {
        setLoading(true);
        try {
            await onSubmitSchoolMarks(data);
            setShowModal(false);
        } catch (error) {
            console.error("Submission failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card-modern shadow-lg border-0 h-100 overflow-hidden bg-white animate-fade-in">
            <div className="p-4 border-bottom d-flex flex-wrap align-items-center justify-content-between gap-3 bg-tertiary" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="d-flex align-items-center gap-2">
                    <TrendingUp className="text-primary flex-shrink-0" size={20} />
                    <h6 className="fw-bold mb-0">Academic Performance</h6>
                </div>
                <button className="btn btn-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-2 shadow-sm hover-lift w-100 w-sm-auto justify-content-center" onClick={() => setShowModal(true)}>
                    <Plus size={14} />
                    <span className="fw-bold" style={{ fontSize: '0.75rem' }}>Submit School Marks</span>
                </button>
            </div>

            <div className="card-body p-0 overflow-auto" style={{ maxHeight: '420px' }}>
                <div className="list-group list-group-flush">

                    {/* Tuition Marks Section - Teacher Conducted */}
                    <div className="px-4 py-3 bg-tertiary-subtle border-bottom d-flex align-items-center gap-2" style={{ backgroundColor: 'rgba(79, 70, 229, 0.05)' }}>
                        <Trophy className="text-primary" size={16} />
                        <span className="small fw-bold text-muted text-uppercase letter-spacing-1">Tuition Assessments</span>
                    </div>
                    {tuitionMarks.length > 0 ? tuitionMarks.map((mark, i) => (
                        <div key={`t-${i}`} className="list-group-item d-flex justify-content-between align-items-center px-4 py-3 border-secondary-subtle hover-bg-tertiary transition-all">
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-2 bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center">
                                    <Activity className="flex-shrink-0" size={16} />
                                </div>
                                <div>
                                    <div className="fw-bold small text-secondary">{mark.subject}</div>
                                    <div className="text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                                        <span>{mark.unitName}</span>
                                        <span className="opacity-50">•</span>
                                        <span>{new Date(mark.examDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-end">
                                <div className="fw-bold text-primary" style={{ fontSize: '1rem' }}>{mark.marksObtained} <span className="opacity-50 fw-normal small">/ {mark.totalMarks}</span></div>
                                <div className={`badge rounded-pill mt-1 ${mark.percentage >= 75 ? 'bg-success' : 'bg-primary'}`} style={{ fontSize: '0.65rem' }}>
                                    {mark.percentage}%
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="p-4 text-center text-muted small opacity-50">No tuition marks recorded yet.</div>
                    )}

                    {/* School Marks Section - Student Submitted */}
                    <div className="px-4 py-3 bg-tertiary-subtle border-bottom border-top d-flex align-items-center gap-2" style={{ backgroundColor: 'rgba(107, 114, 128, 0.05)' }}>
                        <School className="text-secondary" size={16} />
                        <span className="small fw-bold text-muted text-uppercase letter-spacing-1">School Verifications</span>
                    </div>
                    {schoolMarks.length > 0 ? schoolMarks.map((mark, i) => (
                        <div key={`s-${i}`} className="list-group-item d-flex justify-content-between align-items-center px-4 py-3 border-secondary-subtle hover-bg-tertiary transition-all">
                            <div className="d-flex align-items-center gap-3">
                                <div className={`p-2 rounded-3 d-flex align-items-center justify-content-center ${mark.status === 'approved' ? 'bg-success-subtle text-success' : mark.status === 'pending' ? 'bg-warning-subtle text-warning' : 'bg-danger-subtle text-danger'}`}>
                                    {mark.status === 'approved' ? <CheckCircle2 size={16} /> : mark.status === 'pending' ? <Clock size={16} /> : <XCircle size={16} />}
                                </div>
                                <div>
                                    <div className="fw-bold small text-secondary">{mark.subject}</div>
                                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>{mark.unitName}</div>
                                </div>
                            </div>
                            <div className="text-end">
                                {mark.status === 'approved' ? (
                                    <>
                                        <div className="fw-bold text-success">{mark.marksObtained} <span className="opacity-50 fw-normal small">/ {mark.totalMarks}</span></div>
                                        <div className="badge bg-success-subtle text-success mt-1" style={{ fontSize: '0.6rem' }}>{mark.percentage}% VERIFIED</div>
                                    </>
                                ) : mark.status === 'pending' ? (
                                    <div className="badge bg-warning-subtle text-warning rounded-pill px-3 py-1 border border-warning-subtle" style={{ fontSize: '0.65rem' }}>
                                        AWAITING VALIDATION
                                    </div>
                                ) : (
                                    <div className="badge bg-danger-subtle text-danger rounded-pill px-3 py-1 border border-danger-subtle" style={{ fontSize: '0.65rem' }}>
                                        REJECTED
                                    </div>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="p-4 text-center text-muted small opacity-50">No school marks submitted yet.</div>
                    )}

                </div>
            </div>

            <div className="p-3 border-top bg-tertiary" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <button className="btn btn-link w-100 text-decoration-none text-muted small fw-bold d-flex align-items-center justify-content-center gap-2 hover-text-primary transition-all">
                    <span>View Comprehensive Transcript</span>
                    <ChevronRight size={14} />
                </button>
            </div>

            <SubmitMarksModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleSubmit}
                loading={loading}
            />

        </div>
    );
}

export default StudentMarks;
