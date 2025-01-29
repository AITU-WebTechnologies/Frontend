import axios from 'axios';
import DatabaseStatus from '../utils/DatabaseStatus';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => {
        
        DatabaseStatus.setDatabaseAvailable(true);
        return response;
    },
    async (error) => {
        if (!error.response) {

            DatabaseStatus.setDatabaseAvailable(false);
            return Promise.reject(error);
        }

        if (error.response.status === 403) {
            if (error.config.url === '/auth/refresh-token') {
                localStorage.clear();
                window.location.href = '/';
                return Promise.reject(error);
            }

            if (!error.config._retry) {
                error.config._retry = true;
                try {
                    const { data } = await axiosInstance.post('/auth/refresh-token', null);
                    localStorage.setItem('token', data.accessToken);
                    error.config.headers['Authorization'] = `Bearer ${data.accessToken}`;
                    return axiosInstance(error.config);
                } catch (refreshError) {
                    if (refreshError.response && refreshError.response.status === 403) {
                        localStorage.clear();
                        window.location.href = '/';
                    }
                    return Promise.reject(refreshError);
                }
            }
        }

        if (error.response.status >= 500) {
            DatabaseStatus.setDatabaseAvailable(false);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
