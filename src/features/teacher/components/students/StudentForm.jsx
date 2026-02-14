import { useState, useEffect, useCallback, useRef } from "react";
import studentService from "../../api/studentService";

// Simple custom debounce
const useDebounce = (callback, delay) => {
    const timer = useRef();
    return useCallback((...args) => {
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => callback(...args), delay);
    }, [callback, delay]);
};

function StudentForm({ initialData = {}, onSubmit, onCancel, loading }) {
    const isEdit = initialData && initialData._id;

    const [formData, setFormData] = useState({
        name: "", class: "", school: "", year: new Date().getFullYear(),
        monthlyFee: "", joiningDate: new Date().toISOString().split('T')[0],
        feePaymentDay: 15,
        parentName: "", parentEmail: "", parentPhone: "",
        batchId: ""
    });

    const [parentStatus, setParentStatus] = useState({ loading: false, exists: null, message: "" });
    const [showFeeWarning, setShowFeeWarning] = useState(false);

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setFormData({
                name: initialData.name || "",
                class: initialData.class || "",
                school: initialData.school || "",
                year: initialData.year || new Date().getFullYear(),
                monthlyFee: initialData.monthlyFee || "",
                joiningDate: initialData.joiningDate ? new Date(initialData.joiningDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                feePaymentDay: initialData.feePaymentDay || 15,
                parentName: initialData.parentName || "",
                parentEmail: initialData.parentEmail || "",
                parentPhone: initialData.parentPhone || "",
                batchId: initialData.batchId || ""
            });
        }
    }, [initialData]);

    // Use effect to check for fee change
    useEffect(() => {
        if (isEdit && formData.monthlyFee !== initialData.monthlyFee) {
            setShowFeeWarning(true);
        } else {
            setShowFeeWarning(false);
        }
    }, [formData.monthlyFee, initialData.monthlyFee, isEdit]);

    // Debounced parent check
    const checkParent = useDebounce(async (email) => {
        if (!email || !email.includes('@')) return;
        setParentStatus(prev => ({ ...prev, loading: true }));
        try {
            const res = await studentService.checkParent(email);
            setParentStatus({ loading: false, exists: res.exists, message: res.message });
            if (res.exists && res.name) {
                setFormData(prev => ({ ...prev, parentName: res.name }));
            }
        } catch (error) {
            setParentStatus({ loading: false, exists: null, message: "" });
        }
    }, 800);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === "parentEmail") {
            checkParent(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Manual validation for business rules
        if (formData.feePaymentDay < 1 || formData.feePaymentDay > 28) {
            alert("Fee Due Day must be between 1 and 28.");
            return;
        }

        const joinDate = new Date(formData.joiningDate);
        if (joinDate > new Date()) {
            alert("Joining date cannot be in the future.");
            return;
        }

        // Transform for backend (contacts array)
        const submissionData = {
            ...formData,
            contacts: [{
                name: formData.parentName,
                email: formData.parentEmail,
                phone: formData.parentPhone
            }]
        };

        onSubmit(submissionData);
    };

    return (
        <form onSubmit={handleSubmit} className="student-form-premium">
            {/* Student Section */}
            <div className="form-section mb-4 p-3 rounded-4 bg-light bg-opacity-50 border border-white">
                <div className="d-flex align-items-center mb-3">
                    <div className="icon-badge bg-primary bg-opacity-10 text-primary me-2 p-2 rounded-3">
                        <i className="bi bi-person-badge"></i>
                    </div>
                    <h6 className="fw-bold mb-0 text-dark">
                        {isEdit ? `Modifying Profile: ${initialData.registrationNumber}` : 'Student Foundation'}
                    </h6>
                </div>

                <div className="row g-3">
                    <div className="col-md-7">
                        <label className="form-label small fw-semibold text-muted">Full Name</label>
                        <input
                            className="form-control form-control-lg border-0 shadow-sm"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-5">
                        <label className="form-label small fw-semibold text-muted">Class</label>
                        <select className="form-select form-select-lg border-0 shadow-sm" name="class" value={formData.class} onChange={handleChange} required>
                            <option value="">Select Class</option>
                            {[6, 7, 8, 9, 10, 11, 12].map(c => <option key={c} value={c}>{c}th Grade</option>)}
                        </select>
                    </div>
                    <div className="col-md-12">
                        <label className="form-label small fw-semibold text-muted">School Name</label>
                        <input className="form-control border-0 shadow-sm" name="school" placeholder="International Public School" value={formData.school} onChange={handleChange} />
                    </div>
                </div>
            </div>

            {/* Fee Section */}
            <div className={`form-section mb-4 p-3 rounded-4 border border-white ${showFeeWarning ? 'bg-warning bg-opacity-10 border-warning border-opacity-25' : 'bg-light bg-opacity-50'}`}>
                <div className="d-flex align-items-center mb-3">
                    <div className="icon-badge bg-success bg-opacity-10 text-success me-2 p-2 rounded-3">
                        <i className="bi bi-cash-stack"></i>
                    </div>
                    <h6 className="fw-bold mb-0 text-dark">Fee Configuration</h6>
                </div>

                <div className="row g-3">
                    <div className="col-md-4">
                        <label className="form-label small fw-semibold text-muted">Monthly Fee (₹)</label>
                        <input className="form-control border-0 shadow-sm" name="monthlyFee" type="number" min="1" value={formData.monthlyFee} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label small fw-semibold text-muted">Joining Date</label>
                        <input className="form-control border-0 shadow-sm" name="joiningDate" type="date" value={formData.joiningDate} onChange={handleChange} required disabled={isEdit} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label small fw-semibold text-muted">Due Day (1-28)</label>
                        <input className="form-control border-0 shadow-sm" name="feePaymentDay" type="number" min="1" max="28" value={formData.feePaymentDay} onChange={handleChange} required />
                    </div>

                    {showFeeWarning && (
                        <div className="col-12 animate-fade-in">
                            <div className="alert alert-warning py-2 small border-0 bg-warning bg-opacity-25 text-dark mb-0 d-flex align-items-center">
                                <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                                <div>
                                    <strong>Fee Revision Detected:</strong> Changing monthly fee from <strong>₹{initialData.monthlyFee}</strong> to <strong>₹{formData.monthlyFee}</strong> will only affect <strong>future unpaid months</strong>. Paid records are locked.
                                </div>
                            </div>
                        </div>
                    )}

                    {!isEdit && (
                        <div className="col-12">
                            <div className="alert alert-info py-2 small border-0 bg-info bg-opacity-10 text-info mb-0">
                                <i className="bi bi-info-circle me-2"></i>
                                Joining month fee will be automatically <strong>skipped</strong>.
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Parent Section */}
            <div className="form-section mb-4 p-3 rounded-4 bg-light bg-opacity-50 border border-white">
                <div className="d-flex align-items-center mb-3">
                    <div className="icon-badge bg-warning bg-opacity-10 text-warning me-2 p-2 rounded-3">
                        <i className="bi bi-people"></i>
                    </div>
                    <h6 className="fw-bold mb-0 text-dark">Parent / Guardian</h6>
                </div>

                <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Email Address</label>
                    <input className="form-control border-0 shadow-sm" name="parentEmail" type="email" placeholder="parent@example.com" value={formData.parentEmail} onChange={handleChange} required disabled={isEdit} />

                    {parentStatus.loading && <div className="spinner-border spinner-border-sm text-primary mt-2" role="status"></div>}
                    {formData.parentEmail && !parentStatus.loading && parentStatus.message && (
                        <div className={`mt-2 small fw-medium ${parentStatus.exists ? 'text-success' : 'text-primary'}`}>
                            {parentStatus.exists ? <i className="bi bi-check-circle-fill me-1"></i> : <i className="bi bi-plus-circle-fill me-1"></i>}
                            {parentStatus.message}
                        </div>
                    )}
                </div>

                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted">Parent Name</label>
                        <input className="form-control border-0 shadow-sm" name="parentName" placeholder="Full Name" value={formData.parentName} onChange={handleChange} required disabled={parentStatus.exists || isEdit} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted">Phone Number</label>
                        <input className="form-control border-0 shadow-sm" name="parentPhone" placeholder="10 Digit Mobile" value={formData.parentPhone} onChange={handleChange} />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="d-flex justify-content-end gap-3 mt-4">
                <button type="button" className="btn btn-link text-muted text-decoration-none fw-semibold" onClick={onCancel}>Discard Changes</button>
                <button type="submit" className="btn btn-primary px-5 rounded-pill shadow-lg border-0 py-2 fw-bold" disabled={loading}>
                    {loading ? (
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : (
                        <i className="bi bi-check-lg me-2"></i>
                    )}
                    {isEdit ? 'Save Changes' : 'Deploy Student Profile'}
                </button>
            </div>
        </form>
    );
}

export default StudentForm;
