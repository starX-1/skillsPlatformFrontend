'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
// import dynamic from 'next/dynamic';
// import toast, { Toaster } from 'react-hot-toast';
// import { useUser } from '@/app/context/UserContext';
import { useUser } from '@/app/context/UserContext';
import moduleApi from '@/api/modules/moduleApi'; // adjust the path
import { toast } from 'react-toastify';

// const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function AddModulePage() {
    const router = useRouter();
    const { id: courseId } = useParams(); // course ID from route
    const user = useUser();

    const [title, setTitle] = useState('');
    const [module_order, setModule_order] = useState('');
    const [loading, setLoading] = useState(false);

    if (user?.user?.role !== 'admin') {
        return (
            <div className="text-center text-red-600 py-10">
                Access Denied: Admins only.
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !module_order) {
            toast.error('Title and module_order are required');
            return;
        }

        setLoading(true);
        try {
            await moduleApi.createModule({
                title,
                // typecast module order from string to number
                module_order: parseInt(module_order),
                // module_order: module_order,
            }, courseId as string);

            toast.success('Module added successfully');
            router.push(`/dashboard/courses/${courseId}`);
        } catch (err) {
            console.error(err);
            toast.error('Failed to add module');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            {/* <Toaster /> */}
            <h2 className="text-2xl font-bold mb-6">Add Module</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block font-medium">Module Title</label>
                    <input
                        type="text"
                        value={title}
                        placeholder='Enter module title'
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full mt-1 border border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 rounded-lg p-2"
                    />
                </div>

                <div>
                    <label className="block font-medium">Module Order</label>
                    <input
                        type="number"
                        value={module_order}
                        placeholder='Enter module order'
                        onChange={(e) => setModule_order(e.target.value)}
                        className="w-full mt-1 border border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 rounded-lg p-2"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Adding...' : 'Add Module'}
                </button>
            </form>
        </div>
    );
}
