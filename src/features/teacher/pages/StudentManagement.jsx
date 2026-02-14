import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../../../config/appConfig";
import PageHeader from "../../../components/common/PageHeader";
import ConfirmModal from "../../../components/common/ConfirmModal";
import Loading from "../../../components/common/Loading";
import StudentList from "../components/students/StudentList";
import CreateStudentModal from "../../../components/modals/CreateStudentModal";
import StudentDetailModal from "../components/students/StudentDetailModal";
import studentService from "../../student/api/studentService";
import { Plus, Users, Search, Filter, ShieldCheck, UserPlus, RefreshCw } from "lucide-react";

function StudentManagement() {
    const [students, setStudents] = useState([]);
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState("all");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // UI States
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Selection States
    const [selectedStudent, setSelectedStudent] = useState(null);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const params = {
                search: searchTerm,
                batchId: selectedBatch === 'all' ? '' : selectedBatch,
                limit: 100 // Get more students if filtering
            };
            const response = await axios.get(`${serverEndpoint}/students`, {
                params,
                withCredentials: true
            });
            if (response.data && response.data.students) {
                setStudents(response.data.students);
            } else if (Array.isArray(response.data)) {
                setStudents(response.data);
            }
        } catch (error) {
            console.error("Fetch failed", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadInitial = async () => {
            try {
                const bRes = await axios.get(`${serverEndpoint}/batches?limit=all`, { withCredentials: true });
                setBatches(bRes.data.batches || []);
                fetchStudents();
            } catch (err) { console.error(err); }
        };
        loadInitial();
    }, []);

    useEffect(() => {
        fetchStudents();
    }, [selectedBatch]);

    const handleDelete = async () => {
        try {
            await studentService.delete(selectedStudent._id);
            setShowDeleteModal(false);
            fetchStudents();
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const filteredStudents = students.filter(s =>
        s.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && students.length === 0) return <Loading text="Synchronizing scholar records..." />;

    return (
        <div className="p-4 animate-fade-in" style={{ minHeight: '100vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <PageHeader
                    title="Student Registry"
                    subtitle="Management of active scholar identities and enrollment data"
                />
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary rounded-pill px-4 d-flex align-items-center gap-2 border-dashed" onClick={fetchStudents}>
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2 shadow-lg hover-lift" onClick={() => { setSelectedStudent(null); setShowCreateModal(true); }}>
                        <UserPlus size={18} />
                        <span>Enroll New Scholar</span>
                    </button>
                </div>
            </div>

            <div className="card-modern shadow-lg border-0 mb-5 p-4 bg-tertiary-subtle" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="row g-4 align-items-center">
                    <div className="col-lg-4">
                        <div className="position-relative">
                            <Search className="position-absolute top-50 translate-middle-y ms-3 text-primary opacity-50" size={18} />
                            <input
                                className="form-control ps-5 rounded-pill border-0 shadow-sm bg-white"
                                style={{ height: '48px' }}
                                placeholder="Search by name, ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetchStudents()}
                            />
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <select
                            className="form-select border-0 shadow-sm rounded-3"
                            style={{ height: '48px' }}
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                        >
                            <option value="all">All Class Groups</option>
                            {batches.map(b => (
                                <option key={b._id} value={b._id}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-lg-5">
                        <div className="d-flex gap-3 justify-content-lg-end">
                            <div className="stat-pill d-flex align-items-center gap-2 px-3 py-2 bg-white rounded-3 shadow-sm">
                                <Users size={16} className="text-primary" />
                                <span className="small fw-bold">{students.length} Total Enrolled</span>
                            </div>

                            <div className="stat-pill d-flex align-items-center gap-2 px-3 py-2 bg-white rounded-3 shadow-sm border-start-success">
                                <ShieldCheck size={16} className="text-success" />
                                <span className="small fw-bold">Validated Registry</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-modern shadow-sm p-0 overflow-hidden bg-white animate-fade-in-up">
                <div className="p-4 border-bottom d-flex align-items-center justify-content-between bg-tertiary" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <div className="d-flex align-items-center gap-2">
                        <Users size={18} className="text-primary" />
                        <h5 className="mb-0 fw-bold">Validated Registry List</h5>
                    </div>
                    <div className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill small fw-bold">
                        {filteredStudents.length} Records Found
                    </div>
                </div>
                <div className="card-body p-0">
                    <StudentList
                        students={filteredStudents}
                        onView={(s) => { setSelectedStudent(s); setShowViewModal(true); }}
                        onEdit={(s) => { setSelectedStudent(s); setShowCreateModal(true); }}
                        onDelete={(s) => { setSelectedStudent(s); setShowDeleteModal(true); }}
                    />
                </div>
            </div>

            {/* Create / Edit Wizard Modal */}
            <CreateStudentModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={fetchStudents}
                initialData={selectedStudent}
            />

            {/* View Details Modal */}
            <StudentDetailModal
                show={showViewModal}
                student={selectedStudent}
                onClose={() => setShowViewModal(false)}
            />

            {/* Delete Confirmation */}
            <ConfirmModal
                show={showDeleteModal}
                title="Revoke Scholar Access"
                message={`Are you sure you want to permanently revoke the enrollment for ${selectedStudent?.name}? This action will archive all associated academic history.`}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />

        </div>
    );
}

export default StudentManagement;
