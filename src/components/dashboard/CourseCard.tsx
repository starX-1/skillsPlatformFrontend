'use client';

// import { Progress } from "@/components/ui/progress";
import { FaBookOpen } from "react-icons/fa";

type CourseCardProps = {
    title: string;
    instructor: string;
    // progress: number;
};

export default function CourseCard({ title, instructor }: CourseCardProps) {
    return (
        <div className="bg-white p-4 rounded-2xl shadow space-y-3">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                    <FaBookOpen />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <p className="text-sm text-gray-500">Trainer {instructor}</p>
                </div>
            </div>
            {/* <div>
                <Progress value={progress} />
                <p className="text-sm text-gray-500 mt-1">{progress}% complete</p>
            </div> */}
        </div>
    );
}
