'use client';

import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import lessonsApi from '@/api/lessons/lessonsApi';
import { toast } from 'react-toastify';
import { IoAdd } from 'react-icons/io5';

export default function AddLessonPage() {
    const { id: moduleId } = useParams();
    const searchParams = useSearchParams();
    const courseId = searchParams.get('courseId');
    const router = useRouter();
    const [video_url, setVideoUrl] = useState('');
    const [title, setTitle] = useState('');
    const [lessonOrder, setLessonOrder] = useState<number | ''>('');
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    // const handleUpload = async (file: File, folder: string) => {
    //     const formData = new FormData();
    //     formData.append('file', file);
    //     formData.append('folder', folder);

    //     const response = await fetch('/api/uploads/cloudinary', {
    //         method: 'POST',
    //         body: formData,
    //     });

    //     if (!response.ok) {
    //         throw new Error('Upload failed');
    //     }

    //     const data = await response.json();
    //     return data.secure_url; // assuming your backend returns this
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !moduleId || !courseId || !pdfFile || !videoFile) {
            toast.error('Please fill in all fields and select both files.');
            return;
        }

        try {
            setLoading(true);

            // Upload files
            const contentUrl = await lessonsApi.uploadPdf(pdfFile);

            // let videoUrl = '';
            if (videoFile !== null) {
                const videoUrl = await lessonsApi.uploadVideo(videoFile);
                setVideoUrl(videoUrl);
            }
            // const videoUrl = await lessonsApi.uploadVideo(videoFile);

            // Create lesson
            const payload = {
                title,
                lesson_order: lessonOrder || 1,
                content: contentUrl,
                video_url: video_url,
            };

            await lessonsApi.createLesson(payload, moduleId as string);

            toast.success('Lesson added successfully!');
            router.push(`/dashboard/modules/${moduleId}?courseId=${courseId}`);
        } catch (error: any) {
            console.error('Error creating lesson:', error);
            toast.error(error?.message || 'Failed to create lesson.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Lesson</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow rounded-lg">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title *</label>
                    <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-amber-500 focus:outline-none focus:border-amber-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Lesson Order</label>
                    <input
                        type="number"
                        min={1}
                        value={lessonOrder}
                        onChange={(e) => setLessonOrder(parseInt(e.target.value) || '')}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-amber-500 focus:outline-none focus:border-amber-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Upload PDF (Content)</label>
                    <input
                        type="file"
                        accept="application/pdf"
                        required
                        onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                        className="mt-1 block w-full text-gray-700"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Video</label>
                    <input
                        type="file"
                        accept="video/*"
                        // required
                        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                        className="mt-1 block w-full text-gray-700"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="animate-spin w-4 h-4" />}
                        {/* < */}
                        <IoAdd className="text-xl" />
                        Create Lesson
                    </button>
                </div>
            </form>
        </div>
    );
}
