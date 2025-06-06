import axios from 'axios';

const authenticatedInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000, // 10 seconds timeout
    withCredentials: true, // Include credentials in requests
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export default authenticatedInstance