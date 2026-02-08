import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

interface PetProps {
  onTap?: () => void;
  mood?: 'happy' | 'neutral' | 'playful';
}

export const Pet = ({ onTap, mood = 'neutral' }: PetProps) => {
  const [scale] = useState(new Animated.Value(1));
  const [bounce] = useState(new Animated.Value(0));

  const handleTap = async () => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Animation
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 0.85,
          friction: 3,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: -30,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 3,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    onTap?.();
  };

  const moodEmoji = {
    happy: '😊',
    neutral: '😐',
    playful: '🤪',
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleTap}
        style={({ pressed }) => [
          styles.petButton,
          pressed && styles.petButtonPressed,
        ]}
      >
        <Animated.View
          style={[
            styles.petContent,
            {
              transform: [
                { scale },
                { translateY: bounce },
              ],
            },
          ]}
        >
          <Text style={styles.petEmoji}>🐾</Text>
          <Text style={styles.petMood}>{moodEmoji[mood]}</Text>
        </Animated.View>
      </Pressable>
      <Text style={styles.petLabel}>Tap to interact!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  petButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 180, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 180, 0, 0.3)',
  },
  petButtonPressed: {
    backgroundColor: 'rgba(255, 180, 0, 0.2)',
  },
  petContent: {
    alignItems: 'center',
    gap: 4,
  },
  petEmoji: {
    fontSize: 64,
  },
  petMood: {
    fontSize: 40,
  },
  petLabel: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
});
