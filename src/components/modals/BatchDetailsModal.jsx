import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { serverEndpoint } from "../../config/appConfig";
import AppModal from "../common/AppModal";
import Loading from "../common/Loading";

function BatchDetailsModal({ show, onClose, batchId, onEditBatch }) {
    const [batchData, setBatchData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);

    // Add Student State
    const [showAddStudent, setShowAddStudent] = useState(false);
    const [studentSearch, setStudentSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const fetchDetails = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${serverEndpoint}/batches/${batchId}`, { withCredentials: true });
            setBatchData(res.data.batch);
            setStudents(res.data.students);
        } catch {
            console.error("Fetch details failed");
        } finally {
            setLoading(false);
        }
    }, [batchId]);

    useEffect(() => {
        if (show && batchId) {
            fetchDetails();
        }
    }, [show, batchId, fetchDetails]);

    const handleRemoveStudent = async (studentId) => {
        if (!confirm("Remove student from this batch?")) return;
        try {
            await axios.post(`${serverEndpoint}/batches/${batchId}/remove-student`, { studentId }, { withCredentials: true });
            fetchDetails(); // Reload
        } catch {
            alert("Failed to remove student");
        }
    };

    // Search for students to add (Simple implementation: fetch all students and filter locally or use search API)
    // For specific requirement "Select from non-assigned students", we should ideally have an API parameter `batchId=null`
    // but for now, reusing search.
    const searchStudents = async (query) => {
        setStudentSearch(query);
        if (query.length < 2) return;

        try {
            const res = await axios.get(`${serverEndpoint}/students?search=${query}&limit=5`, { withCredentials: true });
            // Filter out already added students
            const available = res.data.students.filter(s => !students.find(existing => existing._id === s._id));
            setSearchResults(available);
        } catch (err) {
            console.error("Search failed", err);
        }
    };

    const handleAddStudent = async (studentId) => {
        try {
            await axios.post(`${serverEndpoint}/batches/${batchId}/add-student`, { studentId }, { withCredentials: true });
            setStudentSearch("");
            setSearchResults([]);
            setShowAddStudent(false);
            fetchDetails();
        } catch {
            alert("Failed to add student");
        }
    };

    if (!show) return null;

    return (
        <AppModal show={show} title={batchData ? `📚 ${batchData.name}` : "Loading..."} onClose={onClose} size="lg">
            {loading ? <Loading /> : (
                <div>
                    {/* Batch Info Header */}
                    <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded mb-4">
                        <div>
                            <span className="badge bg-primary me-2">{batchData.class}</span>
                            <span className="text-muted">{batchData.days?.join(", ")} {batchData.time}</span>
                        </div>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => { onClose(); onEditBatch(batchData); }}>
                            ✏️ Edit Info
                        </button>
                    </div>

                    {/* Students List */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold m-0">Students ({students.length})</h6>
                        <button className="btn btn-sm btn-success" onClick={() => setShowAddStudent(!showAddStudent)}>
                            + Add Student
                        </button>
                    </div>

                    {/* Add Student Search Box */}
                    {showAddStudent && (
                        <div className="card mb-3 border-success">
                            <div className="card-body p-2">
                                <input
                                    type="text"
                                    className="form-control form-control-sm mb-2"
                                    placeholder="Search student name..."
                                    value={studentSearch}
                                    onChange={(e) => searchStudents(e.target.value)}
                                    autoFocus
                                />
                                <ul className="list-group">
                                    {searchResults.map(s => (
                                        <li key={s._id} className="list-group-item d-flex justify-content-between align-items-center py-2">
                                            <span>
                                                <strong>{s.name}</strong> <small className="text-muted">({s.registrationNumber})</small>
                                            </span>
                                            <button className="btn btn-sm btn-outline-success" onClick={() => handleAddStudent(s._id)}>Add</button>
                                        </li>
                                    ))}
                                    {studentSearch.length > 2 && searchResults.length === 0 && (
                                        <li className="list-group-item text-muted small">No available students found.</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Table */}
                    <div className="table-responsive">
                        <table className="table table-sm table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>Reg No</th>
                                    <th>Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.length === 0 ? (
                                    <tr><td colSpan="3" className="text-center text-muted">No students in this batch.</td></tr>
                                ) : (
                                    students.map(student => (
                                        <tr key={student._id}>
                                            <td className="font-monospace small">{student.registrationNumber}</td>
                                            <td>{student.name}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-danger py-0"
                                                    onClick={() => handleRemoveStudent(student._id)}
                                                    title="Remove from batch"
                                                >
                                                    &times;
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AppModal>
    );
}

export default BatchDetailsModal;
