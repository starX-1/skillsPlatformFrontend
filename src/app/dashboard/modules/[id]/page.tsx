'use client';

import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import lessonsApi from '@/api/lessons/lessonsApi';
import moduleApi from '@/api/modules/moduleApi';
import courseApi from '@/api/courses/courseApi';
import { Loader2, ChevronDown, ChevronRight, FileText, Video, Download } from 'lucide-react';
import { IoIosAdd } from 'react-icons/io';
import { useUser } from '@/app/context/UserContext';

interface Material {
    id: string;
    title: string;
    type: 'pdf' | 'video' | 'document' | 'other';
    url: string;
    description?: string;
}

interface Lesson {
    id: string;
    title: string;
    description: string;
    lesson_order: number;
    module_id: string;
    materials?: Material[]; // Add materials to lesson interface
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

// New component for lesson panel
const LessonPanel = ({ lesson, isExpanded, onToggle }: {
    lesson: Lesson;
    isExpanded: boolean;
    onToggle: () => void;
}) => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loadingMaterials, setLoadingMaterials] = useState(false);

    // Fetch materials when lesson is expanded for the first time
    useEffect(() => {
        if (isExpanded && materials.length === 0) {
            fetchLessonMaterials();
        }
    }, [isExpanded]);

    const fetchLessonMaterials = async () => {
        setLoadingMaterials(true);
        try {
            // Replace with your actual API call to fetch lesson materials
            // const materialsRes = await lessonsApi.getLessonMaterials(lesson.id);
            // setMaterials(materialsRes.materials || []);

            // Mock data for demonstration - replace with actual API call
            const mockMaterials: Material[] = [
                {
                    id: '1',
                    title: 'Introduction to React.pdf',
                    type: 'pdf',
                    url: '/materials/react-intro.pdf',
                    description: 'Basic concepts and getting started guide'
                },
                {
                    id: '2',
                    title: 'React Components Tutorial',
                    type: 'video',
                    url: '/materials/react-components.mp4',
                    description: 'Video tutorial on React components'
                }
            ];
            setMaterials(mockMaterials);
        } catch (error) {
            console.error('Failed to fetch lesson materials:', error);
        } finally {
            setLoadingMaterials(false);
        }
    };

    const renderMaterialPreview = (material: Material) => {
        switch (material.type) {
            case 'pdf':
                return (
                    <div className="bg-gray-50 rounded-lg p-4 border">
                        <div className="flex items-start gap-3">
                            <FileText className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-800">{material.title}</h4>
                                {material.description && (
                                    <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                                )}
                                <div className="mt-3 flex gap-2">
                                    <button
                                        className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                                        onClick={() => window.open(material.url, '_blank')}
                                    >
                                        Preview PDF
                                    </button>
                                    <button
                                        className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition flex items-center gap-1"
                                        onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = material.url;
                                            link.download = material.title;
                                            link.click();
                                        }}
                                    >
                                        <Download className="w-3 h-3" />
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* PDF Preview embed - you might want to use a PDF viewer library */}
                        <div className="mt-4 bg-white border rounded p-2">
                            <iframe
                                src={`${material.url}#toolbar=0`}
                                className="w-full h-64 border-0"
                                title={`Preview of ${material.title}`}
                            />
                        </div>
                    </div>
                );

            case 'video':
                return (
                    <div className="bg-gray-50 rounded-lg p-4 border">
                        <div className="flex items-start gap-3 mb-3">
                            <Video className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-800">{material.title}</h4>
                                {material.description && (
                                    <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                                )}
                            </div>
                        </div>
                        {/* Video Preview */}
                        <div className="bg-white border rounded overflow-hidden">
                            <video
                                controls
                                className="w-full max-h-64"
                                preload="metadata"
                            >
                                <source src={material.url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="bg-gray-50 rounded-lg p-4 border">
                        <div className="flex items-center gap-3">
                            <FileText className="w-6 h-6 text-gray-500" />
                            <div>
                                <h4 className="font-medium text-gray-800">{material.title}</h4>
                                {material.description && (
                                    <p className="text-sm text-gray-600">{material.description}</p>
                                )}
                                <a
                                    href={material.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block"
                                >
                                    Open Material →
                                </a>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Clickable lesson header */}
            <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={onToggle}
            >
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                        ) : (
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                        )}
                        <div>
                            <p className="font-medium text-blue-600">{lesson.title}</p>
                            <p className="text-sm text-gray-500">
                                Lesson Number: {lesson.lesson_order ?? 'N/A'}
                            </p>
                        </div>
                    </div>
                    <span className="text-sm text-gray-400">
                        {isExpanded ? 'Collapse' : 'Expand'}
                    </span>
                </div>
            </div>

            {/* Collapsible content panel */}
            {isExpanded && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                    {lesson.description && (
                        <div className="mb-4">
                            <h4 className="font-medium text-gray-800 mb-2">Description</h4>
                            <p className="text-gray-600 text-sm">{lesson.description}</p>
                        </div>
                    )}

                    <div>
                        <h4 className="font-medium text-gray-800 mb-3">Materials</h4>

                        {loadingMaterials ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="animate-spin w-5 h-5 text-blue-600" />
                                <span className="ml-2 text-gray-600">Loading materials...</span>
                            </div>
                        ) : materials.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                <p>No materials available for this lesson yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {materials.map((material) => (
                                    <div key={material.id}>
                                        {renderMaterialPreview(material)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function ModulePage() {
    const { id: moduleId } = useParams();
    const searchParams = useSearchParams();
    const course_id = searchParams.get('courseId');
    const [course, setCourse] = useState<Course | null>(null);
    const [moduleData, setModuleData] = useState<Module | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [lessonsMessage, setLessonsMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());
    const user = useUser();

    const toggleLesson = (lessonId: string) => {
        const newExpandedLessons = new Set(expandedLessons);
        if (newExpandedLessons.has(lessonId)) {
            newExpandedLessons.delete(lessonId);
        } else {
            newExpandedLessons.add(lessonId);
        }
        setExpandedLessons(newExpandedLessons);
    };

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

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Course Info */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{course?.title}</h1>
            </div>

            {/* Module Info */}
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800">{moduleData.title}</h2>
                <p className="text-gray-600 mt-2">
                    Module Number: {moduleData.module_order ?? 'N/A'}
                </p>
            </div>

            {/* Lessons Accordion */}
            <div className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Lessons</h2>

                {lessons.length === 0 ? (
                    <p className="text-gray-500">{lessonsMessage || 'No lessons added yet.'}</p>
                ) : (
                    <div className="space-y-3">
                        {lessons
                            .sort((a, b) => (a.lesson_order || 0) - (b.lesson_order || 0))
                            .map((lesson) => (
                                <LessonPanel
                                    key={lesson.id}
                                    lesson={lesson}
                                    isExpanded={expandedLessons.has(lesson.id)}
                                    onToggle={() => toggleLesson(lesson.id)}
                                />
                            ))}
                    </div>
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
            )}
        </div>
    );
}