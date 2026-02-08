import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { ImageBackground, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { ConvertButton } from '@/components/convert-button';
import { GamePanel } from '@/components/game-panel';
import { GameStats } from '@/components/game-stats';
import InventoryModal from '@/components/inventory-modal';
import { Pet } from '@/components/pet';
import ShopModal from '@/components/shop-modal';
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
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [lastConversionStepCount, setLastConversionStepCount] = useState(0);
  const [shopVisible, setShopVisible] = useState(false);
  const [inventoryVisible, setInventoryVisible] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<Array<{ id: string; name: string }>>([]);

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
          setLastConversionStepCount(parsed.lastConversionStepCount || 0);
          setInventoryItems(parsed.inventory || []);
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
          lastConversionStepCount,
          inventory: inventoryItems,
        };
        await AsyncStorage.setItem('furnacepets_game', JSON.stringify(dataToSave));
      } catch (e) {
        console.error('Failed to save data', e);
      }
    };
    saveData();
  }, [totalCurrency, totalStepsConverted, lastConversionTime, petLevel, currency, lastConversionStepCount]);

  const handleConvert = (convertedAmount: number) => {
    setCurrency(0); // Reset daily currency display
    setTotalCurrency(prev => prev + convertedAmount);
    setTotalStepsConverted(prev => prev + steps);
    setLastConversionTime(new Date());
    setLastConversionStepCount(steps); // Reset convertible steps counter

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

  // Calculate convertible steps (steps since last conversion)
  const convertibleSteps = Math.max(0, steps - lastConversionStepCount);

  // Shop items available for purchase
  const shopItems = [
    { id: 'hoodie', name: 'Hoodie', price: 50 },
    { id: 'hat', name: 'Hat', price: 30 },
    { id: 'bone', name: 'Bone', price: 10 },
    { id: 'doghouse', name: 'Doghouse', price: 200 },
    { id: 'toy1', name: 'Squeaky Toy', price: 25 },
    { id: 'collar', name: 'Collar', price: 15 },
  ];

  const handleBuy = (item: { id: string; name: string; price: number }) => {
    // prevent duplicate purchase of the same base item id
    if (inventoryItems.some(i => i.id.startsWith(item.id))) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    if (totalCurrency >= item.price) {
      setTotalCurrency(prev => prev - item.price);
      setInventoryItems(prev => [...prev, { id: `${item.id}-${Date.now()}`, name: item.name }]);
      // keep shop open after buying
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const handleEquip = (item: { id: string; name: string }) => {
    // equip behavior placeholder (no-op for now)
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('@/assets/images/Background.png')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <View style={styles.container}>
          {/* Stats header with convert button */}
          <View style={styles.headerContainer}>
            <View style={styles.statsRow}>
              {/* Steps box */}
              <View style={styles.statBox}>
                <GameStats steps={convertibleSteps} currency={0} renderStepsOnly={true} />
              </View>

              {/* Convert button between stats */}
              <View style={styles.convertButtonContainer}>
                <ConvertButton
                  steps={convertibleSteps}
                  onConvert={handleConvert}
                  isDisabled={convertibleSteps === 0}
                />
              </View>

              {/* Currency box */}
              <View style={[styles.statBox, styles.currencyBox]}> 
                <GameStats steps={0} currency={totalCurrency} renderCurrencyOnly={true} />
              </View>

              <View style={styles.rightIcons} pointerEvents="box-none">
                <Pressable onPress={() => setShopVisible(true)} style={({ pressed }) => [styles.iconSquare, pressed && styles.iconSquarePressed]}>
                  <Text style={styles.iconLabel}>🏪</Text>
                </Pressable>
                <Pressable onPress={() => setInventoryVisible(true)} style={({ pressed }) => [styles.iconSquare, pressed && styles.iconSquarePressed]}>
                  <Text style={styles.iconLabel}>🎒</Text>
                </Pressable>
              </View>

              <ShopModal visible={shopVisible} items={shopItems} currency={totalCurrency} onClose={() => setShopVisible(false)} onBuy={handleBuy} />
              <InventoryModal visible={inventoryVisible} items={inventoryItems} onClose={() => setInventoryVisible(false)} onEquip={handleEquip} />
            </View>
          </View>

          {/* Main game area */}
          <View style={styles.gameArea}>
            {/* Pet display */}
            <View style={styles.petContainer}>
              <Pet image={dogImage} onTap={handlePetTap} mood={petMood} />
            </View>
          </View>

          {/* Bottom info panel */}
          <View style={styles.panelContainer}>
            <GamePanel
              totalCurrency={totalCurrency}
              totalStepsConverted={totalStepsConverted}
              totalStepsToday={steps}
              lastConversionTime={lastConversionTime}
              petName="FurnacePet"
              petLevel={petLevel}
              petMood={petMood}
              isExpanded={panelExpanded}
              onSwipe={(direction) => {
                if (direction === 'up') {
                  setPanelExpanded(true);
                } else {
                  setPanelExpanded(false);
                }
              }}
            />
          </View>
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
    top: -50,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  statBox: {
    flex: 1,
    height: 80,
    justifyContent: 'center',
  },
  convertButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    paddingHorizontal: 4,
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
    marginLeft: 120,
    marginBottom: 40,
  },
  panelContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  iconButton: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  iconLabel: {
    fontSize: 20,
  },
  iconText: {
    fontSize: 11,
    color: '#444',
  },
  rightIcons: {
    position: 'absolute',
    right: 16,
    top: 12,
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconSquare: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#8B6F47',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
});
