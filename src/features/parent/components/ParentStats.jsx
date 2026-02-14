import StatCard from "../../../components/common/StatCard";
import {
    CalendarCheck,
    CreditCard,
    TrendingUp,
    Clock,
    ShieldAlert
} from "lucide-react";

function ParentStats({ stats }) {
    if (!stats) return null;

    return (
        <div className="row g-4 mb-10 animate-fade-in" style={{ marginBottom: 'var(--s-10)' }}>
            <div className="col-sm-6 col-xl-3">
                <StatCard
                    title="Current Attendance"
                    value={`${stats.attendance}%`}
                    icon={CalendarCheck}
                    trend={stats.attendance >= 75 ? 2.1 : -4.5}
                    color="primary"
                />
            </div>
            <div className="col-sm-6 col-xl-3">
                <StatCard
                    title="Tuition Balance"
                    value={`₹${stats.pendingFees}`}
                    icon={CreditCard}
                    color="danger"
                />
            </div>
            <div className="col-sm-6 col-xl-3">
                <StatCard
                    title="Academic Performance"
                    value={stats.recentGrade || "B+"}
                    icon={TrendingUp}
                    color="success"
                />
            </div>
            <div className="col-sm-6 col-xl-3">
                <StatCard
                    title="Next Session"
                    value={stats.nextExam || "Tomorrow"}
                    icon={Clock}
                    color="info"
                />
            </div>
        </div>
    );
}

export default ParentStats;
