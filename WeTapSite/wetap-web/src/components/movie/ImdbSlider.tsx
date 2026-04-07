interface Props {
    value?: string;
    onChange: (value?: string) => void;
}

export function ImdbSlider({ value, onChange }: Props) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-400">
                <span>IMDb ≥ {value ?? 0}</span>
                <span>10</span>
            </div>

            <input
                type="range"
                min={0}
                max={10}
                step={0.1}
                value={value ?? 0}
                onChange={(e) => onChange(e.target.value)}
                className="w-full accent-red-600"
            />
        </div>
    );
}
