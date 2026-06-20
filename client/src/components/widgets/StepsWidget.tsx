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

import { AppText } from '../AppText';
import { Button } from '../ui/button';
import { useHealthPermission } from '@/lib/StepsPermission';
import { colorScheme } from 'react-native-css-interop';
import useStepValue from '@/lib/GetSteps';

export default function StepsWidget({ storedSteps = 0 }) {
  const newSteps = useStepValue()

  return (
    <AppText className="text-base font-bold">
      {newSteps === -1 && (
        storedSteps
      )}
      {newSteps !== -1 && (
        newSteps
      )}
    </AppText>
  );
}