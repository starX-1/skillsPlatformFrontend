// app/dashboard/page.tsx
'use client';
import { useUser } from '../context/UserContext';
import authApi from '@/api/authApi/auth';
import courseApi from '@/api/courses/courseApi';
import CalendarWidget from '@/components/dashboard/CalendarWidget';
import CourseCard from '@/components/dashboard/CourseCard';
import HourSpendsChart from '@/components/dashboard/HourSpendsChart';
import ScoreInExamChart from '@/components/dashboard/ScoreInExamChart';
import UpcomingExams from '@/components/dashboard/UpcomingExams';
import { useEffect, useState } from 'react';
import { FaBook, FaUserGraduate, FaUpload } from 'react-icons/fa';
interface User {
    id: string;
    full_name: string;
    email: string;
    role: string;
}

interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    creator: User;
    enrolled: number;
}

interface Enrollment {
    id: string;
    user_id: string;
    course_id: string;
    enrolled_at: string;
    course: Course;
}


export default function DashboardHome() {
    const { user, loading } = useUser();
    const [greeting, setGreeting] = useState('');
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

    // const [role, setRole] = useState('');



    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await courseApi.getMyEnrolledCourses();
                setEnrollments(response);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, []);



    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 17) setGreeting('Good afternoon');
        else setGreeting('Good evening');
    }, []);



    // console.log(courses)


    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    {greeting}, {user?.full_name}
                </h1>
                <p className="text-gray-500 mt-1">Here&#39;s your activity summary for today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
                    <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                        <FaBook size={24} />
                    </div>
                    <div>
                        <h2 className="text-sm text-gray-500">Courses Enrolled</h2>
                        <p className="text-xl font-bold text-gray-800">{enrollments.length}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
                    <div className="bg-amber-100 text-amber-600 p-3 rounded-full">
                        <FaUserGraduate size={24} />
                    </div>
                    <div>
                        <h2 className="text-sm text-gray-500">Enrolled Users</h2>
                        <p className="text-xl font-bold text-gray-800">150</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
                    <div className="bg-green-100 text-green-600 p-3 rounded-full">
                        <FaUpload size={24} />
                    </div>
                    <div>
                        <h2 className="text-sm text-gray-500">Submissions</h2>
                        <p className="text-xl font-bold text-gray-800">78</p>
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrollments.map((enrollment) => (
                        <CourseCard
                            key={enrollment.id}
                            title={enrollment.course.title}
                            instructor={enrollment.course.creator.full_name}
                            progress={0}
                        />
                    ))}

                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <HourSpendsChart />
                {/* Score in Exam will go here */}
                <ScoreInExamChart />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UpcomingExams />
                <CalendarWidget />
            </div>
        </div>
    );
}
