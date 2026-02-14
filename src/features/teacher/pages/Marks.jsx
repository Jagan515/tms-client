import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";
import Loading from "../../../components/common/Loading";
import MarksEntry from "../../../components/marks/MarksEntry";
import marksService from "../api/marksService";
import batchService from "../api/batchService";
import {
    Trophy,
    ClipboardCheck,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Clock,
    ChevronLeft,
    Plus,
    Filter,
    BookOpen,
    GraduationCap,
    School,
    Check
} from "lucide-react";

function Marks() {
    const [searchParams] = useSearchParams();
    const [mode, setMode] = useState('view'); // 'view' | 'entry'
    const [mainTab, setMainTab] = useState('school'); // 'school' | 'tuition'
    const [schoolSubTab, setSchoolSubTab] = useState('pending'); // 'pending' | 'approved'
    const [loading, setLoading] = useState(false);
    const [marks, setMarks] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState("");

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchMarks(1);
    }, [mainTab, schoolSubTab, selectedBatch]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const data = await batchService.getAll();
            setBatches(data.batches || []);

            // Check if batchId is in URL params
            const batchIdFromUrl = searchParams.get('batchId');
            if (batchIdFromUrl && data.batches?.some(b => b._id === batchIdFromUrl)) {
                setSelectedBatch(batchIdFromUrl);
            } else if (data.batches?.length > 0) {
                // setSelectedBatch(data.batches[0]._id); // Don't auto-select first batch if we want "All" by default
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const fetchMarks = async (page = 1) => {
        try {
            const params = {
                category: mainTab,
                status: mainTab === 'school' ? schoolSubTab : 'approved',
                batchId: selectedBatch,
                page,
                limit: pagination.limit
            };
            const response = await marksService.getMarks(params);
            setMarks(response.marks || []);
            setPagination(response.pagination || { page: 1, pages: 1, total: 0, limit: 10 });
        } catch (err) { console.error(err); }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            fetchMarks(newPage);
        }
    };

    const handleApprove = async (id) => {
        try {
            await marksService.approveMark(id);
            fetchMarks();
        } catch (err) { alert(err.message); }
    };

    const handleReject = async (id) => {
        const reason = prompt("Reason for rejection:");
        if (!reason) return;
        try {
            await marksService.rejectMark(id, reason);
            fetchMarks();
        } catch (err) { alert(err.message); }
    };

    const handleEditApprove = async (id, currentMark) => {
        const newScore = prompt(`Edit Score (Current: ${currentMark.marksObtained}):`, currentMark.marksObtained);
        if (newScore === null) return;

        try {
            await marksService.editApproveMark(id, {
                marksObtained: Number(newScore),
                totalMarks: currentMark.totalMarks,
                subject: currentMark.subject,
                unitName: currentMark.unitName
            });
            fetchMarks();
        } catch (err) { alert(err.message); }
    };

    const handleTuitionSubmit = async (payload) => {
        setLoading(true);
        try {
            // Bulk add tuition marks
            for (const record of payload.records) {
                await marksService.addTuitionMark({
                    studentId: record.studentId,
                    subject: payload.subject,
                    unitName: payload.unitName,
                    marksObtained: record.marksObtained,
                    totalMarks: payload.totalMarks,
                    examDate: payload.date
                });
            }
            setMode('view');
            setMainTab('tuition');
            fetchMarks();
        } catch (err) { alert(err.message); }
        finally { setLoading(false); }
    };

    if (loading && batches.length === 0) return <Loading text="Loading Academic Registry..." />;

    return (
        <div className="p-4 animate-fade-in" style={{ minHeight: '100vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <PageHeader
                    title="Academic Performance"
                    subtitle="Integrated tracking of school evaluations and tuition assessments"
                />
                <button
                    className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2 shadow-lg"
                    onClick={() => setMode(mode === 'view' ? 'entry' : 'view')}
                >
                    {mode === 'view' ? <><Plus size={18} /><span>Record Tuition Test</span></> : <><ChevronLeft size={18} /><span>Back to Registry</span></>}
                </button>
            </div>

            {mode === 'entry' ? (
                <div className="animate-fade-in-up">
                    <MarksEntry onSubmit={handleTuitionSubmit} onCancel={() => setMode('view')} loading={loading} />
                </div>
            ) : (
                <>
                    {/* Main Navigation Tabs */}
                    <div className="d-flex gap-3 mb-4 bg-tertiary p-2 rounded-4 d-inline-flex" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                        <button
                            className={`btn rounded-pill px-4 py-2 d-flex align-items-center gap-2 border-0 transition-all ${mainTab === 'school' ? 'bg-white shadow-sm text-primary' : 'text-muted'}`}
                            onClick={() => setMainTab('school')}
                        >
                            <School size={18} />
                            <span className="fw-bold">School Assessments</span>
                        </button>
                        <button
                            className={`btn rounded-pill px-4 py-2 d-flex align-items-center gap-2 border-0 transition-all ${mainTab === 'tuition' ? 'bg-white shadow-sm text-primary' : 'text-muted'}`}
                            onClick={() => setMainTab('tuition')}
                        >
                            <GraduationCap size={18} />
                            <span className="fw-bold">Tuition Direct</span>
                        </button>
                    </div>

                    {/* Sub-Tabs for School */}
                    {mainTab === 'school' && (
                        <div className="d-flex gap-4 mb-4 border-bottom px-2">
                            <button
                                className={`btn border-0 pb-2 px-0 rounded-0 position-relative small fw-bold text-uppercase letter-spacing-1 ${schoolSubTab === 'pending' ? 'text-primary' : 'text-muted'}`}
                                onClick={() => setSchoolSubTab('pending')}
                            >
                                Pending Verification
                                {schoolSubTab === 'pending' && <div className="position-absolute bottom-0 start-0 w-100 bg-primary" style={{ height: '2px', width: '100%' }}></div>}
                            </button>
                            <button
                                className={`btn border-0 pb-2 px-0 rounded-0 position-relative small fw-bold text-uppercase letter-spacing-1 ${schoolSubTab === 'approved' ? 'text-primary' : 'text-muted'}`}
                                onClick={() => setSchoolSubTab('approved')}
                            >
                                Approved Ledger
                                {schoolSubTab === 'approved' && <div className="position-absolute bottom-0 start-0 w-100 bg-primary" style={{ height: '2px', width: '100%' }}></div>}
                            </button>
                        </div>
                    )}

                    {/* Batch Filter */}
                    <div className="card-modern shadow-sm border-0 mb-4 p-3 bg-white">
                        <div className="row g-3 align-items-center">
                            <div className="col-md-4">
                                <label className="form-label small fw-bold text-muted text-uppercase letter-spacing-1 mb-2">
                                    Filter by Batch
                                </label>
                                <div className="position-relative">
                                    <BookOpen className="position-absolute top-50 translate-middle-y ms-3 text-primary opacity-50" size={18} />
                                    <select
                                        className="form-select ps-5 border-0 bg-tertiary rounded-3"
                                        value={selectedBatch}
                                        onChange={(e) => setSelectedBatch(e.target.value)}
                                    >
                                        <option value="">📚 All Batches</option>
                                        {batches.map(b => (
                                            <option key={b._id} value={b._id}>
                                                {b.name} ({b.studentCount || 0} students)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-8 d-flex justify-content-end align-items-center gap-3">
                                <div className="text-muted small">
                                    Showing <span className="fw-bold text-dark">{marks.length}</span> records
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Registry */}
                    <div className="card-modern shadow-sm p-0 overflow-hidden border-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="ps-4 py-3">Student Candidate</th>
                                        <th>Assessment Unit</th>
                                        <th className="text-center">Exam Date</th>
                                        <th className="text-center">Score / Total</th>
                                        <th className="text-center">Percentage</th>
                                        <th className="text-end pe-4">Lifecycle Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {marks.length > 0 ? marks.map((mark) => (
                                        <tr key={mark._id}>
                                            <td className="ps-4">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold"
                                                        style={{ width: '32px', height: '32px', fontSize: '0.7rem' }}>
                                                        {mark.studentId?.userId?.name?.charAt(0) || 'S'}
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold small">{mark.studentId?.userId?.name || 'Academic Scholar'}</div>
                                                        <div className="text-muted" style={{ fontSize: '0.65rem' }}>{mark.studentId?.registrationNumber || 'Pending'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="small fw-semibold">{mark.subject}</div>
                                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>{mark.unitName}</div>
                                            </td>
                                            <td className="text-center">
                                                <div className="small text-muted">{new Date(mark.examDate).toLocaleDateString()}</div>
                                            </td>
                                            <td className="text-center">
                                                <span className="badge bg-tertiary text-secondary border px-2.5 py-1.5 rounded-pill" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                                    {mark.marksObtained} / {mark.totalMarks}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <div className="d-flex flex-column align-items-center gap-1">
                                                    <span className={`fw-bold small ${mark.percentage >= 75 ? 'text-success' : mark.percentage >= 40 ? 'text-warning' : 'text-danger'}`}>
                                                        {mark.percentage}%
                                                    </span>
                                                    <div className="progress rounded-pill overflow-hidden" style={{ height: '3px', width: '40px' }}>
                                                        <div className={`progress-bar ${mark.percentage >= 75 ? 'bg-success' : 'bg-warning'}`} style={{ width: `${mark.percentage}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-end pe-4">
                                                {mainTab === 'school' && schoolSubTab === 'pending' ? (
                                                    <div className="d-flex justify-content-end gap-2">
                                                        <button className="btn btn-sm btn-icon rounded-circle bg-success-subtle text-success border-0 p-2 hover-lift" onClick={() => handleApprove(mark._id)}>
                                                            <CheckCircle2 size={16} />
                                                        </button>
                                                        <button className="btn btn-sm btn-icon rounded-circle bg-warning-subtle text-warning border-0 p-2 hover-lift" onClick={() => handleEditApprove(mark._id, mark)}>
                                                            <Filter size={16} />
                                                        </button>
                                                        <button className="btn btn-sm btn-icon rounded-circle bg-danger-subtle text-danger border-0 p-2 hover-lift" onClick={() => handleReject(mark._id)}>
                                                            <XCircle size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className={`badge rounded-pill px-3 py-1.5 small letter-spacing-1 fw-bold ${mark.status === 'approved' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                                                        {mark.status.toUpperCase()}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5">
                                                <div className="bg-tertiary d-inline-block p-4 rounded-circle mb-3">
                                                    <Trophy size={40} className="text-muted opacity-50" />
                                                </div>
                                                <div className="fw-semibold text-muted">Registry Empty</div>
                                                <div className="small text-muted opacity-75">No {mainTab} assessments found {mainTab === 'school' ? `for ${schoolSubTab} status` : ''}.</div>
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
                                        disabled={pagination.page === 1}
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        className="btn btn-sm btn-primary rounded-pill px-4 fw-bold shadow-sm"
                                        disabled={pagination.page === pagination.pages}
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                    >
                                        Next page
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default Marks;
