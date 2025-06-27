'use client';

import React, { useEffect, useState, useCallback } from 'react';
import courseApi from '@/api/courses/courseApi';
import moduleApi from '@/api/modules/moduleApi';
import lessonsApi from '@/api/lessons/lessonsApi';
import { useUser } from '@/app/context/UserContext';
import { VscDebugContinueSmall } from 'react-icons/vsc';
import { useRouter } from 'next/navigation';

interface CourseCreator {
    full_name: string;
    email: string;
}

interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    creator?: CourseCreator;
}

interface EnrolledCourse {
    id: string;
    course_id: string;
    enrolled_at: string;
    user_id: string;
    modules: number;
    lessons: number;
    lessonsCompleted: number;
    enrolled: number;
    course: Course;
}

interface CourseCardProps {
    course: EnrolledCourse;
    onContinue: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onContinue }) => {
    const progressPercent = course.lessons > 0
        ? Math.round((course.lessonsCompleted / course.lessons) * 100)
        : 0;

    const getProgressColor = (percent: number) => {
        if (percent >= 80) return 'bg-green-500';
        if (percent >= 50) return 'bg-yellow-500';
        return 'bg-blue-500';
    };

    const getProgressBg = (percent: number) => {
        if (percent >= 80) return 'bg-green-100';
        if (percent >= 50) return 'bg-yellow-100';
        return 'bg-blue-100';
    };

    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 overflow-hidden">
            {/* Course Image */}
            <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                {course.course?.thumbnail_url ? (
                    <img
                        src={course.course.thumbnail_url}
                        alt={course.course?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-white text-6xl opacity-50">📚</div>
                    </div>
                )}

                {/* Progress Badge */}
                <div className="absolute top-4 right-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getProgressColor(progressPercent)}`}>
                        {progressPercent}% Complete
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Course Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {course.course?.title || 'Untitled Course'}
                </h3>

                {/* Course Creator */}
                {course.course?.creator && (
                    <p className="text-sm text-gray-600 mb-4">
                        by {course.course.creator.full_name}
                    </p>
                )}

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm text-gray-600">
                            {course.lessonsCompleted} of {course.lessons} lessons
                        </span>
                    </div>
                    <div className={`w-full ${getProgressBg(progressPercent)} rounded-full h-2`}>
                        <div
                            className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(progressPercent)}`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{course.modules}</div>
                        <div className="text-xs text-gray-600 uppercase tracking-wide">Modules</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{course.enrolled}</div>
                        <div className="text-xs text-gray-600 uppercase tracking-wide">Students</div>
                    </div>
                </div>

                {/* Continue Button */}
                <button
                    onClick={() => onContinue(course.course_id)}
                    className="w-full border border-blue-600 text-blue-600 font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                    {progressPercent === 100 ? 'Review Course' : 'Continue Learning'}
                    <VscDebugContinueSmall className="text-lg" />
                </button>
            </div>
        </div>
    );
};

const LoadingSkeleton: React.FC = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
        <div className="h-48 bg-gray-300" />
        <div className="p-6">
            <div className="h-6 bg-gray-300 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded mb-4 w-2/3" />
            <div className="h-2 bg-gray-200 rounded mb-4" />
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="h-16 bg-gray-100 rounded-lg" />
                <div className="h-16 bg-gray-100 rounded-lg" />
            </div>
            <div className="h-12 bg-gray-300 rounded-xl" />
        </div>
    </div>
);

export default function MyLearningPage() {
    const user = useUser();
    const [courses, setCourses] = useState<EnrolledCourse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const enrichCourseData = useCallback(async (enrolledCourse: EnrolledCourse): Promise<EnrolledCourse> => {
        const courseId = enrolledCourse.course_id;

        try {
            // Fetch all course-related data in parallel for better performance
            const [modulesRes, enrolledRes, completedRes] = await Promise.all([
                moduleApi.getByCourseId(courseId),
                courseApi.getEnrolledUsers(courseId),
                lessonsApi.getUserCompletedLessons(courseId)
            ]);

            const moduleList = modulesRes.modules || [];
            const enrolledList = enrolledRes || [];
            const completedList = Array.isArray(completedRes)
                ? completedRes
                : Array.isArray(completedRes?.lessons)
                    ? completedRes.lessons
                    : [];

            // Get all lesson IDs for this course
            const lessonPromises = moduleList.map((module: { id: string; }) =>
                lessonsApi.getLessonsByModuleId(module.id, courseId)
            );

            const lessonResults = await Promise.all(lessonPromises);
            const lessonIds = lessonResults.flatMap(result =>
                Array.isArray(result.lessons)
                    ? result.lessons.map((lesson: { id: string; }) => lesson.id)
                    : []
            );

            // Count completed lessons for this course
            const completedCount = completedList.filter((completedLesson: { lesson_id: string; }) =>
                lessonIds.includes(completedLesson.lesson_id)
            ).length;

            return {
                ...enrolledCourse,
                modules: moduleList.length,
                enrolled: enrolledList.length,
                lessons: lessonIds.length,
                lessonsCompleted: completedCount,
            };
        } catch (err) {
            console.error(`Failed to enrich course ${courseId}:`, err);
            // Return basic data if enrichment fails
            return {
                ...enrolledCourse,
                modules: 0,
                enrolled: 0,
                lessons: 0,
                lessonsCompleted: 0,
            };
        }
    }, []);

    const fetchCourseData = useCallback(async () => {
        if (!user?.user?.id) return;

        setIsLoading(true);
        setError(null);

        try {
            const enrolledCourses = await courseApi.getMyEnrolledCourses();

            if (!enrolledCourses || enrolledCourses.length === 0) {
                setCourses([]);
                return;
            }

            const enrichedCourses = await Promise.all(
                enrolledCourses.map(enrichCourseData)
            );

            setCourses(enrichedCourses);
        } catch (err) {
            console.error('Failed to fetch course data:', err);
            setError('Failed to load your courses. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, [user?.user?.id, enrichCourseData]);

    useEffect(() => {
        fetchCourseData();
    }, [fetchCourseData]);

    const handleContinueLearning = useCallback((courseId: string) => {
        // Navigate to course or implement continue learning logic
        router.push(`/dashboard/courses/${courseId}`);
        console.log('Continue learning course:', courseId);
        // Example: router.push(`/courses/${courseId}`);
    }, []);

    const completedCourses = courses.filter(course =>
        course.lessons > 0 && course.lessonsCompleted === course.lessons
    );

    const inProgressCourses = courses.filter(course =>
        course.lessonsCompleted > 0 && course.lessonsCompleted < course.lessons
    );

    const notStartedCourses = courses.filter(course =>
        course.lessonsCompleted === 0
    );

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                        <div className="text-red-600 text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-red-800 mb-2">Something went wrong</h2>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={fetchCourseData}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        My Learning Journey
                    </h1>
                    <p className="text-gray-600 text-lg">
                        {isLoading
                            ? 'Loading your courses...'
                            : `${courses.length} course${courses.length === 1 ? '' : 's'} in progress`
                        }
                    </p>
                </div>

                {/* Learning Stats */}
                {!isLoading && courses.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm uppercase tracking-wide">Completed</p>
                                    <p className="text-3xl font-bold text-green-600">{completedCourses.length}</p>
                                </div>
                                <div className="text-green-500 text-4xl">🎉</div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm uppercase tracking-wide">In Progress</p>
                                    <p className="text-3xl font-bold text-blue-600">{inProgressCourses.length}</p>
                                </div>
                                <div className="text-blue-500 text-4xl">📚</div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm uppercase tracking-wide">Not Started</p>
                                    <p className="text-3xl font-bold text-gray-600">{notStartedCourses.length}</p>
                                </div>
                                <div className="text-gray-500 text-4xl">⏳</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        // Loading skeletons
                        Array.from({ length: 6 }).map((_, index) => (
                            <LoadingSkeleton key={index} />
                        ))
                    ) : courses.length === 0 ? (
                        // Empty state
                        <div className="col-span-full">
                            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
                                <div className="text-gray-400 text-8xl mb-6">📚</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses yet</h3>
                                <p className="text-gray-600 mb-6">
                                    Start your learning journey by enrolling in your first course!
                                </p>
                                <button
                                    onClick={() => router.push('/dashboard/courses')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
                                    Browse Courses
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Course cards
                        courses.map((course) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                onContinue={handleContinueLearning}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}