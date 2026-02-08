import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface GameStatsProps {
  steps: number;
  currency: number;
  renderStepsOnly?: boolean;
  renderCurrencyOnly?: boolean;
}

export const GameStats = ({ 
  steps, 
  currency, 
  renderStepsOnly = false,
  renderCurrencyOnly = false 
}: GameStatsProps) => {
  // If specific view requested
  if (renderStepsOnly) {
    return (
      <View style={styles.singleStatBox}>
        <Text style={styles.label}>Steps</Text>
        <Text style={styles.value}>{steps.toLocaleString()}</Text>
        <Text style={styles.unit}>👣</Text>
      </View>
    );
  }
  
  if (renderCurrencyOnly) {
    return (
      <View style={styles.singleStatBox}>
        <Text style={styles.label}>Currency</Text>
        <Text style={styles.value}>{currency.toLocaleString()}</Text>
        <Text style={styles.unit}>🔥</Text>
      </View>
    );
  }

  // Default: render both
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
    backgroundColor: 'transparent',
    gap: 8,
    alignItems: 'flex-start',
  },
  statBox: {
    flex: 1,
    backgroundColor: '#8B6F47',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  singleStatBox: {
    backgroundColor: '#8B6F47',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    width: '100%',
  },
  label: {
    fontSize: 11,
    color: '#F5DEB3',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF8DC',
    marginBottom: 4,
  },
  unit: {
    fontSize: 18,
  },
});
