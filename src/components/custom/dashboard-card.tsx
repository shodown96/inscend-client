import { cn } from "@/lib/utils"

export default function DashboardCard({ title, description, bordered }: {
    title: string,
    description: string | number
    bordered?: boolean
}) {
    return (
        <div className={cn("p-3 col-span-4", bordered ? 'border-r' : '')}>
            <div className="text-sm font-semibold mb-2">{title}</div>
            <div className="text-lg">{description}</div>
        </div>
    )
}
