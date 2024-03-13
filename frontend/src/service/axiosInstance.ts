import axios from 'axios';

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    responseType: 'json',
    headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
    },
})

export { axiosInstance };

