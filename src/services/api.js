import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const BRAND = 'teasntrees';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to inject token and teasntrees brand
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers['x-brand'] = BRAND;

    if (!config.url.startsWith(`/${BRAND}`)) {
        config.url = `/${BRAND}${config.url}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor for refreshing token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/';
        return Promise.reject(error);
    };

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
            return new Promise(function (resolve, reject) {
                failedQueue.push({ resolve, reject });
            }).then(token => {
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
                return api(originalRequest);
            }).catch(err => {
                return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            return handleLogout();
        }

        try {
            const response = await axios.post(`${API_URL}/teasntrees/customer/auth/refresh-token`, {
                refreshToken: refreshToken
            });

            if (response.data.success) {
                const { accessToken, refreshToken: newRefreshToken } = response.data.data;

                localStorage.setItem('token', accessToken);
                if (newRefreshToken) {
                    localStorage.setItem('refreshToken', newRefreshToken);
                }

                api.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
                originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;

                processQueue(null, accessToken);
                return api(originalRequest);
            } else {
                processQueue(new Error('Refresh failed'), null);
                return handleLogout();
            }
        } catch (refreshError) {
            processQueue(refreshError, null);
            return handleLogout();
        } finally {
            isRefreshing = false;
        }
    }

    return Promise.reject(error);
});

export default api;
