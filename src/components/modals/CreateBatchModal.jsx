import { useState, useEffect } from "react";
import batchService from "../../features/teacher/api/batchService";
import AppModal from "../common/AppModal";
import { BookOpen, Calendar, Clock, MessageSquare, Hash } from "lucide-react";

function CreateBatchModal({ show, onClose, onSuccess, initialData = null }) {
    const isEdit = !!initialData;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        class: "0",
        subject: "",
        time: "",
        description: "",
        year: new Date().getFullYear(),
        days: []
    });

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        if (show) {
            setError("");
            if (initialData) {
                setFormData({
                    name: initialData.name || "",
                    class: initialData.class || "0",
                    subject: initialData.subject || "",
                    time: initialData.time || "",
                    description: initialData.description || "",
                    year: initialData.year || new Date().getFullYear(),
                    days: initialData.days || []
                });
            } else {
                setFormData({
                    name: "",
                    class: "0",
                    subject: "",
                    time: "",
                    description: "",
                    year: new Date().getFullYear(),
                    days: []
                });
            }
        }
    }, [show, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    const handleDayToggle = (day) => {
        setFormData(prev => {
            const days = prev.days.includes(day)
                ? prev.days.filter(d => d !== day)
                : [...prev.days, day];
            return { ...prev, days };
        });
    };

    const validate = () => {
        if (!formData.name.trim()) {
            setError("Batch name is required");
            return false;
        }
        if (formData.days.length === 0) {
            setError("Select at least one day for the batch");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setError("");

        try {
            if (isEdit) {
                await batchService.update(initialData._id, formData);
            } else {
                await batchService.create(formData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            console.log("Batch Error:", err);
            setError(err.response?.data?.message || "Failed to save batch");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppModal
            show={show}
            title={isEdit ? "Update Batch Configuration" : "Create New Batch"}
            onClose={onClose}
            width="600px"
        >
            <div className="p-3">
                {error && (
                    <div className="alert alert-danger border-0 rounded-4 py-2 small mb-4 d-flex align-items-center gap-2">
                        <Hash size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label small text-muted fw-semibold">Batch Name</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0"><BookOpen size={16} className="text-muted" /></span>
                            <input
                                type="text"
                                className="form-control border-light shadow-sm py-2"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Morning Batch A"
                                required
                            />
                        </div>
                    </div>

                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <label className="form-label small text-muted fw-semibold">Class Level</label>
                            <select
                                className="form-select border-light shadow-sm py-2"
                                name="class"
                                value={formData.class}
                                onChange={handleChange}
                            >
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(c => (
                                    <option key={c} value={c}>Class {c}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small text-muted fw-semibold">Subject (Optional)</label>
                            <input
                                type="text"
                                className="form-control border-light shadow-sm py-2"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="e.g. Mathematics"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label small text-muted fw-semibold">Time (Optional)</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0"><Clock size={16} className="text-muted" /></span>
                            <input
                                type="text"
                                className="form-control border-light shadow-sm py-2"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                placeholder="e.g. 10:00 AM - 11:30 AM"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label small text-muted fw-semibold">Custom Message/Description (Optional)</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0 align-items-start pt-2"><MessageSquare size={16} className="text-muted" /></span>
                            <textarea
                                className="form-control border-light shadow-sm"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="e.g. DAV School - Advanced Science Track"
                                rows="3"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label small text-muted fw-semibold d-flex align-items-center gap-2">
                            <Calendar size={16} />
                            <span>Schedule Days</span>
                        </label>
                        <div className="d-flex flex-wrap gap-2">
                            {daysOfWeek.map(day => (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => handleDayToggle(day)}
                                    className={`btn btn-sm rounded-pill px-3 py-2 ${formData.days.includes(day)
                                            ? 'btn-primary shadow-sm'
                                            : 'btn-outline-secondary border-light'
                                        }`}
                                >
                                    {day.slice(0, 3)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                        <button
                            type="button"
                            className="btn btn-light rounded-pill px-4"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-success rounded-pill px-5 d-flex align-items-center gap-2 shadow-lg"
                            disabled={loading}
                        >
                            {loading && <span className="spinner-border spinner-border-sm"></span>}
                            <span className="fw-bold">{isEdit ? 'Update Batch' : 'Create Batch'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AppModal>
    );
}

export default CreateBatchModal;
