import { useEffect, useState } from 'react';
import { useColorScheme, View } from 'react-native';
import Shoe from '@assets/icons/module_icons/shoe.svg'
import {
  getSdkStatus,
  initialize,
  requestPermission,
  SdkAvailabilityStatus,
  readRecords,
  aggregateRecord,
} from 'react-native-health-connect';

import { useHealthPermission } from '@/lib/StepsPermission';
import { colorScheme } from 'react-native-css-interop';

export default function useStepValue() {
    const [steps, setSteps] = useState(0);
    const permissionGranted = useHealthPermission();

    useEffect(() => {
        const fetchSteps = async () => {
            const initialized = await initialize();

            if (!permissionGranted) return -1;

            if (!initialized) {
                console.log('Health Connect not initialized');
                return -1;
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

                const totalSteps = response?.COUNT_TOTAL || -1;

                setSteps(totalSteps);
                console.log('Total Steps Today:', totalSteps);
            } catch (error) {
                console.error('Failed to read step records:', error);
            }
        };
        fetchSteps();
    }, [permissionGranted]);

    return steps;
}
