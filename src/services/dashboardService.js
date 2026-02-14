import api from './api';

const dashboardService = {
    getTeacherDashboard: async () => {
        const response = await api.get('/dashboard/teacher');
        return response.data;
    }
};

export default dashboardService;
