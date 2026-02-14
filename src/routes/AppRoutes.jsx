import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Pages
import Login from '../features/auth/pages/Login';
import ForgotPassword from '../features/auth/pages/ForgotPassword';
import ResetPassword from '../features/auth/pages/ResetPassword';

// Developer Portal
import DeveloperDashboard from '../features/developer/pages/DeveloperDashboard';
import ManageTeachers from '../features/developer/pages/ManageTeachers';
import AuditLogs from '../features/developer/pages/AuditLogs';
import DeveloperSettings from '../features/developer/pages/DeveloperSettings';

// Teacher Portal
import TeacherDashboard from '../features/teacher/pages/TeacherDashboard';
import Attendance from '../features/teacher/pages/Attendance';
import Marks from '../features/teacher/pages/Marks';
import Fees from '../features/teacher/pages/Fees';
import Announcements from '../features/teacher/pages/Announcements';
import StudentManagement from '../features/teacher/pages/StudentManagement';
import BatchManagement from '../features/teacher/pages/BatchManagement';
import Settings from '../features/teacher/pages/Settings';
import Messages from '../features/teacher/pages/Messages';

// Student Portal
import StudentDashboard from '../features/student/pages/StudentDashboard';

// Parent Portal
import ParentDashboard from '../features/parent/pages/ParentDashboard';
import ParentSettingsPage from '../features/parent/pages/ParentSettingsPage';

// Layout
import TopNavbar from '../components/layout/TopNavbar';
import Sidebar from '../components/layout/Sidebar';

const MainLayout = () => {
    return (
        <div className="d-flex vh-100 overflow-hidden">
            <Sidebar />
            <div className="flex-grow-1 d-flex flex-column overflow-hidden">
                <TopNavbar />
                <main className="flex-grow-1 overflow-auto bg-light p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route element={<MainLayout />}>
                {/* Developer Routes */}
                <Route path="/developer/dashboard" element={
                    <ProtectedRoute allowedRoles={['developer']}>
                        <DeveloperDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/developer/teachers" element={
                    <ProtectedRoute allowedRoles={['developer']}>
                        <ManageTeachers />
                    </ProtectedRoute>
                } />
                <Route path="/developer/audit-logs" element={
                    <ProtectedRoute allowedRoles={['developer']}>
                        <AuditLogs />
                    </ProtectedRoute>
                } />
                <Route path="/developer/settings" element={
                    <ProtectedRoute allowedRoles={['developer']}>
                        <DeveloperSettings />
                    </ProtectedRoute>
                } />

                {/* Teacher Routes */}
                <Route path="/teacher/dashboard" element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                        <TeacherDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/teacher/students" element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                        <StudentManagement />
                    </ProtectedRoute>
                } />
                <Route path="/teacher/batches" element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                        <BatchManagement />
                    </ProtectedRoute>
                } />
                <Route path="/teacher/attendance" element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                        <Attendance />
                    </ProtectedRoute>
                } />
                <Route path="/teacher/marks" element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                        <Marks />
                    </ProtectedRoute>
                } />
                <Route path="/teacher/fees" element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                        <Fees />
                    </ProtectedRoute>
                } />
                <Route path="/teacher/announcements" element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                        <Announcements />
                    </ProtectedRoute>
                } />
                <Route path="/teacher/settings" element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                        <Settings />
                    </ProtectedRoute>
                } />
                <Route path="/teacher/messages" element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                        <Messages />
                    </ProtectedRoute>
                } />


                {/* Student Routes */}
                <Route path="/student/dashboard" element={
                    <ProtectedRoute allowedRoles={['student']}>
                        <StudentDashboard />
                    </ProtectedRoute>
                } />

                {/* Parent Routes */}
                <Route path="/parent/dashboard" element={
                    <ProtectedRoute allowedRoles={['parent']}>
                        <ParentDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/parent/settings" element={
                    <ProtectedRoute allowedRoles={['parent']}>
                        <ParentSettingsPage />
                    </ProtectedRoute>
                } />

            </Route>

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Catch all - 404 */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;
