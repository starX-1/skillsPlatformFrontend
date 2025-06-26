'use client';

import React, { useEffect, useState } from 'react';
import courseApi from '@/api/courses/courseApi';
import moduleApi from '@/api/modules/moduleApi';
import lessonsApi from '@/api/lessons/lessonsApi';
import { useUser } from '@/app/context/UserContext';
import { VscDebugContinueSmall } from 'react-icons/vsc';

interface EnrolledCourse {
    id: string;
    course_id: string;
    enrolled_at: string;
    user_id: string;
    modules: number;
    lessons: number;
    lessonsCompleted: number;
    enrolled: number;
    course: {
        id: string;
        title: string;
        description: string;
        thumbnail_url: string;
        creator?: {
            full_name: string;
            email: string;
        };
    };
}

export default function MyLearningPage() {
    const user = useUser();
    const [courses, setCourses] = useState<EnrolledCourse[]>([]);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const enrolled = await courseApi.getMyEnrolledCourses();

                const enriched = await Promise.all(
                    enrolled.map(async (item: any) => {
                        const courseId = item.course_id;

                        // Get all modules for the course
                        const modulesRes = await moduleApi.getByCourseId(courseId);
                        const moduleList = modulesRes.modules || [];

                        // Get enrolled users
                        const enrolledRes = await courseApi.getEnrolledUsers(courseId);
                        const enrolledList = enrolledRes || [];

                        // Get all lessons for the course
                        let lessonIds: string[] = [];
                        for (const module of moduleList) {
                            const lessonsRes = await lessonsApi.getLessonsByModuleId(module.id, courseId);
                            if (Array.isArray(lessonsRes.lessons)) {
                                lessonIds.push(...lessonsRes.lessons.map((lesson: any) => lesson.id));
                            }
                        }

                        // Get completed lessons for this course (POST request with body)
                        const completedRes = await lessonsApi.getUserCompletedLessons(courseId);
                        const completedList = Array.isArray(completedRes)
                            ? completedRes
                            : Array.isArray(completedRes.lessons)
                                ? completedRes.lessons
                                : [];

                        // Count how many of this course's lessons are marked as completed
                        const completedCountPerCourse = completedList.filter((cl: any) =>
                            lessonIds.includes(cl.lesson_id)
                        ).length;

                        return {
                            ...item,
                            modules: moduleList.length,
                            enrolled: enrolledList.length,
                            lessons: lessonIds.length,
                            lessonsCompleted: completedCountPerCourse,
                        };
                    })
                );

                setCourses(enriched);
            } catch (error) {
                console.error('Failed to fetch course details:', error);
            }
        };


        if (user?.user?.id) {
            fetchCourseData();
        }
    }, [user]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Total Courses: {courses.length}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className="bg-white rounded-2xl shadow-md border border-amber-400 p-6 flex flex-col justify-between hover:shadow-lg transition duration-300"
                    >
                        <div>
                            <h2 className="text-xl font-semibold text-blue-700 mb-3">
                                {course.course?.title}
                            </h2>

                            <div className="space-y-2 text-gray-700 text-sm">
                                <div className="flex justify-between">
                                    <span>📦 Modules</span>
                                    <span className="font-medium">{course.modules}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>📚 Lessons</span>
                                    <span className="font-medium">{course.lessons}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>👥 All Students</span>
                                    <span className="font-medium">{course.enrolled}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>✅ My Completed Lessons</span>
                                    <span className="font-medium">{course.lessonsCompleted}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            className="mt-6 flex items-center gap-2 justify-center w-full border border-blue-600 hover:bg-blue-600 hover:text-white py-2 px-4 rounded-xl text-sm font-medium transition"
                        >
                            Continue Learning
                            <VscDebugContinueSmall />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
