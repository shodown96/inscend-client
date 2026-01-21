import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

export type MonthPair = { thisMonth: number; lastMonth: number };
export type OverviewCardsProps = {
  data: OverviewMetrics;
  // optional: pass sparklines for each card (recommended)
  series?: Partial<{
    totalProfit: SparkPoint[];
    customersCount: SparkPoint[];
    orders: SparkPoint[];
    averageOrderRevenue: SparkPoint[];
  }>;
  currencySymbol?: string; // "$"
  currencySuffix?: string; // " CAD" if you want
};
export type OverviewMetrics = {
  paidOrders: number;
  failedOrders: number;
  pendingOrders: number;
  customersCount: MonthPair;
  averageOrderRevenue: MonthPair;
  totalProfit: MonthPair;
};

type SparkPoint = { value: number };

type MetricSparkCardProps = {
  title: string;
  monthLabel: string; // "Aug 2025"
  metric: MonthPair;
  prevLabel: string; // "Jul 2025"
  prefix?: string; // "$"
  suffix?: string; // " CAD"
  accent?: "green" | "blue" | "orange";
  series: SparkPoint[];
  className?: string;
};

const ACCENT = {
  green: "#22c55e",
  blue: "#3b82f6",
  orange: "#f97316",
};

const formatMetric = (
  value: number,
  { prefix, suffix }: { prefix?: string; suffix?: string }
) => {
  const n = Number.isFinite(value) ? value : 0;
  return `${prefix ?? ""}${n.toLocaleString()}${suffix ?? ""}`;
};

export function MetricSparkCard({
  title,
  monthLabel,
  metric,
  prevLabel,
  prefix,
  suffix,
  accent = "green",
  series,
}: MetricSparkCardProps) {
  const stroke = ACCENT[accent];

  return (
    <div
      className={"rounded-lg border bg-white p-5"}
    >
      <div className="flex items-center gap-2">
        <h3 className="truncate0 text-sm font-semibold text-slate-900">
          {title}: {monthLabel}
        </h3>
      </div>

      <div className="flex gap-4">
        <div>
          <div className="mt-6 text-3xl font-semibold tracking-tight text-slate-900">
            {formatMetric(metric.thisMonth, { prefix, suffix })}
          </div>

          <div className="mt-3 text-sm text-slate-500">
            <div className="font-medium">
              {formatMetric(metric.lastMonth, { prefix, suffix })}
            </div>
            <div>{prevLabel}</div>
          </div>
        </div>

        <div className="h-[120px] w-[120px] flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <Tooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const val = payload[0]?.value as number | undefined;
                  if (val === undefined) return null;
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
                      <div className="text-slate-500">Value</div>
                      <div className="font-semibold text-slate-900">
                        {formatMetric(val, { prefix, suffix })}
                      </div>
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={stroke}
                strokeWidth={3}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
