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
  const durationRef = useRef<number | null>(null);
  const playbackListenerRef = useRef<((status: any) => void) | null>(null);

  // predetermined start points (milliseconds)
  const startPoints = [0, 2500, 4700];

  // Load sound on component mount
  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound, status } = await Audio.Sound.createAsync(
          require('@/assets/audio/HappyFurnaceBarks.wav')
        );
        soundRef.current = sound;
        if (status && status.isLoaded && status.durationMillis) {
          durationRef.current = status.durationMillis;
        } else {
          const st = await sound.getStatusAsync();
          if (st && st.isLoaded && st.durationMillis) {
            durationRef.current = st.durationMillis;
          }
        }
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
    // Play a random segment from startPoints until the next point (or end)
    if (soundRef.current) {
      try {
        const sound = soundRef.current;

        // pick random start index
        const idx = Math.floor(Math.random() * startPoints.length);
        const startMs = startPoints[idx];
        let endMs: number | null = null;
        if (idx < startPoints.length - 1) endMs = startPoints[idx + 1];
        else endMs = durationRef.current;

        // clamp start
        if (durationRef.current && startMs >= durationRef.current) {
          await sound.setPositionAsync(0);
        } else {
          await sound.setPositionAsync(startMs);
        }

        // remove previous listener
        if (playbackListenerRef.current) {
          sound.setOnPlaybackStatusUpdate(null);
          playbackListenerRef.current = null;
        }

        // set listener to stop at endMs (if provided)
        playbackListenerRef.current = (status: any) => {
          if (!status.isLoaded) return;
          const pos = status.positionMillis ?? 0;
          if (endMs && pos >= endMs) {
            sound.pauseAsync();
            sound.setOnPlaybackStatusUpdate(null);
            playbackListenerRef.current = null;
          }
        };
        sound.setOnPlaybackStatusUpdate(playbackListenerRef.current);

        await sound.playAsync();
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
