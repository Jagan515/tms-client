import { UserCircle, Hash, Layout, Wallet, GraduationCap } from "lucide-react";

function StudentStats({ student }) {
    if (!student) return null;

    return (
        <div className="card-modern p-0 shadow-premium mb-s-6 overflow-hidden" style={{ marginBottom: 'var(--s-6)' }}>
            <div className="bg-primary p-4 p-md-5 text-white d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
                <div className="d-flex align-items-center gap-4">
                    <div className="bg-white rounded-circle p-1 d-flex align-items-center justify-content-center shadow-lg"
                        style={{ width: '80px', height: '80px', overflow: 'hidden' }}>
                        <UserCircle className="w-12 h-12 text-primary opacity-20 flex-shrink-0" />
                    </div>
                    <div>
                        <h3 className="fw-bold mb-1 tracking-tight">{student.name}</h3>
                        <div className="d-flex align-items-center gap-x-2 opacity-75 small">
                            <Hash className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="fw-bold">ID: {student.registrationNumber || student.regNo || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="d-flex flex-wrap gap-4 gap-md-5 px-md-4 mt-3 mt-md-0">
                    <div className="text-center flex-grow-1 flex-md-grow-0">
                        <div className="small opacity-75 mb-1 text-uppercase letter-spacing-1">Current Class</div>
                        <div className="h4 mb-0 fw-bold">{student.class}th Grade</div>
                    </div>
                    <div className="text-center flex-grow-1 flex-md-grow-0">
                        <div className="small opacity-75 mb-1 text-uppercase letter-spacing-1">Assigned Group</div>
                        <div className="h4 mb-0 fw-bold text-truncate" style={{ maxWidth: '150px' }}>{student.batchName}</div>
                    </div>
                </div>
            </div>

            <div className="p-4 p-md-5 bg-tertiary">
                <div className="row g-4 g-md-5 align-items-center">
                    <div className="col-md-6">
                        <div className="d-flex align-items-center gap-x-2 mb-3 text-muted small fw-bold text-uppercase letter-spacing-1">
                            <Layout className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>Academic Health Index</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <span className="small fw-semibold text-secondary">Presence Metric</span>
                            <span className={`fw-bold small ${student.attendance >= 75 ? 'text-success' : 'text-danger'}`}>
                                {student.attendance}%
                            </span>
                        </div>
                        <div className="progress rounded-pill bg-body" style={{ height: '8px' }}>
                            <div
                                className={`progress-bar rounded-pill ${student.attendance >= 75 ? 'bg-success' : 'bg-danger'}`}
                                role="progressbar"
                                style={{ width: `${student.attendance}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="col-md-6 d-flex justify-content-md-end">
                        <div className="d-flex align-items-center gap-x-4 p-4 rounded-4 bg-body border shadow-sm w-100" style={{ maxWidth: '340px' }}>
                            <div className={`icon-box rounded-3 bg-${student.pendingFees > 0 ? 'danger' : 'success'}-subtle text-${student.pendingFees > 0 ? 'danger' : 'success'} d-flex align-items-center justify-content-center flex-shrink-0`} style={{ width: '48px', height: '48px' }}>
                                <Wallet className="w-6 h-6 flex-shrink-0" />
                            </div>
                            <div className="overflow-hidden">
                                <small className="text-muted d-block fw-bold text-uppercase letter-spacing-1 mb-1 text-truncate" style={{ fontSize: '0.6rem' }}>Financial Standing</small>
                                <span className={`h4 mb-0 fw-bold ${student.pendingFees > 0 ? 'text-danger' : 'text-success'}`}>
                                    {student.pendingFees > 0 ? `₹${student.pendingFees.toLocaleString()}` : 'Cleared'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Decoration */}
            <GraduationCap size={200} className="position-absolute text-white"
                style={{ top: '-40px', right: '-40px', opacity: 0.1, pointerEvents: 'none', transform: 'rotate(15deg)' }} />
        </div>
    );
}

export default StudentStats;
