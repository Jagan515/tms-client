import { useState } from "react";
import { Wallet, CheckCircle, Clock, AlertCircle, History, ChevronRight, CreditCard, ChevronLeft } from "lucide-react";

function StudentFees({ fees = [] }) {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();

    // Find fee ignoring case sensitivity if needed, though backend seems consistent.
    // Assuming backend returns month names like "January", "February" etc.
    const currentFee = fees.find(f => f.month === currentMonth && f.year === currentYear);

    const isPending = !currentFee || (currentFee.status && currentFee.status.toLowerCase() !== 'paid');

    // Pagination State
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(fees.length / itemsPerPage);

    const paginatedFees = fees.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    return (
        <div className="card-modern shadow-lg border-0 h-100 overflow-hidden bg-white animate-fade-in">
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between bg-tertiary" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="d-flex align-items-center gap-x-2">
                    <Wallet className="w-4.5 h-4.5 text-primary flex-shrink-0" />
                    <h6 className="fw-bold mb-0">Financial Status</h6>
                </div>
            </div>

            <div className="card-body p-4">
                <div className={`p-4 rounded-4 mb-5 border animate-pulse-subtle transition-all hover-lift ${isPending ? 'bg-warning-subtle border-warning-subtle text-warning' : 'bg-success-subtle border-success-subtle text-success'}`}
                    style={{ backgroundColor: isPending ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.08)' }}>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <div className="small fw-bold text-uppercase letter-spacing-1 mb-1 opacity-75">Billing Cycle</div>
                            <h4 className="fw-bold mb-0 tracking-tight" style={{ color: 'inherit' }}>{currentMonth} {currentYear}</h4>
                        </div>
                        <div className={`p-2 rounded-circle shadow-sm bg-white d-flex align-items-center justify-content-center ${isPending ? 'text-warning' : 'text-success'}`}>
                            {isPending ? <Clock className="w-5 h-5 flex-shrink-0" /> : <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                        </div>
                    </div>

                    <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
                        <div className={`px-3 py-1 rounded-pill small fw-bold ${isPending ? 'bg-warning text-white shadow-warning' : 'bg-success text-white shadow-success'}`} style={{ fontSize: '0.7rem' }}>
                            {isPending ? 'PENDING' : 'SETTLED'}
                        </div>
                        {isPending && <div className="text-warning small fw-bold" style={{ fontSize: '0.65rem' }}>DUE: 15TH {currentMonth.toUpperCase()}</div>}
                    </div>

                    <button className={`btn btn-sm w-100 rounded-pill py-2 fw-bold transition-all ${isPending ? 'btn-warning text-white shadow-lg' : 'btn-outline-success border-2'}`}>
                        {isPending ? 'Initiate Settlement' : 'Authorized Clearance'}
                    </button>
                </div>

                <div className="mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center gap-x-2 text-muted">
                            <History className="w-4 h-4 flex-shrink-0" />
                            <h6 className="small fw-bold text-uppercase mb-0 letter-spacing-1">Transaction History</h6>
                        </div>
                        {fees.length > 0 && <span className="small text-muted">{fees.length} Records</span>}
                    </div>

                    <div className="d-flex flex-column gap-2 min-h-200">
                        {paginatedFees.length > 0 ? (
                            paginatedFees.map((fee, i) => (
                                <div key={i} className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-tertiary transition-all hover-bg-secondary border border-transparent hover-border-subtle" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                    <div className="d-flex align-items-center gap-x-3">
                                        <div className="p-2 bg-white rounded-circle text-primary shadow-sm d-flex align-items-center justify-content-center">
                                            <CreditCard className="w-3.5 h-3.5 flex-shrink-0" />
                                        </div>
                                        <div>
                                            <div className="small fw-bold text-secondary">{fee.month} {fee.year}</div>
                                            <div className="text-muted" style={{ fontSize: '0.7rem' }}>Amount: ₹{fee.amount}</div>
                                        </div>
                                    </div>
                                    <div className={`d-flex align-items-center gap-x-1 small fw-bold ${fee.status === 'Paid' ? 'text-success' : 'text-danger'}`}>
                                        {fee.status === 'Paid' ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />}
                                        <span style={{ fontSize: '0.7rem' }}>{fee.status?.toUpperCase()}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-muted small">No transaction records found.</div>
                        )}

                        {/* Mock Empty State for visual balance if needed when really 0 records */}
                        {!fees.length && (
                            <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-tertiary opacity-50" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                <div className="d-flex align-items-center gap-x-3">
                                    <div className="p-2 bg-white rounded-circle text-primary shadow-sm d-flex align-items-center justify-content-center">
                                        <CreditCard className="w-3.5 h-3.5 flex-shrink-0" />
                                    </div>
                                    <span className="small fw-bold text-muted">No History Available</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination & Full Ledger Button */}
                <div className="mt-auto pt-3 border-top">
                    {fees.length > itemsPerPage ? (
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <button
                                className="btn btn-sm btn-icon border rounded-circle"
                                onClick={handlePrevPage}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="small fw-bold text-muted">Page {page} of {totalPages}</span>
                            <button
                                className="btn btn-sm btn-icon border rounded-circle"
                                onClick={handleNextPage}
                                disabled={page === totalPages}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    ) : null}

                    {fees.length > itemsPerPage && (
                        <button className="btn btn-link w-100 text-decoration-none text-muted small fw-bold d-flex align-items-center justify-content-center gap-x-2 hover-text-primary transition-all">
                            <span>Retrieve Full Financial Ledger</span>
                            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                        </button>
                    )}
                </div>
            </div>

        </div>
    );
}

export default StudentFees;
