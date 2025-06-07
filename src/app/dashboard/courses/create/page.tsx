'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import courseApi from '@/api/courses/courseApi';

export default function CreateCoursePage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [creating, setCreating] = useState(false);

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setThumbnailFile(file);
        setThumbnailPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);

        try {
            let thumbnailUrl = '';

            if (thumbnailFile) {
                setUploading(true);
                const { thumbnailUrl: uploadedUrl } = await courseApi.uploadThumbNail(thumbnailFile);
                thumbnailUrl = uploadedUrl;
                setUploading(false);
            }

            await courseApi.createCourse(title, description, thumbnailUrl);

            router.push('/dashboard/courses');
        } catch (err) {
            console.error('Course creation failed', err);
            alert('Failed to create course');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
            <h1 className="text-2xl font-bold">Create New Course</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full mt-1 border border-gray-300 focus:ring-2  focus:ring-amber-500 focus:outline-none rounded-lg p-2"
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        required
                        className="w-full mt-1 border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:outline-none rounded-lg p-2"
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700">Course Thumbnail</label>
                    <input type="file" accept="image/*" onChange={handleThumbnailChange} />
                    {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
                    {thumbnailPreview && (
                        <img src={thumbnailPreview} alt="Preview" className="mt-2 h-32 object-cover rounded" />
                    )}
                </div>

                <button
                    type="submit"
                    disabled={creating}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {creating ? 'Creating...' : 'Create Course'}
                </button>
            </form>
        </div>
    );
}
