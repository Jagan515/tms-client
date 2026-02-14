import AppModal from "../../../../components/common/AppModal";
import {
    User,
    Hash,
    BookOpen,
    Layers,
    CreditCard,
    Calendar,
    Mail,
    Phone,
    ShieldAlert,
    ExternalLink,
    Contact
} from "lucide-react";

function StudentDetailModal({ show, student, onClose }) {
    if (!student) return null;

    return (
        <AppModal show={show} title="Scholar Identity Dossier" onClose={onClose}>
            <div className="animate-fade-in">
                <div className="text-center mb-5 pt-3">
                    <div className="position-relative d-inline-block mb-4">
                        <div className="avatar-preview rounded-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-xl mx-auto" style={{ width: 80, height: 80, fontSize: 32, fontWeight: '800' }}>
                            {student.name.charAt(0)}
                        </div>
                        <div className="position-absolute bottom-0 end-0 bg-success text-white p-1 rounded-circle border border-white shadow-sm d-flex align-items-center justify-content-center" style={{ width: 24, height: 24 }}>
                            <ShieldAlert size={14} />
                        </div>
                    </div>
                    <h4 className="fw-bold mb-1 tracking-tight">{student.name}</h4>
                    <div className="d-flex align-items-center justify-content-center gap-2 text-muted small opacity-75">
                        <Hash size={14} />
                        <span className="fw-bold">{student.regNo || 'VERIFICATION_PENDING'}</span>
                    </div>
                </div>

                <div className="grid-details row g-3 mb-5">
                    {[
                        { label: 'Classification', value: `${student.class}th Grade`, icon: BookOpen },
                        { label: 'Institutional Batch', value: student.batchName || 'Unassigned', icon: Layers },
                        { label: 'Evaluation Tier', value: `₹${student.monthlyFee?.toLocaleString()}`, icon: CreditCard },
                        { label: 'Enrollment Date', value: student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A', icon: Calendar },
                    ].map((item, idx) => (
                        <div key={idx} className="col-6">
                            <div className="p-3 rounded-4 bg-tertiary border border-transparent hover-border-subtle transition-all h-100" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                <div className="d-flex align-items-center gap-2 text-primary opacity-50 mb-2">
                                    <item.icon size={16} />
                                    <span className="small fw-bold text-uppercase letter-spacing-1" style={{ fontSize: '0.6rem' }}>{item.label}</span>
                                </div>
                                <div className="fw-bold text-secondary small">{item.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="parent-section bg-tertiary rounded-4 p-4 border mb-5" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <div className="d-flex align-items-center gap-2 mb-4 text-muted">
                        <Contact size={18} className="text-primary" />
                        <h6 className="fw-bold small text-uppercase mb-0 letter-spacing-1">Guardian Liaison Profile</h6>
                    </div>
                    <div className="d-flex flex-column gap-3">
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-2 bg-secondary rounded-3 text-secondary shadow-sm">
                                <User size={18} />
                            </div>
                            <div className="fw-bold small">{student.parentName || 'Authorized Guardian'}</div>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-2 bg-secondary rounded-3 text-secondary shadow-sm">
                                <Mail size={18} />
                            </div>
                            <div className="small text-muted text-truncate">{student.parentEmail}</div>
                            <a href={`mailto:${student.parentEmail}`} className="ms-auto btn btn-sm btn-icon rounded-circle hover-bg-secondary transition-all">
                                <ExternalLink size={14} className="text-primary" />
                            </a>
                        </div>
                        {student.parentPhone && (
                            <div className="d-flex align-items-center gap-3">
                                <div className="p-2 bg-secondary rounded-3 text-secondary shadow-sm">
                                    <Phone size={18} />
                                </div>
                                <div className="small text-muted">{student.parentPhone}</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="d-grid">
                    <button className="btn btn-primary rounded-pill py-2.5 fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2 hover-lift" onClick={() => window.open(`mailto:${student.parentEmail}`)}>
                        <Mail size={18} />
                        <span>Initiate Direct Communication</span>
                    </button>
                </div>
            </div>

        </AppModal>
    );
}

export default StudentDetailModal;
