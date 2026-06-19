<<<<<<< Updated upstream
import { AppText } from '@/components/AppText';
import Shoe from '@assets/icons/module_icons/shoe.svg';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';

export default function StepsWidget() {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#f2f2f2' : '#555555';
  return (
    <View className="flex w-full flex-row items-center justify-start gap-2 self-stretch p-2">
      <Shoe height={30} width={30} color={iconColor} />
      <AppText className="text-base font-bold">9999</AppText>
=======
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SportShoe } from 'lucide-react-native';
import {
  getSdkStatus,
  initialize,
  requestPermission,
  SdkAvailabilityStatus,
  readRecords,
  aggregateRecord,
} from 'react-native-health-connect';

import { AppText } from '../AppText';
import { Button } from '../ui/button';
import { useHealthPermission } from '@/lib/StepsPermission';

export default function StepsWidget() {
  const [steps, setSteps] = useState(0);
  const permissionGranted = useHealthPermission();

  const fetchSteps = async () => {
    const initialized = await initialize();

    if (!initialized) {
      console.log('Health Connect not initialized');
      return;
    }

    try {
      const startTime = new Date();
      startTime.setHours(0, 0, 0, 0);

      const endTime = new Date();

      const response = await aggregateRecord({
        recordType: 'Steps',
        timeRangeFilter: {
          operator: 'between',
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        },
      });

      const totalSteps =
        response?.COUNT_TOTAL

      setSteps(totalSteps);

      console.log('Total Steps Today:', totalSteps);
    } catch (error) {
      console.error('Failed to read step records:', error);
    }
  };

  useEffect(() => {
    if (!permissionGranted) return;
    fetchSteps();
    const interval = setInterval(fetchSteps, 15000);
    return () => clearInterval(interval);
  }, [permissionGranted]);

  return (
    <View className="flex w-full flex-row items-center justify-start gap-2 self-stretch p-2">
      <SportShoe size={30} />

      <AppText className="text-base font-bold">
        {steps}
      </AppText>
>>>>>>> Stashed changes
    </View>
  );
}