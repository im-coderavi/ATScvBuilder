import axios from 'axios';

// Use environment variable for production, fallback to localhost for development
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = `${BASE_URL}/users`;

// Export base URL for use in other components
export const API_BASE_URL = BASE_URL;

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
