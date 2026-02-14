import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverEndpoint } from "../../../config/appConfig";
import PageHeader from "../../../components/common/PageHeader";
import Loading from "../../../components/common/Loading";
import ParentChildSelector from "../components/ParentChildSelector";
import ParentStats from "../components/ParentStats";
import ParentSettings from "../components/ParentSettings";
import StudentAttendance from "../../student/components/StudentAttendance";
import StudentMarks from "../../student/components/StudentMarks";
import StudentFees from "../../student/components/StudentFees";
import AnnouncementList from "../../../components/announcements/AnnouncementList";
import {
    LayoutDashboard,
    CalendarCheck,
    Trophy,
    Wallet,
    Settings,
    ChevronRight,
    Search,
    Users,
    Baby,
    Megaphone
} from "lucide-react";

function ParentDashboard() {
    const { user } = useSelector((state) => state.auth);
    const [children, setChildren] = useState([]);
    const [selectedChildId, setSelectedChildId] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");

    const fetchChildren = async () => {
        setApiError(null);
        try {
            const response = await axios.get(`${serverEndpoint}/parent-view/children`, { withCredentials: true });
            const list = Array.isArray(response.data) ? response.data : [];
            setChildren(list);
            if (list.length > 0) setSelectedChildId(list[0]._id);
            setLoading(false);
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Unable to load parent data.";
            setApiError(message);
            setChildren([]);
            setLoading(false);
        }
    };

    const fetchChildDashboard = async (childId) => {
        if (!childId) return;
        setLoading(true);
        setApiError(null);
        try {
            const response = await axios.get(
                `${serverEndpoint}/parent-view/child/${childId}/dashboard`,
                { withCredentials: true }
            );
            setDashboardData(response.data);
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Failed to load child dashboard.";
            setApiError(message);
            setDashboardData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChildren();
    }, []);

    useEffect(() => {
        if (selectedChildId) {
            fetchChildDashboard(selectedChildId);
        }
    }, [selectedChildId]);

    if (loading && !dashboardData && !apiError) return <Loading text="Synchronizing ward data..." />;

    if (apiError) {
        return (
            <div className="p-4 vh-100 d-flex align-items-center justify-content-center">
                <div className="card-modern p-5 text-center shadow-lg border-primary-subtle" style={{ maxWidth: '500px' }}>
                    <div className="bg-danger-subtle p-4 rounded-circle d-inline-block mb-4">
                        <Users className="w-12 h-12 text-danger flex-shrink-0" />
                    </div>
                    <h3 className="fw-bold mb-3">Unable to Load Portal</h3>
                    <p className="text-muted mb-4 px-4">{apiError}</p>
                    <button type="button" className="btn btn-primary rounded-pill px-5 shadow-sm" onClick={() => { setApiError(null); fetchChildren(); }}>Try Again</button>
                </div>
            </div>
        );
    }

    if (!children.length) {
        return (
            <div className="p-4 vh-100 d-flex align-items-center justify-content-center">
                <div className="card-modern p-5 text-center shadow-lg border-primary-subtle" style={{ maxWidth: '500px' }}>
                    <div className="bg-primary-subtle p-4 rounded-circle d-inline-block mb-4">
                        <Users className="w-12 h-12 text-primary flex-shrink-0" />
                    </div>
                    <h3 className="fw-bold mb-3">Welcome to Parent Portal</h3>
                    <p className="text-muted mb-4 px-4">Our records indicate no students are currently linked to your guardian account. Please contact the administration to authorize access.</p>
                    <button type="button" className="btn btn-primary rounded-pill px-5 shadow-sm">Support Center</button>
                </div>
            </div>
        );
    }

    const selectedChild = children.find(c => c._id === selectedChildId);

    const renderContent = () => {
        if (activeTab === "settings") return <div className="animate-fade-in"><ParentSettings user={user} /></div>;

        if (!dashboardData) return (
            <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary opacity-50" role="status"></div>
            </div>
        );

        switch (activeTab) {
            case "overview":
                return (
                    <div className="animate-fade-in">
                        <ParentStats stats={dashboardData.stats} />
                        <div className="row g-4 mb-4">
                            <div className="col-lg-6">
                                <div className="d-flex align-items-center gap-x-2 mb-3 px-1">
                                    <CalendarCheck className="w-4.5 h-4.5 text-primary flex-shrink-0" />
                                    <h6 className="fw-bold mb-0 text-uppercase small tracking-wider">Attendance Analytics</h6>
                                </div>
                                <StudentAttendance history={dashboardData.attendance.history} stats={dashboardData.attendance.stats} />
                            </div>
                            <div className="col-lg-6">
                                <div className="d-flex align-items-center gap-x-2 mb-3 px-1">
                                    <Trophy className="w-4.5 h-4.5 text-primary flex-shrink-0" />
                                    <h6 className="fw-bold mb-0 text-uppercase small tracking-wider">Recent Evaluation</h6>
                                </div>
                                <StudentMarks
                                    schoolMarks={dashboardData.marks.school}
                                    tuitionMarks={dashboardData.marks.tuition}
                                    hideSubmit={true}
                                />
                            </div>
                        </div>
                        <div className="card-modern shadow-sm p-4 mt-4 border-0">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="d-flex align-items-center gap-x-2">
                                    <Megaphone className="w-4.5 h-4.5 text-primary flex-shrink-0" />
                                    <h6 className="fw-bold mb-0 text-uppercase small tracking-wider">Institutional Updates</h6>
                                </div>
                            </div>
                            <AnnouncementList announcements={dashboardData.announcements} />
                        </div>
                    </div>
                );
            case "attendance":
                return <div className="animate-fade-in"><StudentAttendance history={dashboardData.attendance.history} stats={dashboardData.attendance.stats} /></div>;
            case "marks":
                return <div className="animate-fade-in"><StudentMarks schoolMarks={dashboardData.marks.school} tuitionMarks={dashboardData.marks.tuition} hideSubmit={true} /></div>;
            case "fees":
                return <div className="animate-fade-in"><StudentFees fees={dashboardData.fees.history} /></div>;
            default:
                return null;
        }
    };

    return (
        <div className="p-6 animate-fade-in bg-premium-gradient" style={{ minHeight: '100vh', padding: 'var(--s-6)' }}>
            <div className="d-flex flex-column flex-xl-row justify-content-between align-items-xl-center mb-8 gap-4" style={{ marginBottom: 'var(--s-8)' }}>
                <PageHeader
                    title="Guardian Intelligence"
                    subtitle={`Monitoring growth and performance for ${selectedChild?.name || 'Authorized Ward'}`}
                />

                {activeTab !== 'settings' && (
                    <div className="floating-selector d-flex align-items-center gap-3 p-2 bg-body rounded-pill border shadow-sm">
                        <div className="icon-box bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '40px', height: '40px' }}>
                            <Baby className="w-5 h-5 flex-shrink-0" />
                        </div>
                        <div className="me-2">
                            <ParentChildSelector
                                children={children}
                                selectedChildId={selectedChildId}
                                onSelect={setSelectedChildId}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Tabs */}
            <div className="nav-container mb-10 p-1 bg-secondary rounded-4 d-inline-flex flex-wrap gap-1 shadow-sm" style={{ marginBottom: 'var(--s-10)' }}>
                {[
                    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
                    { id: 'marks', label: 'Evaluation', icon: Trophy },
                    { id: 'fees', label: 'Financials', icon: Wallet },
                    { id: 'settings', label: 'Preferences', icon: Settings },
                ].map(tab => (
                    <button
                        key={tab.id}
                        className={`btn px-4 py-2.5 rounded-4 d-flex align-items-center gap-x-2 transition-all border-0 ${activeTab === tab.id
                            ? 'bg-white shadow-sm text-primary fw-bold'
                            : 'text-secondary opacity-75'
                            }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <tab.icon className="w-4.5 h-4.5 flex-shrink-0" />
                        <span className="small text-capitalize">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="tab-render-area" style={{ minHeight: '500px' }}>
                {renderContent()}
            </div>
        </div>
    );
}

export default ParentDashboard;
