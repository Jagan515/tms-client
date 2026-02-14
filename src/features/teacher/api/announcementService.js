import api from '../../../services/api';

const announcementService = {
    getAll: async (page = 1, limit = 10) => {
        const response = await api.get('/announcements/my-announcements', { params: { page, limit } });
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/announcements/create', data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/announcements/delete/${id}`);
        return response.data;
    }
};

export default announcementService;
