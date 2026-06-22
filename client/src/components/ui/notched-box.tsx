import { View } from 'react-native';
import { cn } from '@/lib/utils';
import { NotchedBorder } from '@/components/ui/notched-border';

type NotchedBoxProps = React.ComponentProps<typeof View> & {
  fillClassName?: string;
  borderClassName?: string;
};

function NotchedBox({
  className,
  fillClassName = 'bg-card',
  borderClassName = 'bg-border',
  children,
  ...props
}: NotchedBoxProps) {
  return (
    <View className={cn('relative', className)} {...props}>
      <NotchedBorder fillClassName={fillClassName} borderClassName={borderClassName} />
      {children}
    </View>
  );
}

export { NotchedBox };
