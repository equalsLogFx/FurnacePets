import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

interface ConvertButtonProps {
  steps: number;
  onConvert: (convertedAmount: number) => void;
  isDisabled?: boolean;
}

export const ConvertButton = ({ steps, onConvert, isDisabled }: ConvertButtonProps) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const conversionRate = 0.1; // 1 step = 0.1 currency
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
        <View style={styles.content}>
          <Text style={[styles.label, isDisabledState && styles.labelDisabled]}>
            Convert Steps
          </Text>
          <Text style={[styles.value, isDisabledState && styles.valueDisabled]}>
            {convertedAmount} 🔥
          </Text>
          <Text style={[styles.description, isDisabledState && styles.descriptionDisabled]}>
            Today&apos;s {steps} steps
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFB400',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 2,
    borderColor: '#FF9500',
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonPressed: {
    backgroundColor: '#FF9500',
    borderColor: '#FF7C00',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  content: {
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  labelDisabled: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  valueDisabled: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  description: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  descriptionDisabled: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
