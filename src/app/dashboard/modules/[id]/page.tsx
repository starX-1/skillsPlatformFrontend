'use client';

import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import lessonsApi from '@/api/lessons/lessonsApi';
import moduleApi from '@/api/modules/moduleApi';
import courseApi from '@/api/courses/courseApi';
import { Loader2, ChevronDown, ChevronRight, FileText, Video, Download, Eye } from 'lucide-react';
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
    content: string;
    video_url: string;
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

const LessonPanel = ({ lesson, isExpanded, onToggle }: {
    lesson: Lesson;
    isExpanded: boolean;
    onToggle: () => void;
}) => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loadingMaterials, setLoadingMaterials] = useState(false);
    const [showPdfPreview, setShowPdfPreview] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        if (isExpanded && materials.length === 0) {
            setLoadingMaterials(true);
            const fetchedMaterials: Material[] = [];

            if (lesson.content) {
                fetchedMaterials.push({
                    id: `${lesson.id}-pdf`,
                    title: `${lesson.title} PDF Material`,
                    type: 'pdf',
                    url: lesson.content,
                });
            }

            if (lesson.video_url) {
                fetchedMaterials.push({
                    id: `${lesson.id}-video`,
                    title: `${lesson.title} Video Lesson`,
                    type: 'video',
                    url: lesson.video_url,
                });
            }

            setMaterials(fetchedMaterials);
            setLoadingMaterials(false);
        }
    }, [isExpanded]);

    const togglePdfPreview = (materialId: string) => {
        setShowPdfPreview(prev => ({
            ...prev,
            [materialId]: !prev[materialId]
        }));
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
                                <div className="mt-3 flex gap-2">
                                    <button
                                        className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition flex items-center gap-1"
                                        onClick={() => togglePdfPreview(material.id)}
                                    >
                                        <Eye className="w-3 h-3" />
                                        {showPdfPreview[material.id] ? 'Hide Preview' : 'Show Preview'}
                                    </button>
                                    <button
                                        className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                                        onClick={() => window.open(material.url, '_blank')}
                                    >
                                        Open in New Tab
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
                        {showPdfPreview[material.id] && (
                            <div className="mt-4 bg-white border rounded p-2">
                                <iframe
                                    src={`${material.url}#toolbar=0`}
                                    className="w-full h-64 border-0"
                                    title={`Preview of ${material.title}`}
                                />
                            </div>
                        )}
                    </div>
                );

            case 'video':
                return (
                    <div className="bg-gray-50 rounded-lg p-4 border">
                        <div className="flex items-start gap-3 mb-3">
                            <Video className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-800">{material.title}</h4>
                            </div>
                        </div>
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
                return null;
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
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
                    <span className="text-sm text-amber-500">
                        {isExpanded ? 'Collapse' : 'Expand'}
                    </span>
                </div>
            </div>

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
                const moduleRes = await moduleApi.getById(course_id, moduleId as string);
                setModuleData(moduleRes);

                const lessonsRes = await lessonsApi.getLessonsByModuleId(moduleId as string, course_id as string);

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
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{course?.title}</h1>
            </div>

            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800">{moduleData.title}</h2>
                <p className="text-gray-600 mt-2">
                    Module Number: {moduleData.module_order ?? 'N/A'}
                </p>
            </div>

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