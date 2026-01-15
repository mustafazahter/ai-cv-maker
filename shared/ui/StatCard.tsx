import React from 'react';

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan';
}

const StatCard: React.FC<StatCardProps> = ({
    icon,
    title,
    value,
    subtitle,
    trend,
    trendValue,
    color = 'indigo'
}) => {
    const colorStyles = {
        indigo: {
            iconBg: 'bg-indigo-50',
            iconText: 'text-indigo-600',
            accent: 'text-indigo-600'
        },
        emerald: {
            iconBg: 'bg-emerald-50',
            iconText: 'text-emerald-600',
            accent: 'text-emerald-600'
        },
        amber: {
            iconBg: 'bg-amber-50',
            iconText: 'text-amber-600',
            accent: 'text-amber-600'
        },
        rose: {
            iconBg: 'bg-rose-50',
            iconText: 'text-rose-600',
            accent: 'text-rose-600'
        },
        cyan: {
            iconBg: 'bg-cyan-50',
            iconText: 'text-cyan-600',
            accent: 'text-cyan-600'
        }
    };

    const colors = colorStyles[color];

    const trendIcons = {
        up: '↑',
        down: '↓',
        neutral: '→'
    };

    const trendColors = {
        up: 'text-emerald-500',
        down: 'text-rose-500',
        neutral: 'text-slate-400'
    };

    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${colors.iconBg}`}>
                    <div className={colors.iconText}>{icon}</div>
                </div>

                {trend && trendValue && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${trendColors[trend]}`}>
                        <span>{trendIcons[trend]}</span>
                        <span>{trendValue}</span>
                    </div>
                )}
            </div>

            <div className="mt-4">
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className={`text-2xl font-bold mt-1 ${colors.accent}`}>{value}</p>
                {subtitle && (
                    <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
                )}
            </div>
        </div>
    );
};

export default StatCard;
