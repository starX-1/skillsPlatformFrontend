'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import courseApi from '@/api/courses/courseApi';
import { useUser } from '@/app/context/UserContext';
import { toast } from 'react-toastify';

// const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Course {
    id: number;
    title: string;
    description: string;
    thumbnail_url: string;
    // category: string;
}

export default function EditCourseForm() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useUser();

    const [course, setCourse] = useState<Course | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    // const [category, setCategory] = useState('');
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await courseApi.getCourseById(id as string);
                setCourse(res.course);
                setTitle(res.course.title);
                setDescription(res.course.description);
                // setCategory(res.course.category);
                setThumbnailPreview(res.course.thumbnail_url);
            } catch (err) {
                toast.error('Failed to load course');
            }
        };

        fetchCourse();
    }, [id]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };
    const UpdateImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnail(file);
            const { thumbnailUrl: uploadedUrl } = await courseApi.uploadThumbNail(file);
            setThumbnailPreview(uploadedUrl);
        }
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description) {
            return toast.error('All fields are required.');
        }

        setLoading(true);

        try {
            // const formData = new FormData();
            // formData.append('title', title);
            // formData.append('description', description);
            // // formData.append('category', category);
            // if (thumbnail) {
            //     formData.append('thumbnail', thumbnail);
            // }

            // console.log(formData);
            await courseApi.updateCourse(id as string, {
                title,
                description,
                thumbnail_url: thumbnailPreview
            });
            toast.success('Course updated successfully!');
            router.push(`/dashboard/courses/${id}`);
        } catch (err) {
            console.error(err);
            toast.error('Failed to update course');
        } finally {
            setLoading(false);
        }
    };

    if (user?.role !== 'admin') {
        return <div className="text-center text-red-600 py-10">Access Denied</div>;
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">

            <h2 className="text-2xl font-bold mb-6">Edit Course</h2>

            <form onSubmit={handleSubmit} className="space-y-6 p-5 bg-gray-100 rounded-lg shadow-md">
                <div>
                    <label className="block font-medium">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full mt-1 border border-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 rounded-lg p-2"
                    />
                </div>

                <div>
                    <label className="block font-medium">Description</label>
                    <textarea
                        value={description}
                        rows={4}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full mt-1 border border-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 rounded-lg p-2"
                    />
                </div>

                {/* <div>
                    <label className="block font-medium">Category</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full mt-1 border border-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 rounded-lg p-2"
                    />
                </div> */}

                <div>
                    <label className="block font-medium">Thumbnail</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1" />
                    {thumbnailPreview && (
                        <Image
                            src={thumbnailPreview}
                            alt="Thumbnail preview"
                            width={300}
                            height={200}
                            className="mt-3 rounded-lg object-cover"
                        />
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Updating...' : 'Update Course'}
                </button>
            </form>
        </div>
    );
}
