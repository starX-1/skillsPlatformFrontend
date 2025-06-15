import authenticatedInstance from "@/utils/authenticatedInstance";
// import instance from "@/utils/axios";

const url = '/api/lessons';

class Lesson {
    async createLesson(data: {title: string, lesson_order: number, content: string, video_url: string}, module_id: string) {
        const response = await authenticatedInstance.post(`${url}/${module_id}`, data);
        return response.data;
    }
    async getLessonsByModuleId(module_id: string, course_id: string) {
        const response = await authenticatedInstance.post(`${url}/getByModule/${module_id}`, {
            course_id: course_id,
        });
        return response.data;
    }



    async getLessonById(id: string) {
        const response = await authenticatedInstance.get(`${url}/${id}`);
        return response.data;
    }

}

export default new Lesson();