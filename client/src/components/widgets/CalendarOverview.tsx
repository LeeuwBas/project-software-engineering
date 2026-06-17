import { ArrowBigLeft, ArrowBigRight, Calendar } from 'lucide-react-native';
import { AppText } from '../AppText';
import { FlatList, Pressable, View } from 'react-native';
import { getGoalCalender } from '@/lib/api/APIBridge';
import { useMemo, useState, useEffect } from 'react';
import { AttachStep } from 'react-native-spotlight-tour';
import { useColorScheme } from 'nativewind';

export interface calendarCell {
  id: string;
  date: Date;
  value: number;
  currentDay: boolean;
  active: boolean;
  hidden: boolean;
}

const weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export default function CalendarOverview() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#f2f2f2' : '#555555';
  const today = useMemo(() => new Date(),[]);

  const [calendarData, updateCalendarData] = useState<any[]>([])

  // Memoization for calendar grid to only change when year or month changes
  // Prevent rerender when parent rerenders
  const { dayGrid, rangeStart, rangeEnd }  = useMemo(() => {
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

    return {dayGrid: grid, rangeStart, rangeEnd};
  }, [year, month]);


  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        updateCalendarData([]);

        if (dayGrid && dayGrid.length > 0) {
          const data = await getGoalCalender(
            new Date(rangeStart),
            new Date(rangeEnd),
          );
          updateCalendarData(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch calendar:", error);
      }
    };

    fetchCalendarData();
  }, [rangeStart, rangeEnd]);


  const toPrevMonth = () => {
    setCurrentDate(
      prev =>
        new Date(
          prev.getFullYear(),
          prev.getMonth() - 1,
          1
        )
    );
  };

  const toNextMonth = () => {
    setCurrentDate(
      prev =>
        new Date(
          prev.getFullYear(),
          prev.getMonth() + 1,
          1
        )
    );
  };

  return (
    <View>
      {/* Month/year displaty with arrow buttons */}
      <View className="mb-6 flex-row items-center gap-x-4 self-center">
        <Pressable onPress={() => setCurrentDate(new Date(year, month - 1))} hitSlop={12}>
          <ArrowBigLeft size={24} color={iconColor} />
        </Pressable>

        <AppText className="text-2xl font-bold">
          {currentDate.toLocaleDateString('en-US', { month: 'long' }) + ' ' + year}
        </AppText>

        <View style={{ width: 24 }}>
          {month !== today.getMonth() && (
            <Pressable onPress={() => setCurrentDate(new Date(year, month + 1))} hitSlop={12}>
              <ArrowBigRight size={24} color={iconColor} />
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
      <AttachStep index={6} fill>
        <FlatList
          data={dayGrid}
          numColumns={7}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          style={{ maxHeight: (dayGrid.length / 7) * 72 }} // Necesarry for the spotlight tutorial
          renderItem={({ item, index }) => (
            <View
<<<<<<< HEAD
              className={`m-1 h-16 flex-1 items-center justify-between gap-y-1 border-2
                    ${item.active ? 'border-border' : item.hidden ? 'border-transparent opacity-0' : 'border-transparent opacity-40'}
                    ${item.currentDay ? 'bg-secondary' : 'bg-card'}`}>
              <AppText className="self-end text-sm font-bold">
                {item.value || 'Placeholder'}
              </AppText>
              <View className="flex-row flex-wrap gap-1 self-start p-0.5">
                <View
                  className={`aspect-square h-[7px] border-[1px] ${dummy_data[item.date.toDateString()]['sleep'] ? 'bg-red-500' : 'hidden'}`}
                />
                <View
                  className={`aspect-square h-[7px] border-[1px] ${dummy_data[item.date.toDateString()]['water'] ? 'bg-blue-500' : 'hidden'}`}
                />
                <View
                  className={`aspect-square h-[7px] border-[1px] ${dummy_data[item.date.toDateString()]['steps'] ? 'bg-green-500' : 'hidden'}`}
                />
              </View>
=======
              className={`m-1 h-16 flex-1 items-center justify-between gap-y-1 border-2
                      ${item.active ? 'border-neutral-300' : item.hidden ? 'border-transparent opacity-0' : 'border-transparent opacity-40'}
                      ${item.currentDay ? 'bg-blue-300' : 'bg-slate-200'}`}>
              <AppText className="self-end text-sm font-bold">{item.value || 'Placeholder'}</AppText>
              {!item.hidden && (
                <View className="flex-row flex-wrap gap-1 self-start p-0.5">
                  <View
                    className={`aspect-square h-[7px] border-[1px] ${calendarData[index]?.sleep === 1 ? 'bg-red-500' : 'hidden'}`}
                  />
                  <View
                    className={`aspect-square h-[7px] border-[1px] ${calendarData[index]?.water === 1 ? 'bg-blue-500' : 'hidden'}`}
                  />
                  <View
                    className={`aspect-square h-[7px] border-[1px] ${calendarData[index]?.steps === 1? 'bg-green-500' : 'hidden'}`}
                  />
                </View>
              )}
>>>>>>> dev
            </View>
          )}
        />
      </AttachStep>
    </View>
  );
}
