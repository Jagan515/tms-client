import { useState, useEffect } from "react";
import batchService from "../../features/teacher/api/batchService";

function AddMarksForm({ onSubmit, onCancel, loading }) {
    const [batches, setBatches] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        studentId: "",
        examName: "",
        subject: "",
        totalMarks: 100,
        marksObtained: ""
    });

    useEffect(() => {
        batchService.getAll().then(data => setBatches(data.batches || []));
    }, []);

    useEffect(() => {
        if (selectedBatch) {
            batchService.getStudents(selectedBatch).then(data => setStudents(data.students || []));
        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setStudents([]);
        }
    }, [selectedBatch]);

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
                <label className="form-label small fw-bold">Select Batch</label>
                <select className="form-select" value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
                    <option value="">-- Select Batch --</option>
                    {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label small fw-bold">Select Student</label>
                <select className="form-select" name="studentId" value={formData.studentId} onChange={handleChange} required disabled={!selectedBatch}>
                    <option value="">-- Select Student --</option>
                    {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.regNo})</option>)}
                </select>
            </div>

            <div className="row g-2 mb-3">
                <div className="col-md-6">
                    <label className="form-label small fw-bold">Exam Name</label>
                    <input className="form-control" name="examName" placeholder="e.g. Unit Test 1" value={formData.examName} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                    <label className="form-label small fw-bold">Subject</label>
                    <input className="form-control" name="subject" placeholder="e.g. Mathematics" value={formData.subject} onChange={handleChange} required />
                </div>
            </div>

            <div className="row g-2 mb-4">
                <div className="col-md-6">
                    <label className="form-label small fw-bold">Total Marks</label>
                    <input className="form-control" name="totalMarks" type="number" value={formData.totalMarks} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                    <label className="form-label small fw-bold">Marks Obtained</label>
                    <input className="form-control" name="marksObtained" type="number" value={formData.marksObtained} onChange={handleChange} required />
                </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                    {loading ? 'Saving...' : 'Add Marks'}
                </button>
            </div>
        </form>
    );
}

export default AddMarksForm;
