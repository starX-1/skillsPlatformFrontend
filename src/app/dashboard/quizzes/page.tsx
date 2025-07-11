'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import quizesApi from '@/api/quizes/quizesApi';
import { useUser } from '@/app/context/UserContext';

type QuizStatus = 'not_started' | 'in_progress' | 'submitted';

interface Quiz {
    id: string;
    title: string;
    instructions: string;
    deadline: string;
    duration_minutes: number;
    status: QuizStatus;
}

const QuizzesPage = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const { user } = useUser()


    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const quizzes = await quizesApi.getUserQuizes();
                setQuizzes(quizzes);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };
        fetchQuizzes();
    }, [user?.id])
    const getStatusConfig = (status: QuizStatus) => {
        switch (status) {
            case 'submitted':
                return {
                    bg: 'bg-gradient-to-r from-emerald-50 to-green-50',
                    text: 'text-emerald-700',
                    border: 'border-emerald-200',
                    icon: '✓',
                    label: 'Completed'
                };
            case 'in_progress':
                return {
                    bg: 'bg-gradient-to-r from-amber-50 to-orange-50',
                    text: 'text-amber-700',
                    border: 'border-amber-200',
                    icon: '⚡',
                    label: 'In Progress'
                };
            default:
                return {
                    bg: 'bg-gradient-to-r from-slate-50 to-gray-50',
                    text: 'text-slate-700',
                    border: 'border-slate-200',
                    icon: '○',
                    label: 'Not Started'
                };
        }
    };

    // console.log(q)
    const getButtonConfig = (status: QuizStatus) => {
        switch (status) {
            case 'submitted':
                return {
                    label: 'View Results',
                    classes: 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-emerald-500/25'
                };
            case 'in_progress':
                return {
                    label: 'Continue Quiz',
                    classes: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25'
                };
            default:
                return {
                    label: 'Start Quiz',
                    classes: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25'
                };
        }
    };

    const isOverdue = (deadline: string) => {
        return new Date(deadline) < new Date();
    };

    const formatDeadline = (deadline: string) => {
        const date = new Date(deadline);
        const now = new Date();
        const diffTime = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'Overdue';
        if (diffDays === 0) return 'Due today';
        if (diffDays === 1) return 'Due tomorrow';
        if (diffDays <= 7) return `Due in ${diffDays} days`;
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <span className="text-white text-xl font-bold">📚</span>
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                My Quizzes
                            </h1>
                        </div>

                        {/* Create Quiz Button */}
                        <Link
                            href="/dashboard/quizzes/create"
                            className="px-4 py-2 text-sm rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                            + Create Quiz
                        </Link>
                    </div>

                    <p className="text-slate-600 text-lg">
                        Track your progress and complete your assessments
                    </p>
                </div>

                {/* Quiz Cards Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {quizzes.map((quiz) => {
                        const statusConfig = getStatusConfig(quiz.status);
                        const buttonConfig = getButtonConfig(quiz.status);
                        const overdue = isOverdue(quiz.deadline);

                        return (
                            <div
                                key={quiz.id}
                                className="group relative bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl shadow-slate-200/50 rounded-2xl p-6 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Status Badge */}
                                <div className="absolute -top-2 -right-2">
                                    <div className={`${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border-2 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm`}>
                                        <span className="text-sm">{statusConfig.icon}</span>
                                        {statusConfig.label}
                                    </div>
                                </div>

                                {/* Quiz Content */}
                                <div className="space-y-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors">
                                            {quiz.title}
                                        </h2>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            {quiz.instructions}
                                        </p>
                                    </div>

                                    {/* Quiz Details */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                                    <span className="text-blue-600">⏱️</span>
                                                </div>
                                                <span className="font-medium">{quiz.duration_minutes} minutes</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-8 h-8 ${overdue ? 'bg-red-50' : 'bg-orange-50'} rounded-lg flex items-center justify-center`}>
                                                    <span className={overdue ? 'text-red-600' : 'text-orange-600'}>📅</span>
                                                </div>
                                                <span className={`font-medium ${overdue ? 'text-red-600' : 'text-slate-600'}`}>
                                                    {formatDeadline(quiz.deadline)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="pt-4 border-t border-slate-100">
                                        <Link
                                            href={`/dashboard/quizzes/${quiz.id}`}
                                            className={`w-full inline-flex items-center justify-center px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${buttonConfig.classes}`}
                                        >
                                            {buttonConfig.label}
                                            <span className="ml-2 transition-transform group-hover:translate-x-0.5">→</span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Decorative Element */}
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl"></div>
                            </div>
                        );
                    })}
                </div>

                {/* Stats Summary */}
                <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Quiz Summary</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="space-y-1">
                            <div className="text-2xl font-bold text-slate-600">
                                {quizzes.filter(q => q.status === 'submitted').length}
                            </div>
                            <div className="text-sm text-slate-500">Completed</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl font-bold text-amber-600">
                                {quizzes.filter(q => q.status === 'in_progress').length}
                            </div>
                            <div className="text-sm text-slate-500">In Progress</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl font-bold text-blue-600">
                                {quizzes.filter(q => q.status === 'not_started').length}
                            </div>
                            <div className="text-sm text-slate-500">Not Started</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizzesPage;