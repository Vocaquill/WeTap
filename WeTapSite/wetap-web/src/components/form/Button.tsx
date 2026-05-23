import type { ButtonHTMLAttributes, ReactNode } from "react";
import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'google';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    isLoading?: boolean;
    icon?: ReactNode;
    iconRight?: ReactNode;
    fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            icon,
            iconRight,
            fullWidth = false,
            className = '',
            disabled,
            type = 'button',
            ...props
        },
        ref
    ) => {
        // Base styles
        const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-300 focus:outline-none focus:ring-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

        // Size variations
        const sizeStyles = {
            sm: 'px-4 py-2 text-xs rounded-xl gap-1.5',
            md: 'px-6 py-3 text-sm rounded-xl gap-2',
            lg: 'px-8 py-3.5 text-sm rounded-2xl gap-2 font-black uppercase tracking-wider',
            xl: 'px-8 py-4 text-base rounded-2xl gap-2.5 font-black uppercase tracking-widest',
        };

        // Variant styles
        const variantStyles = {
            primary: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/10 hover:shadow-red-600/25 focus:ring-red-600/30',
            secondary: 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 focus:ring-zinc-800/30',
            outline: 'bg-transparent border border-white/10 hover:bg-white/5 text-white focus:ring-white/10',
            google: 'bg-white hover:bg-zinc-100 text-black shadow-md focus:ring-white/30',
        };

        const widthStyles = fullWidth ? 'w-full flex' : '';

        return (
            <button
                ref={ref}
                type={type}
                disabled={disabled || isLoading}
                className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyles} ${className}`}
                {...props}
            >
                {isLoading && <Loader2 className="animate-spin shrink-0" size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} />}
                {!isLoading && icon && <span className="shrink-0">{icon}</span>}
                {children}
                {!isLoading && iconRight && <span className="shrink-0">{iconRight}</span>}
            </button>
        );
    }
);

Button.displayName = 'Button';
