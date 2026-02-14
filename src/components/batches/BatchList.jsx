function BatchList({ batches, onEdit, onDelete, onView }) {
    if (!batches || batches.length === 0) {
        return <div className="text-center py-5 text-muted">No batches found. Create one to get started!</div>;
    }

    return (
        <div className="row g-3">
            {batches.map((batch) => (
                <div key={batch._id} className="col-md-4">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <h5 className="fw-bold mb-0 text-primary">{batch.name}</h5>
                                <div className="dropdown">
                                    <button className="btn btn-sm btn-light rounded-circle" type="button" data-bs-toggle="dropdown" onClick={() => onView(batch)}>
                                        <i className="bi bi-three-dots-vertical"></i> View
                                    </button>
                                </div>
                            </div>
                            <p className="text-muted small mb-3">Class {batch.class} • {batch.year}</p>

                            <div className="d-flex justify-content-between align-items-center">
                                <span className="badge bg-light text-dark border">
                                    {batch.studentCount || 0} Students
                                </span>
                                <div>
                                    <button className="btn btn-sm btn-link text-decoration-none px-2" onClick={() => onEdit(batch)}>Edit</button>
                                    <button className="btn btn-sm btn-link text-danger text-decoration-none px-2" onClick={() => onDelete(batch)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default BatchList;
