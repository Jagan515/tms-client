import api from '../../../services/api';

const feeService = {
    // Get registry for Month/Batch view
    getRegistry: async (filters) => {
        const response = await api.get('/fees/registry', { params: filters });
        return response.data;
    },

    // Get defaulters list
    getDefaulters: async (minMonths = 1, batchId = null) => {
        const params = { minMonths };
        if (batchId) params.batchId = batchId;
        const response = await api.get('/fees/defaulters', { params });
        return response.data;
    },

    // Get institutional payment history
    getPaymentHistory: async (batchId = null) => {
        const params = {};
        if (batchId && batchId !== 'all') params.batchId = batchId;
        const response = await api.get('/fees/history', { params });
        return response.data;
    },

    // Get specific student's full financial profile
    getStudentFees: async (studentId) => {
        const response = await api.get(`/fees/student/${studentId}`);
        return response.data;
    },

    // Record dynamic payment for multiple months
    recordPayment: async (payload) => {
        // payload: { studentId, feeIds: [], paymentMethodValue, notes }
        const response = await api.post('/fees/record-payment', payload);
        return response.data;
    },

    // Trigger auto-generation (Admin/Teacher tool)
    generateMonthly: async () => {
        const response = await api.post('/fees/generate-monthly');
        return response.data;
    }
};

export default feeService;
