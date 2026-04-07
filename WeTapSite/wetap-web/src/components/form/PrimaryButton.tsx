import type {ReactNode} from "react";


interface PrimaryButtonProps {
    children: ReactNode;
    type?: 'button' | 'submit';
}

export const PrimaryButton = ({ children, type = 'button' }: PrimaryButtonProps) => (
    <button
        type={type}
        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition transform hover:scale-105"
    >
        {children}
    </button>
);
