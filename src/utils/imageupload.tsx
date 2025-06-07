import axios from "axios";

const imagesInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000, // 10 seconds timeout
    withCredentials: true, // Include credentials in requests
    headers: {
        // "Content-Type": "multipart/form-data",
        Accept: "application/json",
    },
});

export default imagesInstance;
