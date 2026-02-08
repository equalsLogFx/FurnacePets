import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

interface ConvertButtonProps {
  steps: number;
  onConvert: (convertedAmount: number) => void;
  isDisabled?: boolean;
}

export const ConvertButton = ({ steps, onConvert, isDisabled }: ConvertButtonProps) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const conversionRate = 1 / 100; // 100 steps = 1 currency
  const convertedAmount = Math.floor(steps * conversionRate);

  const handlePress = () => {
    if (isDisabled || steps === 0) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Button animation
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.92,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onConvert(convertedAmount);
  };

  const isDisabledState = isDisabled || steps === 0;

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
      }}
    >
      <Pressable
        onPress={handlePress}
        disabled={isDisabledState}
        style={({ pressed }) => [
          styles.button,
          pressed && !isDisabledState && styles.buttonPressed,
          isDisabledState && styles.buttonDisabled,
        ]}
      >
        <Text style={[styles.label, isDisabledState && styles.labelDisabled]}>
          {convertedAmount} 🔥
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFB400',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: '#FF9500',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  labelDisabled: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
