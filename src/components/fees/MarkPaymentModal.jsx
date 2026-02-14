import { useState, useEffect } from "react";
import feeService from "../../features/teacher/api/feeService";
import { Check, CheckCircle2, CreditCard, Calendar, Hash, FileText } from "lucide-react";

function MarkPaymentModal({ studentId, studentName, onSubmit, onCancel, loading }) {
    const [unpaidFees, setUnpaidFees] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [method, setMethod] = useState("Cash");
    const [notes, setNotes] = useState("");
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await feeService.getStudentFees(studentId);
                setUnpaidFees(data.fees.filter(f => f.status === 'unpaid'));
            } catch (err) { console.error(err); }
            finally { setFetching(false); }
        };
        if (studentId) load();
    }, [studentId]);

    const toggleFee = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const totalAmount = unpaidFees
        .filter(f => selectedIds.includes(f._id))
        .reduce((sum, f) => sum + f.amount, 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedIds.length === 0) return alert("Select at least one month.");
        onSubmit({
            studentId,
            feeIds: selectedIds,
            paymentMethod: method,
            notes
        });
    };

    if (fetching) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>;

    return (
        <form onSubmit={handleSubmit}>
            <div className="alert-callout mb-4 p-3 rounded-4 bg-tertiary border-0" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="small text-muted mb-1 text-uppercase letter-spacing-1 fw-bold">Capturing Settlement for</div>
                <div className="fw-bold fs-5 text-primary">{studentName}</div>
            </div>

            <div className="mb-4">
                <label className="form-label small fw-bold text-muted text-uppercase letter-spacing-1 mb-3">Select Outstanding Months</label>
                <div className="d-flex flex-column gap-2 max-h-40 overflow-auto pe-2">
                    {unpaidFees.length > 0 ? unpaidFees.map(fee => (
                        <div
                            key={fee._id}
                            className={`p-3 rounded-3 border transition-all cursor-pointer d-flex align-items-center justify-content-between ${selectedIds.includes(fee._id) ? 'border-primary bg-primary-subtle' : 'bg-white'}`}
                            onClick={() => toggleFee(fee._id)}
                        >
                            <div className="d-flex align-items-center gap-3">
                                <div className={`rounded-circle d-flex align-items-center justify-content-center ${selectedIds.includes(fee._id) ? 'bg-primary text-white' : 'bg-tertiary text-muted'}`} style={{ width: '24px', height: '24px' }}>
                                    {selectedIds.includes(fee._id) && <Check size={14} />}
                                </div>
                                <div>
                                    <div className="fw-bold small">{new Date(fee.year, fee.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
                                    <div className="text-muted small" style={{ fontSize: '0.7rem' }}>Due: {new Date(fee.dueDate).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <div className="fw-bold text-secondary">₹{fee.amount}</div>
                        </div>
                    )) : (
                        <div className="text-center py-4 bg-white rounded-3 border border-dashed">
                            <CheckCircle2 size={32} className="text-success opacity-50 mb-2" />
                            <div className="small fw-bold text-muted">No pending dues found</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-md-6">
                    <label className="form-label small fw-bold">Payment Channel</label>
                    <div className="position-relative">
                        <CreditCard className="position-absolute top-50 translate-middle-y ms-3 text-primary opacity-50" size={18} />
                        <select className="form-select ps-5 rounded-3 border-0 bg-tertiary" value={method} onChange={(e) => setMethod(e.target.value)}>
                            <option value="Cash">Physical Cash</option>
                            <option value="Online">UPI / Online Transfer</option>
                            <option value="Cheque">Bank Cheque</option>
                            <option value="Other">Other Mode</option>
                        </select>
                    </div>
                </div>
                <div className="col-md-6">
                    <label className="form-label small fw-bold">Notes / Ref</label>
                    <div className="position-relative">
                        <FileText className="position-absolute top-50 translate-middle-y ms-3 text-primary opacity-50" size={18} />
                        <input className="form-control ps-5 rounded-3 border-0 bg-tertiary" placeholder="Optional notes..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="bg-primary text-white p-4 rounded-4 d-flex align-items-center justify-content-between mb-4 shadow-lg">
                <div>
                    <div className="small opacity-75 fw-bold text-uppercase">Total Settlement</div>
                    <div className="fs-3 fw-bold">₹{totalAmount.toLocaleString()}</div>
                </div>
                <div className="text-end">
                    <div className="small opacity-75 fw-bold text-uppercase">Items</div>
                    <div className="fs-5 fw-bold">{selectedIds.length} Months</div>
                </div>
            </div>

            <div className="d-flex justify-content-end gap-3">
                <button type="button" className="btn btn-link text-muted fw-bold text-decoration-none" onClick={onCancel}>discard</button>
                <button type="submit" className="btn btn-primary px-5 py-2.5 rounded-pill shadow-lg fw-bold" disabled={loading || selectedIds.length === 0}>
                    {loading ? 'Finalizing...' : 'Authorize Receipt'}
                </button>
            </div>
        </form>
    );
}

export default MarkPaymentModal;
