'use client';

import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import lessonsApi from '@/api/lessons/lessonsApi';
import moduleApi from '@/api/modules/moduleApi';
import courseApi from '@/api/courses/courseApi';
import { Loader2 } from 'lucide-react';
import { IoIosAdd } from 'react-icons/io';
import { useUser } from '@/app/context/UserContext';

interface Lesson {
    id: string;
    title: string;
    description: string;
    lesson_order: number;
    module_id: string;
}

interface Course {
    id: string;
    title: string;
    description: string;
    modules: Module[];
}

interface Module {
    id: string;
    title: string;
    description: string;
    module_order: number;
}

export default function ModulePage() {
    const { id: moduleId } = useParams();
    const searchParams = useSearchParams();
    const course_id = searchParams.get('courseId');
    const [course, setCourse] = useState<Course | null>(null);
    const [moduleData, setModuleData] = useState<Module | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [lessonsMessage, setLessonsMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const user = useUser();


    useEffect(() => {
        if (!moduleId || !course_id) return;

        const fetchData = async () => {
            try {
                // Get module info
                const moduleRes = await moduleApi.getById(course_id, moduleId as string);
                setModuleData(moduleRes);

                // Get lessons
                const lessonsRes = await lessonsApi.getLessonsByModuleId(moduleId as string, course_id as string);

                // get course 
                const courseRes = await courseApi.getCourseById(course_id as string);
                setCourse(courseRes.course);


                if (Array.isArray(lessonsRes.lessons)) {
                    setLessons(lessonsRes.lessons);
                } else {
                    setLessons([]);
                    setLessonsMessage(lessonsRes.message || 'No lessons found.');
                }
            } catch (error) {
                console.error('Failed to fetch module or lessons:', error);
                setLessonsMessage('Failed to load lessons.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [moduleId, course_id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
            </div>
        );
    }

    if (!moduleData) {
        return (
            <div className="text-center py-10 text-red-500">
                Failed to load module data. Make sure you&apos;re enrolled in this course.
            </div>
        );
    }

    console.log("course", course)

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Course Info */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{course?.title}</h1>
                {/* <p className="text-gray-600 mt-2">
                    Description: {course?.description}
                </p> */}
            </div>
            {/* Module Info */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800">{moduleData.title}</h2>
                <p className="text-gray-600 mt-2">
                    Module Number: {moduleData.module_order ?? 'N/A'}
                </p>
            </div>

            {/* Lessons List */}
            <div className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Lessons</h2>

                {lessons.length === 0 ? (
                    <p className="text-gray-500">{lessonsMessage || 'No lessons added yet.'}</p>
                ) : (
                    <ul className="space-y-4">
                        {lessons
                            .sort((a, b) => (a.lesson_order || 0) - (b.lesson_order || 0))
                            .map((lesson) => (
                                <li
                                    key={lesson.id}
                                    className="border border-gray-200 p-4 rounded-lg hover:border-amber-500 transition"
                                >
                                    <Link href={`/dashboard/lessons/${lesson.id}`}>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-blue-600">
                                                    {lesson.title}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Lesson Number: {lesson.lesson_order ?? 'N/A'}
                                                </p>
                                            </div>
                                            <span className="text-sm text-gray-400">View &rarr;</span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                    </ul>
                )}
            </div>

            {/* Add Lesson Button */}
            {user.user?.role === 'admin' && (
                <div className="mt-8 text-right">
                    <Link
                        href={`/dashboard/modules/${moduleId}/Addlesson?courseId=${course_id}`}
                        className="inline-flex items-center gap-2 bg-gray-100 text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-700 hover:text-white transition"
                    >
                        <IoIosAdd className="text-xl" />
                        <span>Add Lesson</span>
                    </Link>
                </div>
            )
            }
        </div>
    );
}
