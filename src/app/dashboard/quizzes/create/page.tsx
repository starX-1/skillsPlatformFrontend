'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import courseApi from '@/api/courses/courseApi';
import { useUser } from '@/app/context/UserContext';
import moduleApi from '@/api/modules/moduleApi';
import { toast } from 'react-toastify';
import quizesApi from '@/api/quizes/quizesApi';

interface Course {
    id: string;
    title: string;
}

interface Module {
    id: string;
    title: string;
}

const CreateQuizPage = () => {
    const router = useRouter();
    const { user } = useUser()

    const [courses, setCourses] = useState<Course[]>([]);
    const [modules, setModules] = useState<Module[]>([]);

    const [selectedCourse, setSelectedCourse] = useState('');
    const [form, setForm] = useState({
        module_id: '',
        title: '',
        instructions: '',
        deadline: '',
        duration_minutes: '',
    });

    const [loading, setLoading] = useState(false);


    // Fetch courses
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await courseApi.getCourseByUploader();
                setCourses(res);
            } catch (err) {
                console.error('Failed to fetch courses', err);
            }
        };
        fetchCourses();
    }, [user?.id]);

    // Fetch modules when a course is selected
    useEffect(() => {
        const fetchModules = async () => {
            if (!selectedCourse) return;
            try {
                const res = await moduleApi.getByCourseId(selectedCourse);
                setModules(res.modules);
            } catch (err) {
                console.error('Failed to fetch modules', err);
            }
        };
        fetchModules();
    }, [selectedCourse]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    console.log(selectedCourse)
    console.log(modules)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.module_id || !form.title || !form.deadline || !form.duration_minutes) {
            toast.error('Please fill all required fields');
            return;
        }

        setLoading(true);


        try {
            // const res = await axios.post('/api/quizzes/quiz/create', {
            //     ...form,
            //     duration_minutes: parseInt(form.duration_minutes, 10),
            // });

            const res = await quizesApi.createQuiz({
                ...form,
                course_id: selectedCourse,
                duration_minutes: parseInt(form.duration_minutes, 10),
            });

            toast.success('Quiz created successfully!');

            // console.log("the res", res)

            const createdQuizId = res.id;
            router.push(`/dashboard/quizzes/${createdQuizId}/questions`);
        } catch (err) {
            console.error(err);
            toast.error('Failed to create quiz');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Step 1: Create Quiz</h1>

            <form onSubmit={handleSubmit} className="space-y-5">


                <div>
                    <label className="block mb-1 font-medium">
                        Select Course <span className="text-sm text-gray-500">(Choose the course this quiz is part of)</span>
                    </label>

                    <select
                        name="course_id"
                        value={selectedCourse}
                        onChange={(e) => {
                            setSelectedCourse(e.target.value);
                            setForm({ ...form, module_id: '' }); // Reset selected module
                        }}
                        className="w-full border rounded-lg px-4 py-2"
                        required
                    >
                        <option value="">-- Choose Course --</option>
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-medium">Select Module *</label>
                    <select
                        name="module_id"
                        value={form.module_id}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2"
                        required
                        disabled={!selectedCourse}
                    >
                        <option value="">-- Choose Module --</option>
                        {modules.map((mod) => (
                            <option key={mod.id} value={mod.id}>
                                {mod.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-medium mb-1">Quiz Title *</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Instructions</label>
                    <textarea
                        name="instructions"
                        value={form.instructions}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Deadline *</label>
                    <input
                        type="date"
                        name="deadline"
                        value={form.deadline}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Duration (minutes) *</label>
                    <input
                        type="number"
                        name="duration_minutes"
                        value={form.duration_minutes}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2"
                        required
                        min={1}
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create & Add Questions'}
                </button>
            </form>
        </div>
    );
};

export default CreateQuizPage;
