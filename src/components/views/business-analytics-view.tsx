import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { clamp, dateLabel, fmtCompact, fmtCurrency, fmtPct, getSeverityMeta, scoreFromInputs } from "@/lib/analytics-utils";
import { cn } from "@/lib/utils";
import type { BusinessAnalyticsResult, IssueResult } from "@/types/analytics";
import React, { useMemo } from "react";

type BusinessinsightsViewProps = {
    analytics: BusinessAnalyticsResult;
    issues: IssueResult;
    onAskBrainstorm?: () => void;
    onViewFullReport?: () => void;
    onSeeAllActions?: () => void;
    onPrimaryAction?: (issueId: string) => void;
    onSecondaryAction?: (issueId: string) => void;
};



function Ring({ value }: { value: number }) {
    const v = clamp(value, 0, 100);
    const r = 18;
    const c = 2 * Math.PI * r;
    const dash = (v / 100) * c;

    return (
        <div className="relative h-12 w-12">
            <svg viewBox="0 0 48 48" className="h-12 w-12">
                <circle cx="24" cy="24" r={r} fill="none" strokeWidth="6" className="stroke-slate-200" />
                <circle
                    cx="24"
                    cy="24"
                    r={r}
                    fill="none"
                    strokeWidth="6"
                    strokeDasharray={`${dash} ${c - dash}`}
                    strokeLinecap="round"
                    className="stroke-slate-900"
                    transform="rotate(-90 24 24)"
                />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-xs font-semibold text-slate-900">
                {v}%
            </div>
        </div>
    );
}

function MetricCard({
    title,
    value,
    deltaLabel,
    actionLabel,
    onAction,
}: {
    title: string;
    value: React.ReactNode;
    deltaLabel?: React.ReactNode;
    actionLabel?: string;
    onAction?: () => void;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-700">{title}</div>
                    <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
                    {deltaLabel ? <div className="mt-2 text-xs text-slate-500">{deltaLabel}</div> : null}
                </div>
                {actionLabel ? (
                    <Button variant="outline" size="sm" onClick={onAction} className="rounded-xl">
                        {actionLabel}
                    </Button>
                ) : null}
            </div>
        </div>
    );
}

function ActionRow({
    issue,
    primaryLabel,
    secondaryLabel,
    onPrimary,
    onSecondary,
}: {
    issue: IssueResult['issues'][0];
    primaryLabel: string;
    secondaryLabel: string;
    onPrimary?: () => void;
    onSecondary?: () => void;
}) {
    const meta = getSeverityMeta(issue.severity);

    return (
        <div className="flex items-center justify-between gap-4 py-5">
            <div className="flex items-start gap-3 min-w-0">
                <div className={cn("mt-1 h-4 w-4 rounded-full", meta.dot)} />
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold", meta.pill)}>
                            {meta.label}
                        </span>
                        <div className="truncate text-sm font-semibold text-slate-900">{issue.title}</div>
                    </div>

                    <div className="mt-2 text-sm text-slate-600">
                        {issue.evidence?.[0] ?? "Needs attention"}{" "}
                        {typeof issue.metric?.value === "number" ? (
                            <span className="text-slate-500">(impact: {fmtCompact(issue.metric.value)})</span>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <Button
                    className="rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                    size="sm"
                    onClick={onPrimary}
                >
                    {primaryLabel}
                </Button>
                <Button variant="outline" className="rounded-xl" size="sm" onClick={onSecondary}>
                    {secondaryLabel}
                </Button>
            </div>
        </div>
    );
}

export function BusinessInsightsView({
    analytics,
    issues,
    onAskBrainstorm,
    onViewFullReport,
    onSeeAllActions,
    onPrimaryAction,
    onSecondaryAction,
}: BusinessinsightsViewProps) {
    console.log("BusinessInsightsView")
    const health = useMemo(() => scoreFromInputs(analytics, issues), [analytics, issues]);

    const urgentCount = issues.issues.filter(i => (i.severity || "").toLowerCase() === "high").length;
    const opportunityCount = issues.issues.filter(i => (i.severity || "").toLowerCase() === "medium").length;
    const winCount = issues.issues.filter(i => (i.severity || "").toLowerCase() === "low").length;

    const topActions = issues.issues.slice(0, 3);

    return (
        <div className="space-y-5">
            {/* Overall Business Health */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <Ring value={health.score} />
                        <div>
                            <div className="text-lg font-semibold text-slate-900">
                                Overall Business Health: <span className="uppercase">{health.label}</span>
                            </div>
                            <div className="mt-1 text-sm text-slate-600">
                                <span className="font-medium">{issues.issues.length}</span> issues need attention{" "}
                                <span className="mx-2 text-slate-300">|</span>
                                <span className="font-medium">{opportunityCount + winCount}</span> opportunities available
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                                Period: {analytics.period.label} ({dateLabel(analytics.period.start)} - {dateLabel(analytics.period.end)})
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {/* <Button
                            className="rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                            onClick={onAskBrainstorm}
                        >
                            Ask Brainstorm
                        </Button> */}
                        <Button variant="outline" className="rounded-xl" onClick={onViewFullReport}>
                            View Full Report
                        </Button>
                    </div>
                </div>
            </div>

            {/* Top Actions */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div className="text-sm font-semibold text-slate-900">Top Actions to Boost Your Numbers</div>
                    <button
                        type="button"
                        onClick={onSeeAllActions}
                        className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"
                    >
                        {/* See All ({issues.issues.length}) <ChevronRight className="h-4 w-4" /> */}
                    </button>
                </div>

                <div className="divide-y divide-slate-200 px-5">
                    {topActions.length === 0 ? (
                        <div className="py-10 text-center text-sm text-slate-600">
                            No actions yet. Once we detect signals, you’ll see recommended next steps here.
                        </div>
                    ) : (
                        topActions.map((issue) => (
                            <ActionRow
                                key={issue.id}
                                issue={issue}
                                primaryLabel="Take Action"
                                secondaryLabel="Learn Why"
                                onPrimary={() => onPrimaryAction?.(issue.id)}
                                onSecondary={() => onSecondaryAction?.(issue.id)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Funnel cards (strict Admin-only: attempts may be null) */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                    title="Checkout Attempts"
                    value={analytics.funnel.checkoutAttempts == null ? "—" : fmtCompact(analytics.funnel.checkoutAttempts)}
                    deltaLabel="Admin-only: requires storefront tracking for accuracy"
                    actionLabel="Ask Brainstorm"
                    onAction={onAskBrainstorm}
                />
                <MetricCard
                    title="Products Sold"
                    value={fmtCompact(analytics.funnel.productsSold)}
                    deltaLabel={`Conversion: ${fmtPct(analytics.funnel.conversionRate)}`}
                    actionLabel="View Product"
                />
                <MetricCard
                    title="Add to Cart Attempts"
                    value={analytics.funnel.addToCartAttempts == null ? "—" : fmtCompact(analytics.funnel.addToCartAttempts)}
                    deltaLabel="Admin-only: requires storefront tracking for accuracy"
                    actionLabel="Improve CTAs"
                />
                <MetricCard
                    title="Purchases"
                    value={fmtCompact(analytics.funnel.purchases)}
                    deltaLabel={`Orders: ${fmtCompact(analytics.sales.totalOrders)}`}
                    actionLabel="Fix Checkout"
                />
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <MetricCard
                    title="Total Sales"
                    value={fmtCurrency(analytics.sales.totalSales, analytics.sales.currency)}
                    deltaLabel={`Avg order: ${fmtCurrency(analytics.sales.averageOrderValue, analytics.sales.currency)}`}
                    actionLabel="View Breakdown"
                />
                <MetricCard
                    title="Conversion Rate"
                    value={fmtPct(analytics.funnel.conversionRate)}
                    deltaLabel={`${urgentCount} urgent • ${opportunityCount} opportunities • ${winCount} wins`}
                    actionLabel="Recover Carts"
                    onAction={onAskBrainstorm}
                />
                <MetricCard
                    title="Total Orders"
                    value={fmtCompact(analytics.sales.totalOrders)}
                    deltaLabel={`Purchases: ${fmtCompact(analytics.funnel.purchases)}`}
                    actionLabel="View Orders"
                />
            </div>

            {/* Customer cards */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <MetricCard
                    title="Repeat Customer Rate"
                    value={fmtPct(analytics.customers.repeatCustomerRate)}
                    deltaLabel={`${analytics.customers.repeatCustomers} repeat customers out of ${analytics.customers.totalCustomers}`}
                    actionLabel="View Customers"
                />
                <MetricCard
                    title="Avg Customer Lifetime Value"
                    value={fmtCurrency(analytics.customers.averageLifetimeValue, analytics.sales.currency)}
                    deltaLabel="Based on customers who purchased in this period"
                    actionLabel="Upsell Strategy"
                    onAction={onAskBrainstorm}
                />
                <MetricCard
                    title="Inventory"
                    value={`${issues.debug.inventory.outOfStockCount} OOS • ${issues.debug.inventory.lowStockCount} Low`}
                    deltaLabel={`${issues.debug.inventory.totalProducts} products tracked`}
                    actionLabel="Inventory"
                />
            </div>

            {/* Optional: Evidence drawer style */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">Issues Needing Attention</div>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                    {issues.issues.slice(0, 6).map((i) => (
                        <div key={i.id} className="rounded-xl border border-slate-200 p-4">
                            <div className="flex items-center justify-between gap-2">
                                <div className="text-sm font-semibold text-slate-900">{i.title}</div>
                                <span className="text-xs font-semibold text-slate-500">{(i.severity || "").toUpperCase()}</span>
                            </div>

                            <div className="mt-2 text-sm text-slate-600">{i.recommendedAction}</div>

                            {i.evidence?.length ? (
                                <div className="mt-3">
                                    <div className="text-xs font-semibold text-slate-700">Evidence</div>
                                    <ScrollArea className="mt-2 h-20">
                                        <ul className="list-disc space-y-1 pl-5 text-xs text-slate-600">
                                            {i.evidence.map((e, idx) => (
                                                <li key={idx}>{e}</li>
                                            ))}
                                        </ul>
                                    </ScrollArea>
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
