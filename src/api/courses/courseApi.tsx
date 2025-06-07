import authenticatedInstance from "@/utils/authenticatedInstance";
import imagesInstance from "@/utils/imageupload";

const url = "/api/courses";
const ImageUrl = '/api/images'

class CourseApi {
    async uploadThumbNail(file: File) {
        const formData = new FormData();
        formData.append('thumbnail', file);

        console.log(file)
        const response = await imagesInstance.post(`${ImageUrl}/upload-thumbnail`, formData);
        return response.data;
    }
    async createCourse(title: string, description: string, thumbnail_url: string) {
        const response = await authenticatedInstance.post(`${url}/addCourse`, { title, description, thumbnail_url });
        return response.data;
    }
    async getCourses() {
        const response = await authenticatedInstance.get(`${url}`);
        return response.data;
    }
}

const courseApi = new CourseApi();
export default courseApi;