import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { type ReactNode } from 'react';
import { View } from 'react-native';
import { type CardProps } from 'react-native-lumen';

export function renderPetStep(props: CardProps) {
  return (
    <StepCard {...props} stop_position="bottom">
      <AppText>Welcome to VirtuoPet! This is your new virtual pet!</AppText>
    </StepCard>
  );
}

export function renderMenuStep(props: CardProps) {
  return (
    <StepCard {...props} stop_position="top">
      <AppText>This is where you log all your habits.</AppText>
    </StepCard>
  );
}

export function renderStatsStep(props: CardProps) {
  return (
    <StepCard {...props} stop_position="top">
      <AppText>This is where you can see your stats.</AppText>
    </StepCard>
  );
}

export function renderSettingsStep(props: CardProps) {
  return (
    <StepCard {...props} stop_position="top">
      <AppText>And here you'll find all of your settings.</AppText>
    </StepCard>
  );
}

export function renderFinalStep(props: CardProps) {
  return (
    <StepCard {...props} stop_position="bottom">
      <AppText>Thank you for following the tutorial!</AppText>
    </StepCard>
  );
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
  next,
  stop_position,
  isLast,
}: CardProps & {
  children: ReactNode;
  stop_position?: 'top' | 'bottom';
}) {
  const buttons = (
    <View className="flex w-full flex-row items-center justify-center gap-2">
      {!isLast && (
        <Button variant="secondary" onPress={stop} className="my-2 w-32 p-0">
          <AppText className="text-xs">Skip Tutorial</AppText>
        </Button>
      )}
      <Button variant="secondary" onPress={isLast ? stop : next} className="my-2 w-32 p-0">
        <AppText className="text-xs">{isLast ? 'Finish Tutorial' : 'Next'}</AppText>
      </Button>
    </View>
  );

  return (
    <>
      {stop_position === 'top' && buttons}
      <Card className="flex max-w-[80vw] flex-col p-4">{children}</Card>
      {stop_position === 'bottom' && buttons}
    </>
  );
}
