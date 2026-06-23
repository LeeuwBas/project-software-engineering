import { useEffect, useState } from 'react';
import { useColorScheme, View } from 'react-native';
import Shoe from '@assets/icons/module_icons/shoe.svg';
import {
    getSdkStatus,
    initialize,
    requestPermission,
    SdkAvailabilityStatus,
    readRecords,
    aggregateRecord,
} from 'react-native-health-connect';
import { useAppContext } from './AppContext';

import { useHealthPermission } from '@/lib/StepsPermission';
import { colorScheme } from 'react-native-css-interop';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { stepsBridge } from './api/APIBridge';

/**
 * Function that retrieves the amount of steps that the user has completed in the current day.
 * This information is retrieved from Android Health Connect.
 * The user needs to have another health application connected to health connect to track steps.
 * E.g Google Fit, Samsung Health etc.
 * @returns the amount of steps
 */
export default function useStepValue() {
    const [steps, setSteps] = useState(0);
    const permissionGranted = useHealthPermission();
    const { menuOpen } = useAppContext();

    const isRunningInExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

    useEffect(() => {
        const fetchSteps = async () => {
            if (isRunningInExpoGo) return -1;

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

                await stepsBridge.set(totalSteps);
                setSteps(totalSteps);

                console.log('Total Steps Today:', totalSteps);
            } catch (error) {
                console.error('Failed to read step records:', error);
            }
        };

        fetchSteps();
    }, [permissionGranted, menuOpen]);

    return steps;
}
