import { User, UserCircle, School, Calendar, Hash, Mail, GraduationCap } from "lucide-react";

function StudentProfile({ student }) {
    if (!student) return null;

    return (
        <div className="card-modern shadow-premium border-0 overflow-hidden animate-fade-in">
            <div className="p-4 border-bottom bg-tertiary d-flex align-items-center gap-x-2" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <UserCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <h6 className="fw-bold mb-0">Identity Profile</h6>
            </div>
            <div className="card-body p-4 p-md-5">
                <div className="row g-4">
                    <div className="col-md-6 col-lg-4">
                        <div className="d-flex align-items-start gap-x-3">
                            <div className="p-2 bg-primary-subtle rounded-3 text-primary d-flex align-items-center justify-content-center">
                                <User className="w-4.5 h-4.5 flex-shrink-0" />
                            </div>
                            <div>
                                <small className="text-muted d-block fw-bold text-uppercase letter-spacing-1 mb-1" style={{ fontSize: '0.6rem' }}>Full Legal Name</small>
                                <strong className="text-secondary">{student.name}</strong>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div className="d-flex align-items-start gap-x-3">
                            <div className="p-2 bg-primary-subtle rounded-3 text-primary d-flex align-items-center justify-content-center">
                                <Hash className="w-4.5 h-4.5 flex-shrink-0" />
                            </div>
                            <div>
                                <small className="text-muted d-block fw-bold text-uppercase letter-spacing-1 mb-1" style={{ fontSize: '0.6rem' }}>Registration ID</small>
                                <strong className="text-secondary">{student.regNo}</strong>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div className="d-flex align-items-start gap-x-3">
                            <div className="p-2 bg-primary-subtle rounded-3 text-primary d-flex align-items-center justify-content-center">
                                <GraduationCap className="w-4.5 h-4.5 flex-shrink-0" />
                            </div>
                            <div>
                                <small className="text-muted d-block fw-bold text-uppercase letter-spacing-1 mb-1" style={{ fontSize: '0.6rem' }}>Academic Level</small>
                                <strong className="text-secondary">{student.class}th Grade</strong>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div className="d-flex align-items-start gap-x-3">
                            <div className="p-2 bg-primary-subtle rounded-3 text-primary d-flex align-items-center justify-content-center">
                                <School className="w-4.5 h-4.5 flex-shrink-0" />
                            </div>
                            <div>
                                <small className="text-muted d-block fw-bold text-uppercase letter-spacing-1 mb-1" style={{ fontSize: '0.6rem' }}>External Institution</small>
                                <strong className="text-secondary">{student.school || 'Unspecified'}</strong>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-8">
                        <div className="d-flex align-items-start gap-x-3">
                            <div className="p-2 bg-primary-subtle rounded-3 text-primary d-flex align-items-center justify-content-center">
                                <Calendar className="w-4.5 h-4.5 flex-shrink-0" />
                            </div>
                            <div>
                                <small className="text-muted d-block fw-bold text-uppercase letter-spacing-1 mb-1" style={{ fontSize: '0.6rem' }}>Provisioning Date</small>
                                <strong className="text-secondary">{new Date(student.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 mt-5">
                        <div className="p-4 rounded-4 bg-tertiary border shadow-inner">
                            <h6 className="fw-bold small text-muted text-uppercase mb-4 letter-spacing-1 border-bottom pb-2 d-flex align-items-center gap-x-2">
                                <UserCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>Assigned Facilitator</span>
                            </h6>
                            <div className="d-flex align-items-center gap-x-4">
                                <div className="avatar-initial rounded-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-sm fw-bold"
                                    style={{ width: '56px', height: '56px', fontSize: '1.25rem' }}>
                                    {student.teacherName?.charAt(0) || 'T'}
                                </div>
                                <div className="overflow-hidden">
                                    <div className="fw-bold h5 mb-1 text-secondary text-truncate">{student.teacherName}</div>
                                    <div className="d-flex align-items-center gap-x-2 text-muted small">
                                        <Mail className="w-3 h-3 flex-shrink-0" />
                                        <span className="text-truncate">{student.teacherEmail}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentProfile;
