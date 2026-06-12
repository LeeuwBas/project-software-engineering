import { LucideIcon } from 'lucide-react-native';
import { SvgProps } from 'react-native-svg';

export type StatName = 'water' | 'sleep';

export interface barConfig {
  color: string;
  maxValue: number;
}

export interface StatInfo {
  title: string;
  unit: string;
  barconfig: barConfig;
}

export const STATS: Record<StatName, StatInfo> = {
  water: {
    title: 'Water drank',
    unit: 'glasses',
    barconfig: { color: '#74ccf4', maxValue: 20 },
  },
  sleep: {
    title: 'test title',
    unit: 'test unit',
    barconfig: { color: 'lightgrey', maxValue: 20 },
  },
};

export interface StatisticResponse {
  today: number;
  days_per_bin: number;
  bins: Record<string, number>;
  average: number;
  high: number;
  low: number;
}

export type HistoryPeriod = 'week' | 'month' | 'year';

export const PERIOD_CONFIG: Record<HistoryPeriod, any> = {
  week: {
    days: 7,
    bins: 7,
  },
  month: {
    days: 28,
    bins: 4,
  },
  year: {
    days: 360,
    bins: 12,
  },
};

export type TabId = 'calender' | StatName;

export type Tab = {
  id: TabId;
  icon: LucideIcon | React.FC<SvgProps>;
};
