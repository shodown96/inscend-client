import type { BusinessAnalyticsResult, IssueResult } from "@/types/analytics";

export const fmtCurrency = (n: number, currency: string) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency }).format(
        Number.isFinite(n) ? n : 0
    );

export const fmtCompact = (n: number) =>
    new Intl.NumberFormat("en-CA", { notation: "compact" }).format(
        Number.isFinite(n) ? n : 0
    );

export const fmtPct = (n01: number) => `${((Number.isFinite(n01) ? n01 : 0) * 100).toFixed(2)}%`;

export const dateLabel = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
};

export function getSeverityMeta(sev: string) {
    const s = (sev || "").toLowerCase();
    if (s === "high" || s === "urgent")
        return { label: "URGENT", dot: "bg-red-500", pill: "bg-red-50 text-red-700 border-red-200" };
    if (s === "medium" || s === "amber")
        return { label: "OPPORTUNITY", dot: "bg-amber-400", pill: "bg-amber-50 text-amber-800 border-amber-200" };
    return { label: "WIN", dot: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-800 border-emerald-200" };
}

export function scoreFromInputs(analytics: BusinessAnalyticsResult, issues: IssueResult) {
    // Lightweight "health score" (0..100) using only your current inputs.
    // You can swap this when Inscend/AI provides a real score.
    const { sales, funnel, customers } = analytics;

    const issuesPenalty = Math.min(30, issues.issues.length * 6);

    // Scale: normalize to avoid a single metric dominating
    const conv = clamp01(funnel.conversionRate) * 100; // 0..100
    const repeat = clamp01(customers.repeatCustomerRate) * 100; // 0..100

    // Sales momentum proxy: purchases (cap at 100 orders for scoring)
    const ordersScore = Math.min(100, (sales.totalOrders / 100) * 100);

    // Inventory penalty based on out-of-stock ratio if available in debug
    const inv = issues.debug.inventory;
    const oosRatio = inv.totalProducts > 0 ? inv.outOfStockCount / inv.totalProducts : 0;
    const invPenalty = Math.min(20, oosRatio * 100); // up to -20

    const raw = 0.35 * conv + 0.25 * repeat + 0.25 * ordersScore + 0.15 * 100;
    const final = Math.round(clamp(raw - issuesPenalty - invPenalty, 0, 100));

    const label = final >= 80 ? "STRONG" : final >= 60 ? "GOOD" : final >= 40 ? "NEEDS ATTENTION" : "AT RISK";
    return { score: final, label };
}

export function clamp(n: number, a: number, b: number) {
    return Math.min(b, Math.max(a, n));
}
export function clamp01(n: number) {
    return clamp(n, 0, 1);
}