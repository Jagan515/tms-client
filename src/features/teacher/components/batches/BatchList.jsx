import { useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, Calendar, Clock, BookOpen, MessageSquare, Users, ChevronRight } from "lucide-react";
import ConfirmModal from "../../../../components/common/ConfirmModal";

function BatchList({ batches, onEdit, onDelete }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState(null);

    const handleDeleteClick = (batch) => {
        setSelectedBatch(batch);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedBatch) {
            onDelete(selectedBatch._id);
            setShowDeleteModal(false);
            setSelectedBatch(null);
        }
    };

    if (!batches || batches.length === 0) {
        return (
            <div className="text-center py-5 bg-tertiary rounded-4 animate-fade-in">
                <div className="bg-body-secondary p-4 rounded-circle d-inline-flex mb-3">
                    <Calendar size={48} className="text-muted opacity-50" />
                </div>
                <h5 className="fw-bold text-secondary">No Batches Found</h5>
                <p className="text-muted mb-0">Get started by creating your first academic batch.</p>
            </div>
        );
    }

    return (
        <>
            <div className="row g-4 animate-fade-in">
                {batches.map((batch) => (
                    <div key={batch._id} className="col-md-6 col-lg-4 col-xl-3">
                        <div className="card-modern h-100 shadow-sm hover-lift transition-all overflow-hidden border-0 position-relative group">
                            {/* Color Strip Indicator */}
                            <div className="position-absolute top-0 start-0 bottom-0 bg-primary" style={{ width: '4px' }}></div>

                            <div className="p-4 d-flex flex-column h-100 ps-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="flex-grow-1 pe-2">
                                        <h5 className="fw-bold mb-1 text-truncate" title={batch.name}>{batch.name}</h5>
                                        <div className="small text-muted fw-bold text-uppercase tracking-wider" style={{ fontSize: '0.65rem' }}>
                                            {batch.subject || 'General'} • Class {batch.class}
                                        </div>
                                    </div>
                                    <div className="dropdown opacity-0 group-hover-opacity-100 transition-all">
                                        <button className="btn btn-sm btn-icon p-1 text-muted hover-text-primary" type="button" data-bs-toggle="dropdown">
                                            <div className="d-flex flex-column gap-0.5">
                                                <div className="bg-current rounded-circle" style={{ width: 3, height: 3 }}></div>
                                                <div className="bg-current rounded-circle" style={{ width: 3, height: 3 }}></div>
                                                <div className="bg-current rounded-circle" style={{ width: 3, height: 3 }}></div>
                                            </div>
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg p-1 rounded-3">
                                            <li>
                                                <button className="dropdown-item rounded-2 small d-flex align-items-center gap-2" onClick={() => onEdit(batch)}>
                                                    <Edit size={14} /> Edit
                                                </button>
                                            </li>
                                            <li>
                                                <button className="dropdown-item rounded-2 small d-flex align-items-center gap-2 text-danger" onClick={() => handleDeleteClick(batch)}>
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Stats & Info */}
                                <div className="mb-4">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <div className="badge bg-primary-subtle text-primary rounded-pill px-2 py-1 d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                                            <Users size={12} />
                                            <span>{batch.studentCount || 0} Students</span>
                                        </div>
                                        {batch.time && (
                                            <div className="badge bg-secondary-subtle text-secondary rounded-pill px-2 py-1 d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                                                <Clock size={12} />
                                                <span>{batch.time}</span>
                                            </div>
                                        )}
                                    </div>

                                    {batch.days && batch.days.length > 0 && (
                                        <div className="d-flex flex-wrap gap-1 mt-2">
                                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                                                const isActive = batch.days.some(d => d.includes(day));
                                                return (
                                                    <span
                                                        key={day}
                                                        className={`badge rounded-pill px-1.5 py-0.5 ${isActive ? 'bg-primary text-white' : 'bg-light text-muted border'}`}
                                                        style={{ fontSize: '0.6rem', opacity: isActive ? 1 : 0.5 }}
                                                    >
                                                        {day.charAt(0)}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto d-grid gap-2">
                                    <Link to={`/teacher/attendance?batchId=${batch._id}`} className="btn btn-primary btn-sm rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-1">
                                        <span>Attendance</span>
                                        <ChevronRight size={14} />
                                    </Link>
                                    <Link to={`/teacher/marks?batchId=${batch._id}`} className="btn btn-outline-secondary btn-sm rounded-pill fw-bold border-0 bg-tertiary hover-bg-secondary text-secondary">
                                        View Marks
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ConfirmModal
                show={showDeleteModal}
                title="Deleting Batch"
                message={`Permanently remove "${selectedBatch?.name}"? Associated attendance and marks records may be affected.`}
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteModal(false)}
                confirmText="Confirm Delete"
                confirmVariant="danger"
            />
        </>
    );
}

export default BatchList;
