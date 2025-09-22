
import { useState, useEffect } from 'react';
import { useStorage } from './useStorage';
import { MoodEntry, SleepEntry, WorkoutEntry, AICoachTip, UserStats } from '../types';

export function useHealthData() {
  const [moodEntries, setMoodEntries] = useStorage<MoodEntry[]>('mood_entries', []);
  const [sleepEntries, setSleepEntries] = useStorage<SleepEntry[]>('sleep_entries', []);
  const [workoutEntries, setWorkoutEntries] = useStorage<WorkoutEntry[]>('workout_entries', []);
  const [aiTips, setAiTips] = useStorage<AICoachTip[]>('ai_tips', []);

  const addMoodEntry = (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => {
    const newEntry: MoodEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    setMoodEntries(prev => [newEntry, ...prev]);
    generateAITips([newEntry], sleepEntries, workoutEntries);
  };

  const addSleepEntry = (entry: Omit<SleepEntry, 'id' | 'timestamp'>) => {
    const newEntry: SleepEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    setSleepEntries(prev => [newEntry, ...prev]);
    generateAITips(moodEntries, [newEntry], workoutEntries);
  };

  const addWorkoutEntry = (entry: Omit<WorkoutEntry, 'id' | 'timestamp'>) => {
    const newEntry: WorkoutEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    setWorkoutEntries(prev => [newEntry, ...prev]);
    generateAITips(moodEntries, sleepEntries, [newEntry]);
  };

  const generateAITips = (moods: MoodEntry[], sleep: SleepEntry[], workouts: WorkoutEntry[]) => {
    const tips: AICoachTip[] = [];
    const now = Date.now();

    // Analyze recent mood trends
    const recentMoods = moods.slice(0, 7);
    if (recentMoods.length > 0) {
      const avgMood = recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length;
      
      if (avgMood < 5) {
        tips.push({
          id: `mood_tip_${now}`,
          type: 'mood',
          title: 'Mood Support',
          message: 'Your mood has been lower lately. Consider adding a 10-minute walk or meditation to your routine.',
          priority: 'high',
          timestamp: now,
        });
      }
    }

    // Analyze sleep patterns
    const recentSleep = sleep.slice(0, 7);
    if (recentSleep.length > 0) {
      const avgSleep = recentSleep.reduce((sum, entry) => sum + entry.duration, 0) / recentSleep.length;
      
      if (avgSleep < 7) {
        tips.push({
          id: `sleep_tip_${now}`,
          type: 'sleep',
          title: 'Sleep Optimization',
          message: 'You\'re averaging less than 7 hours of sleep. Try setting a consistent bedtime routine.',
          priority: 'medium',
          timestamp: now,
        });
      }
    }

    // Analyze workout frequency
    const recentWorkouts = workouts.filter(w => now - w.timestamp < 7 * 24 * 60 * 60 * 1000);
    if (recentWorkouts.length < 3) {
      tips.push({
        id: `workout_tip_${now}`,
        type: 'workout',
        title: 'Stay Active',
        message: 'You\'ve had fewer workouts this week. Even a 15-minute walk can boost your mood!',
        priority: 'medium',
        timestamp: now,
      });
    }

    if (tips.length > 0) {
      setAiTips(prev => [...tips, ...prev.slice(0, 10)]); // Keep only latest 10 tips
    }
  };

  const getStats = (): UserStats => {
    const recentMoods = moodEntries.slice(0, 30);
    const recentSleep = sleepEntries.slice(0, 30);
    const weeklyWorkouts = workoutEntries.filter(w => 
      Date.now() - w.timestamp < 7 * 24 * 60 * 60 * 1000
    ).length;

    const averageMood = recentMoods.length > 0 
      ? recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length 
      : 0;

    const averageSleep = recentSleep.length > 0 
      ? recentSleep.reduce((sum, entry) => sum + entry.duration, 0) / recentSleep.length 
      : 0;

    // Calculate streak (days with at least one entry)
    let streakDays = 0;
    const today = new Date().toDateString();
    const allEntries = [...moodEntries, ...sleepEntries, ...workoutEntries]
      .sort((a, b) => b.timestamp - a.timestamp);

    const uniqueDates = [...new Set(allEntries.map(entry => 
      new Date(entry.timestamp).toDateString()
    ))];

    for (let i = 0; i < uniqueDates.length; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      if (uniqueDates.includes(date.toDateString())) {
        streakDays++;
      } else {
        break;
      }
    }

    return {
      averageMood: Math.round(averageMood * 10) / 10,
      averageSleep: Math.round(averageSleep * 10) / 10,
      weeklyWorkouts,
      streakDays,
    };
  };

  return {
    moodEntries,
    sleepEntries,
    workoutEntries,
    aiTips,
    addMoodEntry,
    addSleepEntry,
    addWorkoutEntry,
    getStats,
  };
}
