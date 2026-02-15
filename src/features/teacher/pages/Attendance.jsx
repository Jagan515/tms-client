import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";
import Loading from "../../../components/Loading";
import AttendanceMarking from "../../../components/attendance/AttendanceMarking";
import AttendanceHistory from "../../../components/attendance/AttendanceHistory";
import DatePicker from "../../../components/common/DatePicker";
import batchService from "../api/batchService";
import attendanceService from "../api/attendanceService";
import {
    BookOpen,
    Edit3,
    History,
    ChevronLeft,
    RefreshCcw,
    Clock,
    CheckCircle2,
    AlertCircle,
    UserCircle
} from "lucide-react";

function Attendance() {
    const [searchParams, setSearchParams] = useSearchParams();
    const mode = searchParams.get('mode') || 'view';
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(searchParams.get('batchId') || "");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
    const [sessionData, setSessionData] = useState(null);
    const [attendanceExists, setAttendanceExists] = useState(false);
    const [dailyOverview, setDailyOverview] = useState(null);
    const [fetchingOverview, setFetchingOverview] = useState(false);

    const fetchDailyOverview = async (selectedDate) => {
        setFetchingOverview(true);
        try {
            const data = await attendanceService.getDailyOverview(selectedDate);
            setDailyOverview(data);
        } catch (err) {
            console.error("Failed to fetch daily overview", err);
        } finally {
            setFetchingOverview(false);
        }
    };

    useEffect(() => {
        if (date) fetchDailyOverview(date);
    }, [date]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchHistory = async (batchId = 'all', page = 1) => {
        try {
            const data = await attendanceService.getBatchHistory(batchId, page);
            setHistory(data.history || []);
            setPagination(data.pagination || { page: 1, pages: 1, total: 0, limit: 10 });
        } catch (err) { console.error(err); }
    };

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const data = await batchService.getAll();
            setBatches(data.batches || []);

            const bId = searchParams.get('batchId');
            if (bId) {
                setSelectedBatch(bId);
                fetchHistory(bId);
            } else {
                fetchHistory('all');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            fetchHistory(selectedBatch || 'all', newPage);
        }
    };

    useEffect(() => {
        if (selectedBatch) {
            fetchHistory(selectedBatch);
            // Sync URL
            const newParams = new URLSearchParams(searchParams);
            newParams.set('batchId', selectedBatch);
            setSearchParams(newParams);
        }
    }, [selectedBatch, searchParams, setSearchParams]); // Added searchParams and setSearchParams to dependency array

    // Check if attendance exists for selected date
    useEffect(() => {
        if (selectedBatch && date) {
            const exists = history.some(h => {
                const hDate = new Date(h.date).toISOString().split('T')[0];
                return hDate === date;
            });
            setAttendanceExists(exists);
        }
    }, [selectedBatch, date, history]);

    const handleMarkClick = async () => {
        setLoading(true);
        try {
            const data = await attendanceService.getSession(selectedBatch, date);
            setSessionData(data);

            // Update URL mode
            const newParams = new URLSearchParams(searchParams);
            newParams.set('mode', 'mark');
            setSearchParams(newParams);
        } catch (err) {
            console.error(err);
            alert("Failed to initialize session: " + err.message);
        }
        finally { setLoading(false); }
    };

    const handleExitMarking = () => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('mode');
        setSearchParams(newParams);
        if (selectedBatch) fetchHistory(selectedBatch);
        if (date) fetchDailyOverview(date);
    };

    const handleHistoryEdit = async (selectedDate) => {
        const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
        setDate(formattedDate);
        setLoading(true);
        try {
            const data = await attendanceService.getSession(selectedBatch, formattedDate);
            setSessionData(data);

            const newParams = new URLSearchParams(searchParams);
            newParams.set('mode', 'mark');
            setSearchParams(newParams);
        } catch (err) {
            console.error(err);
            alert("Failed to load session for editing: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && batches.length === 0) return <Loading text="Initializing attendance modules..." />;

    return (
        <div className="p-4 animate-fade-in" style={{ minHeight: '100vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <PageHeader
                    title="Attendance Ledger"
                    subtitle="Integrated tracking system for batch-wise presence monitoring"
                />
                <div className="d-flex gap-2">

                    {mode === 'mark' && (
                        <button className="btn btn-outline-secondary rounded-pill px-4 d-flex align-items-center gap-2 border-dashed shadow-sm" onClick={handleExitMarking}>
                            <ChevronLeft size={18} />
                            <span>Exit Marking Mode</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Daily Schedule Overview */}
            {mode === 'view' && dailyOverview && (
                <div className="mb-5 animate-fade-in">
                    <div className="d-flex align-items-center justify-content-between mb-4 px-1">
                        <div className="d-flex align-items-center gap-3">
                            <div className="d-flex align-items-center gap-2">
                                <Clock className="text-primary" size={20} />
                                <h5 className="mb-0 fw-bold text-uppercase small letter-spacing-2">
                                    {dailyOverview.day}'s Curated Schedule
                                </h5>
                            </div>
                            <RefreshCcw size={14} className={`cursor-pointer transition-all ${fetchingOverview ? 'animate-spin text-primary' : 'text-muted opacity-50 hover-opacity-100'}`} onClick={() => fetchDailyOverview(date)} />
                        </div>
                    </div>

                    <div className="row g-4">
                        {dailyOverview.batches.length > 0 ? (
                            dailyOverview.batches.map((b) => (
                                <div key={b.batchId} className="col-md-6 col-xl-4">
                                    <div
                                        className={`card-modern h-100 p-4 border-0 shadow-sm transition-all cursor-pointer hover-lift ${selectedBatch === b.batchId ? 'ring-active shadow-premium' : ''}`}
                                        onClick={() => setSelectedBatch(b.batchId)}
                                        style={{
                                            backgroundColor: selectedBatch === b.batchId ? 'var(--surface-elevated)' : 'var(--surface-card)',
                                            border: selectedBatch === b.batchId ? '2px solid var(--accent-primary)' : '1px solid var(--border-default)'
                                        }}
                                    >
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <div className={`p-2 rounded-3 ${b.isMarked ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                                                    <BookOpen size={20} />
                                                </div>
                                                <h6 className="fw-bold mb-0">{b.name}</h6>
                                            </div>
                                            <div className="badge rounded-pill bg-tertiary border shadow-sm px-3 py-1 text-primary small fw-bold">
                                                {b.time || 'TBD'}
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top border-light">
                                            <div className="d-flex align-items-center gap-2">
                                                {b.isMarked ? (
                                                    <CheckCircle2 size={16} className="text-success" />
                                                ) : (
                                                    <AlertCircle size={16} className="text-warning" />
                                                )}
                                                <span className={`small fw-bold ${b.isMarked ? 'text-success' : 'text-warning'}`}>
                                                    {b.isMarked ? 'AUTHENTICATED' : 'PENDING ACTION'}
                                                </span>
                                            </div>
                                            {b.stats && (
                                                <div className="text-muted small fw-bold">
                                                    {b.stats.percentage}% Presence
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12">
                                <div className="p-4 text-center bg-tertiary rounded-4 border-dashed">
                                    <p className="text-muted mb-0 small fw-medium text-uppercase letter-spacing-1">No institutional batches scheduled for this specific epoch.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {loading && mode === 'mark' && <Loading text="Preparing academic session ledger..." />}

            {!loading && mode === 'view' && (
                <div className="card-modern shadow-lg border-0 mb-5 p-4 bg-tertiary-subtle" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <div className="row g-4 align-items-end">
                        <div className="col-lg-4">
                            <label className="form-label small fw-bold text-muted text-uppercase letter-spacing-1 mb-2">Class Group</label>
                            <div className="position-relative">
                                <BookOpen className="position-absolute top-50 translate-middle-y ms-3 text-primary opacity-50" size={18} />
                                <select className="form-select ps-5 rounded-3 shadow-sm" style={{ height: '48px' }} value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
                                    <option value="" disabled>Select Batch Group</option>
                                    {batches.map(b => (
                                        <option key={b._id} value={b._id}>
                                            {b.name} ({b.studentCount || 0} students)
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <label className="form-label small fw-bold text-muted text-uppercase letter-spacing-1 mb-2">Session Date</label>
                            <DatePicker
                                selectedDate={date}
                                onChange={(e) => setDate(e.target.value)}
                                placeholder="Select Session Date"
                            />
                        </div>
                        <div className="col-lg-4">
                            <button className="btn btn-primary w-100 rounded-3 shadow-lg d-flex align-items-center justify-content-center gap-2 hover-lift"
                                style={{ height: '48px' }} onClick={handleMarkClick} disabled={!selectedBatch}>
                                <Edit3 size={18} />
                                <span className="fw-bold">{attendanceExists ? 'Edit Attendance' : 'Mark Attendance'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="animate-fade-in">
                {mode === 'mark' && sessionData ? (
                    <AttendanceMarking
                        session={sessionData}
                        records={sessionData.records}
                        onCancel={handleExitMarking}
                    />
                ) : mode === 'view' ? (
                    <div className="card-modern shadow-sm p-0 overflow-hidden">
                        <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-2">
                                <div className="d-flex align-items-center gap-2 text-primary">
                                    <History size={20} />
                                    <h5 className="mb-0 fw-bold">{selectedBatch ? 'Batch Ledger' : 'Institutional Ledger'}</h5>
                                </div>
                                <RefreshCcw size={14} className={`cursor-pointer transition-all ${loading ? 'animate-spin text-primary' : 'text-muted opacity-50 hover-opacity-100'}`} onClick={() => fetchHistory(selectedBatch || 'all')} />
                            </div>
                            <div className="d-none d-md-flex align-items-center gap-2">
                                <div className="badge bg-success-subtle text-success rounded-pill px-3 py-2">Batch Consistency Overview</div>
                            </div>
                        </div>
                        <AttendanceHistory
                            history={history}
                            onEdit={handleHistoryEdit}
                        />
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
                ) : !loading && mode === 'mark' && !sessionData ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading session...</span>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default Attendance;
