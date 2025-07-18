'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Quiz {
    id: string;
    module_id: string;
    title: string;
    instructions: string;
    deadline: string;
    duration_minutes: number;
    created_at: string;
    status: string;
    course_title: string;
    module_title: string;
    questions: any[];
}

interface QuizContextType {
    selectedQuiz: Quiz | null;
    setSelectedQuiz: (quiz: Quiz) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

    return (
        <QuizContext.Provider value={{ selectedQuiz, setSelectedQuiz }}>
            {children}
        </QuizContext.Provider>
    );
};

export const useQuiz = () => {
    const context = useContext(QuizContext);
    if (!context) throw new Error('useQuiz must be used within a QuizProvider');
    return context;
};
