'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import quizesApi from '@/api/quizes/quizesApi';
import { useUser } from '@/app/context/UserContext';
import { useQuiz } from '@/app/context/QuizContext'; // Add this import

type QuizStatus = 'not_started' | 'in_progress' | 'submitted';

interface Answer {
    id: string;
    question_id: string;
    text: string;
    is_correct?: boolean;
}

interface Question {
    id: string;
    quiz_id: string;
    text: string;
    type: 'text' | 'multiple_choice';
    answers?: Answer[];
}

interface Quiz {
    id: string;
    module_id: string;
    title: string;
    instructions: string;
    deadline: string;
    duration_minutes: number;
    created_at: string;
    status: QuizStatus;
    course_title: string;
    module_title: string;
    questions: Question[];
}

interface UserAnswer {
    question_id: string;
    answer_id?: string;
    text_answer?: string;
}

const QuizTakingPage = () => {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
    const [autoSubmitted, setAutoSubmitted] = useState(false);

    const router = useRouter();
    const params = useParams();
    const { user } = useUser();
    const { selectedQuiz } = useQuiz(); // Add this hook
    const quizId = params.quizId as string;

    // Modified to use context data first, then fetch if not available
    useEffect(() => {
        const initializeQuiz = async () => {
            try {
                setLoading(true);

                // First try to use context data
                if (selectedQuiz && selectedQuiz.id === quizId) {
                    setQuiz({
                        ...selectedQuiz,
                        status: selectedQuiz.status as QuizStatus
                    });

                    // Check if quiz is already started
                    if (selectedQuiz.status === 'in_progress') {
                        setQuizStarted(true);
                        // You might want to fetch actual remaining time from backend
                        setTimeRemaining(selectedQuiz.duration_minutes * 60);
                    }

                    // Initialize user answers array
                    const initialAnswers = selectedQuiz.questions.map((q) => ({
                        question_id: q.id,
                        answer_id: undefined,
                        text_answer: undefined
                    }));
                    setUserAnswers(initialAnswers);
                } else {
                    // Fallback: fetch from API if context data not available
                    const quizData = await quizesApi.getQuizById(quizId);
                    setQuiz(quizData);

                    // Check if quiz is already started
                    if (quizData.status === 'in_progress') {
                        setQuizStarted(true);
                        setTimeRemaining(quizData.duration_minutes * 60);
                    }

                    // Initialize user answers array
                    const initialAnswers = quizData.questions.map((q: { id: any; }) => ({
                        question_id: q.id,
                        answer_id: undefined,
                        text_answer: undefined
                    }));
                    setUserAnswers(initialAnswers);
                }

            } catch (error) {
                console.error('Error initializing quiz:', error);
                router.push('/dashboard/quizzes');
            } finally {
                setLoading(false);
            }
        };

        if (quizId) {
            initializeQuiz();
        }
    }, [quizId, selectedQuiz, router]);

    // Timer functionality
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (quizStarted && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        // Auto-submit when time runs out
                        handleAutoSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [quizStarted, timeRemaining]);

    const handleStartQuiz = async () => {
        try {
            await quizesApi.startQuiz(quizId);
            setQuizStarted(true);
            setTimeRemaining(quiz!.duration_minutes * 60);

            // Update quiz status locally
            setQuiz(prev => prev ? { ...prev, status: 'in_progress' } : null);
        } catch (error) {
            console.error('Error starting quiz:', error);
        }
    };

    const handleAnswerChange = (questionId: string, answerType: 'multiple_choice' | 'text', value: string) => {
        setUserAnswers(prev =>
            prev.map(answer =>
                answer.question_id === questionId
                    ? {
                        ...answer,
                        ...(answerType === 'multiple_choice'
                            ? { answer_id: value, text_answer: undefined }
                            : { text_answer: value, answer_id: undefined })
                    }
                    : answer
            )
        );
    };

    const handleAutoSubmit = useCallback(async () => {
        if (!submitting && !autoSubmitted) {
            setAutoSubmitted(true);
            await handleSubmitQuiz(true);
        }
    }, [submitting, autoSubmitted]);

    const handleSubmitQuiz = async (isAutoSubmit = false) => {
        try {
            setSubmitting(true);

            // await quizesApi.submitQuiz(quizId, userAnswers);

            // Update quiz status
            setQuiz(prev => prev ? { ...prev, status: 'submitted' } : null);

            if (isAutoSubmit) {
                alert('Time is up! Your quiz has been automatically submitted.');
            }

            // Redirect to results page
            router.push(`/dashboard/quizzes/${quizId}/results`);

        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert('Error submitting quiz. Please try again.');
        } finally {
            setSubmitting(false);
            setShowConfirmSubmit(false);
        }
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getTimeColor = () => {
        if (timeRemaining <= 300) return 'text-red-600'; // 5 minutes
        if (timeRemaining <= 600) return 'text-orange-600'; // 10 minutes
        return 'text-slate-600';
    };

    const isOverdue = (deadline: string) => {
        return new Date(deadline) < new Date();
    };

    const getAnsweredCount = () => {
        return userAnswers.filter(answer =>
            answer.answer_id || (answer.text_answer && answer.text_answer.trim() !== '')
        ).length;
    };
    // console.log(quiz)
    const currentQuestion = quiz?.questions[currentQuestionIndex];
    const currentAnswer = userAnswers.find(a => a.question_id === currentQuestion?.id);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center py-12">
                        <h1 className="text-2xl font-bold text-slate-800 mb-4">Quiz not found</h1>
                        <button
                            onClick={() => router.push('/dashboard/quizzes')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Back to Quizzes
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (quiz.status === 'submitted') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">✅</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-4">Quiz Already Submitted</h1>
                        <p className="text-slate-600 mb-6">You have already completed this quiz.</p>
                        <div className="space-x-4">
                            <button
                                onClick={() => router.push(`/dashboard/quizzes/${quizId}/results`)}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                                View Results
                            </button>
                            <button
                                onClick={() => router.push('/dashboard/quizzes')}
                                className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition"
                            >
                                Back to Quizzes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isOverdue(quiz.deadline)) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">⚠️</span>
                        </div>
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Quiz Overdue</h1>
                        <p className="text-slate-600 mb-6">This quiz deadline has passed and can no longer be taken.</p>
                        <button
                            onClick={() => router.push('/dashboard/quizzes')}
                            className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition"
                        >
                            Back to Quizzes
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Quiz start screen
    if (!quizStarted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-slate-800 mb-2">{quiz.title}</h1>
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                                    {quiz.course_title}
                                </span>
                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full font-medium">
                                    {quiz.module_title}
                                </span>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-6 mb-8">
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">Instructions</h2>
                            <p className="text-slate-600 leading-relaxed mb-6">{quiz.instructions}</p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <div className="text-2xl font-bold text-blue-600 mb-1">{quiz.questions.length}</div>
                                    <div className="text-sm text-slate-500">Questions</div>
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <div className="text-2xl font-bold text-orange-600 mb-1">{quiz.duration_minutes}</div>
                                    <div className="text-sm text-slate-500">Minutes</div>
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <div className="text-2xl font-bold text-purple-600 mb-1">
                                        {new Date(quiz.deadline).toLocaleDateString()}
                                    </div>
                                    <div className="text-sm text-slate-500">Deadline</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
                            <div className="flex items-start gap-3">
                                <span className="text-amber-600 text-lg">⚠️</span>
                                <div>
                                    <h3 className="font-semibold text-amber-800 mb-1">Important Notes:</h3>
                                    <ul className="text-amber-700 text-sm space-y-1">
                                        <li>• You have {quiz.duration_minutes} minutes to complete this quiz</li>
                                        <li>• The quiz will auto-submit when time runs out</li>
                                        <li>• You can navigate between questions and change answers</li>
                                        <li>• Make sure to submit your quiz before the deadline</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={handleStartQuiz}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-500/25"
                            >
                                Start Quiz
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Quiz taking interface
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header with Timer and Progress */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 mb-6 border border-white/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">{quiz.title}</h1>
                            <p className="text-slate-600 text-sm">
                                Question {currentQuestionIndex + 1} of {quiz.questions.length}
                            </p>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <div className={`text-2xl font-bold ${getTimeColor()}`}>
                                    {formatTime(timeRemaining)}
                                </div>
                                <div className="text-xs text-slate-500">Time Left</div>
                            </div>

                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {getAnsweredCount()}/{quiz.questions.length}
                                </div>
                                <div className="text-xs text-slate-500">Answered</div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="bg-slate-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Question Navigation Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-white/20 sticky top-6">
                            <h3 className="font-semibold text-slate-800 mb-4">Questions</h3>
                            <div className="grid grid-cols-5 lg:grid-cols-1 gap-2">
                                {quiz.questions.map((_, index) => {
                                    const isAnswered = userAnswers[index] &&
                                        (userAnswers[index].answer_id ||
                                            (userAnswers[index].text_answer && userAnswers[index].text_answer!.trim() !== ''));

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentQuestionIndex(index)}
                                            className={`w-full p-2 rounded-lg text-sm font-medium transition-all duration-200 ${index === currentQuestionIndex
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : isAnswered
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Main Question Area */}
                    <div className="lg:col-span-3">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20">
                            {currentQuestion && (
                                <div>
                                    <div className="mb-8">
                                        <h2 className="text-xl font-semibold text-slate-800 mb-4">
                                            {currentQuestion.text}
                                        </h2>

                                        {currentQuestion.type === 'multiple_choice' && currentQuestion.answers ? (
                                            <div className="space-y-3">
                                                {currentQuestion.answers.map((answer) => (
                                                    <label
                                                        key={answer.id}
                                                        className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`question-${currentQuestion.id}`}
                                                            value={answer.id}
                                                            checked={currentAnswer?.answer_id === answer.id}
                                                            onChange={(e) => handleAnswerChange(currentQuestion.id, 'multiple_choice', e.target.value)}
                                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                                                        />
                                                        <span className="text-slate-700">{answer.text}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        ) : (
                                            <div>
                                                <textarea
                                                    value={currentAnswer?.text_answer || ''}
                                                    onChange={(e) => handleAnswerChange(currentQuestion.id, 'text', e.target.value)}
                                                    placeholder="Enter your answer here..."
                                                    className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Navigation Buttons */}
                                    <div className="flex justify-between items-center pt-6 border-t border-slate-200">
                                        <button
                                            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                                            disabled={currentQuestionIndex === 0}
                                            className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            ← Previous
                                        </button>

                                        <div className="flex gap-3">
                                            {currentQuestionIndex < quiz.questions.length - 1 ? (
                                                <button
                                                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                                >
                                                    Next →
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setShowConfirmSubmit(true)}
                                                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                                                >
                                                    Submit Quiz
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submit Confirmation Modal */}
                {showConfirmSubmit && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Submit Quiz?</h3>
                            <p className="text-slate-600 mb-6">
                                You have answered {getAnsweredCount()} out of {quiz.questions.length} questions.
                                Are you sure you want to submit your quiz?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirmSubmit(false)}
                                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleSubmitQuiz()}
                                    disabled={submitting}
                                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors"
                                >
                                    {submitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizTakingPage;