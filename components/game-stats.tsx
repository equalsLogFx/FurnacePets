import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface GameStatsProps {
  steps: number;
  currency: number;
}

export const GameStats = ({ steps, currency }: GameStatsProps) => {
  return (
    <View style={styles.container}>
      {/* Left - Steps */}
      <View style={styles.statBox}>
        <Text style={styles.label}>Steps</Text>
        <Text style={styles.value}>{steps.toLocaleString()}</Text>
        <Text style={styles.unit}>👣</Text>
      </View>

      {/* Right - Currency */}
      <View style={styles.statBox}>
        <Text style={styles.label}>Currency</Text>
        <Text style={styles.value}>{currency.toLocaleString()}</Text>
        <Text style={styles.unit}>🔥</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  unit: {
    fontSize: 16,
  },
});
