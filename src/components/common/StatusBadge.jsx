import { BadgeCheck, Clock, AlertCircle } from "lucide-react";

function StatusBadge({ status }) {
    const s = status?.toLowerCase();
    const isPaid = s === "paid" || s === "approved" || s === "operational" || s === "trusted";
    const isPending = s === "pending" || s === "waiting" || s === "degraded";

    let color = 'primary';
    let icon = <Clock className="w-3 h-3 flex-shrink-0" />;

    if (isPaid) {
        color = 'success';
        icon = <BadgeCheck className="w-3 h-3 flex-shrink-0" />;
    } else if (isPending) {
        color = 'warning';
        icon = <Clock className="w-3 h-3 flex-shrink-0" />;
    } else {
        color = 'danger';
        icon = <AlertCircle className="w-3 h-3 flex-shrink-0" />;
    }

    return (
        <div className={`d-inline-flex align-items-center gap-x-1 px-3 py-1 rounded-pill small fw-bold shadow-sm border border-${color}-subtle bg-${color}-subtle text-${color} animate-fade-in`} style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
            {icon}
            <span className="text-uppercase">{status || 'UNKNOWN_STATUS'}</span>

        </div>
    );
}

export default StatusBadge;
