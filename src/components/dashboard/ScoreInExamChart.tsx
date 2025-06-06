'use client';

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

const data = [
    { name: 'Get +60% number', value: 16 },
    { name: 'Get between 40%-60%', value: 9 },
    { name: 'Get <40% number', value: 5 },
];

const COLORS = ['#10B981', '#F59E0B', '#EF4444']; // Green, Amber, Red

export default function ScoreInExamChart() {
    return (
        <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Score in Exam</h2>

            <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
