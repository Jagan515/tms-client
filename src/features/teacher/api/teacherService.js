import api from '../../../services/api';

const teacherService = {
    getDashboardStats: async () => {
        const response = await api.get('/teacher/dashboard');
        return response.data;
    },
    updateProfile: async (data) => {
        const response = await api.put('/teacher/profile', data);
        return response.data;
    },
    getEmailPreferences: async () => {
        const response = await api.get('/teacher/email-preferences');
        return response.data;
    },
    updateEmailPreferences: async (emailPreferences) => {
        const response = await api.put('/teacher/email-preferences', { emailPreferences });
        return response.data;
    }

};

export default teacherService;
