'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';

export default function CalendarWidget() {
    const [date, setDate] = useState<Date | null>(new Date());

    return (
        <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Calendar</h2>
            <Calendar
                onChange={(value) => setDate(value                                                                      as Date)}
                value={date}
                className="border-none w-full"
                tileClassName={({ date }) => {
                    const highlightDates = [10, 17, 24];
                    if (highlightDates.includes(date.getDate())) {
                        return 'bg-blue-100 text-blue-700 font-semibold rounded-full';
                    }
                    return '';
                }}
            />
        </div>
    );
}
