import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../../../config/appConfig";
import PageHeader from "../../../components/common/PageHeader";
import Loading from "../../../components/common/Loading";
import {
    LayoutDashboard,
    CalendarCheck,
    Trophy,
    Megaphone,
    User,
    ChevronRight,
    Search,
    BookOpen
} from "lucide-react";

import { useLocation } from "react-router-dom";

// Student Components
import StudentStats from "../components/StudentStats";
import StudentAttendance from "../components/StudentAttendance";
import StudentMarks from "../components/StudentMarks";
import StudentProfile from "../components/StudentProfile";
import AnnouncementList from "../../../components/announcements/AnnouncementList";

function StudentDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const activeTab = query.get('tab') || 'dashboard';

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
            await fetchDashboard();
        } catch (error) {
            console.error("Failed to submit marks.", error);
            const errorMessage = error.response?.data?.message || 'Server error';
            alert(`Failed to submit marks: ${errorMessage}`);
            throw error; // Rethrow to notify caller
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
                            <div className="col-lg-6">
                                <StudentAttendance history={attendance.history} stats={attendance.stats} />
                            </div>
                            <div className="col-lg-6">
                                <StudentMarks
                                    schoolMarks={marks.school}
                                    tuitionMarks={marks.tuition}
                                    onSubmitSchoolMarks={handleSubmitMarks}
                                />
                            </div>

                            <div className="col-12 mt-2">
                                <div className="card-modern shadow-sm p-4 border-0 position-relative overflow-hidden bg-info-subtle">
                                    <div className="d-flex justify-content-between align-items-center mb-4 z-1 position-relative">
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="bg-white p-2 rounded-circle shadow-sm d-flex align-items-center justify-content-center">
                                                <Megaphone className="text-info" size={20} />
                                            </div>
                                            <h5 className="mb-0 fw-bold text-dark">Recent Updates & Bulletins</h5>
                                        </div>
                                        {/* Use Link or simple navigation via router? For now just stay as is, or use anchor */}
                                        <a href="/student/dashboard?tab=announcements" className="btn btn-sm btn-white rounded-pill px-3 fw-bold shadow-sm d-flex align-items-center gap-1">
                                            <span>View All</span>
                                            <ChevronRight size={14} />
                                        </a>
                                    </div>
                                    <div className="px-1 z-1 position-relative">
                                        <AnnouncementList announcements={announcements.slice(0, 3)} />
                                    </div>
                                    <Megaphone size={180} className="position-absolute text-info opacity-10" style={{ bottom: '-30px', right: '-20px', pointerEvents: 'none' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case "attendance":
                return <div className="animate-fade-in"><StudentAttendance history={attendance.history} stats={attendance.stats} createdAt={student.createdAt} /></div>;
            case "marks":
                return <div className="animate-fade-in"><StudentMarks schoolMarks={marks.school} tuitionMarks={marks.tuition} onSubmitSchoolMarks={handleSubmitMarks} /></div>;

            case "announcements":
                return (
                    <div className="card-modern border-0 shadow-lg p-4 animate-fade-in bg-white h-100">
                        <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                            <div className="bg-warning-subtle p-3 rounded-circle text-warning">
                                <Megaphone size={24} />
                            </div>
                            <div>
                                <h4 className="fw-bold mb-1">Notice Board</h4>
                                <p className="text-muted small mb-0">Official communications and updates</p>
                            </div>
                        </div>
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
        <div className="p-4 p-xl-5 pb-5 mb-5 mb-lg-0 animate-fade-in">
            {/* Header Section */}
            <header className="mb-5">
                <h2 className="fw-bold text-dark mb-1">
                    {activeTab === 'dashboard' ? 'Overview' :
                        activeTab === 'attendance' ? 'Attendance Records' :
                            activeTab === 'marks' ? 'Academic Performance' :
                                activeTab === 'announcements' ? 'Notice Board' : 'Student Profile'}
                </h2>
                <p className="text-muted small mb-0">
                    {activeTab === 'dashboard' ? `Welcome back, ${student?.name?.split(' ')[0] || 'Scholar'}. Track your progress.` :
                        'Manage your academic records and updates.'}
                </p>
            </header>

            {/* Content Area */}
            <div className="animate-fade-in fade-in-up">
                {renderContent()}
            </div>
        </div>
    );
}

export default StudentDashboard;
