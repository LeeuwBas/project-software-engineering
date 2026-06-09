import { StatisticMetadata } from '@/lib/stats/statistics-types';

/**
Holds all module metadata used to call API using the
'id' field and for display purposes using both 'title'
and 'unit' fields.

Add entries for new modules here (hardcoded for now).
*/
export const STATISTICS: StatisticMetadata[] = [
  {
    id: 'water',
    title: 'Water Drank',
    unit: 'glasses',
  },
  {
    id: 'running',
    title: 'Kilometers Ran',
    unit: 'km',
  },
  {
    id: 'math',
    title: 'Hours of math',
    unit: 'hours',
  },
  {
    id: 'sleep',
    title: 'Hours of sleep',
    unit: 'hours',
  }
];
