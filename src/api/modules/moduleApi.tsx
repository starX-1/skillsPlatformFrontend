import authenticatedInstance from "@/utils/authenticatedInstance";
import instance from "@/utils/axios";

const url = "/api/modules";

class ModuleApi {
    async createModule(data: any, course_id: string) {
        const response = await authenticatedInstance.post(`${url}/${course_id}`, data);
        return response.data;
    }

}

export default new ModuleApi();