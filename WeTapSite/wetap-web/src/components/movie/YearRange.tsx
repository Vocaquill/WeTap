interface Props {
    from?: string;
    to?: string;
    onChange: (from?: string, to?: string) => void;
}

const MIN_YEAR = 1950;
const MAX_YEAR = new Date().getFullYear();

export function YearRange({ from, to, onChange }: Props) {
    const fromYear = from ? Number(from) : MIN_YEAR;
    const toYear = to ? Number(to) : MAX_YEAR;

    const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFrom = Number(e.target.value);
        if (newFrom > toYear) {
            onChange(to, to);
        } else {
            onChange(String(newFrom), to);
        }
    };

    const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTo = Number(e.target.value);
        if (newTo < fromYear) {
            onChange(from, from);
        } else {
            onChange(from, String(newTo));
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-400">
                <span>{fromYear}</span>
                <span>{toYear}</span>
            </div>

            <input
                type="range"
                min={MIN_YEAR}
                max={MAX_YEAR}
                value={fromYear}
                onChange={handleFromChange}
                className="w-full accent-red-600"
            />

            <input
                type="range"
                min={MIN_YEAR}
                max={MAX_YEAR}
                value={toYear}
                onChange={handleToChange}
                className="w-full accent-red-600"
            />
        </div>
    );
}
