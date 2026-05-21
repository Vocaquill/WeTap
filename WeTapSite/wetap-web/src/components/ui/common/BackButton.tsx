import { ChevronLeft } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';

interface BackButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
}

export const BackButton = ({ label, className = '', ...props }: BackButtonProps) => (
    <button
        type="button"
        className={`flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group ${className}`}
        {...props}
    >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
);
