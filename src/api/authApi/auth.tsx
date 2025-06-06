// import instance from '@/utils/axios';
import authenticatedInstance from '@/utils/authenticatedInstance';
import instance from '@/utils/axios';

const url = "/api/auth";

class AuthApi {
    async login(email: string, password: string) {
        const response = await authenticatedInstance.post(`${url}/login`, { email, password });
        return response.data;
    }

    async register(full_name: string, email: string, password: string, role: string = 'student') {
        const response = await instance.post(`${url}/register`, { full_name, email, password, role });
        return response.data;
    }
    async decodeUser() {
        const response = await authenticatedInstance.get(`${url}/currentUser`);
        return response.data;
    }
}

const authApi = new AuthApi();
export default authApi;