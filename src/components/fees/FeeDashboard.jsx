import { TrendingUp, TrendingDown, DollarSign, Users } from "lucide-react";

function FeeDashboard({ stats, month }) {
    const cards = [
        {
            title: "Revenue Collection",
            value: `₹${stats.collected.toLocaleString()}`,
            icon: <TrendingUp className="text-success" />,
            bgColor: "bg-success-subtle",
            textColor: "text-success",
            desc: `Settled accounts for ${new Date(2000, new Date().getMonth()).toLocaleString('default', { month: 'long' })}`
        },
        {
            title: "Institutional Arrears",
            value: `₹${stats.pending.toLocaleString()}`,
            icon: <TrendingDown className="text-danger" />,
            bgColor: "bg-danger-subtle",
            textColor: "text-danger",
            desc: "Cumulative outstanding across all batches"
        },
        {
            title: "Pending Accounts",
            value: stats.defaulterCount,
            icon: <Users className="text-primary" />,
            bgColor: "bg-primary-subtle",
            textColor: "text-primary",
            desc: "Candidates with unresolved balances"
        }
    ];

    return (
        <div className="row g-4">
            {cards.map((card, idx) => (
                <div className="col-lg-4" key={idx}>
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 transition-all hover-lift">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <div className={`p-3 rounded-4 ${card.bgColor} ${card.textColor}`}>
                                    {card.icon}
                                </div>
                                <div className="text-end">
                                    <h3 className="fw-bold mb-0" style={{ fontSize: '1.75rem' }}>{card.value}</h3>
                                    <span className="small text-muted fw-bold text-uppercase letter-spacing-1">{card.title}</span>
                                </div>
                            </div>
                            <div className="pt-3 border-top">
                                <p className="text-muted small mb-0 d-flex align-items-center gap-2">
                                    <DollarSign size={14} className="opacity-50" />
                                    <span>{card.desc}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default FeeDashboard;
