import type { ChangeEvent } from 'react';

interface TextAreaFieldProps {
    label: string;
    name: string;
    value?: string;
    placeholder?: string;
    rows?: number;
    required?: boolean;
    error?: string[];
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextAreaField = ({
                                  label,
                                  name,
                                  value,
                                  placeholder,
                                  rows = 5,
                                  required = false,
                                  error,
                                  onChange,
                              }: TextAreaFieldProps) => (
    <div className="flex flex-col">
        <label className="text-zinc-400 mb-1 font-semibold">{label}</label>

        <textarea
            name={name}
            value={value}
            placeholder={placeholder}
            rows={rows}
            required={required}
            onChange={onChange}
            className={`bg-zinc-900 rounded-xl px-4 py-3 resize-none border transition
                ${error ? 'border-red-500' : 'border-zinc-800'}
            `}
        />

        {error && (
            <span className="text-red-500 text-sm mt-1">
                {error[0]}
            </span>
        )}
    </div>
);
