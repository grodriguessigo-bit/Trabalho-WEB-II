export interface DailyRevenueItem {
  date: string;
  amount: number;
}

export interface DailyRevenueReport {
  items: DailyRevenueItem[];
  total: number;
}

export interface CategoryRevenueItem {
  categoryId: number;
  categoryName: string;
  requestsCount: number;
  amount: number;
}

export interface CategoryRevenueReport {
  items: CategoryRevenueItem[];
  total: number;
}
