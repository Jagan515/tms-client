import AppModal from "../common/AppModal";

function StudentDetailModal({ show, onClose, student, onEdit, onDelete, onTransfer }) {
    if (!student) return null;

    return (
        <AppModal show={show} title="👤 Student Details" onClose={onClose}>
            <div className="text-center mb-4">
                <h4 className="fw-bold m-0">{student.name}</h4>
                <span className="badge bg-secondary">{student.registrationNumber}</span>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-6">
                    <small className="text-muted d-block">Class</small>
                    <span className="fw-bold">{student.class}</span>
                </div>
                <div className="col-6">
                    <small className="text-muted d-block">Batch</small>
                    <span className="fw-bold">{student.batchName || "No Batch"}</span>
                </div>
                <div className="col-6">
                    <small className="text-muted d-block">Joining Date</small>
                    <span>{new Date(student.createdAt || new Date().toISOString()).toLocaleDateString()}</span>
                </div>
                <div className="col-6">
                    <small className="text-muted d-block">Monthly Fee</small>
                    <span className="fw-bold">₹{student.monthlyFee}</span>
                </div>
            </div>

            <div className="card bg-light border-0 mb-4">
                <div className="card-body">
                    <h6 className="fw-bold text-primary mb-3">Parent Information</h6>
                    <p className="mb-1"><strong>Name:</strong> {student.parentName}</p>
                    <p className="mb-0"><strong>Email:</strong> {student.parentEmail}</p>
                </div>
            </div>

            <div className="card border-primary mb-4">
                <div className="card-header bg-primary text-white">
                    QUICK STATS
                </div>
                <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                        <span>Attendance:</span>
                        <span className="fw-bold">85% (17/20 days)</span> {/* Mocked */}
                    </div>
                    <div className="d-flex justify-content-between">
                        <span>Pending Fees:</span>
                        <span className="fw-bold text-danger">₹2000 (Jan, Feb)</span> {/* Mocked */}
                    </div>
                </div>
            </div>

            <div className="d-grid gap-2">
                <div className="row">
                    <div className="col-4">
                        <button className="btn btn-outline-primary w-100 btn-sm">View Attendance</button>
                    </div>
                    <div className="col-4">
                        <button className="btn btn-outline-primary w-100 btn-sm">View Marks</button>
                    </div>
                    <div className="col-4">
                        <button className="btn btn-outline-primary w-100 btn-sm">HISTORY</button>
                    </div>
                </div>

                <hr />

                <button className="btn btn-warning w-100" onClick={() => { onClose(); onEdit(student); }}>
                    ✏️ Edit Student
                </button>
                <button className="btn btn-info w-100" onClick={() => { onClose(); onTransfer(student); }}>
                    🔄 Transfer Student
                </button>
                <button className="btn btn-danger w-100" onClick={() => { onClose(); onDelete(student); }}>
                    🗑️ Delete Student
                </button>
            </div>
        </AppModal>
    );
}

export default StudentDetailModal;
