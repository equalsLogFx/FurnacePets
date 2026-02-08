import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

// Mock step data for development
const getMockSteps = async () => {
  try {
    const today = new Date().toDateString();
    const storedData = await AsyncStorage.getItem('furnacepets_steps');
    if (storedData) {
      const data = JSON.parse(storedData);
      if (data.date === today) {
        return data.steps;
      }
    }
  } catch (e) {
    console.error('Failed to get stored steps', e);
  }
  return Math.floor(Math.random() * 15000) + 3000; // 3k-18k random steps
};

export const usePedometer = () => {
  const [steps, setSteps] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    // Simulate step data fetching
    // In a real app, you'd use:
    // - iOS: HealthKit via expo-health
    // - Android: Google Fit via expo-health or react-native-health
    
    const initSteps = async () => {
      const initialSteps = await getMockSteps();
      setSteps(initialSteps);
    };
    
    initSteps();
    
    // Simulate step updates every few seconds
    const interval = setInterval(() => {
      setSteps(prev => prev + Math.floor(Math.random() * 5));
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return { steps, lastUpdate };
};

// Helper to get today's date string
export const getTodayDate = () => {
  const today = new Date();
  return today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
