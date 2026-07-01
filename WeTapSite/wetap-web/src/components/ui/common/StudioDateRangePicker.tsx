import { InputField } from "../../form/InputField";

interface StudioDateRangePickerProps {
    from: string;
    to: string;
    onChange: (from: string, to: string) => void;
}

export function StudioDateRangePicker({ from, to, onChange }: StudioDateRangePickerProps) {
    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#1c1c20] p-4 rounded-[1.5rem] border border-zinc-800">
            <InputField
                label="Від"
                type="date"
                value={from}
                onChange={(e) => onChange(e.target.value, to)}
                wrapperClassName="w-full sm:w-auto"
                inputClassName="py-2 text-sm"
            />
            <InputField
                label="До"
                type="date"
                value={to}
                onChange={(e) => onChange(from, e.target.value)}
                wrapperClassName="w-full sm:w-auto"
                inputClassName="py-2 text-sm"
            />
        </div>
    );
}
