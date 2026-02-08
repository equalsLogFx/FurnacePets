import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface GamePanelProps {
  totalCurrency: number;
  totalStepsConverted: number;
  lastConversionTime?: Date;
  petName?: string;
  petLevel?: number;
}

export const GamePanel = ({
  totalCurrency,
  totalStepsConverted,
  lastConversionTime,
  petName = 'Furnace Pet',
  petLevel = 1,
}: GamePanelProps) => {
  const formatTime = (date?: Date) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 Pet Information</Text>
      </View>

      <ScrollView style={styles.content} scrollEnabled={false}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Pet Name</Text>
            <Text style={styles.infoValue}>{petName}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Level</Text>
            <Text style={styles.infoValue}>{petLevel} ⭐</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Total Currency</Text>
            <Text style={[styles.infoValue, styles.currencyValue]}>
              {totalCurrency} 🔥
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Steps Converted</Text>
            <Text style={styles.infoValue}>{totalStepsConverted.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.lastConversion}>
          <Text style={styles.infoLabel}>Last Conversion</Text>
          <Text style={styles.infoValue}>{formatTime(lastConversionTime)}</Text>
        </View>

        <View style={styles.tipBox}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipText}>
            Keep walking to earn more currency and level up your pet!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    maxHeight: '35%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  infoItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  infoLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  currencyValue: {
    color: '#FF8C00',
  },
  lastConversion: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    marginVertical: 8,
  },
  tipBox: {
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  tipIcon: {
    fontSize: 16,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
});
