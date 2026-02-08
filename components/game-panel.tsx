import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface GamePanelProps {
  totalCurrency: number;
  totalStepsConverted: number;
  lastConversionTime?: Date;
  petName?: string;
  petLevel?: number;
}

export const GamePanel = ({
  petName = 'Furnace Pet',
  petLevel = 1,
}: GamePanelProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>{petName}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Level {petLevel} ⭐</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(248, 248, 248, 0.95)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});
