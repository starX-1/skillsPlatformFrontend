'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
// import axios from 'axios';
import quizesApi from '@/api/quizes/quizesApi';

const AddChoicesPage = () => {
    const { questionId } = useParams();
    const router = useRouter();

    const [questionText, setQuestionText] = useState('');
    const [choices, setChoices] = useState([{ text: '', is_correct: false }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch question text
    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const res = await quizesApi.getQuestionById(questionId as string);
                setQuestionText(res?.text || 'Untitled Question');
            } catch (err) {
                console.error('Failed to load question', err);
            }
        };
        fetchQuestion();
    }, [questionId]);

    const handleChoiceChange = (index: number, key: 'text' | 'is_correct', value: string | boolean) => {
        const updated = [...choices];
        updated[index] = { ...updated[index], [key]: value };
        setChoices(updated);
    };

    const addChoiceField = () => {
        setChoices([...choices, { text: '', is_correct: false }]);
    };

    const removeChoice = (index: number) => {
        const updated = choices.filter((_, i) => i !== index);
        setChoices(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            for (const choice of choices) {
                if (!choice.text) continue;

                // await axios.post('/api/choices/create', {
                //     question_id: questionId,
                //     text: choice.text,
                //     is_correct: choice.is_correct,
                // });
                await quizesApi.createChoice({
                    question_id: questionId as string,
                    text: choice.text,
                    is_correct: choice.is_correct ? 1 : 0,
                });
            }
            // redirect back to the add questions page 
            router.back() 
        } catch (err) {
            console.error(err);
            setError('Failed to save choices');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-1">Step 3: Add Choices</h1>
            <p className="text-gray-700 mb-6">Question: <strong>{questionText}</strong></p>

            <form onSubmit={handleSubmit} className="space-y-5">
                {choices.map((choice, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                        <div>
                            <label className="block font-medium mb-1">Choice Text</label>
                            <input
                                type="text"
                                className="w-full border px-4 py-2 rounded-lg"
                                value={choice.text}
                                onChange={(e) => handleChoiceChange(index, 'text', e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={choice.is_correct}
                                onChange={(e) => handleChoiceChange(index, 'is_correct', e.target.checked)}
                            />
                            <label>Mark as Correct</label>
                        </div>

                        {choices.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeChoice(index)}
                                className="text-sm text-red-600 hover:underline"
                            >
                                Remove Choice
                            </button>
                        )}
                    </div>
                ))}

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={addChoiceField}
                        className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
                    >
                        + Add Another Choice
                    </button>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Choices & Finish'}
                    </button>
                </div>

                {error && <p className="text-red-600 mt-2">{error}</p>}
            </form>
        </div>
    );
};

export default AddChoicesPage;
