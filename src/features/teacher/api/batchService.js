import api from '../../../services/api';

const batchService = {
    getAll: async (params = { limit: 'all' }) => {
        const response = await api.get('/batches', { params });
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/batches', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.patch(`/batches/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/batches/${id}`);
        return response.data;
    },
    getStudents: async (batchId) => {
        const response = await api.get(`/batches/${batchId}`);
        // Endpoint returns { batch, students: [...] }
        return { students: response.data.students };
    }
};

export default batchService;
