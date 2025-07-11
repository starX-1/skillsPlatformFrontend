'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import courseApi from '@/api/courses/courseApi';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/app/context/UserContext';
import { CiEdit } from 'react-icons/ci';
import { useRouter } from 'next/navigation';
// import { CgAdd } from 'react-icons/cg';
import { IoIosAdd } from 'react-icons/io';
import moduleApi from '@/api/modules/moduleApi';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  category: string;
  creator: {
    id: number;
    full_name: string;
    email: string;
  };
  enrolled: number;
  created_at: string;
}
interface Module {
  id: number;
  title: string;
  module_order: number;
  course_id: number;
}

export default function CourseDetailsPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : null;
  const user = useUser();
  // console.log(user.user)
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      try {
        const res = await courseApi.getCourseById(id);
        console.log(res);
        setCourse(res.course);
      } catch (err) {
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await moduleApi.getByCourseId(course?.id as string);
        setModules(res.modules);
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    }

    fetchModules();
  }, [course])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12 text-gray-600">
        Course not found.
      </div>
    );
  }

  console.log(modules)
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* edit course button if user is admin */}
      {user?.user?.role === 'admin' && (
        <div className="flex justify-end items-center gap-2 mt-6">
          <button
            className="bg-gray-100 flex items-center justify-center gap-2 border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 hover:text-white"
            onClick={() => router.push(`/dashboard/courses/${course.id}/edit`)}
          >
            <CiEdit className="w-5 h-5" />
            Edit Course
          </button>
        </div>
      )}


      <div className="rounded-xl overflow-hidden shadow border border-gray-200">
        <Image
          src={course.thumbnail_url || '/default-course.jpg'}
          alt={course.title}
          width={1200}
          height={500}
          className="w-full h-64 object-cover"
        />
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
        {/* <div className="text-sm text-gray-500">Category: {course.category}</div> */}
        <p className="text-gray-700 text-base">{course.description}</p>

        <div className="mt-6 border-t pt-4 text-sm text-gray-600 space-y-1">
          <div>
            <strong>Created By:</strong> {course.creator.full_name} ({course.creator.email})
          </div>
          {/* a sectin to display modules for this particular course  */}
          <div>
            <strong>Modules Offered:</strong>
            <ul className="list-disc pl-4">
              {modules.map((module) => (
                <li key={module.id}>
                  <Link
                    className='text-blue-600 hover:underline'
                    href={{
                      pathname: `/dashboard/modules/${module.id}`,
                      query: { courseId: course.id },
                    }}
                  >
                    {module.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* <div>
            <strong>Enrolled:</strong> {course.enrolled} students
          </div> */}
          <div>
            <strong>Created At:</strong> {new Date(course.created_at).toLocaleDateString()}
          </div>
          {user?.user?.role === 'admin' && (
            <div>
              <button
                className="flex items-center justify-center gap-2 bg-gray-100 border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white"
                onClick={() => router.push(`/dashboard/courses/${course.id}/AddModule`)}
              >
                <IoIosAdd className="w-5 h-5" />
                Add Module
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
