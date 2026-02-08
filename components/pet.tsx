import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';

interface PetProps {
  onTap?: () => void;
  mood?: 'happy' | 'neutral' | 'playful';
  image?: ImageSourcePropType;
}

export const Pet = ({ onTap, mood = 'neutral', image }: PetProps) => {
  const [scale] = useState(new Animated.Value(1));
  const [bounce] = useState(new Animated.Value(0));
  const soundRef = useRef<Audio.Sound | null>(null);

  // Load sound on component mount
  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('@/assets/audio/HappyFurnaceBarks.wav')
        );
        soundRef.current = sound;
      } catch (error) {
        console.error('Failed to load sound', error);
      }
    };

    loadSound();

    // Cleanup on unmount
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const handleTap = async () => {
    // Play sound
    if (soundRef.current) {
      try {
        await soundRef.current.replayAsync();
      } catch (error) {
        console.error('Failed to play sound', error);
      }
    }

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
          {image ? (
            <Image source={image} style={styles.petImage} />
          ) : (
            <>
              <Text style={styles.petEmoji}>🐾</Text>
              <Text style={styles.petMood}>{moodEmoji[mood]}</Text>
            </>
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 0,
    marginRight: 40,
    marginTop: 60,
  },
  petButton: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  petButtonPressed: {
    backgroundColor: 'transparent',
  },
  petContent: {
    alignItems: 'center',
    gap: 4,
  },
  petImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  petEmoji: {
    fontSize: 64,
  },
  petMood: {
    fontSize: 40,
  },
});
