import authenticatedInstance from "@/utils/authenticatedInstance";
import instance from "@/utils/axios";

const url = "/api/modules";

class ModuleApi {
    async createModule(data: {title: string, module_order: number}, course_id: string) {
        const response = await authenticatedInstance.post(`${url}/${course_id}`, data);
        return response.data;
    }
    async getByCourseId(course_id: string) {
        const response = await instance.get(`${url}/${course_id}`);
        return response.data;
    }
    async getById(course_id: string, module_id: string) {
        const response = await authenticatedInstance.get(`${url}/${course_id}/${module_id}`);
        return response.data.module || {};
    }
}

export default new ModuleApi();