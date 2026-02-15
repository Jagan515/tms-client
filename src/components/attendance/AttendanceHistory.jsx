import { ExternalLink, Calendar, CheckCircle, XCircle } from "lucide-react";

function AttendanceHistory({ history = [], onEdit }) {
    if (!history || history.length === 0) {
        return (
            <div className="text-center py-5 animate-fade-in">
                <div className="bg-tertiary d-inline-block p-4 rounded-circle mb-3">
                    <Calendar size={40} className="text-muted opacity-50" />
                </div>
                <p className="text-muted small fw-medium">Universal ledger is currently empty.</p>
                <div className="text-muted opacity-50" style={{ fontSize: '0.75rem' }}>Historical session data will appear here.</div>
            </div>
        );
    }

    return (
        <div className="table-responsive animate-fade-in">
            <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                    <tr>
                        <th className="ps-4 py-3">Academic Session</th>
                        <th className="text-center">Verification Count</th>
                        <th className="text-center">Persistence Ratio</th>
                        <th className="text-end pe-4">Detailed Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((record, index) => (
                        <tr key={index}>
                            <td className="ps-4">
                                <div className="d-flex flex-column">
                                    <div className="d-flex align-items-center gap-2">
                                        <Calendar size={14} className="text-primary opacity-50" />
                                        <span className="fw-semibold small">{new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    {record.batchName && (
                                        <small className="text-muted fw-bold mt-1 text-uppercase-caps" style={{ fontSize: '0.6rem' }}>
                                            {record.batchName}
                                        </small>
                                    )}
                                </div>
                            </td>
                            <td className="text-center">
                                <div className="d-flex justify-content-center gap-3">
                                    <div className="d-flex align-items-center gap-1 text-success small">
                                        <CheckCircle size={14} />
                                        <span>{record.presentCount}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-1 text-danger small">
                                        <XCircle size={14} />
                                        <span>{record.absentCount}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="text-center">
                                <div className="d-flex flex-column align-items-center gap-1">
                                    <span className={`small fw-bold ${record.percentage >= 75 ? 'text-success' : 'text-danger'}`}>{record.percentage}%</span>
                                    <div className="progress rounded-pill bg-tertiary" style={{ height: '4px', width: '60px' }}>
                                        <div className={`progress-bar rounded-pill ${record.percentage >= 75 ? 'bg-success' : 'bg-danger'}`}
                                            style={{ width: `${record.percentage}%` }}></div>
                                    </div>
                                </div>
                            </td>
                            <td className="text-end pe-4">
                                <button
                                    className="btn btn-sm btn-icon rounded-circle hover-bg-tertiary transition-all"
                                    onClick={() => onEdit?.(record.date)}
                                    title="Edit this session"
                                >
                                    <ExternalLink size={16} className="text-primary" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AttendanceHistory;
