function PendingApprovals({ pending = [], onApprove, onReject }) {
    if (!pending || pending.length === 0) {
        return <p className="text-center text-muted my-3">No pending approvals.</p>;
    }

    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        <th>Student</th>
                        <th>Exam</th>
                        <th>Marks</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pending.map((item) => (
                        <tr key={item._id}>
                            <td>
                                <div className="fw-bold">{item.studentId?.userId?.name || 'Academic Scholar'}</div>
                                <small className="text-muted">Batch: {item.batchId?.name || 'Institutional'}</small>
                            </td>
                            <td>{item.unitName}</td>
                            <td><span className="badge bg-secondary">{item.marksObtained}/{item.totalMarks}</span></td>
                            <td>
                                <button className="btn btn-sm btn-success me-2" onClick={() => onApprove(item)}>Approve</button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => onReject(item)}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PendingApprovals;
