import authenticatedInstance from "@/utils/authenticatedInstance";
import imagesInstance from "@/utils/imageupload";
import instance from "@/utils/axios";

const url = "/api/courses";
const ImageUrl = '/api/images'
const enrollUrl = '/api/enrollments'

class CourseApi {
    async uploadThumbNail(file: File) {
        const formData = new FormData();
        formData.append('thumbnail', file);
        // console.log(file)
        const response = await imagesInstance.post(`${ImageUrl}/upload-thumbnail`, formData);
        return response.data;
    }
    async createCourse(title: string, description: string, thumbnail_url: string) {
        const response = await authenticatedInstance.post(`${url}/addCourse`, { title, description, thumbnail_url });
        return response.data;
    }
    async getCourses(page: number, limit: number) {
        const response = await instance.get(`${url}`, {
            params: { page, limit }
        });
        return response.data; // return the full response to access pagination info
    }
    async enrollCourse(courseId: string) {
        const response = await authenticatedInstance.post(`${enrollUrl}/enroll`, { course_id: courseId });
        return response.data;
    }
    async getMyEnrolledCourses() {
        const response = await authenticatedInstance.get(`${enrollUrl}/getMyEnrollments`);
        return response.data;
    }
    async getCourseById(id: string) {
        const response = await instance.get(`${url}/getCourse/${id}`);
        return response.data;
    }
    async updateCourse(id: string, data: { title: string, description: string, thumbnail_url: string }) {
        const response = await authenticatedInstance.put(`${url}/updateCourse/${id}`, data);
        return response.data;
    }
}

const courseApi = new CourseApi();
export default courseApi;