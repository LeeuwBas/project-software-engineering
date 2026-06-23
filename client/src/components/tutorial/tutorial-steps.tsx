import {
  AttachStep,
  SpotlightTourProvider,
  TourStep,
  useSpotlightTour,
} from 'react-native-spotlight-tour';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { AppState, Pressable, View } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type ReactNode } from 'react';
import { initializeApiManager, waterBridge } from '@/lib/api/APIBridge';

type TutorialStepParams = {
  menuOpen: boolean;
  statsOpen: boolean;
  changeMenu: () => void;
  changeStats: () => void;
  water: number;
};

/** TODO (buenk): docstring */
export function createTutorialSteps({
  menuOpen,
  statsOpen,
  changeMenu,
  changeStats,
  water,
}: TutorialStepParams): TourStep[] {
  return [
    // 0. The pet
    {
      render: ({ stop }) => (
        <StepCard stop={stop} stop_position="bottom">
          <AppText>Welcome to VirtuoPet! This is your new virtual pet!</AppText>
        </StepCard>
      ),
    },
    // 1. Center button.
    {
      placement: 'top',
      render: ({ stop }) => (
        <StepCard stop={stop} stop_position="top">
          <AppText>This is where you log all your habits. Give it a try!</AppText>
        </StepCard>
      ),
    },
    // 2. Opened menu card.
    {
      placement: 'top',
      before: () =>
        new Promise<void>((resolve) => {
          if (!menuOpen) changeMenu();
          setTimeout(resolve, 80);
        }),
      render: ({ stop }) => (
        <StepCard stop={stop} stop_position="top">
          <AppText>Here you see all the habits you can log.</AppText>
        </StepCard>
      ),
    },
    // 3. Log water button.
    {
      placement: 'top',
      onBackdropPress: ({ next }) => {
        waterBridge.set(water + 1);
        next();
      },
      render: ({ stop }) => (
        <StepCard stop={stop} stop_position="top">
          <AppText>Click here to log a glass of water.</AppText>
        </StepCard>
      ),
    },
    // 4. Tap center button again to close.
    {
      placement: 'top',
      onBackdropPress: ({ next }) => {
        if (menuOpen) changeMenu();
        next();
      },
      render: ({ stop }) => (
        <StepCard stop={stop} stop_position="top">
          <AppText>Nice! Now tap here again to close the menu.</AppText>
        </StepCard>
      ),
    },
    // 5. Stats button
    {
      placement: 'top',
      render: ({ stop }) => (
        <StepCard stop={stop} stop_position="top">
          <AppText>This is where you can see your stats. Go and try it!</AppText>
        </StepCard>
      ),
    },
    // 6. Calendar view
    {
      placement: 'top',
      before: () =>
        new Promise<void>((resolve) => {
          if (!statsOpen) changeStats();
          setTimeout(resolve, 120);
        }),
      render: ({ stop }) => (
        <StepCard stop={stop} stop_position="top">
          <AppText>
            This is the calendar view, each block shows the goals you reached that day.
          </AppText>
        </StepCard>
      ),
    },
    // 7. Tap stats button again to close it
    {
      placement: 'top',
      onBackdropPress: ({ next }) => {
        if (statsOpen) changeStats();
        next();
      },
      render: ({ stop }) => (
        <StepCard stop={stop} stop_position="top">
          <AppText>Tap here again to close your stats.</AppText>
        </StepCard>
      ),
    },
    // 8. Profile settings
    {
      placement: 'top',
      render: ({ stop }) => (
        <StepCard stop={stop} stop_position="top">
          <AppText>And here you'll find all of your settings.</AppText>
        </StepCard>
      ),
    },
    // 9. Final message.
    {
      onBackdropPress: ({ stop }) => stop(),
      render: ({ stop }) => (
        <StepCard stop={stop} stop_position="bottom">
          <AppText>Thank you for following the tutorial!</AppText>
        </StepCard>
      ),
    },
  ];
}

/** TODO (buenk): docstring */
function StepCard({
  children,
  stop,
  stop_position,
}: {
  children: ReactNode;
  stop: () => void;
  stop_position?: 'top' | 'bottom';
}) {
  return (
    <>
      {stop_position === 'top' && (
        <View className="flex w-full items-center justify-center">
          <Button variant="secondary" onPress={stop} className="my-2 w-32 p-0">
            <AppText className="text-xs">Skip Tutorial</AppText>
          </Button>
        </View>
      )}
      <Card className="flex max-w-[80vw] flex-col p-4">{children}</Card>
      {stop_position === 'bottom' && (
        <View className="flex w-full items-center justify-center">
          <Button variant="secondary" onPress={stop} className="my-2 w-32 p-0">
            <AppText className="text-xs">Skip Tutorial</AppText>
          </Button>
        </View>
      )}
    </>
  );
}
