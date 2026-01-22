export interface IssueResult {
  generatedAt: string;
  issues: Issue[];
  debug: Debug;
}

interface Debug {
  thisMonth: ThisMonth;
  lastMonth: ThisMonth;
  counts: Counts;
  inventory: Inventory;
}

interface Inventory {
  totalProducts: number;
  outOfStockCount: number;
  lowStockCount: number;
}

interface Counts {
  sales: number;
  pending: number;
  cancelled: number;
  refunded: number;
}

interface ThisMonth {
  start: string;
  end: string;
}

interface Issue {
  id: string;
  title: string;
  severity: string;
  metric: Metric;
  evidence: string[];
  recommendedAction: string;
}

interface Metric {
  name: string;
  value: number;
}


export interface BusinessAnalyticsResult {
  generatedAt: string;
  period: Period;
  funnel: Funnel;
  sales: Sales;
  customers: Customers;
}

interface Customers {
  repeatCustomerRate: number;
  averageLifetimeValue: number;
  totalCustomers: number;
  repeatCustomers: number;
}

interface Sales {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  currency: string;
}

interface Funnel {
  checkoutAttempts: number;
  productsSold: number;
  addToCartAttempts: number;
  purchases: number;
  conversionRate: number;
}

interface Period {
  start: string;
  end: string;
  label: string;
}