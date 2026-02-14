function AttendanceOverview({ present, total }) {
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return (
        <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
                <h6 className="text-muted small fw-bold mb-3">TODAY'S ATTENDANCE</h6>
                <div className="position-relative d-inline-block mb-3">
                    <svg width="100" height="100" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#e9ecef" strokeWidth="8" />
                        <circle
                            cx="50" cy="50" r="45" fill="none" stroke="#0d6efd" strokeWidth="8"
                            strokeDasharray={`${percentage * 2.83} 283`}
                            transform="rotate(-90 50 50)"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="position-absolute top-50 start-50 translate-middle">
                        <span className="h4 fw-bold mb-0">{percentage}%</span>
                    </div>
                </div>
                <p className="mb-2 fw-bold">{present}/{total} Present</p>
                <button className="btn btn-sm btn-primary rounded-pill px-4">
                    Mark Now
                </button>
            </div>
        </div>
    );
}

export default AttendanceOverview;
