import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";
import Loading from "../../../components/common/Loading";
import AppModal from "../../../components/common/AppModal";
import MarksEntry from "../../../components/marks/MarksEntry";
import marksService from "../api/marksService";
import batchService from "../api/batchService";
import {
    Trophy,
    CheckCircle2,
    XCircle,
    X,
    Clock,
    ClipboardCheck,
    AlertCircle,
    LayoutGrid,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Plus,
    Edit3,
    Trash2,
    BookOpen,
    School,
    Check,
    RefreshCw,
    GraduationCap
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
    const [groupedView, setGroupedView] = useState(true);
    const [expandedGroups, setExpandedGroups] = useState(new Set());

    // Action Modals State
    const [actionModal, setActionModal] = useState({ show: false, type: '', mark: null, bundleIds: null, reason: '', score: '' });

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
        } catch (err) { handleError(err); }
    };

    const handleError = (err) => {
        const msg = err.response?.data?.message || err.message || "Institutional telemetry synchronization failure.";
        alert(msg);
    };

    const toggleGroup = (groupId) => {
        const next = new Set(expandedGroups);
        if (next.has(groupId)) next.delete(groupId);
        else next.add(groupId);
        setExpandedGroups(next);
    };

    // Grouping Logic
    const processMarks = () => {
        if (!groupedView || mainTab === 'tuition') return marks.map(m => ({ ...m, isGroup: false }));

        const groups = {};
        marks.forEach(m => {
            const key = `${m.studentId?._id}-${m.unitName}-${m.examDate}`;
            if (!groups[key]) {
                groups[key] = {
                    _id: key,
                    isGroup: true,
                    student: m.studentId,
                    unitName: m.unitName,
                    examDate: m.examDate,
                    status: m.status,
                    subjects: [],
                    totalMarks: 0,
                    marksObtained: 0,
                    itemIds: []
                };
            }
            groups[key].subjects.push(m);
            groups[key].totalMarks += m.totalMarks;
            groups[key].marksObtained += m.marksObtained;
            groups[key].itemIds.push(m._id);
        });

        return Object.values(groups).map(g => ({
            ...g,
            percentage: parseFloat(((g.marksObtained / g.totalMarks) * 100).toFixed(2))
        }));
    };

    const displayMarks = processMarks();

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            fetchMarks(newPage);
        }
    };

    const handleApprove = async (id) => {
        try {
            await marksService.approveMark(id);
            fetchMarks();
        } catch (err) { handleError(err); }
    };

    const handleApproveBundle = async (ids) => {
        if (!confirm(`Are you sure you want to authorize all ${ids.length} subjects in this assessment group?`)) return;
        try {
            setLoading(true);
            for (const id of ids) {
                await marksService.approveMark(id);
            }
            fetchMarks();
        } catch (err) { handleError(err); }
        finally { setLoading(false); }
    };

    const handleRejectClick = (item, isBundle = false) => {
        setActionModal({
            show: true,
            type: 'reject',
            mark: isBundle ? null : item,
            bundleIds: isBundle ? item : null,
            reason: '',
            score: ''
        });
    };

    const submitRejection = async () => {
        if (!actionModal.reason) return alert("Please specify a reason for rejection.");
        try {
            if (actionModal.bundleIds) {
                await marksService.rejectBulk(actionModal.bundleIds, actionModal.reason);
            } else {
                await marksService.rejectMark(actionModal.mark._id, actionModal.reason);
            }
            setActionModal({ show: false, type: '', mark: null, bundleIds: null, reason: '', score: '' });
            fetchMarks();
        } catch (err) { handleError(err); }
    };

    const handleEditClick = (mark) => {
        setActionModal({ show: true, type: 'edit', mark, reason: '', score: mark.marksObtained });
    };

    const submitCorrection = async () => {
        const score = Number(actionModal.score);
        if (isNaN(score)) return alert("Invalid score entered.");

        try {
            await marksService.editApproveMark(actionModal.mark._id, {
                marksObtained: score,
                totalMarks: actionModal.mark.totalMarks,
                subject: actionModal.mark.subject,
                unitName: actionModal.mark.unitName
            });
            setActionModal({ show: false, type: '', mark: null, reason: '', score: '' });
            fetchMarks();
        } catch (err) { handleError(err); }
    };

    const handleTuitionSubmit = async (payload) => {
        setLoading(true);
        try {
            // High-throughput Bulk submission
            await marksService.addTuitionMark({
                subject: payload.subject,
                unitName: payload.unitName,
                totalMarks: payload.totalMarks,
                examDate: payload.date,
                records: payload.records
            });

            setMode('view');
            setMainTab('tuition');
            fetchMarks();
        } catch (err) { handleError(err); }
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
                    className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2 shadow-lg hover-lift"
                    onClick={() => setMode(mode === 'view' ? 'entry' : 'view')}
                >
                    {mode === 'view' ? <><Plus size={18} /><span>Log Internal Assessment</span></> : <><ChevronLeft size={18} /><span>Return to Archive</span></>}
                </button>
            </div>

            {mode === 'entry' ? (
                <div className="animate-fade-in-up">
                    <MarksEntry
                        onSubmit={handleTuitionSubmit}
                        onCancel={() => setMode('view')}
                        loading={loading}
                        defaultBatchId={selectedBatch}
                    />
                </div>
            ) : (
                <>
                    {/* Main Navigation Tabs */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="d-flex gap-3 bg-tertiary p-2 rounded-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <button
                                className={`btn rounded-pill px-4 py-2 d-flex align-items-center gap-2 border-0 transition-all hover-bg-tertiary ${mainTab === 'school' ? 'bg-white shadow-sm text-primary' : 'text-muted'}`}
                                onClick={() => { setMainTab('school'); fetchMarks(1); }}
                            >
                                <School size={18} />
                                <span className="fw-bold">Institutional Evaluations</span>
                                <RefreshCw size={14} className={`ms-1 opacity-50 ${loading && mainTab === 'school' ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                                className={`btn rounded-pill px-4 py-2 d-flex align-items-center gap-2 border-0 transition-all hover-bg-tertiary ${mainTab === 'tuition' ? 'bg-white shadow-sm text-primary' : 'text-muted'}`}
                                onClick={() => { setMainTab('tuition'); fetchMarks(1); }}
                            >
                                <GraduationCap size={18} />
                                <span className="fw-bold">Internal Assessments</span>
                                <RefreshCw size={14} className={`ms-1 opacity-50 ${loading && mainTab === 'tuition' ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        {mainTab === 'school' && (
                            <div className="form-check form-switch d-flex align-items-center gap-2">
                                <label className="form-check-label small fw-bold text-muted text-uppercase letter-spacing-1" htmlFor="groupToggle">Detailed Overview</label>
                                <input className="form-check-input shadow-none" type="checkbox" id="groupToggle" checked={groupedView} onChange={() => setGroupedView(!groupedView)} />
                            </div>
                        )}
                    </div>

                    {/* Sub-Tabs for School */}
                    {mainTab === 'school' && (
                        <div className="d-flex gap-4 mb-4 border-bottom px-2">
                            <button
                                className={`btn border-0 pb-2 px-0 rounded-0 position-relative small fw-bold text-uppercase letter-spacing-1 transition-all hover-opacity-100 d-flex align-items-center gap-2 ${schoolSubTab === 'pending' ? 'text-primary' : 'text-muted opacity-50'}`}
                                onClick={() => setSchoolSubTab('pending')}
                            >
                                <Clock size={14} />
                                <span>Verification Queue</span>
                                {schoolSubTab === 'pending' && <div className="position-absolute bottom-0 start-0 w-100 bg-primary" style={{ height: '2px' }}></div>}
                            </button>
                            <button
                                className={`btn border-0 pb-2 px-0 rounded-0 position-relative small fw-bold text-uppercase letter-spacing-1 transition-all hover-opacity-100 d-flex align-items-center gap-2 ${schoolSubTab === 'approved' ? 'text-primary' : 'text-muted opacity-50'}`}
                                onClick={() => setSchoolSubTab('approved')}
                            >
                                <ClipboardCheck size={14} />
                                <span>Verified Registry</span>
                                {schoolSubTab === 'approved' && <div className="position-absolute bottom-0 start-0 w-100 bg-primary" style={{ height: '2px' }}></div>}
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
                                        <option value="">All Institutional Batches</option>
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
                                    Showing <span className="fw-bold text-dark">{marks.length}</span> individual records
                                    {groupedView && mainTab === 'school' && <span> • Grouped into <span className="fw-bold text-primary">{displayMarks.length}</span> bundles</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Registry */}
                    <div className="card-modern shadow-sm p-0 overflow-hidden border-0">
                        <div className="table-responsive">
                            <table className="table align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="ps-4 py-3" style={{ width: '30%' }}>Student Candidate</th>
                                        <th style={{ width: '25%' }}>Assessment Unit</th>
                                        <th className="text-center" style={{ width: '15%' }}>Exam Date</th>
                                        <th className="text-center" style={{ width: '15%' }}>Score / Total</th>
                                        <th className="text-center" style={{ width: '15%' }}>Result</th>
                                        <th className="text-end pe-4" style={{ width: '15%' }}>Lifecycle Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayMarks.length > 0 ? displayMarks.map((item) => {
                                        const isExpanded = expandedGroups.has(item._id);

                                        if (item.isGroup) {
                                            return (
                                                <React.Fragment key={item._id}>
                                                    <tr className={`transition-all ${isExpanded ? 'bg-tertiary shadow-sm border-primary border-start' : 'hover-bg-tertiary'}`}
                                                        style={{ cursor: 'pointer', borderLeft: isExpanded ? '4px solid var(--accent-primary)' : '4px solid transparent' }}
                                                        onClick={() => toggleGroup(item._id)}>
                                                        <td className="ps-4">
                                                            <div className="d-flex align-items-center gap-3">
                                                                <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold transition-all ${isExpanded ? 'bg-primary text-white scale-110' : 'bg-primary-subtle text-primary'}`}
                                                                    style={{ width: '36px', height: '36px', fontSize: '0.8rem' }}>
                                                                    {isExpanded ? <ChevronDown size={18} /> : item.student?.userId?.name?.charAt(0) || 'S'}
                                                                </div>
                                                                <div>
                                                                    <div className="fw-bold small">{item.student?.userId?.name || 'Academic Scholar'}</div>
                                                                    <div className="text-muted" style={{ fontSize: '0.65rem' }}>{item.student?.registrationNumber || 'Pending'}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="small fw-bold text-primary">{item.unitName}</div>
                                                            <div className="text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                                                                <BookOpen size={10} /> {item.subjects.length} Subjects Breakdown
                                                            </div>
                                                        </td>
                                                        <td className="text-center">
                                                            <div className="small text-muted fw-medium">{new Date(item.examDate).toLocaleDateString()}</div>
                                                        </td>
                                                        <td className="text-center">
                                                            <span className="badge bg-white shadow-sm text-dark border px-3 py-2 rounded-pill fw-bold">
                                                                {item.marksObtained} <small className="text-muted mx-1">/</small> {item.totalMarks}
                                                            </span>
                                                        </td>
                                                        <td className="text-center">
                                                            <div className="d-flex flex-column align-items-center gap-1">
                                                                <span className={`fw-bold small ${item.percentage >= 75 ? 'text-success' : item.percentage >= 40 ? 'text-warning' : 'text-danger'}`}>
                                                                    {item.percentage}%
                                                                </span>
                                                                <div className="progress rounded-pill overflow-hidden bg-secondary-subtle" style={{ height: '4px', width: '45px' }}>
                                                                    <div className={`progress-bar transition-all ${item.percentage >= 75 ? 'bg-success' : item.percentage >= 40 ? 'bg-warning' : 'bg-danger'}`} style={{ width: `${item.percentage}%` }}></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-end pe-4">
                                                            {schoolSubTab === 'pending' ? (
                                                                <div className="d-flex justify-content-end gap-2">
                                                                    <button className="btn btn-sm btn-icon rounded-circle bg-success-subtle text-success border-0 p-2 hover-lift" title="Authorize Bundle" onClick={(e) => { e.stopPropagation(); handleApproveBundle(item.itemIds); }}>
                                                                        <CheckCircle2 size={16} />
                                                                    </button>
                                                                    <button className="btn btn-sm btn-icon rounded-circle bg-danger-subtle text-danger border-0 p-2 hover-lift" title="Reject Bundle" onClick={(e) => { e.stopPropagation(); handleRejectClick(item.itemIds, true); }}>
                                                                        <XCircle size={16} />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="d-flex align-items-center justify-content-end gap-3 text-muted">
                                                                    {isExpanded ? <ChevronDown size={20} className="opacity-75" /> : <LayoutGrid size={18} className="opacity-50" />}
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                    {isExpanded && item.subjects.map((sub, idx) => (
                                                        <tr key={sub._id} className="bg-light animate-fade-in" style={{ backgroundColor: 'rgba(var(--accent-primary-rgb), 0.03)' }}>
                                                            <td className="ps-5 text-muted small italic">↳ Subject {idx + 1}</td>
                                                            <td>
                                                                <div className="small fw-bold text-secondary">{sub.subject}</div>
                                                            </td>
                                                            <td></td>
                                                            <td className="text-center">
                                                                <span className="small text-muted">{sub.marksObtained} / {sub.totalMarks}</span>
                                                            </td>
                                                            <td className="text-center">
                                                                <span className="small fw-bold opacity-75">{sub.percentage}%</span>
                                                            </td>
                                                            <td className="text-end pe-4">
                                                                {schoolSubTab === 'pending' ? (
                                                                    <div className="d-flex justify-content-end gap-2 align-items-center">
                                                                        <button className="btn btn-sm btn-icon rounded-circle bg-success-subtle text-success border-0 flex-shrink-0" style={{ width: '32px', height: '32px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Approve" onClick={(e) => { e.stopPropagation(); handleApprove(sub._id); }}>
                                                                            <Check size={14} />
                                                                        </button>
                                                                        <button className="btn btn-sm btn-icon rounded-circle bg-warning-subtle text-warning border-0 flex-shrink-0" style={{ width: '32px', height: '32px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Edit & Approve" onClick={(e) => { e.stopPropagation(); handleEditClick(sub); }}>
                                                                            <Edit3 size={14} />
                                                                        </button>
                                                                        <button className="btn btn-sm btn-icon rounded-circle bg-danger-subtle text-danger border-0 flex-shrink-0" style={{ width: '32px', height: '32px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Reject" onClick={(e) => { e.stopPropagation(); handleRejectClick(sub); }}>
                                                                            <X size={14} />
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-success d-flex justify-content-end" title="Verified Performance">
                                                                        <CheckCircle2 size={16} />
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </React.Fragment>
                                            );
                                        }

                                        // Flat view for tuition or when groupedView is off
                                        return (
                                            <tr key={item._id} className="hover-bg-tertiary">
                                                <td className="ps-4">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold"
                                                            style={{ width: '32px', height: '32px', fontSize: '0.7rem' }}>
                                                            {item.studentId?.userId?.name?.charAt(0) || 'S'}
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold small">{item.studentId?.userId?.name || 'Academic Scholar'}</div>
                                                            <div className="text-muted" style={{ fontSize: '0.65rem' }}>{item.studentId?.registrationNumber || 'Pending'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="small fw-semibold">{item.subject}</div>
                                                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>{item.unitName}</div>
                                                </td>
                                                <td className="text-center">
                                                    <div className="small text-muted">{new Date(item.examDate).toLocaleDateString()}</div>
                                                </td>
                                                <td className="text-center">
                                                    <span className="badge bg-tertiary text-secondary border px-2.5 py-1.5 rounded-pill" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                                        {item.marksObtained} / {item.totalMarks}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <div className="d-flex flex-column align-items-center gap-1">
                                                        <span className={`fw-bold small ${item.percentage >= 75 ? 'text-success' : item.percentage >= 40 ? 'text-warning' : 'text-danger'}`}>
                                                            {item.percentage}%
                                                        </span>
                                                        <div className="progress rounded-pill overflow-hidden" style={{ height: '3px', width: '40px' }}>
                                                            <div className={`progress-bar ${item.percentage >= 75 ? 'bg-success' : 'bg-warning'}`} style={{ width: `${item.percentage}%` }}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-end pe-4">
                                                    {mainTab === 'school' && schoolSubTab === 'pending' ? (
                                                        <div className="d-flex justify-content-end gap-2">
                                                            <button className="btn btn-sm btn-icon rounded-circle bg-success-subtle text-success border-0 p-2 hover-lift" title="Approve" onClick={() => handleApprove(item._id)}>
                                                                <Check size={16} />
                                                            </button>
                                                            <button className="btn btn-sm btn-icon rounded-circle bg-warning-subtle text-warning border-0 p-2 hover-lift" title="Edit & Approve" onClick={() => handleEditClick(item)}>
                                                                <Edit3 size={16} />
                                                            </button>
                                                            <button className="btn btn-sm btn-icon rounded-circle bg-danger-subtle text-danger border-0 p-2 hover-lift" title="Reject" onClick={() => handleRejectClick(item)}>
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="d-flex justify-content-end">
                                                            {item.status === 'approved' ? (
                                                                <div className="text-success" title="Evaluation Verified">
                                                                    <CheckCircle2 size={20} />
                                                                </div>
                                                            ) : (
                                                                <div className="text-danger" title={`Rejected: ${item.rejectionReason || 'Discrepancy'}`}>
                                                                    <AlertCircle size={20} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    }) : (
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
                                        className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold d-flex align-items-center gap-1"
                                        disabled={pagination.page === 1}
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                    >
                                        <ChevronLeft size={16} />
                                        <span>Prev</span>
                                    </button>
                                    <button
                                        className="btn btn-sm btn-primary rounded-pill px-3 fw-bold shadow-sm d-flex align-items-center gap-1"
                                        disabled={pagination.page === pagination.pages}
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                    >
                                        <span>Next</span>
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Assessment Lifecycle Action Modal */}
            <AppModal
                show={actionModal.show}
                title={actionModal.type === 'reject' ? 'Assessment Rejection Protocol' : 'Academic Correction Protocol'}
                onClose={() => setActionModal({ show: false, type: '', mark: null, bundleIds: null, reason: '', score: '' })}
                width="400px"
            >
                <div className="p-4 bg-tertiary" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <div className="d-flex flex-column gap-3">
                        <div className="bg-white p-3 rounded-4 shadow-sm border">
                            <div className="text-muted small fw-bold text-uppercase mb-2">Subject Context</div>
                            <div className="fw-bold">{actionModal.bundleIds ? `${actionModal.bundleIds.length} Assessment Records` : actionModal.mark?.subject}</div>
                            <div className="text-muted small">{actionModal.bundleIds ? 'Institutional Batch Correction' : actionModal.mark?.unitName}</div>
                        </div>

                        {actionModal.type === 'reject' ? (
                            <div>
                                <label className="form-label small fw-bold text-muted text-uppercase">Rejection Reason</label>
                                <textarea
                                    className="form-control rounded-3 border-0 bg-white shadow-sm"
                                    placeholder="Enter specific discrepancy details..."
                                    rows="3"
                                    value={actionModal.reason}
                                    onChange={(e) => setActionModal({ ...actionModal, reason: e.target.value })}
                                />
                            </div>
                        ) : (
                            <div>
                                <label className="form-label small fw-bold text-muted text-uppercase">Modified Score</label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        className="form-control rounded-3 border-0 bg-white shadow-sm fw-bold text-center"
                                        value={actionModal.score}
                                        onChange={(e) => setActionModal({ ...actionModal, score: e.target.value })}
                                    />
                                    <span className="input-group-text bg-transparent border-0 fw-bold">/ {actionModal.mark?.totalMarks}</span>
                                </div>
                            </div>
                        )}

                        <div className="row g-2 mt-2">
                            <div className="col-6">
                                <button
                                    className="btn btn-light w-100 rounded-pill fw-bold"
                                    onClick={() => setActionModal({ show: false, type: '', mark: null, bundleIds: null, reason: '', score: '' })}
                                >
                                    Dismiss
                                </button>
                            </div>
                            <div className="col-6">
                                <button
                                    className={`btn w-100 rounded-pill fw-bold text-white shadow-sm ${actionModal.type === 'reject' ? 'bg-danger' : 'bg-primary'}`}
                                    onClick={actionModal.type === 'reject' ? submitRejection : submitCorrection}
                                >
                                    {actionModal.type === 'reject' ? 'Execute Reject' : 'Authorize Edit'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </AppModal>
        </div>
    );
}

export default Marks;
