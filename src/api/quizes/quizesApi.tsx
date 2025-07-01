import authenticatedInstance from "@/utils/authenticatedInstance";

class QuizesApi {
    async createQuiz(data: { course_id: string, title: string, module_id: string, instructions: string, deadline: string, duration_minutes: number }) {
        const response = await authenticatedInstance.post(`/api/quizzes/quiz/create`, data);
        return response.data;
    }

    async getUserQuizes() {
        const response = await authenticatedInstance.get(`/api/quizzes/quiz/user`);
        return response.data;
    }
    async getQuizById(quizId: string) {
        const response = await authenticatedInstance.get(`/api/quizzes/quiz/get-by-id/${quizId}`);
        return response.data;
    }
    async createQuestion(data: { quiz_id: string, course_id: string, text: string, type: string }) {
        const response = await authenticatedInstance.post(`/api/questions/questions/create`, data);
        return response.data;
    }
}

const quizesApi = new QuizesApi();
export default quizesApi;