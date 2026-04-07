import type { ChangeEvent } from 'react';

interface FileUploadFieldProps {
    label: string;
    name: string;
    accept?: string;
    required?: boolean;
    error?: string[];
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const FileUploadField = ({
                                    label,
                                    name,
                                    accept,
                                    required = false,
                                    error,
                                    onChange,
                                }: FileUploadFieldProps) => (
    <div className="flex flex-col">
        <label className="text-zinc-400 mb-1 font-semibold">{label}</label>

        <input
            type="file"
            name={name}
            accept={accept}
            required={required}
            onChange={onChange}
            className={`bg-zinc-900 rounded-xl px-4 py-2 cursor-pointer border transition
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
