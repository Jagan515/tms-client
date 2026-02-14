import { History, Hash, CreditCard, User, Calendar, Receipt } from "lucide-react";

function PaymentHistory({ history = [] }) {
    if (!history || history.length === 0) {
        return (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
                <div className="bg-tertiary d-inline-block p-4 rounded-circle mb-3">
                    <History size={48} className="text-muted opacity-50" />
                </div>
                <h5 className="fw-bold text-secondary">No Transactions Found</h5>
                <p className="text-muted small">The digital ledger is currently empty for this selection.</p>
            </div>
        );
    }

    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
            <div className="p-4 border-bottom bg-tertiary d-flex align-items-center justify-content-between" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="d-flex align-items-center gap-3">
                    <Receipt className="text-primary" size={24} />
                    <div>
                        <h6 className="mb-0 fw-bold">Recent Settlements</h6>
                        <p className="mb-0 text-muted small" style={{ fontSize: '0.7rem' }}>Audit trail of historical revenue collections</p>
                    </div>
                </div>
                <div className="badge bg-primary rounded-pill px-3 py-1.5">{history.length} Receipts</div>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th className="ps-4">Student Candidate</th>
                            <th className="text-center">Total Amount</th>
                            <th className="text-center">Channel</th>
                            <th className="text-center">Settlement Date</th>
                            <th className="text-end pe-4">Receipt Reference</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((h) => (
                            <tr key={h._id}>
                                <td className="ps-4">
                                    <div className="d-flex align-items-center gap-3 py-2">
                                        <div className="avatar-sm bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold small" style={{ width: '32px', height: '32px' }}>
                                            {h.studentId?.userId?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="fw-bold small">{h.studentId?.userId?.name}</div>
                                            <div className="text-muted" style={{ fontSize: '0.65rem' }}>{h.studentId?.userId?.registrationNumber}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-center fw-bold text-success">₹{h.totalAmount?.toLocaleString()}</td>
                                <td className="text-center">
                                    <div className="d-inline-flex align-items-center gap-2 px-3 py-1 bg-tertiary rounded-pill small fw-bold" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                        <CreditCard size={12} className="text-primary" />
                                        <span>{h.paymentMethod}</span>
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className="small fw-semibold text-muted">
                                        {new Date(h.paymentDate).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="text-end pe-4">
                                    <div className="d-flex flex-column align-items-end">
                                        <code className="text-primary fw-bold" style={{ fontSize: '0.75rem' }}>#{h.receiptNumber}</code>
                                        <span className="text-muted" style={{ fontSize: '0.65rem' }}>{h.monthsCovered?.length} months included</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PaymentHistory;
