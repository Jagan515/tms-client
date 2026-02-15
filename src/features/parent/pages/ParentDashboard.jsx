import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
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
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const activeTab = query.get('tab') || 'overview';

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

    // Re-fetch dashboard when tab changes if needed, or simply render different view
    // Since dashboardData contains everything, we don't need to refetch on tab change unless data is segmented.
    // The current backend sends everything.

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
            case "notices":
                return (
                    <div className="animate-fade-in">
                        <div className="d-flex align-items-center gap-x-2 mb-4">
                            <Megaphone className="w-5 h-5 text-primary flex-shrink-0" />
                            <h5 className="fw-bold mb-0">Notice Board</h5>
                        </div>
                        <AnnouncementList announcements={dashboardData.announcements} />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-4 p-xl-5 pb-5 mb-5 mb-lg-0 animate-fade-in">
            {/* Header Section */}
            <header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">
                <div>
                    <h2 className="fw-bold text-dark mb-1">
                        {activeTab === 'overview' ? 'Dashboard Overview' :
                            activeTab === 'attendance' ? 'Attendance Records' :
                                activeTab === 'marks' ? 'Academic Performance' :
                                    activeTab === 'fees' ? 'Financial Context' :
                                        activeTab === 'notices' ? 'Notice Board' : 'Settings'}
                    </h2>
                    <p className="text-muted small mb-0">Managing portfolio for <span className="fw-bold text-primary">{selectedChild?.name || 'your ward'}</span></p>
                </div>

                {/* Child Selector */}
                {activeTab !== 'settings' && (
                    <div className="bg-white p-1.5 rounded-pill border shadow-sm d-inline-flex align-items-center gap-2">
                        <div className="bg-primary-subtle p-2 rounded-circle text-primary">
                            <Baby size={18} />
                        </div>
                        <div className="pe-2">
                            <ParentChildSelector
                                children={children}
                                selectedChildId={selectedChildId}
                                onSelect={setSelectedChildId}
                            />
                        </div>
                    </div>
                )}
            </header>

            {/* Content Area */}
            <div className="animate-fade-in fade-in-up">
                {renderContent()}
            </div>
        </div>
    );
}

export default ParentDashboard;
