import axios from 'axios';
import { serverEndpoint } from '../config/appConfig';

const api = axios.create({
    baseURL: serverEndpoint,
    withCredentials: true,
});

export default api;
