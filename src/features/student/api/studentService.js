import api from '../../../services/api';

const studentService = {
    getAll: async (params) => {
        const response = await api.get('/students', { params });
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/students/create', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.patch(`/students/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/students/${id}`, { data: { confirmation: 'DELETE' } });
        return response.data;
    },
    transfer: async (id, teacherEmail) => {
        const response = await api.post(`/students/${id}/transfer`, { teacherEmail });
        return response.data;
    },
    checkParent: async (email) => {
        const response = await api.get('/students/check-parent', { params: { email } });
        return response.data;
    }
};

export default studentService;
