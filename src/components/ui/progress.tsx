'use client';

type ProgressProps = {
    value: number;
};

export function Progress({ value }: ProgressProps) {
    return (
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${value}%` }}
            />
        </div>
    );
}
