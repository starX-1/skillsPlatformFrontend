'use client';

import { CalendarDays } from 'lucide-react';

const exams = [
    {
        subject: 'Meteorology and Climatology',
        teacher: 'Anna Wilson',
        date: '17/10/2022',
        time: '9:00 am - 11:00 am',
        color: 'text-green-600 bg-green-50',
    },
    {
        subject: 'Math',
        teacher: 'Sergio Canales',
        date: '20/10/2022',
        time: '9:00 am - 11:00 am',
        color: 'text-red-600 bg-red-50',
    },
    {
        subject: 'User Experience',
        teacher: 'Harry Willson',
        date: '24/10/2022',
        time: '9:00 am - 11:00 am',
        color: 'text-yellow-600 bg-yellow-50',
    },
];

export default function UpcomingExams() {
    return (
        <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Upcoming Exams</h2>
            <div className="space-y-3">
                {exams.map((exam, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-lg flex items-start gap-3 ${exam.color}`}
                    >
                        <CalendarDays className="w-5 h-5 mt-1" />
                        <div>
                            <h3 className="font-semibold">{exam.subject}</h3>
                            <p className="text-sm text-gray-600">Teacher: {exam.teacher}</p>
                            <p className="text-sm text-gray-600">
                                Date: {exam.date} – {exam.time}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
