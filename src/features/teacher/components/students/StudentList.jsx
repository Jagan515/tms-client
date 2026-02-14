import { Eye, Edit3, Trash2, User, Hash, Briefcase, Info, BadgeCheck, AlertCircle } from "lucide-react";

function StudentList({ students, onEdit, onDelete, onView }) {
    if (!students || students.length === 0) {
        return (
            <div className="text-center py-5 animate-fade-in">
                <div className="bg-tertiary d-inline-block p-4 rounded-circle mb-3">
                    <User size={40} className="text-muted opacity-50" />
                </div>
                <h6 className="fw-bold text-secondary mb-1">Scholar Registry Empty</h6>
                <p className="text-muted small">No active student records detected in the synchronization ledger.</p>
            </div>
        );
    }

    return (
        <div className="table-responsive animate-fade-in">
            <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                    <tr>
                        <th className="ps-4 py-3">Scholar Profile</th>
                        <th>Classification</th>
                        <th>Institutional Batch</th>
                        <th className="text-center">Financial Status</th>
                        <th className="text-end pe-4">Lifecycle Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student._id}>
                            <td className="ps-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="avatar-initial rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '40px', height: '40px', fontSize: '0.85rem' }}>
                                        {student.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="fw-bold small">{student.name}</div>
                                        <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.7rem' }}>
                                            <Hash size={10} />
                                            <span>{student.registrationNumber || 'VERIFICATION_PENDING'}</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="badge-modern px-2 py-1 rounded bg-tertiary text-secondary small border" style={{ fontSize: '0.7rem' }}>
                                        STD {student.class}
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center gap-2 text-secondary small fw-medium">
                                    <Briefcase size={14} className="opacity-50" />
                                    <span>{student.batchName || 'Unassigned'}</span>
                                </div>
                            </td>
                            <td className="text-center">
                                <div className={`d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill small fw-bold ${student.feeStatus === 'Paid' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`} style={{ fontSize: '0.65rem' }}>
                                    {student.feeStatus === 'Paid' ? <BadgeCheck size={12} /> : <AlertCircle size={12} />}
                                    <span>{student.feeStatus?.toUpperCase() || 'UNKNOWN'}</span>
                                </div>
                            </td>
                            <td className="text-end pe-4">
                                <div className="d-flex justify-content-end gap-2">
                                    <button className="btn btn-sm btn-icon rounded-circle hover-bg-tertiary" onClick={() => onView(student)} title="Inspect Record">
                                        <Eye size={18} className="text-primary" />
                                    </button>
                                    <button className="btn btn-sm btn-icon rounded-circle hover-bg-tertiary" onClick={() => onEdit(student)} title="Modify Configuration">
                                        <Edit3 size={18} className="text-secondary" />
                                    </button>
                                    <button className="btn btn-sm btn-icon rounded-circle hover-bg-tertiary" onClick={() => onDelete(student)} title="Revoke Access">
                                        <Trash2 size={18} className="text-danger" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StudentList;
