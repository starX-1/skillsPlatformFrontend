// app/dashboard/courses/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

interface Course {
    id: number;
    title: string;
    description: string;
    image: string;
    category: string;
    enrolled: number;
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        // Example mock data – replace with API call
        setCourses([
            {
                id: 1,
                title: 'React for Beginners',
                description: 'Learn React from scratch with this beginner-friendly course.',
                image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
                category: 'Frontend',
                enrolled: 120,
            },
            {
                id: 2,
                title: 'Node.js Essentials',
                description: 'Understand backend development with Node.js and Express.',
                image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
                category: 'Backend',
                enrolled: 85,
            },
            {
                id: 3,
                title: 'UI/UX Fundamentals',
                description: 'Master design principles and tools to build engaging interfaces.',
                image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
                category: 'Design',
                enrolled: 62,
            },
        ]);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-end">
                {/* <h1 className="text-2xl font-bold">Courses</h1> */}
                <Link
                    href="/dashboard/courses/create"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <Plus size={18} /> Create Course
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className="bg-white shadow rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition"
                    >
                        <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-40 object-cover"
                        />
                        <div className="p-4 space-y-2">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {course.title}
                            </h2>
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {course.description}
                            </p>
                            <div className="text-sm text-gray-500">Category: {course.category}</div>
                            <div className="text-sm text-gray-500">Enrolled: {course.enrolled}</div>
                            <div className="flex items-center justify-between">
                                <Link
                                    href={`/dashboard/courses/${course.id}`}
                                    className="inline-block mt-2 text-blue-600 text-sm font-medium hover:underline"
                                >
                                    View Course
                                </Link>
                                <Link
                                    href={`/dashboard/courses/${course.id}/edit`}
                                    className="inline-block mt-2 text-blue-600 text-sm border border-amber-500 p-2 rounded-md font-bold hover:bg-amber-500 hover:text-white"
                                >
                                    Enroll
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
