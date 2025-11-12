// // AnalyticsDashboard.tsx
// import { mainClient } from '@/lib/axios';
// import { API_ENDPOINTS } from '@/lib/constants';
// import { useEffect, useState } from 'react';


// // Types
// interface MetricData {
//   current: number;
//   previous: number;
//   label: string;
//   chartData?: ChartDataPoint[];
// }

// interface ChartDataPoint {
//   date: string;
//   value: number;
// }

// interface OrderStatuses {
//   payments: number;
//   delivery: number;
//   inWork: number;
//   delivered: number;
//   failed: number;
// }

// interface SalesDistribution {
//   location: string;
//   count: number;
//   revenue: number;
// }

// interface DashboardData {
//   salesTotal: MetricData;
//   orderStatuses: OrderStatuses;
//   totalProfit: MetricData;
//   customerStats: MetricData;
//   orderStats: MetricData;
//   avgOrderRevenue: MetricData;
//   salesDistribution: SalesDistribution[];
// }

// interface AnalyticsDashboardProps {
//   startDate?: Date;
//   endDate?: Date;
// }

// export default function AnalyticsDashboard({ 
//   startDate = new Date(new Date().setMonth(new Date().getMonth() - 1)),
//   endDate = new Date()
// }: AnalyticsDashboardProps) {
//   const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetchDashboardData();
//   }, [startDate, endDate]);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const r = await mainClient.get(API_ENDPOINTS.Analytics.Dashboard, {
//         params: {
//           startDate: startDate.toISOString(),
//           endDate: endDate.toISOString()
//         }
//       });

//       if (r.status === 200 && r.data.result) {
//         setDashboardData(r.data.result);
//       } else {
//         setError(r.data.message || 'Failed to fetch dashboard data');
//       }
//     } catch (err: any) {
//       console.error('Dashboard fetch error:', err);
//       setError(err.response?.data?.message || 'An error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculatePercentageChange = (current: number, previous: number): number => {
//     if (previous === 0) return 0;
//     return ((current - previous) / previous) * 100;
//   };

//   const formatCurrency = (value: number): string => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(value);
//   };

//   const formatNumber = (value: number): string => {
//     return new Intl.NumberFormat('en-US').format(Math.round(value));
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
//         <p className="text-red-800">{error}</p>
//         <button 
//           onClick={fetchDashboardData}
//           className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   if (!dashboardData) {
//     return <div>No data available</div>;
//   }

//   const salesChange = calculatePercentageChange(
//     dashboardData.salesTotal.current,
//     dashboardData.salesTotal.previous
//   );

//   const profitChange = calculatePercentageChange(
//     dashboardData.totalProfit.current,
//     dashboardData.totalProfit.previous
//   );

//   const customerChange = calculatePercentageChange(
//     dashboardData.customerStats.current,
//     dashboardData.customerStats.previous
//   );

//   const orderChange = calculatePercentageChange(
//     dashboardData.orderStats.current,
//     dashboardData.orderStats.previous
//   );

//   const avgRevenueChange = calculatePercentageChange(
//     dashboardData.avgOrderRevenue.current,
//     dashboardData.avgOrderRevenue.previous
//   );

//   return (
//     <div className="min-h-screen overflow-scroll bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">

//         {/* Metrics Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//           <MetricCard
//             title="Total Profit"
//             label={dashboardData.totalProfit.label}
//             current={dashboardData.totalProfit.current}
//             previous={dashboardData.totalProfit.previous}
//             change={profitChange}
//             chartData={dashboardData.totalProfit.chartData}
//             formatValue={formatCurrency}
//           />
//           <MetricCard
//             title="Customer"
//             label={dashboardData.customerStats.label}
//             current={dashboardData.customerStats.current}
//             previous={dashboardData.customerStats.previous}
//             change={customerChange}
//             chartData={dashboardData.customerStats.chartData}
//             formatValue={formatNumber}
//           />
//           <MetricCard
//             title="Order"
//             label={dashboardData.orderStats.label}
//             current={dashboardData.orderStats.current}
//             previous={dashboardData.orderStats.previous}
//             change={orderChange}
//             chartData={dashboardData.orderStats.chartData}
//             formatValue={formatNumber}
//           />
//           <MetricCard
//             title="Avg. Order Revenue"
//             label={dashboardData.avgOrderRevenue.label}
//             current={dashboardData.avgOrderRevenue.current}
//             previous={dashboardData.avgOrderRevenue.previous}
//             change={avgRevenueChange}
//             chartData={dashboardData.avgOrderRevenue.chartData}
//             formatValue={formatCurrency}
//           />
//         </div>

//         {/* Sales Distribution Map Placeholder */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Distribution of sales globally</h2>
//           <div className="h-96 bg-gray-100 rounded flex items-center justify-center">
//             <div>
//               <p className="text-gray-500 text-center">Map Component</p>
//               <p className="text-sm text-gray-400 text-center mt-2">
//                 {dashboardData.salesDistribution.length} locations
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Status Card Component
// interface StatusCardProps {
//   icon: string;
//   label: string;
//   count: number;
// }

// function StatusCard({ icon, label, count }: StatusCardProps) {
//   return (
//     <div className="bg-white rounded-lg shadow p-4 text-center">
//       <div className="text-2xl mb-2">{icon}</div>
//       <div className="text-3xl font-bold text-gray-900">{count}</div>
//       <div className="text-sm text-gray-600 mt-1">{label}</div>
//     </div>
//   );
// }

// // Metric Card Component
// interface MetricCardProps {
//   title: string;
//   label: string;
//   current: number;
//   previous: number;
//   change: number;
//   chartData?: ChartDataPoint[];
//   formatValue: (value: number) => string;
// }

// function MetricCard({ 
//   title, 
//   label, 
//   current, 
//   previous, 
//   change, 
//   chartData,
//   formatValue 
// }: MetricCardProps) {
//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <div className="flex items-start justify-between mb-4">
//         <h3 className="text-sm font-medium text-gray-600">{title}: {label}</h3>
//         <button className="text-gray-400 hover:text-gray-600">⋮</button>
//       </div>
      
//       <div className="mb-4">
//         <p className="text-3xl font-bold text-gray-900">{formatValue(current)}</p>
//         <div className="flex items-center mt-2">
//           <p className="text-sm text-gray-600">{formatValue(previous)}</p>
//           <span className={`ml-2 text-sm font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//             {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
//           </span>
//         </div>
//         <p className="text-xs text-gray-500 mt-1">{label}</p>
//       </div>

//       {/* Simple Chart Visualization */}
//       {chartData && chartData.length > 0 && (
//         <div className="h-20">
//           <SimpleLineChart data={chartData} color={change >= 0 ? '#10b981' : '#ef4444'} />
//         </div>
//       )}
//     </div>
//   );
// }

// // Simple Line Chart Component
// interface SimpleLineChartProps {
//   data: ChartDataPoint[];
//   color: string;
// }

// function SimpleLineChart({ data, color }: SimpleLineChartProps) {
//   if (data.length === 0) return null;

//   const maxValue = Math.max(...data.map(d => d.value));
//   const minValue = Math.min(...data.map(d => d.value));
//   const range = maxValue - minValue || 1;

//   const points = data.map((point, index) => {
//     const x = (index / (data.length - 1)) * 100;
//     const y = 100 - ((point.value - minValue) / range) * 100;
//     return `${x},${y}`;
//   }).join(' ');

//   return (
//     <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
//       <polyline
//         fill="none"
//         stroke={color}
//         strokeWidth="2"
//         points={points}
//       />
//     </svg>
//   );
// }
