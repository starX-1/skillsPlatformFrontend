import authenticatedInstance from "@/utils/authenticatedInstance";
// import instance from "@/utils/axios";

const url = '/api/lessons';
const pdfUrl = "/api/pdfs"
const videoUrl = "/api/videos"

class Lesson {
    async uploadPdf(file: File) {
        const formData = new FormData();
        formData.append('pdf', file);
        const response = await authenticatedInstance.post(`${pdfUrl}/upload`, formData);
        return response.data;

    }
    async uploadVideo(file: File) {
        const formData = new FormData();
        formData.append('video', file);
        const response = await authenticatedInstance.post(`${videoUrl}/upload`, formData);
        return response.data;
    }
    async createLesson(data: { title: string, lesson_order: number, content: string, video_url: string }, module_id: string) {
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