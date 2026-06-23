import { TextClassContext } from '@/components/ui/text';
import { NotchedBorder } from '@/components/ui/notched-border';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Platform, Pressable, type PressableStateCallbackType } from 'react-native';

const buttonVariants = cva(
  cn(
    'group relative shrink-0 flex-row items-center justify-center gap-2 bg-transparent',
    Platform.select({
      web: "focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 whitespace-nowrap outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    })
  ),
  {
    variants: {
      variant: {
        default: '',
        destructive: '',
        outline: '',
        secondary: '',
        ghost: '',
        link: '',
      },
      size: {
        default: cn('min-h-10 px-4 py-2 sm:h-9', Platform.select({ web: 'has-[>svg]:px-3' })),
        sm: cn('min-h-9 gap-1.5 px-3 sm:h-8', Platform.select({ web: 'has-[>svg]:px-2.5' })),
        lg: cn('min-h-11 px-6 sm:h-10', Platform.select({ web: 'has-[>svg]:px-4' })),
        icon: 'h-10 w-10 sm:h-9 sm:w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Colors live here so the notch can swap fill on press.
const notchColors = {
  default: { fill: 'bg-primary', fillActive: 'bg-primary/90', border: 'bg-primary-dark' },
  destructive: {
    fill: 'bg-destructive',
    fillActive: 'bg-destructive/90',
    border: 'bg-destructive-dark',
  },
  outline: { fill: 'bg-background', fillActive: 'bg-accent', border: 'bg-border' },
  secondary: { fill: 'bg-secondary', fillActive: 'bg-secondary/80', border: 'bg-secondary-dark' },
  ghost: { fill: 'bg-transparent', fillActive: 'bg-accent', border: 'bg-transparent' },
  link: { fill: 'bg-transparent', fillActive: 'bg-transparent', border: 'bg-transparent' },
} as const;

const buttonTextVariants = cva(
  cn(
    'text-foreground text-sm font-medium',
    Platform.select({ web: 'pointer-events-none transition-colors' })
  ),
  {
    variants: {
      variant: {
        default: 'text-white font-bold',
        destructive: 'text-white font-bold',
        outline: cn(
          'text-secondary-foreground font-bold group-active:text-accent-foreground',
          Platform.select({ web: 'group-hover:text-accent-foreground' })
        ),
        secondary: 'text-white font-bold',
        ghost: 'group-active:text-accent-foreground',
        link: cn(
          'text-primary group-active:underline',
          Platform.select({ web: 'underline-offset-4 hover:underline group-hover:underline' })
        ),
      },
      size: { default: '', sm: '', lg: '', icon: '' },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

type ButtonProps = React.ComponentProps<typeof Pressable> &
  React.RefAttributes<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

function Button({
  className,
  variant = 'default',
  size,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const colors = notchColors[variant ?? 'default'];

  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Pressable
        className={cn(disabled && 'opacity-50', buttonVariants({ variant, size }), className)}
        role="button"
        disabled={disabled}
        {...props}>
        {(state: PressableStateCallbackType) => (
          <>
            <NotchedBorder
              fillClassName={state.pressed ? colors.fillActive : colors.fill}
              borderClassName={colors.border}
            />
            {typeof children === 'function' ? children(state) : children}
          </>
        )}
      </Pressable>
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
