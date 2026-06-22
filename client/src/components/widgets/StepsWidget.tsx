
import useStepValue from '@/lib/GetSteps';
import { AppText } from '../AppText';

export default function StepsWidget({ storedSteps = 0 }) {
  const newSteps = useStepValue();

  return (
    <AppText className="text-base font-bold">
      {newSteps === -1 && storedSteps}
      {newSteps !== -1 && newSteps}
    </AppText>
  );
}
