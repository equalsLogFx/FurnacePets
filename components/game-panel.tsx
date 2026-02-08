import React, { useRef } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';

interface GamePanelProps {
  totalCurrency: number;
  totalStepsConverted: number;
  totalStepsToday?: number;
  lastConversionTime?: Date;
  petName?: string;
  petLevel?: number;
  petMood?: 'happy' | 'neutral' | 'playful';
  isExpanded?: boolean;
  onSwipe?: (direction: 'up' | 'down') => void;
  weeklySteps?: number[];
  onDevInput?: () => void;
  daySliderIndex?: number;
  onDaySlideLeft?: () => void;
  onDaySlideRight?: () => void;
}

export const GamePanel = ({
  totalCurrency,
  totalStepsConverted,
  totalStepsToday = 0,
  lastConversionTime,
  petName = 'Furnace Pet',
  petLevel = 1,
  petMood = 'neutral',
  isExpanded = false,
  onSwipe,
  weeklySteps = [0, 0, 0, 0, 0, 0, 0],
  onDevInput,
  daySliderIndex = 0,
  onDaySlideLeft,
  onDaySlideRight,
}: GamePanelProps) => {
  const startY = useRef(0);
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        startY.current = event.nativeEvent.pageY;
      },
      onPanResponderMove: () => {},
      onPanResponderRelease: (event) => {
        const endY = event.nativeEvent.pageY;
        const diff = startY.current - endY;

        // Swiped up: diff > 0
        if (diff > 50) {
          onSwipe?.('up');
        }
        // Swiped down: diff < 0
        else if (diff < -50) {
          onSwipe?.('down');
        }
      },
    })
  ).current;

  return (
    <View {...panResponder.panHandlers} style={[styles.container, isExpanded && styles.containerExpanded]}>
      <View style={styles.dragHandle} />
      
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>{petName}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Level {petLevel} ⭐</Text>
        </View>
      </View>

      {isExpanded && (
        <View style={styles.expandedContent}>
          <View style={styles.moodRow}>
            <Text style={styles.moodLabel}>Mood</Text>
            <Text style={styles.moodValue}>{petMood === 'happy' ? '😊' : petMood === 'playful' ? '🤩' : '😐'} {petMood}</Text>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Currency</Text>
              <Text style={styles.statValue}>{totalCurrency}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Steps Today</Text>
              <Text style={styles.statValue}>{totalStepsToday.toLocaleString()}</Text>
            </View>
          </View>
          {lastConversionTime && (
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>Last Converted: {lastConversionTime.toLocaleTimeString()}</Text>
            </View>
          )}

          {/* Weekly Steps Section */}
          <View style={styles.weeklySection}>
            <View style={styles.weeklyHeader}>
              <Text style={styles.weeklyTitle}>Weekly Steps</Text>
              <Pressable onPress={onDevInput} style={styles.devInputButton}>
                <Text style={styles.devInputButtonText}>Dev Input</Text>
              </Pressable>
            </View>
            <View style={styles.sliderContainer}>
              <Pressable 
                onPress={onDaySlideLeft} 
                disabled={daySliderIndex === 0}
                style={[styles.arrowButton, daySliderIndex === 0 && styles.arrowButtonDisabled]}
              >
                <Text style={[styles.arrowText, daySliderIndex === 0 && styles.arrowTextDisabled]}>◀</Text>
              </Pressable>
              
              <View style={styles.daysDisplay}>
                {[0, 1, 2].map((offset) => {
                  const idx = daySliderIndex + offset;
                  if (idx < 7) {
                    return (
                      <View key={idx} style={styles.weekSquare}>
                        <Text style={styles.weekLabel}>{dayNames[idx]}</Text>
                        <Text style={styles.weekValue}>{weeklySteps[idx].toLocaleString()}</Text>
                      </View>
                    );
                  }
                  return null;
                })}
              </View>
              
              <Pressable 
                onPress={onDaySlideRight}
                disabled={daySliderIndex >= 4}
                style={[styles.arrowButton, daySliderIndex >= 4 && styles.arrowButtonDisabled]}
              >
                <Text style={[styles.arrowText, daySliderIndex >= 4 && styles.arrowTextDisabled]}>▶</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
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
  containerExpanded: {
    paddingVertical: 20,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
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
  expandedContent: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingTop: 12,
  },
  moodRow: {
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  moodLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  moodValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(139, 111, 71, 0.1)',
    borderRadius: 8,
    padding: 10,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  timeRow: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  timeLabel: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
  weeklySection: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weeklyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  devInputButton: {
    backgroundColor: '#8B6F47',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  devInputButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  weeklyScroll: {
    flexDirection: 'row',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  arrowButton: {
    width: 36,
    height: 36,
    backgroundColor: '#8B6F47',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.5,
  },
  arrowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  arrowTextDisabled: {
    color: '#999',
  },
  daysDisplay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  weekSquare: {
    width: 56,
    height: 56,
    backgroundColor: '#8B6F47',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    paddingHorizontal: 4,
  },
  weekLabel: {
    fontSize: 10,
    color: '#F5DEB3',
    fontWeight: '600',
  },
  weekValue: {
    fontSize: 12,
    color: '#FFF8DC',
    fontWeight: '700',
    marginTop: 2,
  },
});
