import { type ChangeEvent, useRef, useState, useCallback } from 'react';

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
}: FileUploadFieldProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e);
    };

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const file = e.dataTransfer.files?.[0];
            if (!file || !inputRef.current) return;

            if (accept) {
                const acceptedTypes = accept.split(',').map((t) => t.trim());
                const isAccepted = acceptedTypes.some((type) => {
                    if (type.startsWith('.')) {
                        return file.name.toLowerCase().endsWith(type.toLowerCase());
                    }
                    if (type.endsWith('/*')) {
                        return file.type.startsWith(type.replace('/*', '/'));
                    }
                    return file.type === type;
                });
                if (!isAccepted) return;
            }

            const dt = new DataTransfer();
            dt.items.add(file);
            inputRef.current.files = dt.files;

            const syntheticEvent = new Event('change', { bubbles: true });
            Object.defineProperty(syntheticEvent, 'target', {
                writable: false,
                value: inputRef.current,
            });
            inputRef.current.dispatchEvent(syntheticEvent);

            const fakeEvent = {
                target: inputRef.current,
                currentTarget: inputRef.current,
                nativeEvent: syntheticEvent,
                bubbles: true,
                cancelable: false,
                defaultPrevented: false,
                eventPhase: 0,
                isTrusted: true,
                preventDefault: () => {},
                isDefaultPrevented: () => false,
                stopPropagation: () => {},
                isPropagationStopped: () => false,
                persist: () => {},
                timeStamp: Date.now(),
                type: 'change',
            } as unknown as ChangeEvent<HTMLInputElement>;

            onChange(fakeEvent);
        },
        [accept, onChange]
    );

    const hasError = !!error;

    return (
        <div className="flex flex-col gap-1 w-full">
            <label className="text-zinc-400 font-semibold text-sm">{label}</label>

            <div
                role="button"
                tabIndex={0}
                aria-label={`Завантажити файл: ${label}`}
                onClick={handleClick}
                onKeyDown={(e) => e.key === 'Enter' && handleClick()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={[
                    'relative flex flex-col items-center justify-center gap-2',
                    'w-full min-h-[90px] px-4 py-5',
                    'rounded-xl cursor-pointer select-none',
                    'border-2 border-dashed transition-colors duration-200',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500',
                    isDragging
                        ? 'border-zinc-400 bg-zinc-800/60'
                        : hasError
                        ? 'border-red-500/70 bg-zinc-900/50 hover:border-red-400'
                        : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-500 hover:bg-zinc-800/40',
                ].join(' ')}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-7 h-7 shrink-0 transition-colors duration-200 ${
                        isDragging ? 'text-zinc-300' : 'text-zinc-500'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                </svg>

                <span className="text-zinc-500 text-sm text-center leading-snug">
                    <span className="text-zinc-300 font-medium">Оберіть файл</span>{' '}
                    або перетягніть сюди
                </span>
            </div>

            <input
                ref={inputRef}
                type="file"
                name={name}
                accept={accept}
                required={required}
                onChange={handleChange}
                className="hidden"
            />

            {hasError && (
                <span className="text-red-500 text-sm">{error![0]}</span>
            )}
        </div>
    );
};
