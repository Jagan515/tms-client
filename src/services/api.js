import axios from 'axios';
import { serverEndpoint } from '../config/appConfig';

const api = axios.create({
    baseURL: serverEndpoint,
    withCredentials: true,
});

// Response Interceptor: Handles global errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || 'Something went wrong';

        // Handle 401 Unauthorized (Expired Session)
        if (error.response?.status === 401) {
            console.error('Session expired. Redirecting to login...');
            // Optional: window.location.href = '/login';
        }

        // Return a rejected promise with the error message
        return Promise.reject({
            ...error,
            message: message
        });
    }
);

export default api;
