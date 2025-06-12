import authenticatedInstance from "@/utils/authenticatedInstance";
import instance from "@/utils/axios";

const url = "/api/modules";

class ModuleApi {
    async createModule(data: any, course_id: string) {
        const response = await authenticatedInstance.post(`${url}/${course_id}`, data);
        return response.data;
    }
    async getByCourseId(course_id: string) {
        const response = await instance.get(`${url}/${course_id}`);
        return response.data;
    }

}

export default new ModuleApi();