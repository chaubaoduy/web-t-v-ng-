import axios from 'axios';

// Vite handles the proxy in dev, but for production (later) we might need full URL
const API_URL = '/api';

export const api = {
    // Sets
    getSets: async () => {
        const response = await axios.get(`${API_URL}/sets`);
        return response.data;
    },
    createSet: async (set) => {
        const response = await axios.post(`${API_URL}/sets`, set);
        return response.data;
    },
    deleteSet: async (id) => {
        const response = await axios.delete(`${API_URL}/sets/${id}`);
        return response.data;
    },

    // Results
    getResults: async () => {
        const response = await axios.get(`${API_URL}/results`);
        return response.data;
    },
    saveResult: async (result) => {
        const response = await axios.post(`${API_URL}/results`, result);
        return response.data;
    },

    // Cleanup
    cleanupResults: async () => {
        const response = await axios.post(`${API_URL}/cleanup`);
        return response.data;
    }
};
