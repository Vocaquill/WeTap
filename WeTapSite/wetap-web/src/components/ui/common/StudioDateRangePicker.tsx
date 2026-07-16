import { InputField } from "../../form/InputField";

interface StudioDateRangePickerProps {
    from: string;
    to: string;
    onChange: (from: string, to: string) => void;
}

export function StudioDateRangePicker({ from, to, onChange }: StudioDateRangePickerProps) {
    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-zinc-900 p-4 rounded-[1.5rem] border border-zinc-800/80">
            <InputField
                label="Від"
                type="date"
                value={from}
                onChange={(e) => onChange(e.target.value, to)}
                wrapperClassName="w-full sm:w-auto"
                inputClassName="py-2 text-sm bg-zinc-950 text-zinc-100 border-zinc-800/80 focus:border-zinc-500 focus:ring-zinc-500/20 [color-scheme:dark]"
            />
            <InputField
                label="До"
                type="date"
                value={to}
                onChange={(e) => onChange(from, e.target.value)}
                wrapperClassName="w-full sm:w-auto"
                inputClassName="py-2 text-sm bg-zinc-950 text-zinc-100 border-zinc-800/80 focus:border-zinc-500 focus:ring-zinc-500/20 [color-scheme:dark]"
            />
        </div>
    );
}