import api from '../../../services/api';

const marksService = {
    // Teacher APIs
    getMarks: async (params) => {
        const response = await api.get('/marks', { params });
        return response.data;
    },
    addTuitionMark: async (data) => {
        const response = await api.post('/marks/tuition', data);
        return response.data;
    },
    approveMark: async (id) => {
        const response = await api.patch(`/marks/${id}/approve`);
        return response.data;
    },
    rejectMark: async (id, reason) => {
        const response = await api.patch(`/marks/${id}/reject`, { reason });
        return response.data;
    },
    editApproveMark: async (id, data) => {
        const response = await api.patch(`/marks/${id}/edit-approve`, data);
        return response.data;
    },
    getStudentStats: async (studentId) => {
        const response = await api.get(`/marks/stats/${studentId}`);
        return response.data;
    },

    // Student APIs
    submitSchoolMark: async (data) => {
        const response = await api.post('/marks/school', data);
        return response.data;
    }
};

export default marksService;
