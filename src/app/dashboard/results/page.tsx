'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface QuizResult {
    id: string;
    quiz_id: string;
    quiz_title: string;
    course_title: string;
    module_title: string;
    score: number;
    max_score: number;
    percentage: number;
    time_taken_minutes: number;
    submitted_at: string;
    status: 'completed' | 'failed' | 'passed';
}

// Dummy data for multiple quiz results
const getDummyQuizResults = (): QuizResult[] => {
    return [
        {
            id: 'result1',
            quiz_id: 'quiz1',
            quiz_title: 'React Fundamentals Quiz',
            course_title: 'Frontend Development',
            module_title: 'React Basics',
            score: 8,
            max_score: 10,
            percentage: 80,
            time_taken_minutes: 15.5,
            submitted_at: '2024-03-15T10:30:00Z',
            status: 'passed'
        },
        {
            id: 'result2',
            quiz_id: 'quiz2',
            quiz_title: 'JavaScript ES6 Features',
            course_title: 'Frontend Development',
            module_title: 'Modern JavaScript',
            score: 12,
            max_score: 15,
            percentage: 80,
            time_taken_minutes: 22.3,
            submitted_at: '2024-03-14T14:20:00Z',
            status: 'passed'
        },
        {
            id: 'result3',
            quiz_id: 'quiz3',
            quiz_title: 'CSS Grid and Flexbox',
            course_title: 'Frontend Development',
            module_title: 'Advanced CSS',
            score: 14,
            max_score: 15,
            percentage: 93,
            time_taken_minutes: 18.7,
            submitted_at: '2024-03-13T16:45:00Z',
            status: 'passed'
        },
        {
            id: 'result4',
            quiz_id: 'quiz4',
            quiz_title: 'Node.js Basics',
            course_title: 'Backend Development',
            module_title: 'Server-side JavaScript',
            score: 6,
            max_score: 12,
            percentage: 50,
            time_taken_minutes: 25.1,
            submitted_at: '2024-03-12T11:15:00Z',
            status: 'failed'
        },
        {
            id: 'result5',
            quiz_id: 'quiz5',
            quiz_title: 'Database Design Principles',
            course_title: 'Backend Development',
            module_title: 'Database Fundamentals',
            score: 9,
            max_score: 10,
            percentage: 90,
            time_taken_minutes: 20.8,
            submitted_at: '2024-03-11T09:30:00Z',
            status: 'passed'
        },
        {
            id: 'result6',
            quiz_id: 'quiz6',
            quiz_title: 'API Design and REST',
            course_title: 'Backend Development',
            module_title: 'API Development',
            score: 11,
            max_score: 15,
            percentage: 73,
            time_taken_minutes: 28.4,
            submitted_at: '2024-03-10T13:20:00Z',
            status: 'passed'
        }
    ];
};

const QuizResultsOverview = () => {
    const [results, setResults] = useState<QuizResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'passed' | 'failed'>('all');

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                await new Promise(resolve => setTimeout(resolve, 1000));
                const dummyResults = getDummyQuizResults();
                setResults(dummyResults);
            } catch (error) {
                console.error('Error loading quiz results:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    const getScoreColor = (percentage: number) => {
        if (percentage >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
        if (percentage >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
        if (percentage >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        if (percentage >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const getStatusBadge = (status: string, percentage: number) => {
        if (status === 'passed') {
            return (
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                    ✅ Passed
                </span>
            );
        } else {
            return (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                    ❌ Failed
                </span>
            );
        }
    };

    const formatTimeSpent = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = Math.floor(minutes % 60);

        if (hours > 0) {
            return `${hours}h ${mins}m`;
        } else {
            return `${mins}m`;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const filteredResults = results.filter(result => {
        if (filter === 'all') return true;
        return result.status === filter;
    });

    const stats = {
        total: results.length,
        passed: results.filter(r => r.status === 'passed').length,
        failed: results.filter(r => r.status === 'failed').length,
        averageScore: results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length) : 0
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Link
                            href="/dashboard"
                            className="w-10 h-10 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center hover:bg-white transition-colors"
                        >
                            <span className="text-slate-600">←</span>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                My Quiz Results
                            </h1>
                            <p className="text-slate-600">Track your performance across all quizzes</p>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-slate-800">{stats.total}</div>
                            <div className="text-sm text-slate-600">Total Quizzes</div>
                        </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-emerald-600">{stats.passed}</div>
                            <div className="text-sm text-slate-600">Passed</div>
                        </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-red-600">{stats.failed}</div>
                            <div className="text-sm text-slate-600">Failed</div>
                        </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{stats.averageScore}%</div>
                            <div className="text-sm text-slate-600">Average Score</div>
                        </div>
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === 'all'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white/60 text-slate-600 hover:bg-white/80'
                            }`}
                    >
                        All Results ({stats.total})
                    </button>
                    <button
                        onClick={() => setFilter('passed')}
                        className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === 'passed'
                                ? 'bg-emerald-600 text-white shadow-lg'
                                : 'bg-white/60 text-slate-600 hover:bg-white/80'
                            }`}
                    >
                        Passed ({stats.passed})
                    </button>
                    <button
                        onClick={() => setFilter('failed')}
                        className={`px-4 py-2 rounded-xl font-medium transition-all ${filter === 'failed'
                                ? 'bg-red-600 text-white shadow-lg'
                                : 'bg-white/60 text-slate-600 hover:bg-white/80'
                            }`}
                    >
                        Failed ({stats.failed})
                    </button>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredResults.map((result) => (
                        <div
                            key={result.id}
                            className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                        {result.quiz_title}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                            {result.course_title}
                                        </span>
                                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                                            {result.module_title}
                                        </span>
                                    </div>
                                </div>
                                {getStatusBadge(result.status, result.percentage)}
                            </div>

                            <div className="space-y-3">
                                {/* Score */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">Score</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getScoreColor(result.percentage)}`}>
                                            {result.percentage}%
                                        </span>
                                        <span className="text-sm text-slate-500">
                                            ({result.score}/{result.max_score})
                                        </span>
                                    </div>
                                </div>

                                {/* Time Taken */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">Time Taken</span>
                                    <span className="text-sm font-medium text-slate-800">
                                        {formatTimeSpent(result.time_taken_minutes)}
                                    </span>
                                </div>

                                {/* Date Submitted */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">Submitted</span>
                                    <span className="text-sm font-medium text-slate-800">
                                        {formatDate(result.submitted_at)}
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-4">
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-1000 ease-out ${result.percentage >= 80
                                                ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                                                : result.percentage >= 60
                                                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                                                    : 'bg-gradient-to-r from-red-400 to-red-600'
                                            }`}
                                        style={{ width: `${result.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredResults.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">📊</span>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-600 mb-2">
                            No results found
                        </h3>
                        <p className="text-slate-500 mb-4">
                            {filter === 'all'
                                ? "You haven't taken any quizzes yet."
                                : `No ${filter} quiz results to display.`
                            }
                        </p>
                        <Link
                            href="/dashboard/quizzes"
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition inline-block"
                        >
                            Browse Quizzes
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizResultsOverview;