import { useState, useEffect } from "react";
import batchService from "../../features/teacher/api/batchService";
import {
    Calendar,
    BookOpen,
    Trophy,
    Hash,
    User,
    ArrowRight,
    Save,
    X,
    Users
} from "lucide-react";

function MarksEntry({ onSubmit, onCancel, loading, defaultBatchId }) {
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(defaultBatchId || "");
    const [students, setStudents] = useState([]);

    const [form, setForm] = useState({
        subject: "",
        unitName: "",
        totalMarks: 100,
        date: new Date().toISOString().split('T')[0]
    });

    const [marksMap, setMarksMap] = useState({});

    useEffect(() => {
        const init = async () => {
            const data = await batchService.getAll();
            setBatches(data.batches || []);

            if (defaultBatchId) {
                try {
                    const studentData = await batchService.getStudents(defaultBatchId);
                    setStudents(studentData.students || []);
                } catch (err) { console.error(err); }
            }
        };
        init();
    }, [defaultBatchId]);

    const handleBatchChange = async (e) => {
        const batchId = e.target.value;
        setSelectedBatch(batchId);
        if (batchId) {
            try {
                const data = await batchService.getStudents(batchId);
                setStudents(data.students || []);
                setMarksMap({});
            } catch (err) { console.error(err); }
        } else {
            setStudents([]);
        }
    };

    const handleMarkChange = (studentId, val) => {
        setMarksMap(prev => ({ ...prev, [studentId]: val }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const records = Object.keys(marksMap)
            .filter(id => marksMap[id] !== "")
            .map(studentId => ({
                studentId,
                marksObtained: Number(marksMap[studentId])
            }));

        if (records.length === 0) {
            alert("No scores entered. Please provide at least one candidate's performance data.");
            return;
        }

        // Integrity Check: Marks cannot exceed scale
        const invalidEntry = records.find(r => r.marksObtained > form.totalMarks);
        if (invalidEntry) {
            const student = students.find(s => s._id === invalidEntry.studentId);
            alert(`Integrity Discrepancy: ${student?.name || 'Candidate'} score (${invalidEntry.marksObtained}) exceeds the total scale (${form.totalMarks}).`);
            return;
        }

        onSubmit({ ...form, records });
    };

    return (
        <div className="card-modern shadow-2xl border-0 overflow-hidden animate-fade-in mb-5">
            {/* Context Header */}
            <div className="p-4 border-bottom bg-tertiary d-flex align-items-center justify-content-between" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="d-flex align-items-center gap-3">
                    <div className="bg-primary text-white p-2 rounded-3 shadow-sm">
                        <Trophy size={20} />
                    </div>
                    <div>
                        <h5 className="mb-0 fw-bold">Assessment Performance Entry</h5>
                        <p className="text-muted small mb-0">Record performance metrics for institutional evaluations</p>
                    </div>
                </div>
                <button className="btn btn-sm btn-light rounded-circle p-2" onClick={onCancel}>
                    <X size={18} />
                </button>
            </div>

            <div className="p-4">
                <form onSubmit={handleSubmit}>
                    {/* Test Configuration */}
                    <div className="row g-4 mb-5">
                        <div className="col-lg-3">
                            <label className="form-label small fw-bold text-muted text-uppercase letter-spacing-1">Class Group</label>
                            <div className="position-relative">
                                <Users className="position-absolute top-50 translate-middle-y ms-3 text-primary opacity-50" size={18} />
                                <select className="form-select ps-5 rounded-3 border-0 bg-tertiary shadow-none" style={{ height: '48px' }} value={selectedBatch} onChange={handleBatchChange} required>
                                    <option value="">Choose Batch</option>
                                    {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <label className="form-label small fw-bold text-muted text-uppercase letter-spacing-1">Subject</label>
                            <div className="position-relative">
                                <BookOpen className="position-absolute top-50 translate-middle-y ms-3 text-primary opacity-50" size={18} />
                                <input className="form-control ps-5 rounded-3 border-0 bg-tertiary shadow-none" style={{ height: '48px' }} placeholder="Mathematics..." value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <label className="form-label small fw-bold text-muted text-uppercase letter-spacing-1">Unit / Title</label>
                            <div className="position-relative">
                                <ArrowRight className="position-absolute top-50 translate-middle-y ms-3 text-primary opacity-50" size={18} />
                                <input className="form-control ps-5 rounded-3 border-0 bg-tertiary shadow-none" style={{ height: '48px' }} placeholder="Unit 1 Algebra..." value={form.unitName} onChange={(e) => setForm({ ...form, unitName: e.target.value })} required />
                            </div>
                        </div>
                        <div className="col-lg-2">
                            <label className="form-label small fw-bold text-muted text-uppercase letter-spacing-1">Total Scale</label>
                            <div className="position-relative">
                                <Hash className="position-absolute top-50 translate-middle-y ms-3 text-primary opacity-50" size={18} />
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control ps-5 rounded-3 border-0 bg-tertiary shadow-none"
                                    style={{ height: '48px' }}
                                    value={form.totalMarks}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '' || /^\d+$/.test(val)) {
                                            const sanitized = val === '0' ? '0' : val.replace(/^0+/, '');
                                            setForm({ ...form, totalMarks: sanitized === '' ? '' : Number(sanitized) });
                                        }
                                    }}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-lg-1">
                            <label className="form-label small fw-bold text-muted text-uppercase letter-spacing-1">Date</label>
                            <input type="date" className="form-control rounded-3 border-0 bg-tertiary shadow-none px-2" style={{ height: '48px', fontSize: '0.75rem' }} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                        </div>
                    </div>

                    {/* Candidate Grid */}
                    {students.length > 0 ? (
                        <div className="bg-tertiary rounded-4 p-4 mb-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <div className="row g-3">
                                {students.map(student => (
                                    <div className="col-md-6 col-lg-4" key={student._id}>
                                        <div className="bg-white p-3 rounded-3 shadow-sm d-flex align-items-center justify-content-between border transition-all hover-lift">
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold small" style={{ width: '28px', height: '28px' }}>
                                                    {student.name?.charAt(0) || '?'}
                                                </div>
                                                <span className="small fw-semibold">{student.name || 'Unknown'}</span>
                                            </div>
                                            <div className="d-flex flex-column align-items-end gap-1" style={{ width: '100px' }}>
                                                <label className="text-muted fw-bold" style={{ fontSize: '0.6rem', letterSpacing: '0.05rem' }}>SCORE OBTAINED</label>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    className="form-control form-control-sm text-center fw-bold bg-white border"
                                                    style={{
                                                        height: '32px',
                                                        borderColor: 'var(--border-color)',
                                                        borderRadius: '6px',
                                                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                                                    }}
                                                    placeholder="0"
                                                    value={marksMap[student._id] || ''}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        // Allow only digits
                                                        if (val === '' || /^\d+$/.test(val)) {
                                                            // Strip leading zeros unless it's just '0'
                                                            const sanitized = val === '0' ? '0' : val.replace(/^0+/, '');
                                                            handleMarkChange(student._id, sanitized);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-5 opacity-50">
                            <Users size={40} className="mb-3" />
                            <p>Choose a batch to populate student candidates</p>
                        </div>
                    )}

                    <div className="d-flex justify-content-end gap-3 border-top pt-4">
                        <button type="button" className="btn btn-link text-muted fw-bold text-decoration-none" onClick={onCancel}>discard</button>
                        <button type="submit" className="btn btn-primary px-5 py-2.5 rounded-pill shadow-lg d-flex align-items-center gap-2 hover-lift" disabled={loading || students.length === 0}>
                            {loading ? <span>Syncing...</span> : <><Save size={18} /><span>Authorize Publication</span></>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default MarksEntry;
