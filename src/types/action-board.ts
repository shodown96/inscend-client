export interface GenerateActionCardResult {
  success: boolean;
  cards: ActionCard[];
  total_cards: number;
  total_potential_revenue: number;
  total_revenue_at_risk: number;
}

export type ActionCardType = "restock_alert" |
  "customer_reminder" |
  "discount_opportunity" |
  "sales_target" |
  "inventory_alert" |
  "retention_alert" |
  "upsell_opportunity" |
  "seasonal_trend"

export interface ActionCard {
  card_id: string;
  type: ActionCardType;
  priority: string;
  title: string;
  primary_metric: Primarymetric;
  action_type: string;
  action_label: string;
  revenue_at_risk: number;
  confidence_score: number;
  reasoning: string;
  data_points: string[];
  entities: Entities;
}

interface Entities {
  product_ids: string[];
}

interface Primarymetric {
  label: string;
  value: number;
  currency: string;
}