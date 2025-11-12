import { cn } from "@/lib/utils";

export default function SelectPill({
    label,
    active,
    onSelect
}: {
    label: string
    active: boolean,
    onSelect: (v: string) => void
}) {
    return (
        <div
            className={cn("border-r p-2 text-sm cursor-pointer", active ? 'bg-white' : '')}
            onClick={() => onSelect(label)}>
            {label}
        </div>
    )
}
