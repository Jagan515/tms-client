import api from '../../../services/api';

const notificationService = {
    getNotifications: async (limit = 20) => {
        const response = await api.get(`/notifications?limit=${limit}`);
        return response.data;
    },
    markRead: async (id) => {
        const response = await api.patch(`/notifications/${id}/read`);
        return response.data;
    },
    markAllRead: async () => {
        const response = await api.patch('/notifications/read-all');
        return response.data;
    }
};

export default notificationService;
