import { AlertCircle, ArrowRight, MessageSquare, Clock, TrendingDown } from "lucide-react";

function FeeDefaulters({ defaulters = [], onPayLink }) {
    if (!defaulters || defaulters.length === 0) {
        return (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
                <div className="bg-success-subtle d-inline-block p-4 rounded-circle mb-3">
                    <Clock size={48} className="text-success" />
                </div>
                <h5 className="fw-bold text-secondary">Zero Arrears Detected</h5>
                <p className="text-muted small">All institutional accounts are currently in good standing.</p>
            </div>
        );
    }

    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
            <div className="p-4 border-bottom bg-danger-subtle d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                    <TrendingDown className="text-danger" size={24} />
                    <div>
                        <h6 className="mb-0 fw-bold text-danger">Outstanding Receivables</h6>
                        <p className="mb-0 text-muted small" style={{ fontSize: '0.7rem' }}>Tracking cumulative arrears and overdue metrics</p>
                    </div>
                </div>
                <div className="badge bg-danger rounded-pill px-3 py-1.5">{defaulters.length} Accounts</div>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th className="ps-4">Student Candidate</th>
                            <th className="text-center">Arrear Depth</th>
                            <th className="text-center">Arrears Total</th>
                            <th className="text-center">Persistence</th>
                            <th className="text-end pe-4">Recovery Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {defaulters.map((d) => (
                            <tr key={d.studentId}>
                                <td className="ps-4">
                                    <div className="d-flex align-items-center gap-3 py-2">
                                        <div className="avatar-sm bg-danger-subtle text-danger rounded-circle d-flex align-items-center justify-content-center fw-bold small" style={{ width: '32px', height: '32px' }}>
                                            {d.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="fw-bold small">{d.name}</div>
                                            <div className="text-muted" style={{ fontSize: '0.65rem' }}>{d.regNo}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-center">
                                    <span className="badge bg-tertiary text-danger border px-3 rounded-pill fw-bold" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                        {d.unpaidMonths} {d.unpaidMonths === 1 ? 'Month' : 'Months'}
                                    </span>
                                </td>
                                <td className="text-center fw-bold text-danger">₹{d.totalPending?.toLocaleString()}</td>
                                <td className="text-center">
                                    <div className="d-flex flex-column align-items-center gap-1">
                                        <span className="small fw-bold text-muted">{d.overdueDays} Days Overdue</span>
                                        <div className="progress rounded-pill" style={{ height: '3px', width: '60px' }}>
                                            <div className="progress-bar bg-danger" style={{ width: `${Math.min(d.overdueDays, 100)}%` }}></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-end pe-4">
                                    <div className="d-flex justify-content-end gap-2">
                                        <button className="btn btn-sm btn-icon rounded-circle bg-tertiary text-muted p-2 hover-lift" title="Send Reminder">
                                            <MessageSquare size={16} />
                                        </button>
                                        <button className="btn btn-sm btn-primary rounded-pill px-3 d-flex align-items-center gap-2" onClick={() => onPayLink(d)}>
                                            <span>Settle</span>
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-3 bg-tertiary text-center border-top">
                <span className="small text-muted fw-bold">Aggregate Recovery Potential: ₹{defaulters.reduce((acc, curr) => acc + curr.totalPending, 0).toLocaleString()}</span>
            </div>
        </div>
    );
}

export default FeeDefaulters;
