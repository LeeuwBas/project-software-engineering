import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { type ReactNode } from 'react';
import { View } from 'react-native';
import { TourStep } from 'react-native-spotlight-tour';

/**
 * Factory that creates the step React components for the spotlight tutorial.
 *
 * @returns An array of TourStep objects representing the tutorial steps.
 */
export function createTutorialSteps(): TourStep[] {
  return [
    // 0. The pet
    {
      render: ({ stop }) => (
        <StepCard stop={stop} stop_position="bottom" final={false}>
          <AppText>Welcome to VirtuoPet! This is your new virtual pet!</AppText>
        </StepCard>
      ),
    },
    // 1. Center button.
    {
      placement: 'top',
      render: ({ stop }) => (
        <StepCard stop={stop} stop_position="top" final={false}>
          <AppText>This is where you log all your habits.</AppText>
        </StepCard>
      ),
    },
    // 2. Stats button
    {
      placement: 'top',
      render: ({ stop }) => (
        <StepCard stop={stop} stop_position="top" final={false}>
          <AppText>This is where you can see your stats.</AppText>
        </StepCard>
      ),
    },
    // 3. Profile settings
    {
      placement: 'top',
      render: ({ stop }) => (
        <StepCard stop={stop} stop_position="top" final={false}>
          <AppText>And here you'll find all of your settings.</AppText>
        </StepCard>
      ),
    },
    // 4. Final message.
    {
      onBackdropPress: ({ stop }) => stop(),
      render: ({ stop }) => (
        <StepCard stop={stop} stop_position="bottom" final={true}>
          <AppText>Thank you for following the tutorial!</AppText>
        </StepCard>
      ),
    },
  ];
}

/**
 * Component that renders a card with a button to stop the tutorial.
 *
 * @param children - React content to render inside the card.
 * @param stop - Stop tutorial callback function.
 * @param stop_position - Variable to render the stop tutorial button on the
 *                        top or bottom for layout purposes.
 * @return The step JSX component.
 */
function StepCard({
  children,
  stop,
  stop_position,
  final,
}: {
  children: ReactNode;
  stop: () => void;
  stop_position?: 'top' | 'bottom';
  final: boolean;
}) {
  return (
    <>
      {stop_position === 'top' && (
        <View className="flex w-full items-center justify-center">
          <Button variant="secondary" onPress={stop} className="my-2 w-32 p-0">
            <AppText className="text-xs">{!final ? 'Skip Tutorial' : 'Finish Tutorial'}</AppText>
          </Button>
        </View>
      )}
      <Card className="flex max-w-[80vw] flex-col p-4">{children}</Card>
      {stop_position === 'bottom' && (
        <View className="flex w-full items-center justify-center">
          <Button variant="secondary" onPress={stop} className="my-2 w-32 p-0">
            <AppText className="text-xs">{!final ? 'Skip Tutorial' : 'Finish Tutorial'}</AppText>
          </Button>
        </View>
      )}
    </>
  );
}
