import { cn } from "@/lib/utils"

export default function DashboardCard({ title, description, bordered, className }: {
    title: string,
    description: string | number
    bordered?: boolean
    className?:string
}) {
    return (
        <div className={cn("p-3 col-span-3", bordered ? 'border-r' : '', className)}>
            <div className="text-sm font-semibold mb-2">{title}</div>
            <div className="text-lg">{description}</div>
        </div>
    )
}
