import { useState, useEffect } from "react";
import { Check, X, Mail, Send, Save, Ban, UserCheck, UserX, Loader2, CloudCheck, CloudOff } from "lucide-react";
import attendanceService from "../../features/teacher/api/attendanceService";

function AttendanceMarking({ session, records: initialRecords = [], onCancel }) {
    const [records, setRecords] = useState(Array.isArray(initialRecords) ? initialRecords : []);
    const [savingStatus, setSavingStatus] = useState({}); // { studentId: 'saving' | 'saved' | 'failed' }
    const [sendEmail, setSendEmail] = useState(true);

    // Sync state with props if they change
    useEffect(() => {
        if (Array.isArray(initialRecords)) {
            setRecords(initialRecords);
        }
    }, [initialRecords]);

    const handleStatusToggle = async (studentId, newStatus) => {
        // Optimistic Update
        const oldRecords = [...records];
        setRecords(prev => prev.map(r => r.studentId?._id === studentId ? { ...r, status: newStatus } : r));
        setSavingStatus(prev => ({ ...prev, [studentId]: 'saving' }));

        try {
            await attendanceService.patchRecord({
                attendanceId: session?._id,
                studentId,
                status: newStatus
            });
            setSavingStatus(prev => ({ ...prev, [studentId]: 'saved' }));
            // Clear 'saved' after 2 seconds
            setTimeout(() => {
                setSavingStatus(prev => ({ ...prev, [studentId]: null }));
            }, 2000);
        } catch (error) {
            console.error("Auto-save failed", error);
            setRecords(oldRecords); // Revert
            setSavingStatus(prev => ({ ...prev, [studentId]: 'failed' }));
        }
    };

    const handleRemarkChange = (studentId, remarks) => {
        setRecords(prev => prev.map(r => r.studentId?._id === studentId ? { ...r, remarks } : r));
    };

    const saveRemark = async (studentId, remarks) => {
        setSavingStatus(prev => ({ ...prev, [studentId]: 'saving' }));
        try {
            const currentRecord = records.find(r => r.studentId?._id === studentId);
            await attendanceService.patchRecord({
                attendanceId: session?._id,
                studentId,
                status: currentRecord?.status,
                remarks
            });
            setSavingStatus(prev => ({ ...prev, [studentId]: 'saved' }));
            setTimeout(() => setSavingStatus(prev => ({ ...prev, [studentId]: null })), 2000);
        } catch (error) {
            setSavingStatus(prev => ({ ...prev, [studentId]: 'failed' }));
        }
    };

    const presentCount = records.filter(r => r.status === 'present').length;
    const absentCount = records.filter(r => r.status === 'absent').length;

    // Safety check for empty or null records
    if (!Array.isArray(records) || records.length === 0) {
        return (
            <div className="card-modern p-5 text-center shadow-lg border-0">
                <div className="mb-4">
                    <X size={48} className="text-muted opacity-30" />
                </div>
                <h5 className="fw-bold mb-2">No Students Found</h5>
                <p className="text-muted">No students are currently assigned to this batch for assessment.</p>
                <button className="btn btn-outline-primary rounded-pill px-5 mt-3" onClick={onCancel}>
                    Back to Overview
                </button>
            </div>
        );
    }

    return (
        <div className="card-modern shadow-2xl border-0 overflow-hidden animate-fade-in mb-5">
            <div className="p-4 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 bg-tertiary" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <Check size={18} className="text-success" />
                        <h5 className="mb-0 fw-bold">Live Session Ledger: {session?.date ? new Date(session.date).toLocaleDateString() : 'N/A'}</h5>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <small className="text-muted fw-bold text-uppercase letter-spacing-1" style={{ fontSize: '0.65rem' }}>Auto-Sync Enabled</small>
                        <div className="d-flex gap-2 align-items-center">
                            <span className="badge bg-success-subtle text-success rounded-pill px-2.5 py-1 small fw-bold">{presentCount} P</span>
                            <span className="badge bg-danger-subtle text-danger rounded-pill px-2.5 py-1 small fw-bold">{absentCount} A</span>
                            <span className="badge bg-secondary-subtle text-secondary rounded-pill px-2.5 py-1 small fw-bold">{records.length - presentCount - absentCount} Unmarked</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-0">
                <div className="table-responsive">
                    <table className="table table-hover mb-0 align-middle">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4 py-3">Student Identity</th>
                                <th className="text-center">Verification</th>
                                <th className="text-center">Sync Status</th>
                                <th className="pe-4">Notes / Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(record => {
                                const sId = record.studentId?._id;
                                if (!sId) return null;

                                return (
                                    <tr key={sId}>
                                        <td className="ps-4">
                                            <div className="d-flex align-items-center gap-3 py-1">
                                                <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold"
                                                    style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
                                                    {record.studentId?.userId?.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <div className="fw-bold small">{record.studentId?.userId?.name || 'Unknown Student'}</div>
                                                    <div className="text-muted" style={{ fontSize: '0.7rem' }}>S-ID: {sId.slice(-6)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <div className="attendance-toggle bg-tertiary rounded-pill p-1 d-inline-flex gap-1" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                                <button
                                                    className={`btn btn-sm rounded-pill px-3 py-1 d-flex align-items-center gap-1.5 transition-all ${record.status === 'present' ? 'bg-success text-white shadow-sm' : 'text-secondary border-0 opacity-50'}`}
                                                    onClick={() => handleStatusToggle(sId, 'present')}
                                                >
                                                    <Check size={12} />
                                                    <span className="fw-bold" style={{ fontSize: '0.75rem' }}>P</span>
                                                </button>
                                                <button
                                                    className={`btn btn-sm rounded-pill px-3 py-1 d-flex align-items-center gap-1.5 transition-all ${record.status === 'absent' ? 'bg-danger text-white shadow-sm' : 'text-secondary border-0 opacity-50'}`}
                                                    onClick={() => handleStatusToggle(sId, 'absent')}
                                                >
                                                    <X size={12} />
                                                    <span className="fw-bold" style={{ fontSize: '0.75rem' }}>A</span>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            {savingStatus[sId] === 'saving' && <Loader2 size={16} className="text-primary animate-spin inline" />}
                                            {savingStatus[sId] === 'saved' && <CloudCheck size={16} className="text-success inline" />}
                                            {savingStatus[sId] === 'failed' && <CloudOff size={16} className="text-danger inline" />}
                                        </td>
                                        <td className="pe-4">
                                            <input
                                                className="form-control form-control-sm border-0 bg-transparent shadow-none"
                                                placeholder="Add operational remark..."
                                                value={record.remarks || ''}
                                                onChange={(e) => handleRemarkChange(sId, e.target.value)}
                                                onBlur={(e) => saveRemark(sId, e.target.value)}
                                                style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="p-4 border-top bg-tertiary" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="d-flex justify-content-between align-items-center">
                    <div className="text-muted small fw-medium">
                        <i className="bi bi-info-circle me-2"></i>
                        Changes are saved automatically as you mark.
                    </div>
                    <button className="btn btn-dark px-5 py-2.5 rounded-pill shadow-lg fw-bold" onClick={onCancel}>
                        Complete Session
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AttendanceMarking;
