import { getGoalCalender } from '@/lib/api/APIBridge';
import { getActiveModules } from '@/lib/settings';
import { ModuleDefinition, MODULES } from '@/lib/types';
import { useColorScheme } from 'nativewind';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { AttachStep } from 'react-native-spotlight-tour';
import { AppText } from '../AppText';
import ChevronLeft from '@assets/icons/toolbar_icons/chevron_left.svg';
import ChevronRight from '@assets/icons/toolbar_icons/chevron_right.svg';

export interface calendarCell {
  id: string;
  date: Date;
  value: number;
  currentDay: boolean;
  active: boolean;
  hidden: boolean;
}

const weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

/** TODO (Dorus-vda): docstring, make sure to explain the @returns */
export default function CalendarOverview() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#f2f2f2' : '#555555';
  const today = useMemo(() => new Date(), []);

  const [calendarData, updateCalendarData] = useState<any[]>([]);

  const activeCalendarModules: ModuleDefinition[] = MODULES.filter(
    (module) => getActiveModules()[module.id] && module.id !== 'stress'
  );

  // Memoization for calendar grid to only change when year or month changes
  // Prevent rerender when parent rerenders
  const { dayGrid, rangeStart, rangeEnd } = useMemo(() => {
    const grid: calendarCell[] = [];
    const startDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;
    const totalDays = new Date(year, month + 1, 0).getDate();
    const totalPrev = new Date(year, month, 0).getDate(); // Total days in the previous month

    // Push filler cells to align correctly with weekdays
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const newDate: Date = new Date(year, month - 1, totalPrev - i);
      newDate.setHours(12, 0, 0, 0);
      const newCell: calendarCell = {
        id: `prevcell-${i}`,
        date: newDate,
        value: totalPrev - i,
        currentDay: false,
        active: false,
        hidden: false,
      };
      grid.push(newCell);
    }

    // Push cells of current month
    for (let i = 1; i <= totalDays; i++) {
      const newDate: Date = new Date(year, month, i);
      newDate.setHours(12, 0, 0, 0);
      const isToday: boolean =
        today.getDate() === i && today.getMonth() === month && today.getFullYear() === year;
      const newCell: calendarCell = {
        id: `currCell-${i}`,
        date: newDate,
        value: i,
        currentDay: isToday,
        active: true,
        hidden: false,
      };
      grid.push(newCell);
    }

    // Push cells of coming month
    for (let i = 1; i <= grid.length % 7; i++) {
      const newDate: Date = new Date(year, month + 1, i);
      newDate.setHours(12, 0, 0, 0);
      const newCell: calendarCell = {
        id: `nextCell-${i}`,
        date: newDate,
        value: i,
        currentDay: false,
        active: false,
        hidden: false,
      };
      grid.push(newCell);
    }

    const rangeStart = grid[0].date.toISOString();
    const rangeEnd = grid[grid.length - 1].date.toISOString();

    for (let i = grid.length; i < 42; i++) {
      const newCell: calendarCell = {
        id: `emptyCell-${i}`,
        date: currentDate,
        value: 0,
        currentDay: false,
        active: false,
        hidden: true,
      };
      grid.push(newCell);
    }

    return { dayGrid: grid, rangeStart, rangeEnd };
  }, [year, month]);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        updateCalendarData([]);

        if (dayGrid && dayGrid.length > 0) {
          const data = await getGoalCalender(new Date(rangeStart), new Date(rangeEnd));
          updateCalendarData(data || []);
        }
      } catch (error) {
        console.error('Failed to fetch calendar:', error);
      }
    };

    fetchCalendarData();
  }, [rangeStart, rangeEnd]);

  const toPrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const toNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  console.log(calendarData[today.getDate() - 1]); // Today

  return (
    <View>
      {/* Month/year displaty with arrow buttons */}
      <View className="mb-6 flex-row items-center gap-x-4 self-center">
        <Pressable onPress={toPrevMonth} hitSlop={12}>
          <ChevronLeft width={24} height={24} color={iconColor} />
        </Pressable>

        <AppText className="text-2xl font-bold">
          {currentDate.toLocaleDateString('en-US', { month: 'long' }) + ' ' + year}
        </AppText>

        <View style={{ width: 24 }}>
          {!(month === today.getMonth() && year === today.getFullYear()) && (
            <Pressable onPress={toNextMonth} hitSlop={12}>
              <ChevronRight width={24} height={24} color={iconColor} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Row of weekdays */}
      <View className="mb-2 flex-row">
        {weekdays.map((d) => (
          <View key={d} className="w-[14.2857%] items-center">
            <AppText className="font-bold">{d}</AppText>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <FlatList
        data={dayGrid}
        numColumns={7}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        style={{ maxHeight: (dayGrid.length / 7) * 72 }} // Necesarry for the spotlight tutorial
        renderItem={({ item, index }) => (
          <View
            className={`m-1 h-16 flex-1 items-center justify-between gap-y-1 border-2
                  ${item.active ? 'border-border' : item.hidden ? 'border-transparent opacity-0' : 'opacity-40'}
                  ${item.currentDay && 'border-primary-foreground'}
                  ${calendarData[index]?.stress === 2 ? 'bg-[#b41b21]/30' : calendarData[index]?.stress === 1 ? 'bg-[#FFFF00]/30' : calendarData[index]?.stress === 0 ? 'bg-[#22a022]/30' : ''} `}>
            <AppText className="m-1 mt-0 self-end text-sm font-bold">{item.value || 'Placeholder'}</AppText>
            {!item.hidden && (
              <View className="flex-row flex-wrap gap-1 self-start p-0.5">
                {activeCalendarModules.map(
                  (module) =>
                    calendarData[index]?.[module.id] === 1 && (
                      <View
                        key={module.id}
                        className={`aspect-square h-[7px] border-[1px]`}
                        style={{
                          backgroundColor: module.borderColor,
                        }}
                      />
                    )
                )}
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}
