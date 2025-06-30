import authenticatedInstance from "@/utils/authenticatedInstance";

class QuizesApi {
    async createQuiz(data: { module_id:string, instructions:string, deadline:string, duration_minutes:number }) {
        const response = await authenticatedInstance.post(`/api/quizzes/quiz/create`, data);
        return response.data;
    }

    async getUserQuizes() {
        const response = await authenticatedInstance.get(`/api/quizzes/quiz/user`);
        return response.data;
    }
}

const quizesApi = new QuizesApi();
export default quizesApi;