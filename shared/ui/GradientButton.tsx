import React from 'react';

interface GradientButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    disabled?: boolean;
    icon?: React.ReactNode;
}

const GradientButton: React.FC<GradientButtonProps> = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    icon
}) => {
    const baseStyles = `
    relative inline-flex items-center justify-center gap-2 font-semibold rounded-2xl
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    overflow-hidden group
  `;

    const sizeStyles = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    };

    const variantStyles = {
        primary: `
      bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500
      text-white shadow-lg shadow-indigo-500/30
      hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02]
      focus:ring-indigo-500
      active:scale-[0.98]
    `,
        secondary: `
      bg-gradient-to-r from-slate-800 to-slate-700
      text-white shadow-lg shadow-slate-800/30
      hover:shadow-xl hover:shadow-slate-800/40 hover:scale-[1.02]
      focus:ring-slate-500
      active:scale-[0.98]
    `,
        outline: `
      bg-transparent border-2 border-indigo-500
      text-indigo-600 hover:bg-indigo-50
      focus:ring-indigo-500
      active:scale-[0.98]
    `
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        >
            {/* Shimmer effect */}
            {variant !== 'outline' && (
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            )}

            {icon && <span className="relative z-10">{icon}</span>}
            <span className="relative z-10">{children}</span>
        </button>
    );
};

export default GradientButton;
