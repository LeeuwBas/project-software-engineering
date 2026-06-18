import { GoaledStatisticBridge, stepsBridge, waterBridge } from '@/lib/api/APIBridge';
import { LucideIcon } from 'lucide-react-native';
import { SvgProps } from 'react-native-svg';

export type StatName = 'water' | 'steps';

export interface barConfig {
    barcolor: string;
    goalcolor: string;
}

export interface StatInfo {
    title: string;
    unit: string;
    barconfig: barConfig;
    bridge: GoaledStatisticBridge;
}

export const STATS: Record<StatName, StatInfo> = {
    water: {
        title: 'Water drank',
        unit: 'glasses',
        barconfig: { barcolor: '#74ccf4', goalcolor: '#15a4e6' },
        bridge: waterBridge,
    },
    steps: {
        title: 'Steps walked',
        unit: 'steps',
        barconfig: { barcolor: '#b5ff00', goalcolor: '#49e40c' },
        bridge: stepsBridge,
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
