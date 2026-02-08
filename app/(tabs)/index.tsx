import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View } from 'react-native';

import { ConvertButton } from '@/components/convert-button';
import { GamePanel } from '@/components/game-panel';
import { GameStats } from '@/components/game-stats';
import { Pet } from '@/components/pet';
import { usePedometer } from '@/hooks/use-pedometer';

const dogImage = require('@/assets/images/Dog.png');

export default function HomeScreen() {
  const { steps } = usePedometer();
  const [currency, setCurrency] = useState(0);
  const [totalCurrency, setTotalCurrency] = useState(0);
  const [totalStepsConverted, setTotalStepsConverted] = useState(0);
  const [lastConversionTime, setLastConversionTime] = useState<Date>();
  const [petMood, setPetMood] = useState<'happy' | 'neutral' | 'playful'>('neutral');
  const [petLevel, setPetLevel] = useState(1);

  // Load saved data on mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('furnacepets_game');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setTotalCurrency(parsed.totalCurrency || 0);
          setTotalStepsConverted(parsed.totalStepsConverted || 0);
          setLastConversionTime(parsed.lastConversionTime ? new Date(parsed.lastConversionTime) : undefined);
          setPetLevel(parsed.petLevel || 1);
          setCurrency(parsed.currency || 0);
        }
      } catch (e) {
        console.error('Failed to load saved data', e);
      }
    };
    loadSavedData();
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        const dataToSave = {
          totalCurrency,
          totalStepsConverted,
          lastConversionTime: lastConversionTime?.toISOString(),
          petLevel,
          currency,
        };
        await AsyncStorage.setItem('furnacepets_game', JSON.stringify(dataToSave));
      } catch (e) {
        console.error('Failed to save data', e);
      }
    };
    saveData();
  }, [totalCurrency, totalStepsConverted, lastConversionTime, petLevel, currency]);

  const handleConvert = (convertedAmount: number) => {
    setCurrency(0); // Reset daily currency display
    setTotalCurrency(prev => prev + convertedAmount);
    setTotalStepsConverted(prev => prev + steps);
    setLastConversionTime(new Date());

    // Pet reacts to conversion
    setPetMood('happy');
    setTimeout(() => setPetMood('neutral'), 2000);

    // Trigger haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Level up every 50000 steps converted
    if ((totalStepsConverted + steps) % 50000 < steps) {
      setPetLevel(prev => prev + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handlePetTap = () => {
    setPetMood('playful');
    setTimeout(() => setPetMood('neutral'), 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('@/assets/images/Background.jpg')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <View style={styles.container}>
          {/* Stats at top */}
          <GameStats steps={steps} currency={totalCurrency} />

          {/* Main game area */}
          <View style={styles.gameArea}>
            {/* Convert button in the middle-top area */}
            <ConvertButton
              steps={steps}
              onConvert={handleConvert}
              isDisabled={steps === 0}
            />

            {/* Pet display */}
            <View style={styles.petContainer}>
              <Pet image={dogImage} onTap={handlePetTap} mood={petMood} />
            </View>
          </View>

          {/* Bottom info panel */}
          <GamePanel
            totalCurrency={totalCurrency}
            totalStepsConverted={totalStepsConverted}
            lastConversionTime={lastConversionTime}
            petName="FurnacePet"
            petLevel={petLevel}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    opacity: 1,
    resizeMode: 'cover',
    top: -40,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  petContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
