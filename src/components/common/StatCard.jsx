function StatCard({ title, value, color = "primary", icon: Icon, trend }) {
    return (
        <div className="card-modern h-100 animate-fade-in d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div className={`icon-box bg-${color}-subtle text-${color} rounded-3 d-flex align-items-center justify-content-center shadow-sm`}
                    style={{ width: '48px', height: '48px' }}>
                    {Icon && <Icon className="w-6 h-6 flex-shrink-0" />}
                </div>
                {trend && (
                    <div className={`badge bg-${trend > 0 ? 'success' : 'danger'}-subtle text-${trend > 0 ? 'success' : 'danger'} border border-${trend > 0 ? 'success' : 'danger'}-subtle`}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </div>
                )}
            </div>

            <div>
                <div className="text-muted small fw-bold text-uppercase letter-spacing-1 mb-1">{title}</div>
                <h2 className="fw-bold mb-0 tracking-tight">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </h2>
            </div>
        </div>
    );
}

export default StatCard;
