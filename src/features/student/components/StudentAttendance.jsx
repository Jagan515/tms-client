import { Calendar, CheckCircle, XCircle, TrendingUp, ChevronRight } from "lucide-react";

function StudentAttendance({ history = [], stats }) {
    // Mock last 7 days for visualization if not provided
    const last7Days = history.slice(0, 7).reverse();

    return (
        <div className="card-modern shadow-lg border-0 h-100 overflow-hidden bg-white animate-fade-in">
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between bg-tertiary" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="d-flex align-items-center gap-x-2">
                    <Calendar className="w-4.5 h-4.5 text-primary flex-shrink-0" />
                    <h6 className="fw-bold mb-0">Attendance Velocity</h6>
                </div>
            </div>

            <div className="card-body p-4">
                <div className="d-flex justify-content-between text-center mb-5 mt-2">
                    {last7Days.map((day, index) => (
                        <div key={index} className="d-flex flex-column align-items-center gap-2 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
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

                <button className="btn btn-outline-secondary w-100 rounded-pill py-2.5 small fw-bold d-flex align-items-center justify-content-center gap-x-2 border-dashed transition-all hover-bg-tertiary">
                    <span>Inspect Holistic History</span>
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                </button>
            </div>

        </div>
    );
}

export default StudentAttendance;
