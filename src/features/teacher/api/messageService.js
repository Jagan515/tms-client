import api from '../../../services/api';

const messageService = {
    getInbox: async () => {
        const response = await api.get('/messages/inbox');
        return response.data;
    },
    getSent: async () => {
        const response = await api.get('/messages/sent');
        return response.data;
    },
    send: async (data) => {
        const response = await api.post('/messages/send', data);
        return response.data;
    },
    markRead: async (id) => {
        const response = await api.patch(`/messages/${id}/read`);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/messages/${id}`);
        return response.data;
    }
};

export default messageService;
