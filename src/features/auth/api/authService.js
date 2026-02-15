import api from '../../../services/api';

const authService = {
    login: async (credentials, role) => {
        const response = await api.post(`/auth/${role}/login`, credentials);
        return response.data;
    },
    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
    changePassword: async (data) => {
        const response = await api.post('/auth/change-password', data);
        return response.data;
    },
    forgotPassword: async (data) => {
        const response = await api.post('/auth/forgot-password', data);
        return response.data;
    },
    resetPassword: async (token, newPassword) => {
        const response = await api.put(`/auth/reset-password/${token}`, { newPassword });
        return response.data;
    },
    requestEmailChange: async (data) => {
        const response = await api.post('/auth/change-email', data);
        return response.data;
    },
    verifyEmailChange: async (token) => {
        const response = await api.put(`/auth/verify-email/${token}`);
        return response.data;
    },
    resetPasswordStudent: async (registrationNumber, otp, newPassword) => {
        const response = await api.post('/auth/student/reset-password', { registrationNumber, otp, newPassword });
        return response.data;
    }
};

export default authService;
