import { useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, Calendar, Clock, BookOpen, MessageSquare } from "lucide-react";
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
            <div className="text-center py-5 bg-tertiary rounded-4">
                <Calendar size={48} className="text-muted opacity-30 mb-3" />
                <p className="text-muted mb-0">No batches found. Create your first batch to get started.</p>
            </div>
        );
    }

    return (
        <>
            <div className="row g-4">
                {batches.map((batch) => (
                    <div key={batch._id} className="col-md-6">
                        <div className="card-modern h-100 p-4 shadow-sm hover-lift transition-all">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="flex-grow-1">
                                    <h5 className="fw-bold mb-2">{batch.name}</h5>
                                    <div className="d-flex flex-wrap gap-2 mb-2">
                                        <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1">
                                            Class {batch.class}
                                        </span>
                                        {batch.subject && (
                                            <span className="badge bg-info-subtle text-info rounded-pill px-3 py-1">
                                                <BookOpen size={12} className="me-1" />
                                                {batch.subject}
                                            </span>
                                        )}
                                        <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1">
                                            👥 {batch.studentCount || 0} Students
                                        </span>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button
                                        onClick={() => onEdit(batch)}
                                        className="btn btn-sm btn-outline-primary rounded-circle p-2"
                                        title="Edit Batch"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(batch)}
                                        className="btn btn-sm btn-outline-danger rounded-circle p-2"
                                        title="Delete Batch"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {batch.time && (
                                <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                                    <Clock size={14} />
                                    <span>{batch.time}</span>
                                </div>
                            )}

                            {batch.description && (
                                <div className="d-flex align-items-start gap-2 text-muted small mb-3 p-2 bg-tertiary rounded-3">
                                    <MessageSquare size={14} className="mt-1 flex-shrink-0" />
                                    <span className="line-clamp-2">{batch.description}</span>
                                </div>
                            )}

                            {batch.days && batch.days.length > 0 && (
                                <div className="mb-3">
                                    <div className="small text-muted mb-2 fw-semibold">Schedule:</div>
                                    <div className="d-flex flex-wrap gap-1">
                                        {batch.days.map((day) => (
                                            <span
                                                key={day}
                                                className="badge bg-secondary-subtle text-secondary rounded-pill px-2 py-1"
                                                style={{ fontSize: "0.7rem" }}
                                            >
                                                {day.slice(0, 3)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="d-flex gap-2 mt-auto pt-3 border-top">
                                <Link
                                    to={`/teacher/attendance?batchId=${batch._id}`}
                                    className="btn btn-sm btn-primary rounded-pill px-3 flex-grow-1"
                                >
                                    Attendance
                                </Link>
                                <Link
                                    to={`/teacher/marks?batchId=${batch._id}`}
                                    className="btn btn-sm btn-outline-secondary rounded-pill px-3 flex-grow-1"
                                >
                                    Marks
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ConfirmModal
                show={showDeleteModal}
                title="Delete Batch"
                message={`Are you sure you want to delete "${selectedBatch?.name}"? This action cannot be undone.`}
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteModal(false)}
                confirmText="Delete Batch"
            />
        </>
    );
}

export default BatchList;
