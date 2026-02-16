import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { serverEndpoint } from "../../../config/appConfig";
import PageHeader from "../../../components/common/PageHeader";
import StatCard from "../../../components/common/StatCard";
import Loading from "../../../components/common/Loading";
import {
    Users,
    UserCheck,
    GraduationCap,
    BookOpen,
    Activity,
    Database,
    Mail,
    History,
    ArrowRight,
    Cpu,
    ShieldCheck,
    Zap,
    Globe,
    ExternalLink,
    Terminal
} from "lucide-react";

function DeveloperDashboard() {
    const [stats, setStats] = useState(null);
    const [recentTeachers, setRecentTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [statsRes, teachersRes] = await Promise.all([
                axios.get(`${serverEndpoint}/developer/stats`, { withCredentials: true }),
                axios.get(`${serverEndpoint}/developer/teachers`, { withCredentials: true })
            ]);

            if (statsRes.data?.success) setStats(statsRes.data.data);
            if (Array.isArray(teachersRes.data)) {
                const sorted = [...teachersRes.data].reverse();
                setRecentTeachers(sorted.slice(0, 5));
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <Loading text="Initializing Institutional Oversight Matrix..." />;

    return (
        <div className="p-4 p-lg-5 animate-fade-in bg-premium-gradient">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-5">
                <PageHeader
                    title="System Intelligence Matrix"
                    subtitle="Real-time institutional oversight and infrastructure health monitoring"
                />
                <div className="d-flex gap-2">
                    <div className="badge bg-tertiary text-primary px-3 py-2 border d-flex align-items-center gap-x-2">
                        <Terminal className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="fw-bold small">NODE_v20.12.0</span>
                    </div>
                    <div className="badge bg-success-subtle text-success px-3 py-2 border border-success-subtle d-flex align-items-center gap-x-2">
                        <Zap className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="fw-bold small">ENV: PRODUCTION</span>
                    </div>
                </div>
            </div>

            {/* Core Metrics Portfolio */}
            <div className="row g-4 mb-10" style={{ marginBottom: 'var(--s-10)' }}>
                {[
                    { title: 'Total Provisioned Instructors', value: stats?.totalTeachers || 0, icon: Users, color: 'primary', trend: 12.5 },
                    { title: 'Authorized Active Entities', value: stats?.activeTeachers || 0, icon: UserCheck, color: 'success', trend: 0 },
                    { title: 'Student Enrollment Matrix', value: stats?.totalStudents || 0, icon: GraduationCap, color: 'warning', trend: 8.2 },
                    { title: 'Operational Course Batches', value: stats?.totalBatches || 0, icon: BookOpen, color: 'info', trend: 3 },
                ].map((stat, idx) => (
                    <div key={idx} className="col-sm-6 col-xl-3">
                        <StatCard {...stat} />
                    </div>
                ))}
            </div>

            <div className="row g-5">
                {/* Infrastructure Telemetry */}
                <div className="col-xl-5">
                    <div className="card-modern h-100 p-0 shadow-premium">
                        <div className="p-4 border-bottom bg-tertiary d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-x-2">
                                <Cpu className="w-5 h-5 text-primary flex-shrink-0" />
                                <h5 className="mb-0 fw-bold">Infrastructure Diagnostic</h5>
                            </div>
                            <button className="btn btn-icon rounded-circle hover-bg-secondary p-2 transition-all d-flex align-items-center justify-content-center">
                                <Globe className="w-5 h-5 text-muted flex-shrink-0" />
                            </button>
                        </div>
                        <div className="p-4 p-md-5">
                            <div className="d-flex flex-column gap-4">
                                {[
                                    { name: 'Core Database Cluster', type: 'MongoDB Altas', status: stats?.systemHealth?.database === "Connected" ? 'OPERATIONAL' : 'OFFLINE', icon: Database, color: stats?.systemHealth?.database === "Connected" ? 'success' : 'danger' },
                                    { name: 'Institutional Mail Relay', type: 'SMTP Protocol', status: stats?.systemHealth?.emailService === "Operational" ? 'AUTHORIZED' : 'DEGRADED', icon: Mail, color: stats?.systemHealth?.emailService === "Operational" ? 'success' : 'warning' },
                                    { name: 'Security Verification layer', type: 'JWT Bearer Auth', status: 'SYNCHRONIZED', icon: ShieldCheck, color: 'primary' },
                                ].map((sys, idx) => (
                                    <div key={idx} className="p-4 rounded-4 bg-tertiary border border-subtle-hover transition-all shadow-sm">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center gap-x-3">
                                                <div className={`icon-box bg-${sys.color}-subtle text-${sys.color} rounded-3 d-flex align-items-center justify-content-center border`} style={{ width: '40px', height: '40px' }}>
                                                    <sys.icon className="w-4.5 h-4.5 flex-shrink-0" />
                                                </div>
                                                <div>
                                                    <div className="fw-bold small">{sys.name}</div>
                                                    <div className="text-muted" style={{ fontSize: '0.65rem' }}>{sys.type}</div>
                                                </div>
                                            </div>
                                            <div className={`badge bg-${sys.color} text-white px-3 py-1 fw-bold`} style={{ fontSize: '0.6rem' }}>
                                                {sys.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="mt-2 p-4 rounded-4 bg-tertiary border border-dashed text-center">
                                    <div className="text-muted small mb-2 d-flex align-items-center justify-content-center gap-x-2">
                                        <History className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span className="fw-bold text-uppercase letter-spacing-1" style={{ fontSize: '0.65rem' }}>Last Automated Snapshot</span>
                                    </div>
                                    <div className="fw-bold">
                                        {stats?.systemHealth?.lastBackup
                                            ? new Date(stats.systemHealth.lastBackup).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })
                                            : "Verification in progress..."}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Authority Lifecycle Management */}
                <div className="col-xl-7">
                    <div className="card-modern h-100 p-0 shadow-premium">
                        <div className="p-4 d-flex justify-content-between align-items-center border-bottom bg-tertiary">
                            <div className="d-flex align-items-center gap-x-2">
                                <Users className="w-5 h-5 text-primary flex-shrink-0" />
                                <h5 className="mb-0 fw-bold">Authorization Registry Ledger</h5>
                            </div>
                            <Link to="/developer/teachers" className="btn btn-primary rounded-pill px-4 py-2 d-flex align-items-center gap-x-2 shadow-sm hover-lift">
                                <span className="small fw-bold">Matrix Directive</span>
                                <ArrowRight className="w-4 h-4 flex-shrink-0" />
                            </Link>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th className="ps-4 py-3">Identity Profile</th>
                                        <th className="py-3">Authentication Channel</th>
                                        <th className="pe-4 py-3 text-end">System Integrity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTeachers.length > 0 ? (
                                        recentTeachers.map((t) => (
                                            <tr key={t._id}>
                                                <td className="ps-4 py-4">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="avatar-initial rounded-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-sm fw-bold"
                                                            style={{ width: '40px', height: '40px', fontSize: '0.85rem' }}>
                                                            {t.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold small">{t.name}</div>
                                                            <div className="text-muted" style={{ fontSize: '0.65rem' }}>Provisioned: {new Date(t.createdAt).toLocaleDateString()}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-x-2">
                                                        <div className="badge bg-tertiary text-secondary small border px-2 py-1" style={{ fontSize: '0.7rem' }}>
                                                            {t.email}
                                                        </div>
                                                        <ExternalLink className="w-3 h-3 text-muted opacity-50 flex-shrink-0" />
                                                    </div>
                                                </td>
                                                <td className="pe-4 py-4 text-end">
                                                    <div className={`d-inline-flex align-items-center gap-x-2 px-3 py-1 rounded-pill small fw-bold ${t.isActive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`} style={{ fontSize: '0.65rem' }}>
                                                        <div className={`rounded-circle flex-shrink-0 pulse-${t.isActive ? 'success' : 'danger'}`} style={{ width: '8px', height: '8px', backgroundColor: t.isActive ? 'var(--bs-success)' : 'var(--bs-danger)' }}></div>
                                                        {t.isActive ? "TRUSTED" : "REVOKED"}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center py-5">
                                                <div className="bg-tertiary d-inline-block p-4 rounded-circle mb-3">
                                                    <Activity className="w-10 h-10 text-muted opacity-20 flex-shrink-0" />
                                                </div>
                                                <div className="text-muted fw-bold small">Zero registrations detected in the current epoch.</div>
                                                <Link to="/developer/teachers" className="btn btn-link btn-sm text-decoration-none fw-bold mt-2">Initialize First Provisioning</Link>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeveloperDashboard;
