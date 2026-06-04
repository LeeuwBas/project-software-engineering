import { StatisticCard } from '@/components/stats/statistic-card'
import { StatisticData } from '@/components/stats/statistics-types';

export function Statistics() {
  const statistics: StatisticData[] = [
    {
      id: 'water',
      title: 'Water Drank',
      unit: 'Glasses',
      current: 2,
      history: [
        { day: 'Mon', value: 4 },
        { day: 'Tue', value: 8 },
        { day: 'Wed', value: 9 },
        { day: 'Thu', value: 2 },
        { day: 'Fri', value: 0 },
        { day: 'Sat', value: 5 },
        { day: 'Sun', value: 1 },
      ],
    },
    {
      id: 'ran',
      title: 'Miles Ran',
      unit: 'km',
      current: 2.4,
      history: [
        { day: 'Mon', value: 10.3 },
        { day: 'Tue', value: 4.5 },
        { day: 'Wed', value: 2.0 },
        { day: 'Thu', value: 2.2 },
        { day: 'Fri', value: 7.3 },
        { day: 'Sat', value: 9.3 },
        { day: 'Sun', value: 1.4 },
      ],
    }
  ];

  return (
    <>
      {statistics.map(stat => (
        <StatisticCard key={stat.id} stat={stat} />
      ))}
    </>
  );
}
