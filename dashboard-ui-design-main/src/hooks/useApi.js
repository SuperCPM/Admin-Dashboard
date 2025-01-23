import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/utils/axios';

export const useApi = () => {
    const navigate = useNavigate();

    const handleRequest = useCallback(async (method, url, data = null) => {
        try {
            const response = await api[method](url, data);
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.clear();
                navigate('/login', { replace: true });
            }
            throw error;
        }
    }, [navigate]);

    return {
        get: (url) => handleRequest('get', url),
        post: (url, data) => handleRequest('post', url, data),
        put: (url, data) => handleRequest('put', url, data),
        delete: (url) => handleRequest('delete', url),
    };
};
