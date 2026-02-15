import { Calendar, CheckCircle, XCircle, TrendingUp, ChevronRight, User, Clock, ChevronLeft } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../../../config/appConfig";
import AppModal from "../../../components/common/AppModal";

function StudentAttendance({ history = [], stats, createdAt }) {
    const [viewMode, setViewMode] = useState("overview"); // overview or calendar
    const [showHistory, setShowHistory] = useState(false);
    const [paginatedData, setPaginatedData] = useState({ records: [], pagination: {} });
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Calendar State
    const [currentCalDate, setCurrentCalDate] = useState(new Date());

    // Joining Date logic
    const joinDate = new Date(createdAt);
    joinDate.setHours(0, 0, 0, 0);

    // Mock last 7 days for visualization if not provided
    const last7Days = history.slice(0, 7).reverse();

    const fetchHistory = async (page = 1) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${serverEndpoint}/student-view/attendance?page=${page}&limit=10`,
                { withCredentials: true }
            );
            setPaginatedData(response.data);
            setCurrentPage(page);
        } catch (error) {
            console.error("Failed to load attendance history", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenHistory = () => {
        setShowHistory(true);
        fetchHistory(1);
    };

    // Calendar Helper Functions
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const renderCalendar = () => {
        const year = currentCalDate.getFullYear();
        const month = currentCalDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const days = [];
        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            date.setHours(0, 0, 0, 0);

            const isFuture = date > today;
            const isBeforeJoin = date < joinDate;
            const isToday = date.getTime() === today.getTime();

            // Find attendance for this day
            const record = history.find(h => {
                const recDate = new Date(h.date);
                recDate.setHours(0, 0, 0, 0);
                return recDate.getTime() === date.getTime();
            });

            let statusClass = "";
            let statusIcon = null;
            if (record) {
                statusClass = record.status === 'Present' ? 'bg-success text-white' : 'bg-danger text-white';
                statusIcon = record.status === 'Present' ? <CheckCircle size={10} /> : <XCircle size={10} />;
            } else if (isBeforeJoin) {
                statusClass = "bg-light text-muted opacity-50";
            } else if (isFuture) {
                statusClass = "border border-dashed text-muted opacity-25";
            } else {
                statusClass = "bg-secondary-subtle text-muted";
            }

            days.push(
                <div key={day} className={`calendar-day d-flex flex-column align-items-center justify-content-center position-relative rounded-3 transition-all hover-scale ${statusClass}`}
                    style={{
                        width: '100%', aspectRatio: '1/1', fontSize: '0.8rem', cursor: record ? 'pointer' : 'default',
                        border: isToday ? '2px solid var(--accent-primary)' : 'none'
                    }}>
                    <span className="fw-bold">{day}</span>
                    <div className="position-absolute bottom-0 mb-1">
                        {statusIcon}
                    </div>
                    {isToday && <div className="position-absolute top-0 end-0 mt-1 me-1"><div className="bg-primary rounded-circle" style={{ width: '4px', height: '4px' }}></div></div>}
                </div>
            );
        }

        return days;
    };

    const changeMonth = (offset) => {
        const newDate = new Date(currentCalDate.setMonth(currentCalDate.getMonth() + offset));
        setCurrentCalDate(new Date(newDate));
    };

    return (
        <div className="card-modern shadow-lg border-0 h-100 overflow-hidden bg-white animate-fade-in">
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between bg-tertiary" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="d-flex align-items-center gap-x-2">
                    <Calendar className="w-4.5 h-4.5 text-primary flex-shrink-0" />
                    <h6 className="fw-bold mb-0">Attendance Explorer</h6>
                </div>
                <div className="btn-group btn-group-sm rounded-pill p-1 border bg-white shadow-sm">
                    <button className={`btn rounded-pill px-3 fw-bold ${viewMode === 'overview' ? 'btn-primary' : 'btn-link text-muted'}`} onClick={() => setViewMode('overview')}>Velocity</button>
                    <button className={`btn rounded-pill px-3 fw-bold ${viewMode === 'calendar' ? 'btn-primary' : 'btn-link text-muted'}`} onClick={() => setViewMode('calendar')}>Calendar</button>
                </div>
            </div>

            <div className="card-body p-4">
                {viewMode === "overview" ? (
                    <div className="animate-fade-in">
                        <div className="d-flex justify-content-between text-center mb-5 mt-2 overflow-x-auto pb-2 gap-3 hide-scrollbar">
                            {last7Days.map((day, index) => (
                                <div key={index} className="d-flex flex-column align-items-center gap-2 animate-fade-in flex-shrink-0" style={{ animationDelay: `${index * 0.1}s`, minWidth: '45px' }}>
                                    <small className="text-muted fw-bold d-block letter-spacing-1" style={{ fontSize: '0.6rem' }}>{day.day?.substring(0, 3).toUpperCase()}</small>
                                    <div className={`rounded-circle d-flex align-items-center justify-content-center shadow-sm transition-all hover-scale ${day.status === 'Present' ? 'bg-success text-white' : 'bg-danger text-white'}`} style={{ width: '32px', height: '32px' }}>
                                        {day.status === 'Present' ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> : <XCircle className="w-3.5 h-3.5 flex-shrink-0" />}
                                    </div>
                                </div>
                            ))}
                            {last7Days.length === 0 && (
                                <div className="p-4 text-center text-muted w-100 italic opacity-50 small">No recent telemetry data available.</div>
                            )}
                        </div>

                        <div className="stats-breakdown bg-tertiary rounded-4 p-4 border mb-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="d-flex align-items-center gap-x-2">
                                    <div className="bg-white p-1.5 rounded-3 shadow-sm text-primary d-flex align-items-center justify-content-center">
                                        <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
                                    </div>
                                    <span className="small fw-semibold text-secondary">Current Month Persistence</span>
                                </div>
                                <span className="fw-bold small text-primary">{stats?.thisMonthPct || 0}%</span>
                            </div>
                            <div className="progress rounded-pill bg-white shadow-inner" style={{ height: '6px' }}>
                                <div className="progress-bar rounded-pill bg-primary shadow-sm transition-all"
                                    style={{ width: `${stats?.thisMonthPct || 0}%`, transitionDuration: '1s' }}></div>
                            </div>
                            <div className="mt-2 text-end text-muted" style={{ fontSize: '0.65rem' }}>
                                {stats?.thisMonth || '0/0'} sessions verified
                            </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center p-3 rounded-3 bg-secondary mb-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                            <span className="small fw-bold text-muted">Overall Integrity</span>
                            <div className="badge-modern px-3 py-1 rounded-pill bg-primary text-white shadow-sm fw-bold" style={{ fontSize: '0.8rem' }}>
                                {stats?.overallPct || 0}%
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <button className="btn btn-icon btn-sm hover-bg-tertiary rounded-circle" onClick={() => changeMonth(-1)}><ChevronLeft size={18} /></button>
                            <h6 className="fw-bold text-primary m-0 text-uppercase letter-spacing-1">
                                {currentCalDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </h6>
                            <button className="btn btn-icon btn-sm hover-bg-tertiary rounded-circle" onClick={() => changeMonth(1)}><ChevronRight size={18} /></button>
                        </div>

                        <div className="calendar-grid bg-tertiary p-3 rounded-4 border mb-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <div className="row g-1 text-center mb-2 fw-bold text-muted" style={{ fontSize: '0.6rem' }}>
                                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => <div key={d} className="col">{d}</div>)}
                            </div>
                            <div className="row g-1">
                                {renderCalendar().map((dayComp, idx) => (
                                    <div key={idx} className="col" style={{ width: '14.28%', flex: '0 0 14.28%' }}>
                                        {dayComp}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="d-flex flex-wrap gap-3 justify-content-center mb-4">
                            <div className="d-flex align-items-center gap-1 small fw-bold text-muted">
                                <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                                <span>Present</span>
                            </div>
                            <div className="d-flex align-items-center gap-1 small fw-bold text-muted">
                                <div className="bg-danger rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                                <span>Absent</span>
                            </div>
                            <div className="d-flex align-items-center gap-1 small fw-bold text-muted">
                                <div className="border border-dashed rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                                <span>Upcoming</span>
                            </div>
                            <div className="d-flex align-items-center gap-1 small fw-bold text-muted opacity-50">
                                <div className="bg-light rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                                <span>Before Join</span>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    className="btn btn-outline-secondary w-100 rounded-pill py-2.5 small fw-bold d-flex align-items-center justify-content-center gap-x-2 border-dashed transition-all hover-bg-tertiary"
                    onClick={handleOpenHistory}
                >
                    <span>Inspect Holistic History</span>
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                </button>
            </div>

            {/* Attendance History Modal */}
            <AppModal
                show={showHistory}
                onClose={() => setShowHistory(false)}
                title="Historical Attendance Ledger"
                width="800px"
            >
                <div className="p-0 d-flex flex-column h-100" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <div className="p-4 overflow-auto custom-scrollbar flex-grow-1" style={{ maxHeight: '60vh' }}>
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                                <div className="mt-2 text-muted small fw-bold text-uppercase tracking-widest">Retrieving Records...</div>
                            </div>
                        ) : (
                            <div className="card-modern border-0 shadow-sm overflow-hidden p-0" style={{ backgroundColor: 'var(--surface-card)' }}>
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="bg-dark text-white opacity-90 small fw-bold text-uppercase letter-spacing-1">
                                            <tr>
                                                <th className="ps-4 border-0">Temporal Record</th>
                                                <th className="text-center border-0">Status</th>
                                                <th className="border-0">Marked By</th>
                                                <th className="pe-4 border-0">Action/Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedData.records.map((record, i) => (
                                                <tr key={i} className="align-middle">
                                                    <td className="ps-4 py-3">
                                                        <div className="fw-bold text-dark">{record.day.split(',')[0]}</div>
                                                        <div className="text-muted small d-flex align-items-center gap-1">
                                                            <Clock size={12} /> {record.day.split(',').slice(1).join(',')}
                                                        </div>
                                                    </td>
                                                    <td className="text-center py-3">
                                                        <span className={`badge rounded-pill ${record.status === 'Present' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                                                            {record.status === 'Present' ? <CheckCircle size={12} className="me-1" /> : <XCircle size={12} className="me-1" />}
                                                            {record.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="p-1 bg-primary-subtle rounded text-primary">
                                                                <User size={14} />
                                                            </div>
                                                            <span className="small fw-bold text-secondary">{record.markedBy}</span>
                                                        </div>
                                                    </td>
                                                    <td className="pe-4 py-3">
                                                        <span className="text-muted italic small">{record.remarks || 'No digital signature provided.'}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {paginatedData.records.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-5 text-muted italic">No historical records found for this identity.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Modal Footer with Pagination */}
                    <div className="p-3 border-top bg-white d-flex justify-content-between align-items-center" style={{ borderTopWidth: '2px !important' }}>
                        <div className="text-muted small fw-bold">
                            Showing Page <span className="text-primary">{paginatedData.pagination?.page || 0}</span> of <span className="text-dark">{paginatedData.pagination?.pages || 0}</span>
                        </div>
                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-bold d-flex align-items-center gap-1"
                                onClick={() => fetchHistory(currentPage - 1)}
                                disabled={currentPage === 1 || loading}
                            >
                                <ChevronLeft size={16} /> Previous
                            </button>
                            <button
                                className="btn btn-sm btn-primary rounded-pill px-3 fw-bold d-flex align-items-center gap-1"
                                onClick={() => fetchHistory(currentPage + 1)}
                                disabled={currentPage === paginatedData.pagination?.pages || loading}
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </AppModal>
        </div>
    );
}

export default StudentAttendance;
