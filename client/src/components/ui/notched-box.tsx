import { View } from 'react-native';
import { cn } from '@/lib/utils';
import { NotchedBorder } from '@/components/ui/notched-border';

type NotchedBoxProps = React.ComponentProps<typeof View> & {
  fillClassName?: string;
  borderClassName?: string;
};

/*
  A <View>-like component with the pixel-art notched border baked into it.
  This ensuresthe user does not have to wire up <NotchedBorder> by hand.

  Layout and spacing can be passed via the `className` prop.

  The `fillClassName` and `borderClassName` props control the notched border
  and fill of the container respectively.

  @example
  <NotchedBox fillClassName="bg-secondary" borderClassName="bg-secondary-dark" className="p-4">
    <Text>content</Text>
  </NotchedBox>
 */
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
