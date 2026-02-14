function StatWidget({ title, value, color = "primary", actionText = null, onAction = null }) {
    return (
        <div className="card border-0 shadow-sm h-100">
            <div className={`card-body border-start border-4 border-${color}`}>
                <h6 className="text-muted text-uppercase small fw-bold mb-2">{title}</h6>
                <h3 className="fw-bold mb-3">{value}</h3>
                {actionText && (
                    <button
                        className={`btn btn-sm btn-outline-${color} rounded-pill px-3`}
                        onClick={onAction}
                    >
                        {actionText}
                    </button>
                )}
            </div>
        </div>
    );
}

export default StatWidget;
