function RecentAnnouncements({ announcements = [] }) {
    return (
        <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center pt-3 pb-0">
                <h6 className="fw-bold mb-0">📢 Announcements</h6>
                <button className="btn btn-sm text-primary">View All</button>
            </div>
            <div className="card-body">
                {announcements.length === 0 ? (
                    <p className="text-muted small text-center my-4">No recent announcements</p>
                ) : (
                    <ul className="list-group list-group-flush">
                        {announcements.slice(0, 3).map((item, index) => (
                            <li key={index} className="list-group-item px-0 border-light">
                                <span className="d-block small fw-bold text-dark">{item.title}</span>
                                <span className="d-block small text-muted">{item.date}</span>
                            </li>
                        ))}
                    </ul>
                )}
                <button className="btn btn-sm btn-light w-100 rounded-pill mt-2">
                    + Create New
                </button>
            </div>
        </div>
    );
}

export default RecentAnnouncements;
