import { useEffect, useState } from "react";
import AppModal from "../common/AppModal";
import Loading from "../Loading";
import batchService from "../../features/teacher/api/batchService";

function BatchDetail({ show, batch, onClose }) {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show && batch?._id) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoading(true);
            batchService.getStudents(batch._id)
                .then(data => setStudents(data.students || []))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [show, batch]);

    if (!show || !batch) return null;

    return (
        <AppModal show={show} title={batch.name} onClose={onClose}>
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
                <div>
                    <span className="badge bg-primary me-2">Class {batch.class}</span>
                    <span className="text-muted small">{batch.year}</span>
                </div>
                <button className="btn btn-sm btn-outline-primary">+ Add Student</button>
            </div>

            <h6 className="fw-bold small text-muted mb-3">Enrolled Students ({students.length})</h6>

            {loading ? (
                <Loading text="Loading students..." />
            ) : students.length === 0 ? (
                <p className="text-center text-muted py-3">No students in this batch.</p>
            ) : (
                <ul className="list-group list-group-flush">
                    {students.map(student => (
                        <li key={student._id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                            <div>
                                <h6 className="mb-0 small fw-bold">{student.name}</h6>
                                <small className="text-muted">{student.regNo}</small>
                            </div>
                            <button className="btn btn-sm btn-link text-danger p-0">Remove</button>
                        </li>
                    ))}
                </ul>
            )}
        </AppModal>
    );
}

export default BatchDetail;
