import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

export function AppText({ className = '', style, ...props }: TextProps & { className?: string }) {
  const hasBoldClass = className.includes('font-bold');
  const cleanedClassName = className.replace('font-bold', '');

  return (
    <Text
      className={cleanedClassName}
      style={[
        { fontFamily: hasBoldClass ? 'IosevkaCharon-Bold' : 'IosevkaCharon' },
        style,
      ]}
      {...props}
    />
  );
}