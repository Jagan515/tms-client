import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { serverEndpoint } from "../../../config/appConfig";
import StatCard from "../../../components/common/StatCard";
import Loading from "../../../components/common/Loading";
import {
    Users,
    Calendar,
    CreditCard,
    AlertTriangle,
    Plus,
    Edit3,
    Megaphone,
    Trophy,
    ArrowRight,
    Clock,
    BookOpen,
    CheckCircle2,
    CalendarDays,
    Star,
    Sparkles,
    ChevronRight,
    BarChart3,
    History
} from "lucide-react";

function TeacherDashboard() {
    const { user } = useSelector((state) => state.auth);
    const [dashboardData, setDashboardData] = useState(null);
    const [todaysBatches, setTodaysBatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashboardRes, batchesRes] = await Promise.all([
                    axios.get(`${serverEndpoint}/dashboard/teacher`, { withCredentials: true }),
                    axios.get(`${serverEndpoint}/batches`, { withCredentials: true })
                ]);

                setDashboardData(dashboardRes.data);

                const batchesArray = Array.isArray(batchesRes.data.batches)
                    ? batchesRes.data.batches
                    : Array.isArray(batchesRes.data)
                        ? batchesRes.data
                        : [];

                if (batchesArray.length > 0) {
                    const todayDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                    const todayBatches = batchesArray.filter(b =>
                        b.days && b.days.includes(todayDayName)
                    );
                    setTodaysBatches(todayBatches);
                }
            } catch (error) {
                console.error("Dashboard fetch failed", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <Loading text="Personalizing your workspace..." />;
    if (!dashboardData) return <div className="alert alert-danger mx-4 my-5 animate-fade-in shadow-sm rounded-4">Institutional telemetry synchronization failed. Accessing recovery protocols...</div>;

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

    return (
        <div className="animate-fade-in bg-premium-gradient" style={{ minHeight: '100vh', padding: 'var(--s-6)' }}>
            {/* Elite Welcome Header */}
            <div className="d-flex flex-column flex-xl-row justify-content-between align-items-xl-center gap-4" style={{ marginBottom: 'var(--s-8)' }}>
                <div className="animate-fade-in">
                    <div className="d-flex align-items-center gap-x-2 mb-1">
                        <Sparkles className="w-4 h-4 text-warning flex-shrink-0" />
                        <span className="text-uppercase-caps">{greeting}</span>
                    </div>
                    <h2 className="fw-bold tracking-tight mb-2">
                        Teacher {user?.name?.split(' ')[0] || "User"}
                    </h2>
                    <p className="text-muted mb-0 small fw-medium">Manage your students, fees, and attendance from one place.</p>
                </div>
                <div className="d-flex flex-wrap gap-2">
                    <Link to="/teacher/attendance" className="btn btn-primary rounded-pill px-4 py-2.5 d-flex align-items-center gap-x-2 shadow-sm hover-lift">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                        <span className="fw-bold small">Mark Attendance</span>
                    </Link>
                    <Link to="/teacher/announcements" className="btn btn-outline-secondary rounded-pill px-4 py-2.5 d-flex align-items-center gap-x-2 border-dashed transition-all">
                        <Megaphone className="w-4 h-4 flex-shrink-0" />
                        <span className="fw-bold small">New Announcement</span>
                    </Link>
                </div>
            </div>

            {/* Matrix Portfolio - Stats Grid */}
            <div className="row g-4" style={{ marginBottom: 'var(--s-10)' }}>
                {[
                    { title: 'Total Students', value: dashboardData.totalStudents, icon: Users, color: 'primary' },
                    { title: 'Total Batches', value: dashboardData.totalBatches || 0, icon: Calendar, color: 'success' },
                    { title: 'Pending Fees', value: `₹${dashboardData.pendingFees?.amount?.toLocaleString() || 0}`, icon: CreditCard, color: 'info' },
                    { title: 'Low Attendance', value: dashboardData.lowAttendanceCount, icon: AlertTriangle, color: 'danger' },
                ].map((stat, idx) => (
                    <div key={idx} className="col-sm-6 col-xl-3">
                        <StatCard {...stat} />
                    </div>
                ))}
            </div>

            <div className="row g-5">
                {/* Tactical Schedule Area */}
                <div className="col-xl-8">
                    <div className="card-modern h-100 p-0 shadow-premium">
                        <div className="p-4 border-bottom bg-tertiary d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-3">
                                <div className="icon-box bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '42px', height: '42px' }}>
                                    <Clock className="w-5 h-5 flex-shrink-0" />
                                </div>
                                <div>
                                    <h5 className="mb-0 fw-bold">Today's Batches</h5>
                                    <div className="text-muted small fw-medium">Scheduled classes for today</div>
                                </div>
                            </div>
                            <div className="badge bg-tertiary text-primary border rounded-pill px-3 py-2 fw-bold" style={{ fontSize: '0.75rem' }}>
                                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                            </div>
                        </div>

                        <div className="p-4 p-md-5">
                            {todaysBatches.length > 0 ? (
                                <div className="d-flex flex-column gap-3">
                                    {todaysBatches.map((batch) => (
                                        <div key={batch._id} className="d-flex align-items-center justify-content-between p-4 rounded-4 bg-tertiary transition-all hover-lift border border-subtle-hover shadow-sm">
                                            <div className="d-flex align-items-center gap-4">
                                                <div className="time-indicator bg-body shadow-sm rounded-3 py-2 px-3 text-center border" style={{ minWidth: '94px' }}>
                                                    <div className="text-primary fw-bold" style={{ fontSize: '0.9rem' }}>{batch.time || "TBD"}</div>
                                                    <div className="text-muted mt-0.5" style={{ fontSize: '0.6rem', letterSpacing: '0.05em' }}>SCHEDULED</div>
                                                </div>
                                                <div>
                                                    <h6 className="mb-1 fw-bold tracking-tight" style={{ fontSize: '1.05rem' }}>{batch.name}</h6>
                                                    <div className="d-flex align-items-center gap-x-2 text-muted small">
                                                        <BookOpen className="w-3.5 h-3.5 opacity-50 flex-shrink-0" />
                                                        <span className="fw-medium">{batch.subject || "Standard Curriculum"}</span>
                                                        {batch.studentCount !== undefined && (
                                                            <>
                                                                <span className="mx-1">•</span>
                                                                <span className="badge bg-success-subtle text-success px-2 py-1">
                                                                    👥 {batch.studentCount} students
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <Link to={`/teacher/attendance?batchId=${batch._id}`}
                                                    className="btn btn-primary rounded-pill px-4 py-2 small fw-bold shadow-sm transition-all hover-scale">
                                                    Mark Attendance
                                                </Link>
                                                <Link to={`/teacher/marks?batchId=${batch._id}`}
                                                    className="btn btn-icon rounded-circle hover-bg-tertiary p-2.5 transition-all text-muted d-flex align-items-center justify-content-center border"
                                                    title="Manage Marks">
                                                    <Edit3 className="w-4 h-4 flex-shrink-0" />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-5 d-flex flex-column align-items-center gap-3 bg-tertiary rounded-4">
                                    <div className="bg-body p-4 rounded-circle shadow-sm">
                                        <CalendarDays size={48} className="text-muted opacity-30" />
                                    </div>
                                    <div>
                                        <p className="fw-bold mb-1">No Batches Today</p>
                                        <p className="text-muted small px-5">There are no classes scheduled for today.</p>
                                        <Link to="/teacher/batches" className="btn btn-sm btn-primary rounded-pill px-4 mt-2">
                                            View All Batches
                                        </Link>
                                    </div>
                                    <button className="btn btn-primary rounded-pill px-4 py-2 small fw-bold shadow-sm hover-lift d-flex align-items-center gap-x-2">
                                        <History className="w-4 h-4 flex-shrink-0" />
                                        Refresh Schedule
                                    </button>
                                </div>
                            )}

                            {/* View All Batches Link */}
                            {todaysBatches.length > 0 && (
                                <div className="mt-4 text-center">
                                    <Link to="/teacher/batches" className="btn btn-outline-primary rounded-pill px-5 py-2 d-inline-flex align-items-center gap-2">
                                        <span>Manage All Batches</span>
                                        <ChevronRight size={16} />
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Broadcast Segment */}
                        <div className="mt-auto p-4 border-top bg-tertiary">
                            <div className="d-flex justify-content-between align-items-center mb-4 px-1">
                                <div className="d-flex align-items-center gap-x-2">
                                    <Megaphone className="w-4 h-4 text-primary flex-shrink-0" />
                                    <h6 className="mb-0 fw-bold text-uppercase-caps">Recent Announcements</h6>
                                </div>
                                <Link to="/teacher/announcements" className="small text-decoration-none fw-bold d-flex align-items-center gap-x-1 hover-text-primary text-muted">
                                    <span>View All</span>
                                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                                </Link>
                            </div>
                            <div className="row g-3">
                                {dashboardData.recentAnnouncements?.slice(0, 2).map((ann, idx) => (
                                    <div key={idx} className="col-md-6">
                                        <div className="p-3 bg-body rounded-4 shadow-sm h-100 border border-subtle-hover transition-all">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h6 className="mb-0 fw-bold text-truncate small" style={{ maxWidth: '80%' }}>{ann.title}</h6>
                                                <div className="bg-primary-subtle p-1 rounded d-flex align-items-center justify-content-center">
                                                    <Star className="w-2.5 h-2.5 text-primary flex-shrink-0" />
                                                </div>
                                            </div>
                                            <p className="small text-muted mb-0 line-clamp-2" style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>{ann.message}</p>
                                        </div>
                                    </div>
                                )) || <div className="col-12 text-center py-2 text-muted small opacity-50 italic">No broadcast logs found...</div>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analytical Intelligence Sidebar */}
                <div className="col-xl-4">
                    <div className="row g-4">
                        {/* Elite Merit Ledger */}
                        <div className="col-12">
                            <div className="card-modern p-0 shadow-premium">
                                <div className="p-4 border-bottom bg-tertiary d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-x-2">
                                        <BarChart3 className="w-4.5 h-4.5 text-success flex-shrink-0" />
                                        <h5 className="mb-0 fw-bold">Top Students</h5>
                                    </div>
                                </div>
                                <div className="p-3">
                                    {dashboardData.topPerformers && dashboardData.topPerformers.length > 0 ? (
                                        <div className="d-flex flex-column gap-1">
                                            {dashboardData.topPerformers.map((student, idx) => (
                                                <div key={idx} className="d-flex align-items-center justify-content-between p-3 rounded-4 hover-bg-tertiary transition-all">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="position-relative">
                                                            <div className={`avatar rounded-circle d-flex align-items-center justify-content-center shadow-sm ${idx === 0 ? 'bg-primary' : 'bg-tertiary'} text-white fw-bold`}
                                                                style={{ width: '42px', height: '42px', fontSize: '0.9rem' }}>
                                                                {student.name?.charAt(0) || 'S'}
                                                            </div>
                                                            {idx === 0 && (
                                                                <div className="position-absolute bg-warning rounded-circle shadow-sm border border-white d-flex align-items-center justify-content-center"
                                                                    style={{ bottom: '-4px', right: '-4px', width: '20px', height: '20px' }}>
                                                                    <Trophy className="w-2.5 h-2.5 text-white flex-shrink-0" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold small">{student.name}</div>
                                                            <div className="text-muted" style={{ fontSize: '0.65rem' }}>Rank #{idx + 1}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-primary fw-bold" style={{ fontSize: '0.9rem' }}>{student.average}%</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-5 text-muted small opacity-50 italic">Merit calculation in progress...</div>
                                    )}
                                </div>
                                <div className="p-3 border-top bg-tertiary text-center">
                                    <Link to="/teacher/marks" className="btn btn-link py-1 text-decoration-none small fw-bold d-flex align-items-center justify-content-center gap-x-2 text-muted hover-text-primary transition-all">
                                        <span>View All Marks</span>
                                        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Operational Toolbox */}
                        <div className="col-12">
                            <div className="card-modern p-4 border-dashed bg-tertiary">
                                <h6 className="text-uppercase-caps mb-4">Quick Actions</h6>
                                <div className="d-flex flex-column gap-3">
                                    <QuickActionLink to="/teacher/students" icon={Plus} label="Add Student" />
                                    <QuickActionLink to="/teacher/marks" icon={Edit3} label="Manage Marks" />
                                    <QuickActionLink to="/teacher/fees" icon={CreditCard} label="Record Payment" />
                                    <QuickActionLink to="/teacher/attendance" icon={History} label="Attendance History" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const QuickActionLink = ({ to, icon: Icon, label }) => (
    <Link to={to} className="btn bg-body d-flex align-items-center justify-content-between p-3 rounded-4 transition-all hover-lift border border-subtle-hover shadow-sm">
        <div className="d-flex align-items-center gap-x-3">
            <div className="bg-primary-subtle p-2 rounded-3 text-primary d-flex align-items-center justify-content-center">
                <Icon className="w-4.5 h-4.5 flex-shrink-0" />
            </div>
            <span className="small fw-bold text-secondary">{label}</span>
        </div>
        <div className="bg-tertiary p-1 rounded-circle d-flex align-items-center justify-content-center">
            <ChevronRight className="w-3 h-3 text-muted opacity-50 flex-shrink-0" />
        </div>
    </Link>
);

export default TeacherDashboard;
