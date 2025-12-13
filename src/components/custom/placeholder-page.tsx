import { APP_NAME } from "@/lib/constants";

export default function PlaceholderPage({ title = "PlaceholderPage" }) {
    return (
        <>
            <title>{`${title} | ${APP_NAME}`}</title>
            <div className="h-[90vh] w-full flex gap-2 flex-col items-center justify-center">
                <p className="font-karma font-semibold text-2xl">{title}</p>
            </div>
        </>
    )
}
