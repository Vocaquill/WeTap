import type { ButtonHTMLAttributes, ReactNode } from "react";
import React from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'google'
    | 'inverse'
    | 'danger'
    | 'ghost'
    | 'ghostIcon'
    | 'ghostIconDanger'
    | 'link'
    | 'linkDanger'
    | 'linkAccent'
    | 'linkSubtle'
    | 'linkPlain'
    | 'icon'
    | 'iconFilled'
    | 'iconRound'
    | 'iconInline'
    | 'surface'
    | 'surfaceDark'
    | 'chip'
    | 'gradient'
    | 'profile'
    | 'play'
    | 'menuItem'
    | 'player'
    | 'playerMuted'
    | 'paginationNav'
    | 'paginationPage'
    | 'reaction'
    | 'navItem'
    | 'action'
    | 'actionDanger';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon' | 'iconMd' | 'iconLg';
    active?: boolean;
    isLoading?: boolean;
    icon?: ReactNode;
    iconRight?: ReactNode;
    fullWidth?: boolean;
}

const TEXT_VARIANTS = new Set<ButtonVariant>([
    'primary',
    'secondary',
    'outline',
    'google',
    'inverse',
    'danger',
    'ghost',
    'gradient',
]);

const NO_FOCUS_RING_VARIANTS = new Set<ButtonVariant>([
    'ghost',
    'ghostIcon',
    'ghostIconDanger',
    'link',
    'linkDanger',
    'linkAccent',
    'linkSubtle',
    'linkPlain',
    'iconInline',
    'menuItem',
    'player',
    'playerMuted',
    'reaction',
    'navItem',
]);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = 'primary',
            size = 'md',
            active = false,
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
        const baseStyles = [
            'inline-flex items-center justify-center transition-all duration-300 focus:outline-none',
            !NO_FOCUS_RING_VARIANTS.has(variant) && 'focus:ring-2',
            TEXT_VARIANTS.has(variant) && 'font-bold active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100',
        ].filter(Boolean).join(' ');

        const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
            sm: 'px-4 py-2 text-xs rounded-xl gap-1.5',
            md: 'px-6 py-3 text-sm rounded-xl gap-2',
            lg: 'px-8 py-3.5 text-sm rounded-2xl gap-2 font-black uppercase tracking-wider',
            xl: 'px-8 py-4 text-base rounded-2xl gap-2.5 font-black uppercase tracking-widest',
            icon: 'p-2',
            iconMd: 'w-10 h-10 p-0 rounded-xl',
            iconLg: 'w-12 h-12 p-0 rounded-xl',
        };

        const variantStyles: Record<ButtonVariant, string> = {
            primary: 'bg-[#FF2D7A] hover:bg-[#FF2D7A]/90 text-white focus:ring-[#FF2D7A]/30',
            secondary: 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 hover:border-zinc-700 focus:ring-zinc-800/30',
            outline: 'bg-transparent border border-white/10 hover:bg-white/5 text-white focus:ring-white/10',
            google: 'bg-white hover:bg-zinc-100 text-black shadow-md focus:ring-white/30',
            inverse: 'font-black uppercase bg-white text-black hover:bg-red-600 hover:text-white',
            danger: 'font-black uppercase border border-red-600/20 text-red-500 hover:bg-red-600 hover:text-white',
            ghost: 'font-bold text-zinc-500 hover:text-white transition-colors',
            ghostIcon: 'text-zinc-500 hover:text-white transition-colors',
            ghostIconDanger: 'text-zinc-500 hover:text-red-500 transition-colors',
            link: 'text-xs text-zinc-400 hover:text-white transition-colors',
            linkDanger: 'text-sm text-red-500 hover:underline',
            linkAccent: 'text-xs text-[#FF2D7A] font-bold hover:underline',
            linkSubtle: 'text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-red-600 transition-colors',
            linkPlain: 'text-white',
            icon: 'p-2 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-xl active:scale-95',
            iconFilled: 'p-2 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-zinc-300 hover:text-white transition-colors shrink-0',
            iconRound: 'p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors',
            iconInline: 'text-zinc-400 hover:text-white transition-colors',
            surface: 'w-full text-left p-4 rounded-2xl border border-white/5 hover:bg-white/5 font-bold text-zinc-300',
            surfaceDark: 'w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-3 rounded-xl text-sm font-medium text-left px-4 justify-between',
            chip: active
                ? 'px-3 py-1 rounded-xl border transition bg-red-600 border-red-600 text-white'
                : 'px-3 py-1 rounded-xl border transition bg-zinc-900 border-zinc-800 text-zinc-400',
            gradient: 'font-black uppercase bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:opacity-90 text-white shadow-lg shadow-rose-500/20 active:scale-95 tracking-wider',
            profile: 'bg-gradient-to-r from-zinc-900 to-rose-950/20 hover:to-rose-900/30 rounded-xl border border-zinc-800/60 transition-all gap-2.5 p-1 pr-3',
            play: 'w-16 h-16 bg-rose-600 rounded-full shadow-lg active:scale-95 transition-transform',
            menuItem: active
                ? 'w-full text-left px-4 py-2 text-sm hover:bg-zinc-800 transition-colors text-[#FF2D7A] font-bold'
                : 'w-full text-left px-4 py-2 hover:bg-zinc-800 transition-colors text-white',
            player: 'w-8 h-8 rounded-full text-white hover:bg-white/10 hover:text-[#FF2D7A] transition-colors',
            playerMuted: 'w-8 h-8 rounded-full text-white/70 hover:bg-white/10 hover:text-[#FF2D7A] transition-colors',
            paginationNav: 'w-10 h-10 rounded-xl border border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed',
            paginationPage: active
                ? 'w-10 h-10 rounded-xl text-sm font-bold bg-red-600 text-white ring-2 ring-white ring-inset'
                : 'w-10 h-10 rounded-xl text-sm font-bold text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800',
            reaction: 'gap-2 px-4 py-2 hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium',
            navItem: 'p-3 rounded-xl text-zinc-500 hover:bg-zinc-900/60 hover:text-rose-400 w-full justify-start gap-3',
            action: 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700',
            actionDanger: 'bg-zinc-900 border border-zinc-800 hover:bg-red-950/40 text-zinc-500 hover:text-red-500 hover:border-red-950/40',
        };

        const resolvedSize = (() => {
            if (variant === 'play') return '';
            if (size === 'iconMd' || size === 'iconLg') return sizeStyles[size];
            if (['icon', 'iconFilled', 'iconRound'].includes(variant)) return sizeStyles.icon;
            if (variant === 'action' || variant === 'actionDanger') return sizeStyles.iconMd;
            if (variant === 'paginationNav' || variant === 'paginationPage') return '';
            if (variant === 'player' || variant === 'playerMuted') return '';
            if (variant === 'chip') return '';
            if (variant === 'menuItem') return '';
            if (variant === 'reaction') return '';
            if (variant === 'navItem') return '';
            if (variant === 'profile') return '';
            if (variant === 'surface' || variant === 'surfaceDark') return '';
            if (['ghostIcon', 'ghostIconDanger', 'link', 'linkDanger', 'linkAccent', 'linkSubtle', 'linkPlain', 'iconInline'].includes(variant)) return '';
            if (variant === 'inverse' && size === 'sm') return 'px-6 py-3 text-xs rounded-2xl tracking-tighter gap-2';
            if (variant === 'inverse' && size === 'xl') return 'px-10 py-5 text-sm rounded-2xl gap-2 shadow-2xl';
            if (variant === 'gradient') return 'p-2 px-4 text-xs gap-2.5';
            if (TEXT_VARIANTS.has(variant)) return sizeStyles[size === 'icon' ? 'md' : size];
            return '';
        })();

        const widthStyles = fullWidth ? 'w-full flex' : '';

        return (
            <button
                ref={ref}
                type={type}
                disabled={disabled || isLoading}
                className={`${baseStyles} ${variantStyles[variant]} ${resolvedSize} ${widthStyles} ${className}`}
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
