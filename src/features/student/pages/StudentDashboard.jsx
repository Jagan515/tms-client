import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../../../config/appConfig";
import PageHeader from "../../../components/common/PageHeader";
import Loading from "../../../components/common/Loading";
import {
    LayoutDashboard,
    CalendarCheck,
    Trophy,
    Wallet,
    Megaphone,
    User,
    ChevronRight,
    Search
} from "lucide-react";

// Student Components
import StudentStats from "../components/StudentStats";
import StudentAttendance from "../components/StudentAttendance";
import StudentMarks from "../components/StudentMarks";
import StudentFees from "../components/StudentFees";
import StudentProfile from "../components/StudentProfile";
import AnnouncementList from "../../../components/announcements/AnnouncementList";

function StudentDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("dashboard");

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${serverEndpoint}/student-view/dashboard`,
                { withCredentials: true }
            );
            setData(response.data);
        } catch (error) {
            console.error("Fetch failed", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const handleSubmitMarks = async (marksData) => {
        try {
            await axios.post(
                `${serverEndpoint}/student-view/marks/custom`,
                marksData,
                { withCredentials: true }
            );
            fetchDashboard();
        } catch (error) {
            console.error("Failed to submit marks.");
        }
    };

    if (loading) return <Loading text="Assembling your academic profile..." />;
    if (!data) return <div className="alert alert-danger mx-4 my-5 animate-fade-in shadow-sm">Connection interruption. Please refresh your browser.</div>;

    const { student, attendance, marks, fees, announcements } = data;

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return (
                    <div className="animate-fade-in">
                        <StudentStats student={student} />
                        <div className="row g-4">
                            <div className="col-lg-4">
                                <StudentAttendance history={attendance.history} stats={attendance.stats} />
                            </div>
                            <div className="col-lg-4">
                                <StudentMarks
                                    schoolMarks={marks.school}
                                    tuitionMarks={marks.tuition}
                                    onSubmitSchoolMarks={handleSubmitMarks}
                                />
                            </div>
                            <div className="col-lg-4">
                                <StudentFees fees={fees.history} />
                            </div>

                            <div className="col-12 mt-2">
                                <div className="card-modern shadow-sm p-4 border-0 position-relative overflow-hidden">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div className="d-flex align-items-center gap-x-2">
                                            <div className="bg-primary-subtle p-2 rounded-3 d-flex align-items-center justify-content-center">
                                                <Megaphone className="w-4.5 h-4.5 text-primary flex-shrink-0" />
                                            </div>
                                            <h5 className="mb-0 fw-bold">Recent Updates</h5>
                                        </div>
                                        <button className="btn btn-link btn-sm fw-bold text-decoration-none d-flex align-items-center gap-x-1" onClick={() => setActiveTab('announcements')}>
                                            <span>View Repository</span>
                                            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                                        </button>
                                    </div>
                                    <div className="px-1">
                                        <AnnouncementList announcements={announcements.slice(0, 3)} />
                                    </div>
                                    <Megaphone size={120} className="position-absolute text-primary opacity-05" style={{ bottom: '-30px', right: '-20px', pointerEvents: 'none' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case "attendance":
                return <div className="animate-fade-in"><StudentAttendance history={attendance.history} stats={attendance.stats} /></div>;
            case "marks":
                return <div className="animate-fade-in"><StudentMarks schoolMarks={marks.school} tuitionMarks={marks.tuition} onSubmitSchoolMarks={handleSubmitMarks} /></div>;
            case "fees":
                return <div className="animate-fade-in"><StudentFees fees={fees.history} /></div>;
            case "announcements":
                return (
                    <div className="card-modern border-0 shadow-sm p-4 animate-fade-in">
                        <AnnouncementList announcements={announcements} />
                    </div>
                );
            case "profile":
                return <div className="animate-fade-in"><StudentProfile student={student} /></div>;
            default:
                return null;
        }
    };

    return (
        <div className="p-6 animate-fade-in bg-premium-gradient" style={{ minHeight: '100vh', padding: 'var(--s-6)' }}>
            <div className="mb-8" style={{ marginBottom: 'var(--s-8)' }}>
                <PageHeader
                    title="Scholar Development"
                    subtitle="Unified view of your learning path and institutional data"
                />
            </div>

            {/* Navigation Navigation Tabs */}
            <div className="nav-container mb-10 p-1 bg-secondary rounded-4 d-inline-flex flex-wrap gap-1 shadow-sm" style={{ marginBottom: 'var(--s-10)' }}>
                {[
                    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
                    { id: 'attendance', label: 'Presence', icon: CalendarCheck },
                    { id: 'marks', label: 'Performance', icon: Trophy },
                    { id: 'fees', label: 'Financials', icon: Wallet },
                    { id: 'announcements', label: 'Bulletin', icon: Megaphone },
                    { id: 'profile', label: 'ID Card', icon: User },
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
                        <span className="small">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="tab-container position-relative" style={{ minHeight: '400px' }}>
                {renderContent()}
            </div>
        </div>
    );
}

export default StudentDashboard;
