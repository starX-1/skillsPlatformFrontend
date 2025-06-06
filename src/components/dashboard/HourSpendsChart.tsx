'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

const data = [
    { date: '08 Aug', theory: 4, practical: 6 },
    { date: '09 Aug', theory: 7.5, practical: 3.5 },
    { date: '10 Aug', theory: 5, practical: 5 },
    { date: '11 Aug', theory: 8, practical: 4 },
    { date: '12 Aug', theory: 6, practical: 4 },
    { date: '13 Aug', theory: 3, practical: 7 },
    { date: '14 Aug', theory: 5.5, practical: 4.5 },
];

export default function HourSpendsChart() {
    return (
        <div className="bg-white p-4 rounded-2xl shadow">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Hour Spends</h2>
                <select className="border text-sm rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option>Monthly</option>
                    <option>Weekly</option>
                </select>
            </div>

            <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="theory"
                            stroke="#F59E0B" // Amber
                            strokeWidth={2}
                        />
                        <Line
                            type="monotone"
                            dataKey="practical"
                            stroke="#10B981" // Green
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
