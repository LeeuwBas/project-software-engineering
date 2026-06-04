export interface StatisticHistoryPoint {
  day: string;
  value: number;
}

export interface StatisticData {
  id: string;
  title: string;
  unit: string;
  current: number;
  history: StatisticHistoryPoint[];
}