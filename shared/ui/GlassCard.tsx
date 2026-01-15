import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    blur?: 'sm' | 'md' | 'lg';
    padding?: 'sm' | 'md' | 'lg' | 'none';
}

const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className = '',
    hover = true,
    blur = 'md',
    padding = 'md'
}) => {
    const blurStyles = {
        sm: 'backdrop-blur-sm',
        md: 'backdrop-blur-md',
        lg: 'backdrop-blur-xl'
    };

    const paddingStyles = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };

    const hoverStyles = hover
        ? 'hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 hover:border-indigo-200/50'
        : '';

    return (
        <div
            className={`
        bg-white/70 ${blurStyles[blur]}
        border border-white/50 rounded-3xl
        shadow-xl shadow-slate-200/50
        transition-all duration-300 ease-out
        ${paddingStyles[padding]}
        ${hoverStyles}
        ${className}
      `}
        >
            {children}
        </div>
    );
};

export default GlassCard;
