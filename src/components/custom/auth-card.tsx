import { cn } from '@/lib/utils'
import { type PropsWithChildren } from 'react'

export default function AuthCard({
    title = "",
    description = "",
    children,
    goBack,
    className,
}: PropsWithChildren & {
    title?: string,
    description?: string,
    className?: string
    goBack?: () => void
}) {
    return (
        <div className={cn(
            'p-8 border rounded-lg bg-white h-max max-md:w-[320px] md:min-w-lg',
            className
        )}>
            {goBack ? (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className='mb-4 cursor-pointer max-md:size-6' onClick={goBack}>
                    <path d="M3.05727 16.9427C2.53657 16.422 2.53657 15.5778 3.05727 15.0571L8.39061 9.72378C8.9113 9.20308 9.75553 9.20308 10.2762 9.72378C10.7969 10.2445 10.7969 11.0887 10.2762 11.6094L7.21903 14.6666L28.0001 14.6666C28.7365 14.6666 29.3334 15.2635 29.3334 15.9999C29.3334 16.7363 28.7365 17.3333 28.0001 17.3333L7.21903 17.3333L10.2762 20.3904C10.7969 20.9111 10.7969 21.7554 10.2762 22.2761C9.75553 22.7968 8.9113 22.7968 8.3906 22.2761L3.05727 16.9427Z" fill="#101928" />
                </svg>
            ) : null}
            {title ? (
                <div className="mb-4">
                    <h4 className="font-semibold text-lg md:text-2xl">{title}</h4>
                    {description ? <p className="text-sm">{description}</p> : null}
                </div>
            ) : null}
            {children}
        </div>
    )
}
