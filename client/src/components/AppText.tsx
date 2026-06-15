import React from 'react';
import { Text, TextProps } from 'react-native';

/**
 * Themed text component that enforces the app's custom font.
 *
 * @param className - NativeWind utility classes; `font-bold` is intercepted to switch font variant
 * @param style - Additional inline styles, merged after font family (takes precedence)
 * @param props - Remaining {@link TextProps} forwarded to the underlying <{@link Text}>
 * @returns A <{@link Text}> element with the project font applied
 *
 * @example <AppText className="font-bold text-lg">Hello</AppText>
 */
export function AppText({ className = '', style, ...props }: TextProps & { className?: string }) {
  const hasBoldClass = className.includes('font-bold');
  const cleanedClassName = className.replace('font-bold', '');

  return (
    <Text
      className={`text-foreground ${cleanedClassName}`}
      style={[{ fontFamily: hasBoldClass ? 'IosevkaCharon-Bold' : 'IosevkaCharon' }, style]}
      {...props}
    />
  );
}
