import { ArrowBigLeft, ArrowBigRight } from 'lucide-react-native';
import { AppText } from '../AppText';
import { FlatList, Pressable, View } from 'react-native';
import { useMemo, useState } from 'react';
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
  const today = new Date();
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#f2f2f2' : '#555555';

  let last_day = null;
  let renderedDayAmount = 0;

  // Memoization for calendar grid to only change when year or month changes
  // Prevent rerender when parent rerenders
  const dayGrid = useMemo(() => {
    const grid: calendarCell[] = [];
    const startDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;
    const totalDays = new Date(year, month + 1, 0).getDate();
    const totalPrev = new Date(year, month, 0).getDate(); // Total days in the previous month

    // Push filler cells to align correctly with weekdays
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const newDate: Date = new Date(year, month, totalPrev - i);
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

    last_day = grid[-1];
    renderedDayAmount = grid.length;

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

    return grid;
  }, [year, month]);

  // const calendarStatData = getCalender(dayGrid[0].date, dayGrid[dayGrid.length - 1].date)
  // console.log(calendarStatData)

  const dummy_data = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Object.fromEntries(
      dayGrid.map((day) => {
        const cellDate = new Date(day.date);
        cellDate.setHours(0, 0, 0, 0);

        const isFuture = today < cellDate;

        return [
          day.date.toDateString(),
          {
            water: isFuture ? false : Math.random() < 0.5,
            steps: isFuture ? false : Math.random() < 0.5,
            sleep: isFuture ? false : Math.random() < 0.5,
          },
        ];
      })
    );
  }, [dayGrid, year, month]);

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
          renderItem={({ item }) => (
            <View
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
            </View>
          )}
        />
      </AttachStep>
    </View>
  );
}
