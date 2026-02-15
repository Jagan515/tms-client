import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { serverEndpoint } from "../../../config/appConfig";
import PageHeader from "../../../components/common/PageHeader";
import Loading from "../../../components/common/Loading";
import CreateTeacherModal from "../../../components/modals/CreateTeacherModal";
import ResetPasswordModal from "../../../components/modals/ResetPasswordModal";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import {
    UserPlus,
    UserCheck,
    UserX,
    Search,
    RefreshCcw,
    Mail,
    Users
} from "lucide-react";

function ManageTeachers() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const currentSearch = searchParams.get('search') || "";

    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(currentSearch);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });

    // Modals State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetEmail, setResetEmail] = useState("");

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        variant: "danger",
        confirmText: "Confirm",
        targetId: null,
        targetActiveState: false, // for toggle
        actionType: "TOGGLE", // "TOGGLE" or "DELETE"
        isLoading: false,
        error: null
    });

    const fetchTeachers = useCallback(async (page = currentPage, search = currentSearch) => {
        setLoading(true);
        try {
            const response = await axios.get(`${serverEndpoint}/developer/teachers`, {
                params: { page, limit: pagination.limit, search },
                withCredentials: true
            });
            if (response.data?.success) {
                setTeachers(response.data.teachers);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error("Failed to fetch teachers", error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, currentSearch, pagination.limit]);

    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            const newParams = new URLSearchParams(searchParams);
            newParams.set('page', newPage);
            setSearchParams(newParams);
        }
    };

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter') {
            const newParams = new URLSearchParams(searchParams);
            newParams.set('search', searchTerm);
            newParams.set('page', 1); // Reset to page 1 on search
            setSearchParams(newParams);
        }
    };

    const initiateToggleStatus = (teacher) => {
        const action = teacher.isActive ? "Revoke" : "Authorize";
        const variant = teacher.isActive ? "danger" : "success";

        setConfirmModal({
            isOpen: true,
            title: `${action} Access?`,
            message: `Are you sure you want to ${action.toLowerCase()} access for ${teacher.name}? ${teacher.isActive ? "They will no longer be able to log in." : "They will regain access to the system."}`,
            variant: variant,
            confirmText: teacher.isActive ? "Revoke Access" : "Authorize Access",
            targetId: teacher.userId,
            targetActiveState: teacher.isActive,
            actionType: "TOGGLE",
            isLoading: false
        });
    };

    const initiateDelete = (teacher) => {
        setConfirmModal({
            isOpen: true,
            title: "Confirm Teacher Deletion",
            message: `Are you sure you want to permanently delete ${teacher.name}? This will remove all related data including classes, assignments, attendance, salary records, and linked student associations. This action cannot be undone.`,
            variant: "danger",
            confirmText: "Confirm Delete",
            targetId: teacher.userId,
            actionType: "DELETE",
            isLoading: false
        });
    };

    const handleConfirmAction = async () => {
        if (!confirmModal.targetId) return;
        setConfirmModal(prev => ({ ...prev, isLoading: true }));

        try {
            if (confirmModal.actionType === "DELETE") {
                await axios.delete(`${serverEndpoint}/developer/teachers/${confirmModal.targetId}`, { withCredentials: true });
                setTeachers(prev => prev.filter(t => t.userId !== confirmModal.targetId));
                setConfirmModal(prev => ({ ...prev, isOpen: false, isLoading: false }));
            } else {
                // TOGGLE
                const newStatus = !confirmModal.targetActiveState;
                await axios.patch(`${serverEndpoint}/developer/teachers/${confirmModal.targetId}/status`,
                    { isActive: newStatus },
                    { withCredentials: true }
                );
                setTeachers(prev => prev.map(t =>
                    t.userId === confirmModal.targetId ? { ...t, isActive: newStatus } : t
                ));
                setConfirmModal(prev => ({ ...prev, isOpen: false, isLoading: false }));
            }
        } catch (error) {
            console.error("Failed to execute action", error);
            const errMsg = error.response?.data?.message || "Internal system error. Action aborted.";
            setConfirmModal(prev => ({ ...prev, isLoading: false, error: errMsg }));
        }
    };

    const handleResetClick = (email) => {
        setResetEmail(email);
        setShowResetModal(true);
    };

    const closeConfirmModal = () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
    };

    useEffect(() => {
        // Initial fetch handled by callback effect
    }, []);

    const filteredTeachers = teachers.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Loading text="Syncing educator directory..." />;

    return (
        <div className="p-4 animate-fade-in" style={{ minHeight: '100vh' }}>
            <PageHeader
                title="Instructional Faculty"
                subtitle="Credential management and system access control"
            />

            <div className="card-modern shadow-lg border-0 mb-4 p-0 overflow-hidden">
                <div className="p-4 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div className="d-flex align-items-center gap-x-2">
                        <div className="bg-primary-subtle p-2 rounded-3 d-flex align-items-center justify-content-center">
                            <Users className="w-4.5 h-4.5 text-primary flex-shrink-0" />
                        </div>
                        <h5 className="mb-0 fw-bold">Active Directory ({pagination.total})</h5>
                    </div>

                    <div className="d-flex align-items-center gap-x-2">
                        <div className="position-relative">
                            <Search className="position-absolute top-50 translate-middle-y ms-3 text-primary opacity-50" size={18} />
                            <input
                                type="text"
                                className="form-control ps-5 rounded-pill shadow-sm"
                                placeholder="Filter instructors..."
                                style={{ width: '320px', height: '44px', fontSize: '0.9rem' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleSearchSubmit}
                            />
                        </div>
                        <button className="btn btn-primary d-flex align-items-center gap-x-2 rounded-pill px-4 shadow-sm" onClick={() => setShowCreateModal(true)} style={{ height: '44px' }}>
                            <UserPlus className="w-4.5 h-4.5 flex-shrink-0" />
                            <span>Provision Account</span>
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4 py-3">Instructor Identity</th>
                                <th>Access Credentials</th>
                                <th>Status</th>
                                <th className="text-end pe-4">Lifecycle Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTeachers.length > 0 ? (
                                filteredTeachers.map((t) => (
                                    <tr key={t._id}>
                                        <td className="ps-4 py-3">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="teacher-avatar rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                                                    style={{ width: '38px', height: '38px', backgroundColor: 'var(--bg-tertiary)', color: 'var(--brand-primary)', border: '1px solid var(--border-color)' }}>
                                                    {t.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="fw-bold small">{t.name}</div>
                                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>Full Faculty Access</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-x-2 text-secondary small">
                                                <Mail className="w-3.5 h-3.5 opacity-50 flex-shrink-0" />
                                                <span>{t.email}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={`d-inline-flex align-items-center gap-1.5 px-3 py-1 rounded-pill small fw-bold ${t.isActive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                                                <div className="rounded-circle" style={{ width: '6px', height: '6px', backgroundColor: t.isActive ? 'var(--success)' : 'var(--danger)' }}></div>
                                                {t.isActive ? "Operational" : "Restricted"}
                                            </div>
                                        </td>
                                        <td className="text-end pe-4">
                                            <div className="d-flex justify-content-end gap-2">
                                                <button
                                                    className="btn btn-sm btn-tertiary rounded-pill px-3 d-flex align-items-center gap-x-2 transition-all hover-lift border"
                                                    onClick={() => handleResetClick(t.email)}
                                                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                                                >
                                                    <RefreshCcw className="w-3.5 h-3.5 text-warning flex-shrink-0" />
                                                    <span className="small fw-semibold">Reset</span>
                                                </button>
                                                <button
                                                    className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-x-2 transition-all hover-lift ${t.isActive ? 'btn-outline-danger' : 'btn-outline-success border'}`}
                                                    onClick={() => initiateToggleStatus(t)}
                                                >
                                                    {t.isActive ? <UserX className="w-3.5 h-3.5 flex-shrink-0" /> : <UserCheck className="w-3.5 h-3.5 flex-shrink-0" />}
                                                    <span className="small fw-semibold">{t.isActive ? "Revoke" : "Authorize"}</span>
                                                </button>
                                                <div className="vr mx-2 opacity-25"></div>
                                                <button
                                                    className="btn btn-sm btn-danger rounded-pill px-3 d-flex align-items-center gap-x-2 transition-all hover-lift shadow-sm"
                                                    onClick={() => initiateDelete(t)}
                                                    title="Permanently Delete"
                                                >
                                                    <UserX className="w-3.5 h-3.5 flex-shrink-0" />
                                                    <span className="small fw-semibold">Remove</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-5">
                                        <div className="bg-tertiary d-inline-block p-4 rounded-circle mb-3">
                                            <Search className="w-10 h-10 text-muted opacity-50 flex-shrink-0" />
                                        </div>
                                        <div className="fw-semibold text-muted">No instructors match your criteria</div>
                                        <div className="small text-muted opacity-75">Try adjusting your search terms or filters</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {pagination.pages > 1 && (
                    <div className="p-4 border-top bg-tertiary d-flex justify-content-between align-items-center" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                        <div className="small text-muted fw-bold">
                            Showing page <span className="text-primary">{pagination.page}</span> of <span className="text-primary">{pagination.pages}</span>
                        </div>
                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-sm btn-outline-primary rounded-pill px-4 fw-bold"
                                disabled={pagination.page === 1 || loading}
                                onClick={() => handlePageChange(pagination.page - 1)}
                            >
                                Previous
                            </button>
                            <button
                                className="btn btn-sm btn-primary rounded-pill px-4 fw-bold shadow-sm"
                                disabled={pagination.page === pagination.pages || loading}
                                onClick={() => handlePageChange(pagination.page + 1)}
                            >
                                Next page
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <CreateTeacherModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={fetchTeachers}
            />

            <ResetPasswordModal
                show={showResetModal}
                onClose={() => setShowResetModal(false)}
                emailToReset={resetEmail}
            />

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                onConfirm={handleConfirmAction}
                title={confirmModal.title}
                message={confirmModal.message}
                variant={confirmModal.variant}
                confirmText={confirmModal.confirmText}
                isLoading={confirmModal.isLoading}
            />


        </div>
    );
}

export default ManageTeachers;
