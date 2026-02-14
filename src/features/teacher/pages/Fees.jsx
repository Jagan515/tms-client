import { useState, useEffect, useCallback } from "react";
import PageHeader from "../../../components/common/PageHeader";
import AppModal from "../../../components/common/AppModal";
import Loading from "../../../components/common/Loading";
import FeeDashboard from "../../../components/fees/FeeDashboard";
import FeeDefaulters from "../../../components/fees/FeeDefaulters";
import MarkPaymentModal from "../../../components/fees/MarkPaymentModal";
import feeService from "../api/feeService";
import batchService from "../api/batchService";
import {
    CreditCard,
    Calendar,
    Filter,
    RefreshCcw,
    AlertCircle,
    ChevronDown,
    Search,
    History,
    ShieldCheck,
    ArrowRight
} from "lucide-react";

import PaymentHistory from "../../../components/fees/PaymentHistory";

function Fees() {
    const [stats, setStats] = useState({ collected: 0, monthPending: 0, pending: 0, defaulterCount: 0 });
    const [viewMode, setViewMode] = useState('registry'); // 'registry' | 'defaulters' | 'history'
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedBatch, setSelectedBatch] = useState("all");
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year] = useState(new Date().getFullYear());

    const [registry, setRegistry] = useState([]);
    const [defaulters, setDefaulters] = useState([]);
    const [historyList, setHistoryList] = useState([]);

    const [paymentContext, setPaymentContext] = useState(null); // { id, name }
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchRegistry = async () => {
        setLoading(true);
        try {
            const data = await feeService.getRegistry({ month, year, batchId: selectedBatch === 'all' ? null : selectedBatch });
            setRegistry(data.fees || []);

            // Calculate local stats for header
            const collected = (data.fees || []).filter(f => f.status === 'paid').reduce((s, c) => s + c.amount, 0);
            const pending = (data.fees || []).filter(f => f.status === 'unpaid').reduce((s, c) => s + c.amount, 0);
            setStats(prev => ({ ...prev, collected, monthPending: pending }));
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const fetchDefaulters = async () => {
        setLoading(true);
        try {
            const data = await feeService.getDefaulters(1, selectedBatch === 'all' ? null : selectedBatch); // 1+ months unpaid
            const totalArrears = (data.defaulters || []).reduce((acc, curr) => acc + (curr.totalPending || 0), 0);
            setDefaulters(data.defaulters || []);
            setStats(prev => ({
                ...prev,
                defaulterCount: data.defaulters?.length || 0,
                pending: totalArrears
            }));
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const fetchPaymentHistory = async () => {
        setLoading(true);
        try {
            const data = await feeService.getPaymentHistory(selectedBatch);
            setHistoryList(data.history || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSync = () => {
        if (viewMode === 'registry') fetchRegistry();
        else if (viewMode === 'defaulters') fetchDefaulters();
        else if (viewMode === 'history') fetchPaymentHistory();
    };

    useEffect(() => {
        const init = async () => {
            const data = await batchService.getAll();
            setBatches(data.batches || []);
            fetchRegistry();
            fetchDefaulters();
            fetchPaymentHistory();
        };
        init();
    }, []);

    useEffect(() => {
        if (viewMode === 'registry') fetchRegistry();
        else if (viewMode === 'defaulters') fetchDefaulters();
        else if (viewMode === 'history') fetchPaymentHistory();
    }, [month, selectedBatch, viewMode]);

    const handleRecordPayment = async (payload) => {
        setActionLoading(true);
        try {
            await feeService.recordPayment(payload);
            setShowPaymentModal(false);
            // Refresh based on current view
            handleSync();
        } catch (error) { alert(error.message); }
        finally { setActionLoading(false); }
    };

    const openPayment = (studentId, name) => {
        setPaymentContext({ id: studentId, name });
        setShowPaymentModal(true);
    };

    if (loading && batches.length === 0) return <Loading text="Initializing fiscal modules..." />;

    return (
        <div className="p-4 animate-fade-in" style={{ minHeight: '100vh' }}>
            <div className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <PageHeader
                        title="Financial Treasury"
                        subtitle="Integrated revenue management and arrears tracking"
                    />
                    <div className="d-flex gap-2">
                        <button className="btn btn-outline-primary rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm" onClick={handleSync}>
                            <RefreshCcw size={18} />
                            <span>Sync {viewMode === 'registry' ? 'Registry' : viewMode === 'defaulters' ? 'Ledger' : 'History'}</span>
                        </button>
                        {viewMode === 'registry' && (
                            <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2 shadow-lg" onClick={() => feeService.generateMonthly().then(() => fetchRegistry())}>
                                <CreditCard size={18} />
                                <span>Generate Fees</span>
                            </button>
                        )}
                    </div>
                </div>

                <FeeDashboard stats={stats} month={month} />
            </div>

            {/* Navigation Tabs */}
            <div className="d-flex gap-3 mb-4 bg-tertiary p-2 rounded-4 d-inline-flex" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <button
                    className={`btn rounded-pill px-4 py-2 d-flex align-items-center gap-2 border-0 transition-all ${viewMode === 'registry' ? 'bg-white shadow-sm text-primary' : 'text-muted'}`}
                    onClick={() => setViewMode('registry')}
                >
                    <Calendar size={18} />
                    <span className="fw-bold">Monthly Registry</span>
                </button>
                <button
                    className={`btn rounded-pill px-4 py-2 d-flex align-items-center gap-2 border-0 transition-all ${viewMode === 'defaulters' ? 'bg-white shadow-sm text-danger' : 'text-muted'}`}
                    onClick={() => setViewMode('defaulters')}
                >
                    <AlertCircle size={18} />
                    <span className="fw-bold">Defaulters Ledger</span>
                    {stats.defaulterCount > 0 && <span className="badge bg-danger rounded-circle p-1" style={{ fontSize: '0.6rem' }}>{stats.defaulterCount}</span>}
                </button>
                <button
                    className={`btn rounded-pill px-4 py-2 d-flex align-items-center gap-2 border-0 transition-all ${viewMode === 'history' ? 'bg-white shadow-sm text-primary' : 'text-muted'}`}
                    onClick={() => setViewMode('history')}
                >
                    <History size={18} />
                    <span className="fw-bold">Settlement History</span>
                </button>
            </div>

            {/* Filters Bar */}
            <div className="card-modern shadow-sm border-0 mb-4 p-3 bg-white">
                <div className="row g-3 align-items-center">
                    {viewMode === 'registry' && (
                        <div className="col-md-3">
                            <select className="form-select border-0 bg-tertiary rounded-3" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                                    <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className={viewMode === 'registry' ? "col-md-3" : "col-md-4"}>
                        <select className="form-select border-0 bg-tertiary rounded-3" value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
                            <option value="all">📚 All Batches (Consolidated)</option>
                            {batches.map(b => (
                                <option key={b._id} value={b._id}>
                                    {b.name} ({b.studentCount || 0} students)
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={(viewMode === 'registry' ? "col-md-6" : "col-md-8") + " d-flex justify-content-end gap-5 px-4"}>
                        <div className="text-center">
                            <div className="small text-muted fw-bold text-uppercase opacity-75" style={{ fontSize: '0.65rem' }}>Collected</div>
                            <div className="fw-bold text-success">₹{(stats.collected || 0).toLocaleString()}</div>
                        </div>
                        <div className="text-center">
                            <div className="small text-muted fw-bold text-uppercase opacity-75" style={{ fontSize: '0.65rem' }}>Outstanding</div>
                            <div className="fw-bold text-danger">₹{(stats.monthPending || 0).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>

            {viewMode === 'registry' ? (
                <div className="card-modern shadow-sm p-0 overflow-hidden border-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4 py-3">Student Candidate</th>
                                    <th>Planned Amount</th>
                                    <th className="text-center">Due Metric</th>
                                    <th className="text-center">Lifecycle Status</th>
                                    <th className="text-end pe-4">Accounting Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registry.length > 0 ? registry.map((fee) => (
                                    <tr key={fee._id}>
                                        <td className="ps-4">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="avatar-sm bg-tertiary text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold small" style={{ width: '32px', height: '32px' }}>
                                                    {fee.studentId?.userId?.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="fw-bold small">{fee.studentId?.userId?.name}</div>
                                                    <div className="text-muted" style={{ fontSize: '0.65rem' }}>{fee.studentId?.registrationNumber}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="fw-bold text-secondary">₹{fee.amount}</td>
                                        <td className="text-center small text-muted">{new Date(fee.dueDate).toLocaleDateString()}</td>
                                        <td className="text-center">
                                            <span className={`badge rounded-pill px-3 py-1.5 small letter-spacing-1 fw-bold ${fee.status === 'paid' ? 'bg-success-subtle text-success' :
                                                fee.status === 'skipped' ? 'bg-secondary-subtle text-secondary' :
                                                    'bg-danger-subtle text-danger'
                                                }`}>
                                                {fee.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="text-end pe-4">
                                            {fee.status === 'unpaid' ? (
                                                <button className="btn btn-sm btn-primary rounded-pill px-3 d-flex align-items-center gap-2 ms-auto" onClick={() => openPayment(fee.studentId._id, fee.studentId.userId.name)}>
                                                    <span>Collect Fee</span>
                                                    <ArrowRight size={14} />
                                                </button>
                                            ) : (
                                                <div className="d-inline-flex align-items-center gap-1 text-success small fw-bold">
                                                    <ShieldCheck size={14} />
                                                    <span>Verified Receipt</span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5">
                                            <div className="text-muted opacity-50">No records found for the selected period.</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : viewMode === 'defaulters' ? (
                <div className="animate-fade-in-up">
                    <FeeDefaulters
                        defaulters={defaulters}
                        onPayLink={(d) => openPayment(d.studentId, d.name)}
                    />
                </div>
            ) : (
                <div className="animate-fade-in-up">
                    <PaymentHistory history={historyList} />
                </div>
            )}

            <AppModal
                show={showPaymentModal}
                title="Authorized Financial Reception"
                onClose={() => setShowPaymentModal(false)}
                size="lg"
            >
                <MarkPaymentModal
                    studentId={paymentContext?.id}
                    studentName={paymentContext?.name}
                    onSubmit={handleRecordPayment}
                    onCancel={() => setShowPaymentModal(false)}
                    loading={actionLoading}
                />
            </AppModal>

        </div>
    );
}

export default Fees;
