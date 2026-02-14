import api from '../../../services/api';

const attendanceService = {
    // Session-based Attendance (New)
    getSession: async (batchId, date) => {
        const response = await api.get('/attendance/session', { params: { batchId, date } });
        return response.data;
    },
    patchRecord: async (data) => {
        // data: { sessionId, studentId, status, remarks }
        const response = await api.patch('/attendance/record', data);
        return response.data;
    },
    recordCustom: async (data) => {
        const response = await api.post('/attendance/custom', data);
        return response.data;
    },

    // Statistics
    getStudentStats: async (studentId) => {
        const response = await api.get(`/attendance/stats/${studentId}`);
        return response.data;
    },
    getBatchHistory: async (batchId, page = 1) => {
        const response = await api.get(`/attendance/history/${batchId}`, { params: { page } });
        return response.data;
    },
    getDailyOverview: async (date) => {
        const response = await api.get('/attendance/daily-overview', { params: { date } });
        return response.data;
    }
};

export default attendanceService;
