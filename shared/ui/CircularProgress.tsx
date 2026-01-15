import React from 'react';

interface CircularProgressProps {
    value: number; // 0-100
    size?: number;
    strokeWidth?: number;
    label?: string;
    sublabel?: string;
    color?: 'indigo' | 'emerald' | 'amber' | 'rose';
}

const CircularProgress: React.FC<CircularProgressProps> = ({
    value,
    size = 120,
    strokeWidth = 8,
    label,
    sublabel,
    color = 'indigo'
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    const colorStyles = {
        indigo: {
            stroke: 'stroke-indigo-500',
            text: 'text-indigo-600',
            bg: 'stroke-indigo-100'
        },
        emerald: {
            stroke: 'stroke-emerald-500',
            text: 'text-emerald-600',
            bg: 'stroke-emerald-100'
        },
        amber: {
            stroke: 'stroke-amber-500',
            text: 'text-amber-600',
            bg: 'stroke-amber-100'
        },
        rose: {
            stroke: 'stroke-rose-500',
            text: 'text-rose-600',
            bg: 'stroke-rose-100'
        }
    };

    const colors = colorStyles[color];

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={strokeWidth}
                    className={colors.bg}
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    className={`${colors.stroke} transition-all duration-1000 ease-out`}
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: offset
                    }}
                />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl font-bold ${colors.text}`}>
                    {Math.round(value)}
                </span>
                {label && (
                    <span className="text-xs font-medium text-slate-500 mt-0.5">
                        {label}
                    </span>
                )}
                {sublabel && (
                    <span className="text-[10px] text-slate-400">
                        {sublabel}
                    </span>
                )}
            </div>
        </div>
    );
};

export default CircularProgress;
