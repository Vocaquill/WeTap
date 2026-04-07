import type {ChangeEvent} from "react";

interface InputFieldProps {
    label: string;
    name: string;
    value?: string;
    placeholder?: string;
    type?: string;
    required?: boolean;
    error?: string[];
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const InputField = ({
                               label,
                               name,
                               value,
                               placeholder,
                               type = 'text',
                               required = false,
                               error,
                               onChange,
                           }: InputFieldProps) => (
    <div className="flex flex-col">
        <label className="text-zinc-400 mb-1 font-semibold">{label}</label>

        <input
            type={type}
            name={name}
            value={value}
            placeholder={placeholder}
            required={required}
            onChange={onChange}
            className={`bg-zinc-900 text-white rounded-xl px-4 py-3 border transition
                ${error ? 'border-red-500' : 'border-zinc-800'}
                [color-scheme:dark]
        
                [&::-webkit-calendar-picker-indicator]:filter
                [&::-webkit-calendar-picker-indicator]:invert
                [&::-webkit-calendar-picker-indicator]:sepia
                [&::-webkit-calendar-picker-indicator]:saturate-[500%]
                [&::-webkit-calendar-picker-indicator]:hue-rotate-[-10deg]
                [&::-webkit-calendar-picker-indicator]:opacity-90
                [&::-webkit-calendar-picker-indicator]:cursor-pointer
            `}
        />

        {error && (
            <span className="text-red-500 text-sm mt-1">
                {error[0]}
            </span>
        )}
    </div>
);
