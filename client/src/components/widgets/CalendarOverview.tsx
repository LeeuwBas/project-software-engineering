import { ArrowBigLeft, ArrowBigRight, Square } from "lucide-react-native"
import { AppText } from "../AppText"
import { FlatList, View, Pressable } from "react-native"
import { useMemo, useState } from "react";

export interface calendarCell {
    id: string;
    date: Date;
    value: number;
    currentDay: boolean;
    active: boolean;
}

const weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export default function CalendarOverview() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // Memoization for calendar grid to only change when year or month changes
    // Prevent rerender when parent rerenders
    const dayGrid = useMemo(() => {
        const grid: calendarCell[] = []
        const startDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;
        const totalDays = new Date(year, month + 1, 0).getDate();
        const totalPrev = new Date(year, month, 0).getDate(); // Total days in the previous month
        const today = new Date();

        // Push filler cells to align correctly with weekdays
        for (let i = startDayOfWeek-1; i >= 0; i--) {
            const newDate: Date = new Date(year, month, totalPrev - i);
            const newCell: calendarCell = {
                id: `prevcell-${i}`, date: newDate, value: totalPrev - i, currentDay: false, active: false
            };
            grid.push(newCell);
        }

        // Push cells of current month
        for (let i = 1; i <= totalDays; i++) {
            const newDate: Date = new Date(year, month, i);
            const isToday: boolean = today.getDate() === i &&
                                    today.getMonth() === month &&
                                    today.getFullYear() === year;
            const newCell: calendarCell = {
                id: `currCell-${i}`, date: newDate, value: i, currentDay: isToday, active: true
            };
            grid.push(newCell);
        }

        // Push cells of coming month
        for (let i = 1; i <= (grid.length % 7); i++) {
            const newDate: Date = new Date(year, month, i);
            const newCell: calendarCell = {
                id: `nextCell-${i}`, date: newDate, value: i, currentDay: false, active: false
            };
            grid.push(newCell);
        }

        return grid;
    }, [year, month]);


    return (
        <View>
            {/* Month/year displaty with arrow buttons */}
            <View className="flex-row self-center mb-6 items-center gap-x-4">
                <Pressable
                    onPress={() => setCurrentDate(new Date(year, month - 1))}
                    hitSlop={12}
                >
                    <ArrowBigLeft size={24} />
                </Pressable>

                <AppText className="text-2xl font-bold">
                    {currentDate.toLocaleDateString("en-US", { month: "long" }) + " " + year}
                </AppText>

                <Pressable
                    onPress={() => setCurrentDate(new Date(year, month + 1))}
                    hitSlop={12}
                >
                    <ArrowBigRight size={24} />
                </Pressable>
            </View>

            {/* Row of weekdays */}
            <View className="flex-row mb-2">
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
                renderItem={({ item }) => (
                    <View className={`flex-1 justify-between h-16 gap-y-1 items-center m-1 border-2 ${item.active ? 'border-neutral-300' : 'border-transparent opacity-40'} ${item.currentDay ? 'bg-blue-300' : 'bg-slate-200'}`}>
                        <AppText className="text-sm font-bold self-end">{item.value || 'Placeholder'}</AppText>
                        <View className="flex-row flex-wrap gap-1 p-0.5">
                            <View className="h-2 w-2 border-[1px] bg-orange-500" />
                            <View className="h-2 w-2 border-[1px] bg-red-500" />
                            <View className="h-2 w-2 border-[1px] bg-blue-500" />
                            <View className="h-2 w-2 border-[1px] bg-green-500" />
                            <View className="h-2 w-2 border-[1px] bg-pink-500" />
                            <View className="h-2 w-2 border-[1px] bg-yellow-500" />
                        </View>
                    </View>
                )}
            />
        </View>
    );
}