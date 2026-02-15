import { useState, useEffect } from "react";
import AppModal from "../../../components/common/AppModal";
import FormInput from "../../../components/common/FormInput";
import DatePicker from "../../../components/common/DatePicker";
import {
    FileText,
    Plus,
    Trash2,
    Send,
    Calculator,
    AlertCircle,
    Calendar,
    ChevronRight,
    Trophy,
    Menu,
    ChevronLeft
} from "lucide-react";

function SubmitMarksModal({ show, onClose, onSubmit, loading }) {
    const [examDetails, setExamDetails] = useState({
        unitName: "",
        examDate: new Date().toISOString().split('T')[0]
    });

    const [subjects, setSubjects] = useState([
        { subject: "", marksObtained: "", totalMarks: "" }
    ]);

    const [aggregate, setAggregate] = useState({ obtain: 0, total: 0, percentage: "0.00" });
    const [isConfirming, setIsConfirming] = useState(false);

    useEffect(() => {
        const totalObtain = subjects.reduce((sum, item) => {
            const val = parseFloat(item.marksObtained);
            return sum + (isNaN(val) ? 0 : val);
        }, 0);

        const totalMax = subjects.reduce((sum, item) => {
            const val = parseFloat(item.totalMarks);
            return sum + (isNaN(val) ? 0 : val);
        }, 0);

        const calculatedPercentage = totalMax > 0
            ? ((totalObtain / totalMax) * 100).toFixed(2)
            : "0.00";

        setAggregate({
            obtain: totalObtain,
            total: totalMax,
            percentage: calculatedPercentage
        });
    }, [subjects]);

    const handleExamChange = (e) => {
        setExamDetails({ ...examDetails, [e.target.name]: e.target.value });
    };

    const handleDateChange = (e) => {
        setExamDetails({ ...examDetails, examDate: e.target.value });
    };

    const handleSubjectChange = (index, field, value) => {
        setSubjects(prev => prev.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        ));
    };

    const addSubject = () => {
        setSubjects([...subjects, { subject: "", marksObtained: "", totalMarks: "" }]);
    };

    const removeSubject = (index) => {
        if (subjects.length > 1) {
            const newSubjects = subjects.filter((_, i) => i !== index);
            setSubjects(newSubjects);
        }
    };

    const handleReview = (e) => {
        e.preventDefault();
        if (!examDetails.unitName || subjects.some(s => !s.subject || !s.marksObtained || !s.totalMarks)) {
            alert("Please fill in all required fields.");
            return;
        }
        setIsConfirming(true);
    };

    const handleFinalSubmit = () => {
        const payload = subjects.map(s => ({
            unitName: examDetails.unitName,
            examDate: examDetails.examDate,
            subject: s.subject,
            marksObtained: parseFloat(s.marksObtained),
            totalMarks: parseFloat(s.totalMarks)
        }));
        onSubmit(payload);
    };

    if (!show) return null;

    return (
        <AppModal show={show} title={isConfirming ? "Mission: Final Confirmation" : "Academic Record Portal"} onClose={onClose} width="950px">
            {isConfirming ? (
                /* ----------------- STEP 2: CONFIRMATION VIEW (PREMIUM SLATE) ----------------- */
                <div className="d-flex flex-column flex-grow-1 animate-fade-in" style={{ minHeight: 0, backgroundColor: 'var(--bg-primary)' }}>
                    <div className="p-4 p-md-5 flex-grow-1 overflow-y-auto custom-scrollbar" style={{ minHeight: 0 }}>

                        {/* HERO ZONE */}
                        <div className="text-center py-5 mb-5 rounded-4 shadow-sm border position-relative overflow-hidden"
                            style={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--border-default)' }}>
                            <div className="bg-primary d-inline-flex p-4 rounded-circle mb-3 text-white shadow-lg animate-bounce-subtle z-1 position-relative">
                                <Trophy size={48} />
                            </div>
                            <h2 className="fw-bold text-primary mb-2 z-1 position-relative">Review & Finalize</h2>
                            <p className="text-secondary mb-5 px-5 mx-auto z-1 position-relative" style={{ maxWidth: '600px' }}>
                                You are archiving <strong>{examDetails.unitName}</strong> records.
                                Click below to transmit this data to your facilitator.
                            </p>

                            <div className="d-flex justify-content-center px-4 z-1 position-relative">
                                <button
                                    type="button"
                                    className="btn btn-primary py-3 px-5 fw-bold rounded-pill hover-translate-y shadow-lg d-flex align-items-center justify-content-center gap-3 transition-all scale-105"
                                    onClick={handleFinalSubmit}
                                    disabled={loading}
                                    style={{ background: 'linear-gradient(135deg, var(--success) 0%, #059669 100%)', border: 'none', minWidth: '280px' }}
                                >
                                    {loading ? <span className="spinner-border spinner-border-sm" /> : <>Finalize & Send Data <Send size={20} /></>}
                                </button>
                            </div>

                            {/* Decorative Grid */}
                            <div className="position-absolute bottom-0 start-0 w-100 h-100 opacity-5"
                                style={{ backgroundImage: 'radial-gradient(var(--accent-primary) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }}></div>
                        </div>

                        <div className="row g-4 mb-5">
                            <div className="col-md-6">
                                <div className="card-modern h-100 p-4 border-0 shadow-sm" style={{ backgroundColor: 'var(--surface-card)' }}>
                                    <div className="d-flex align-items-center gap-2 mb-4">
                                        <div className="p-2 bg-primary-subtle rounded-3 text-primary">
                                            <FileText size={18} />
                                        </div>
                                        <span className="fw-bold text-dark text-uppercase letter-spacing-1 small">Examination Identity</span>
                                    </div>
                                    <div className="d-flex flex-column gap-3">
                                        <div className="p-3 rounded-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                            <small className="text-muted d-block mb-1 text-uppercase fw-bold letter-spacing-1" style={{ fontSize: '0.6rem' }}>Authorized Unit</small>
                                            <div className="fw-bold text-primary h5 mb-0">{examDetails.unitName}</div>
                                        </div>
                                        <div className="p-3 rounded-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                            <small className="text-muted d-block mb-1 text-uppercase fw-bold letter-spacing-1" style={{ fontSize: '0.6rem' }}>Temporal Record</small>
                                            <div className="d-flex align-items-center gap-2 fw-semibold text-secondary">
                                                <Calendar size={16} />
                                                <span>{new Date(examDetails.examDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card-modern h-100 p-4 border-0 shadow-sm" style={{ backgroundColor: 'var(--surface-card)' }}>
                                    <div className="d-flex align-items-center gap-2 mb-4">
                                        <div className="p-2 bg-success-subtle rounded-3 text-success">
                                            <Calculator size={18} />
                                        </div>
                                        <span className="fw-bold text-dark text-uppercase letter-spacing-1 small">Integrity Summary</span>
                                    </div>
                                    <div className="row g-2 mb-3">
                                        <div className="col-6">
                                            <div className="p-3 rounded-4 text-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                                <div className="h3 fw-bold text-primary mb-0">{subjects.length}</div>
                                                <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.6rem' }}>Segments</small>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="p-3 bg-primary text-white rounded-4 text-center shadow-lg">
                                                <div className="h3 fw-bold mb-0">{aggregate.percentage}%</div>
                                                <small className="opacity-75 text-uppercase fw-bold" style={{ fontSize: '0.6rem' }}>Aggregate</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-4 text-center border border-dashed" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                        <span className="text-muted small fw-bold">RAW SCORE SUM: </span>
                                        <span className="fw-bold text-primary px-1">{aggregate.obtain}</span>
                                        <span className="text-muted px-1">/</span>
                                        <span className="fw-bold text-secondary">{aggregate.total}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary-subtle text-primary p-4 rounded-4 border border-primary-subtle d-flex align-items-start gap-3 shadow-inner">
                            <AlertCircle className="flex-shrink-0 mt-1" size={20} />
                            <div className="small fw-semibold opacity-90">
                                LEGAL DISCLOSURE: Once confirmed, these records are timestamped and synchronized with the facilitator's database.
                                Ensure all performance metrics are verified against your academic scripts.
                            </div>
                        </div>
                    </div>

                    {/* REDESIGNED FOOTER */}
                    <div className="p-4 border-top flex-shrink-0" style={{ backgroundColor: 'var(--surface-card)', borderTopColor: 'var(--border-default) !important' }}>
                        <div className="d-flex gap-3 justify-content-center mx-auto" style={{ maxWidth: '600px' }}>
                            <button
                                type="button"
                                className="btn btn-outline-secondary py-3 px-5 fw-bold rounded-pill hover-bg-tertiary transition-all"
                                onClick={() => setIsConfirming(false)}
                            >
                                <ChevronLeft size={18} className="me-2" /> Adjust Data
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* ----------------- STEP 1: ENTRY FORM VIEW (DASHBOARD SYNERGY) ----------------- */
                <form onSubmit={handleReview} className="d-flex flex-column flex-grow-1" style={{ minHeight: 0, backgroundColor: 'var(--bg-primary)' }}>
                    <div className="p-4 p-md-5 overflow-y-auto flex-grow-1 custom-scrollbar" style={{ minHeight: 0 }}>

                        {/* FORM HEADER */}
                        <div className="card-modern mb-5 p-4 bg-premium-gradient border-0 shadow-premium">
                            <div className="row g-4 align-items-end">
                                <div className="col-md-7">
                                    <label className="form-label small fw-bold text-muted text-uppercase mb-2 tracking-widest">Global Examination Title</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg fw-bold rounded-4 border-white shadow-sm"
                                        placeholder="e.g. Unit Assessment III - Mathematics"
                                        name="unitName"
                                        value={examDetails.unitName}
                                        onChange={handleExamChange}
                                        required
                                        style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                                    />
                                </div>
                                <div className="col-md-5">
                                    <div className="form-group">
                                        <label className="form-label small fw-bold text-muted text-uppercase mb-2 tracking-widest">
                                            <Calendar size={14} className="me-2" /> Evaluation Day
                                        </label>
                                        <div className="bg-white rounded-4 shadow-sm border overflow-hidden p-1">
                                            <DatePicker selectedDate={examDetails.examDate} onChange={handleDateChange} className="border-0 bg-transparent w-100" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SUB-HEADER WITH AGGREGATE */}
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-4 mb-4 px-1">
                            <div className="d-flex align-items-center gap-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-2.5 bg-dark rounded-circle text-white shadow-lg">
                                        <Menu size={18} />
                                    </div>
                                    <h5 className="fw-extrabold text-dark m-0 tracking-tight h4">Segment Breakdown</h5>
                                </div>

                                {/* PREMIUM SLATE AGGREGATE BADGE */}
                                <div className="d-flex align-items-center gap-3 px-4 py-2.5 bg-primary text-white rounded-pill shadow-premium animate-pulse-subtle">
                                    <Trophy size={20} className="text-warning" />
                                    <div className="d-flex align-items-center gap-4">
                                        <div className="d-flex flex-column lh-1">
                                            <span className="fw-extrabold h5 m-0 lh-1">{aggregate.percentage}%</span>
                                            <small className="opacity-75 fw-bold text-uppercase mt-1" style={{ fontSize: '0.55rem', letterSpacing: '1px' }}>Global Performance</small>
                                        </div>
                                        <div className="vr opacity-25" style={{ height: '30px' }}></div>
                                        <div className="d-flex flex-column lh-1">
                                            <span className="fw-extrabold m-0 lh-1">{aggregate.obtain} / {aggregate.total}</span>
                                            <small className="opacity-75 fw-bold text-uppercase mt-1" style={{ fontSize: '0.55rem', letterSpacing: '1px' }}>Raw Sum</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-dark fw-bold d-flex align-items-center gap-2 rounded-pill px-4 py-2.5 transition-all hover-shadow-lg"
                                    onClick={addSubject}
                                >
                                    <Plus size={20} /> Append Segment
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary fw-bold d-flex align-items-center gap-2 rounded-pill px-5 py-2.5 shadow-premium transition-all hover-lift"
                                    disabled={loading}
                                    style={{ background: 'linear-gradient(135deg, var(--accent-primary) 0%, #4f46e5 100%)', border: 'none' }}
                                >
                                    Validate & Continue <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>

                        {/* TABLE MODULE */}
                        <div className="card-modern p-0 border-0 shadow-premium overflow-hidden mb-4" style={{ backgroundColor: 'var(--surface-card)' }}>
                            <div className="row g-0 px-4 py-3 bg-dark text-white opacity-90 small fw-extrabold text-uppercase letter-spacing-2 d-none d-md-flex align-items-center">
                                <div className="col-1 text-center">UID</div>
                                <div className="col-md-4">Segment Descriptor</div>
                                <div className="col-md-2 text-center">Score</div>
                                <div className="col-md-2 text-center">Threshold</div>
                                <div className="col-md-3 text-center">Efficiency</div>
                            </div>

                            <div className="bg-white">
                                {subjects.map((item, index) => (
                                    <div key={index} className="row g-0 align-items-center px-4 py-4 border-bottom hover-bg-tertiary transition-all group position-relative" style={{ backgroundColor: 'var(--surface-card)' }}>
                                        <div className="col-1 text-muted fw-bold text-center d-none d-md-block">
                                            <span className="p-2 rounded-3 small fw-bold" style={{ backgroundColor: 'var(--bg-secondary)' }}>{(index + 1).toString().padStart(2, '0')}</span>
                                        </div>

                                        <div className="col-md-4 col-12 px-2 mb-3 mb-md-0">
                                            <input
                                                type="text"
                                                className="form-control fw-bold border-0 bg-transparent focus-bg-white transition-all px-3 py-2 rounded-3"
                                                placeholder="e.g. Physics Theory"
                                                value={item.subject}
                                                onChange={(e) => handleSubjectChange(index, "subject", e.target.value)}
                                                required
                                                style={{ fontSize: '1rem', border: '1px solid transparent !important', color: 'var(--text-primary)' }}
                                            />
                                        </div>

                                        <div className="col-6 col-md-2 px-2">
                                            <small className="d-block d-md-none text-muted mb-1 fw-bold">SCORE</small>
                                            <input
                                                type="number"
                                                className="form-control fw-bold text-center border-0 rounded-4 py-2.5"
                                                placeholder="00"
                                                min="0"
                                                value={item.marksObtained}
                                                onChange={(e) => handleSubjectChange(index, "marksObtained", e.target.value)}
                                                required
                                                style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                                            />
                                        </div>

                                        <div className="col-6 col-md-2 px-2">
                                            <small className="d-block d-md-none text-muted mb-1 fw-bold">TOTAL</small>
                                            <input
                                                type="number"
                                                className="form-control fw-bold text-center border-0 rounded-4 py-2.5"
                                                placeholder="100"
                                                min="1"
                                                value={item.totalMarks}
                                                onChange={(e) => handleSubjectChange(index, "totalMarks", e.target.value)}
                                                required
                                                style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                                            />
                                        </div>

                                        <div className="col-md-3 col-12 px-2 text-center mt-4 mt-md-0">
                                            <div className="d-inline-flex align-items-center gap-3 px-3 py-2 rounded-pill bg-tertiary border shadow-sm">
                                                <div className="progress flex-grow-1 d-none d-lg-flex" style={{ height: '8px', width: '70px', backgroundColor: 'var(--border-default)' }}>
                                                    <div
                                                        className={`progress-bar rounded-pill transition-all ${parseFloat(item.marksObtained) / parseFloat(item.totalMarks) > 0.8 ? 'bg-success' : 'bg-primary'}`}
                                                        style={{ width: `${(parseFloat(item.marksObtained) / parseFloat(item.totalMarks)) * 100 || 0}%`, transitionDuration: '0.8s' }}
                                                    ></div>
                                                </div>
                                                <span className="fw-extrabold text-primary small">
                                                    {((parseFloat(item.marksObtained) / parseFloat(item.totalMarks)) * 100 || 0).toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>

                                        {/* REMOVE ACTION (FLOATING) */}
                                        <button
                                            type="button"
                                            className="btn btn-link text-danger p-2 position-absolute end-0 top-0 mt-2 me-2 opacity-0 group-hover-opacity-100 transition-all rounded-circle hover-bg-danger-subtle d-none d-md-flex"
                                            onClick={() => removeSubject(index)}
                                            disabled={subjects.length === 1}
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* GLOBAL FORM FOOTER */}
                    <div className="p-4 border-top flex-shrink-0 shadow-lg position-relative" style={{ zIndex: 10, backgroundColor: 'var(--surface-card)', borderTopWidth: '2px !important' }}>
                        <div className="row align-items-center g-4">
                            <div className="col-md-9 d-none d-md-block">
                                <div className="d-flex align-items-center gap-4">
                                    <div className="p-3 rounded-circle text-primary border" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                        <Calculator size={28} />
                                    </div>
                                    <div className="d-flex gap-5">
                                        <div className="lh-1">
                                            <small className="text-muted fw-extrabold text-uppercase letter-spacing-1 mb-2 d-block" style={{ fontSize: '0.6rem' }}>Temporal Status</small>
                                            <div className="h5 fw-bold mb-0 text-success">
                                                <Check size={18} className="me-1" /> Ready for Validation
                                            </div>
                                        </div>
                                        <div className="vr opacity-25" style={{ height: '40px' }}></div>
                                        <div className="lh-1">
                                            <small className="text-muted fw-extrabold text-uppercase letter-spacing-1 mb-2 d-block" style={{ fontSize: '0.6rem' }}>Calculated Delta</small>
                                            <div className="h5 fw-bold mb-0 text-primary">{aggregate.percentage}% Global</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-danger py-3 px-4 fw-bold w-100 rounded-pill hover-bg-danger-subtle transition-all"
                                    onClick={onClose}
                                >
                                    Dismiss Portal
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </AppModal>
    );
}

// Internal Helper Icons (Restoring missing ones)
const Check = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export default SubmitMarksModal;
