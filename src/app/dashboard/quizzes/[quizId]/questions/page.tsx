'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
// import axios from 'axios';
import quizesApi from '@/api/quizes/quizesApi';
import { useUser } from '@/app/context/UserContext';

const AddQuestionsPage = () => {
    const { quizId } = useParams();
    const router = useRouter();
    const { user } = useUser();
    const searchParams = useSearchParams();
    const course_id = searchParams.get('course_id');


    const [quizTitle, setQuizTitle] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [questionType, setQuestionType] = useState<'multiple_choice' | 'text'>('multiple_choice');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch quiz title
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await quizesApi.getQuizById(quizId as string);
                console.log(res);
                setQuizTitle(res?.title || 'Untitled Quiz');
            } catch (err) {
                console.error('Failed to load quiz');
            }
        };
        fetchQuiz();
    }, [quizId, user?.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!questionText) {
            setError('Question text is required');
            setLoading(false);
            return;
        }

        try {
            // const res = await axios.post('/api/questions/create', {
            //     quiz_id: quizId,
            //     text: questionText,
            //     type: questionType,
            // });

            const res = await quizesApi.createQuestion({
                quiz_id: quizId as string,
                course_id: course_id as string,
                text: questionText,
                type: questionType,
            });
            const createdQuestionId = res.id;
            console.log(res);

            if (questionType === 'multiple_choice') {
                router.push(`/dashboard/questions/${createdQuestionId}/choices`);
            } else {
                router.refresh(); // Reload current page to add next question
            }
        } catch (err) {
            console.error(err);
            setError('Failed to add question');
        } finally {
            setLoading(false);
            setQuestionText('');
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-1">Step 2: Add Questions</h1>
            <p className="text-gray-700 mb-6">Quiz: <strong>{quizTitle}</strong></p>

            <form onSubmit={handleSubmit} className="space-y-5">
                {error && <div className="text-red-600">{error}</div>}

                <div>
                    <label className="block font-medium mb-1">Question Text *</label>
                    <textarea
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        rows={3}
                        className="w-full border px-4 py-2 rounded-lg"
                        placeholder="Enter the question..."
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Question Type *</label>
                    <select
                        value={questionType}
                        onChange={(e) => setQuestionType(e.target.value as 'multiple_choice' | 'text')}
                        className="w-full border px-4 py-2 rounded-lg"
                        required
                    >
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="text">Open Text</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
                >
                    {loading ? 'Adding...' : 'Add Question'}
                </button>
            </form>
        </div>
    );
};

export default AddQuestionsPage;
