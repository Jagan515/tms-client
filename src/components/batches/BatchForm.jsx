import { useState, useEffect } from "react";

function BatchForm({ initialData = {}, onSubmit, onCancel, loading }) {
    const [formData, setFormData] = useState({
        name: "",
        class: "",
        year: new Date().getFullYear()
    });

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setFormData({ ...formData, ...initialData });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Batch Name</label>
                <input
                    className="form-control"
                    name="name"
                    placeholder="e.g. 8th Math Morning"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="row g-2 mb-4">
                <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Class</label>
                    <select
                        className="form-select"
                        name="class"
                        value={formData.class}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Class</option>
                        {[6, 7, 8, 9, 10, 11, 12].map(c => <option key={c} value={c}>{c}th</option>)}
                    </select>
                </div>
                <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Year</label>
                    <input
                        className="form-control"
                        name="year"
                        type="number"
                        value={formData.year}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Batch'}
                </button>
            </div>
        </form>
    );
}

export default BatchForm;
