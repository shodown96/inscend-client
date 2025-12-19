import { cn } from "@/lib/utils";

export default function SettingPill({
    id,
    label,
    active,
    onSelect
}: {
    id?: string
    label: string
    active: boolean,
    onSelect: (v: string) => void
}) {
    return (
        <div
            id={id}
            className={cn("border-r p-2 text-sm cursor-pointer", active ? 'bg-[#E6E7EC]' : 'bg-white text-gray-400')}
            onClick={() => onSelect(label)}>
            {label}
        </div>
    )
}
