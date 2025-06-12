// app/dashboard/courses/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useUser } from '@/app/context/UserContext';
import courseApi from '@/api/courses/courseApi';
// import { number } from 'framer-motion';
import { FcNext, FcPrevious } from 'react-icons/fc';
import { AiOutlineEdit } from 'react-icons/ai';
import { toast } from 'react-toastify';

interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    creator: User;
    enrolled: number;
}
interface User {
    id: string;
    full_name: string;
    email: string;
    role: string;
}



export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const { user } = useUser();
    // const [role, setRole] = useState('');\
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);


    const handleEnrollment = async (courseId: string) => {
        const response = await courseApi.enrollCourse(courseId)
        if (response.enrollment.id) {
            toast.success(response.message);
        }
        else {
            toast.error(response.message);
        }

    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await courseApi.getCourses(currentPage, 6);
                setCourses(response.courses);
                setTotalPages(response.totalPages);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, [currentPage]);

    console.log(courses);
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-end">
                {/* <h1 className="text-2xl font-bold">Courses</h1> */}
                {user?.role === 'admin' && (
                    <Link
                        href="/dashboard/courses/create"
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        <Plus size={18} /> Create Course
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className="bg-white shadow rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition"
                    >
                        {course.thumbnail_url && (
                            <Image
                                src={course.thumbnail_url}
                                alt={course.title}
                                width={400}
                                height={250}
                                className="w-full h-40 object-cover"
                            />
                        )}
                        <div className="p-4 space-y-2">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {course.title}
                            </h2>
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {course.description}
                            </p>
                            <div className="text-sm text-gray-500">Instructor: {course?.creator?.full_name}</div>
                            {/* <div className="text-sm text-gray-500">Enrolled: {course.enrolled}</div> */}
                            <div className="flex items-center justify-between">
                                <Link
                                    href={`/dashboard/courses/${course.id}`}
                                    className="inline-block mt-2 text-blue-600 text-sm font-medium hover:underline"
                                >
                                    View Course
                                </Link>
                                {user?.role === 'admin' ? (

                                    <Link
                                        href={`/dashboard/courses/${course.id}/edit`}
                                        className="flex items-center gap-2 mt-2 text-blue-600 text-sm border border-amber-500 p-2 rounded-md font-bold hover:bg-amber-500 hover:text-white"
                                    >
                                        <AiOutlineEdit />
                                        Edit
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => handleEnrollment(course.id)}
                                        className="inline-block mt-2 text-blue-600 text-sm border border-amber-500 p-2 rounded-md font-bold hover:bg-amber-500 hover:text-white"
                                    >
                                        Enroll
                                    </button>
                                )}

                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Pagination Buttons */}
            <div className="flex justify-center items-center space-x-4 mt-6">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 border border-amber-700 rounded disabled:opacity-50"
                >
                    <FcPrevious />
                </button>

                <span>
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded bg-gray-300 border border-amber-700 disabled:opacity-50"
                >
                    <FcNext />
                </button>
            </div>
        </div>
    );
}
