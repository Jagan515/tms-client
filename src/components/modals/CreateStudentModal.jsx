import { useState, useEffect } from "react";
import studentService from "../../features/student/api/studentService";
import batchService from "../../features/teacher/api/batchService";
import AppModal from "../common/AppModal";
import { User, School, Calendar, Mail, Phone, Hash, CreditCard, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";

function CreateStudentModal({ show, onClose, onSuccess, initialData = null }) {
    const isEdit = !!initialData;
    const [currentStep, setCurrentStep] = useState(1);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        class: "0",
        school: "",
        parentName: "",
        parentEmail: "",
        parentPhone: "",
        relation: "Father",
        batchId: "",
        monthlyFee: "",
        feePaymentDay: new Date().getDate(),
        year: new Date().getFullYear()
    });

    // Sync form data with initialData when editing
    useEffect(() => {
        if (show) {
            setCurrentStep(1);
            setError("");
            if (initialData) {
                setFormData({
                    name: initialData.name || "",
                    class: initialData.class || "0",
                    school: initialData.school || "",
                    parentName: initialData.parentName || "",
                    parentEmail: initialData.parentEmail || "",
                    parentPhone: initialData.parentPhone || "",
                    relation: initialData.parentRelation || "Father",
                    batchId: initialData.batchId || "",
                    monthlyFee: initialData.monthlyFee || "",
                    feePaymentDay: initialData.feePaymentDay || new Date().getDate(),
                    year: initialData.year || new Date().getFullYear()
                });
            } else {
                setFormData({
                    name: "",
                    class: "0",
                    school: "",
                    parentName: "",
                    parentEmail: "",
                    parentPhone: "",
                    relation: "Father",
                    batchId: "",
                    monthlyFee: "",
                    feePaymentDay: new Date().getDate(),
                    year: new Date().getFullYear()
                });
            }
            loadBatches();
        }
    }, [show, initialData]);

    const loadBatches = async () => {
        try {
            const data = await batchService.getAll();
            if (data.batches) {
                setBatches(data.batches);
            } else if (Array.isArray(data)) {
                setBatches(data);
            }
        } catch (err) {
            console.log("Error loading batches:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Auto-stop at 10 digits for phone
        if (name === "parentPhone") {
            const digits = value.replace(/\D/g, "").slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: digits }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (error) {
            setError("");
        }
    };

    const validate = (step) => {
        try {
            if (step === 1) {
                if (!formData.name.trim()) throw new Error("Scholar name is mandatory.");
                if (!formData.school.trim()) throw new Error("Institutional name (School) is mandatory.");
            }
            if (step === 2) {
                if (!formData.parentName.trim()) throw new Error("Parent/Guardian name is mandatory.");
                if (!formData.parentEmail.trim()) throw new Error("Parent email is mandatory for portal access.");
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) throw new Error("Invalid email format.");
                if (!formData.parentPhone.trim() || formData.parentPhone.length < 10) throw new Error("Valid 10-digit contact number is mandatory.");
            }
            if (step === 3) {
                if (formData.monthlyFee && isNaN(formData.monthlyFee)) throw new Error("Monthly fee must be a valid number.");
                if (formData.feePaymentDay < 1 || formData.feePaymentDay > 28) throw new Error("Fee Collection Day must be between 1 and 28.");
            }
            return true;
        } catch (err) {
            setError(err.message);
            console.log("Validation Error:", err.message);
            return false;
        }
    };

    const handleNext = () => {
        if (validate(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate(3)) return;

        setLoading(true);
        setError("");

        try {
            const payload = {
                ...formData,
                monthlyFee: formData.monthlyFee ? Number(formData.monthlyFee) : 0,
                feePaymentDay: Number(formData.feePaymentDay),
                year: Number(formData.year),
                contacts: [{
                    name: formData.parentName,
                    email: formData.parentEmail,
                    phone: formData.parentPhone,
                    relation: formData.relation
                }]
            };

            console.log("Submitting Student Data:", payload);

            if (isEdit) {
                await studentService.update(initialData._id, payload);
            } else {
                await studentService.create(payload);
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.log("Enrollment Error:", err);
            setError(err.response?.data?.message || "Internal system conflict during enrollment.");
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="animate-fade-in">
                        <div className="d-flex align-items-center mb-4 text-primary">
                            <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3">
                                <User size={20} />
                            </div>
                            <h6 className="mb-0 fw-bold">Scholar Identity</h6>
                        </div>

                        <div className="mb-4">
                            <label className="form-label small text-muted fw-semibold">Scholar Full Name</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-0"><User size={16} className="text-muted" /></span>
                                <input type="text" className="form-control border-light shadow-sm py-2" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Alexander Pierce" required />
                            </div>
                        </div>

                        <div className="row g-3 mb-4">
                            <div className="col-md-12">
                                <label className="form-label small text-muted fw-semibold">Institutional Level (Class)</label>
                                <select className="form-select border-light shadow-sm py-2" name="class" value={formData.class} onChange={handleChange}>
                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(c => <option key={c} value={c}>Class {c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label small text-muted fw-semibold">Institution (School)</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-0"><School size={16} className="text-muted" /></span>
                                <input type="text" className="form-control border-light shadow-sm py-2" name="school" value={formData.school} onChange={handleChange} placeholder="Current School Name" required />
                            </div>
                        </div>
                        <small className="text-muted opacity-75">Registration ID will be auto-generated by the system.</small>
                    </div>
                );
            case 2:
                return (
                    <div className="animate-fade-in">
                        <div className="d-flex align-items-center mb-4 text-primary">
                            <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3">
                                <Mail size={20} />
                            </div>
                            <h6 className="mb-0 fw-bold">Parental Authorization</h6>
                        </div>

                        <div className="mb-3">
                            <label className="form-label small text-muted fw-semibold">Primary Guardian Name</label>
                            <input type="text" className="form-control border-light shadow-sm py-2" name="parentName" value={formData.parentName} onChange={handleChange} placeholder="Full Guardian Name" required />
                        </div>

                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label className="form-label small text-muted fw-semibold">Relation</label>
                                <select className="form-select border-light shadow-sm py-2" name="relation" value={formData.relation} onChange={handleChange}>
                                    <option value="Father">Father</option>
                                    <option value="Mother">Mother</option>
                                    <option value="Guardian">Guardian</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small text-muted fw-semibold">Mobile Number</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><Phone size={16} className="text-muted" /></span>
                                    <input type="tel" className="form-control border-light shadow-sm py-2" name="parentPhone" value={formData.parentPhone} onChange={handleChange} placeholder="10 Digit Number" required />
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label small text-muted fw-semibold">Email Address (Registry Entry)</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-0"><Mail size={16} className="text-muted" /></span>
                                <input type="email" className="form-control border-light shadow-sm py-2" name="parentEmail" value={formData.parentEmail} onChange={handleChange} placeholder="parent@example.com" required />
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="animate-fade-in">
                        <div className="d-flex align-items-center mb-4 text-primary">
                            <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3">
                                <CreditCard size={20} />
                            </div>
                            <h6 className="mb-0 fw-bold">Academic Configuration</h6>
                        </div>

                        <div className="mb-4">
                            <label className="form-label small text-muted fw-semibold">Institutional Batch Assignment</label>
                            <select className="form-select border-light shadow-sm py-2" name="batchId" value={formData.batchId} onChange={handleChange}>
                                <option value="">--- Await Assignment ---</option>
                                {batches.map(b => (
                                    <option key={b._id} value={b._id}>{b.name} ({b.year}) - {b.class}</option>
                                ))}
                            </select>
                        </div>

                        <div className="row g-3 mb-4">
                            <div className="col-md-12">
                                <label className="form-label small text-muted fw-semibold">Monthly Tuition Fee</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0 fw-bold text-muted">₹</span>
                                    <input type="number" className="form-control border-light shadow-sm py-2" name="monthlyFee" value={formData.monthlyFee} onChange={handleChange} placeholder="0" />
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-tertiary rounded-4 border border-white shadow-sm">
                            <div className="d-flex gap-3">
                                <div className="text-primary mt-1"><CheckCircle size={18} /></div>
                                <div>
                                    <div className="fw-bold small mb-1">Simplicity Mode Active</div>
                                    <p className="text-muted small mb-0 opacity-75">All identification and activation timestamps will be auto-generated for maximum efficiency.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <AppModal show={show} title={isEdit ? "Update Scholar Profile" : "Enroll New Scholar"} onClose={onClose} width="600px">
            <div className="p-2">
                {/* Custom Progress Bar */}
                <div className="d-flex justify-content-between mb-5 px-4 position-relative">
                    <div className="position-absolute top-50 start-0 translate-middle-y w-100 bg-light" style={{ height: '2px', zIndex: 0 }}></div>
                    <div className="position-absolute top-50 start-0 translate-middle-y bg-primary bg-opacity-50 transition-all" style={{ height: '2px', width: `${((currentStep - 1) / 2) * 100}%`, zIndex: 0 }}></div>

                    {[1, 2, 3].map(step => (
                        <div key={step} className={`step-circle rounded-circle d-flex align-items-center justify-content-center border shadow-sm z-1 ${currentStep >= step ? 'bg-primary text-white border-primary' : 'bg-white text-muted border-light'}`} style={{ width: '32px', height: '32px', transition: '0.3s' }}>
                            {currentStep > step ? <CheckCircle size={14} /> : <span className="small fw-bold">{step}</span>}
                        </div>
                    ))}
                </div>

                {error && (
                    <div className="alert alert-danger border-0 rounded-4 py-2 small mb-4 animate-shake d-flex align-items-center gap-2">
                        <Hash size={16} />
                        {error}
                    </div>
                )}

                <div className="modal-step-content" style={{ minHeight: '380px' }}>
                    {renderStep()}
                </div>

                <div className="modal-footer-custom d-flex justify-content-between mt-5 pt-3 border-top">
                    {currentStep > 1 ? (
                        <button className="btn btn-outline-secondary rounded-pill px-4 d-flex align-items-center gap-2" onClick={handleBack}>
                            <ChevronLeft size={18} />
                            <span>Previous Step</span>
                        </button>
                    ) : (
                        <button className="btn btn-light rounded-pill px-4 text-muted" onClick={onClose}>Discard</button>
                    )}

                    {currentStep < 3 ? (
                        <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm" onClick={handleNext}>
                            <span>Continue</span>
                            <ChevronRight size={18} />
                        </button>
                    ) : (
                        <button className="btn btn-success rounded-pill px-5 d-flex align-items-center gap-2 shadow-lg hover-lift" onClick={handleSubmit} disabled={loading}>
                            {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <CheckCircle size={18} />}
                            <span className="fw-bold">{isEdit ? 'Update Profile' : 'Complete Registration'}</span>
                        </button>
                    )}
                </div>
            </div>
        </AppModal>
    );
}

export default CreateStudentModal;
