import { Search } from "lucide-react";

export default function SearchInput({ value, onValueChange }: {
    value?: string,
    onValueChange?: (v: string) => void
}) {
    return (
        <div className="bg-[#FAFAFA] rounded-lg flex gap-2 items-center px-4 py-2 border">
            <Search className="" />
            <input type="text" className="outline-none w-full"
                placeholder="Search"
                value={value} onChange={e => {
                    if (onValueChange) {
                        onValueChange(e.target.value)
                    }
                }} />
        </div>
    )
}
