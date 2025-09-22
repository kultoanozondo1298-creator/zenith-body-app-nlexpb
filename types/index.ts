
export interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-10 scale
  notes?: string;
  timestamp: number;
}

export interface SleepEntry {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  quality: number; // 1-10 scale
  duration: number; // in hours
  timestamp: number;
}

export interface WorkoutEntry {
  id: string;
  date: string;
  type: string;
  duration: number; // in minutes
  intensity: number; // 1-10 scale
  exercises?: string[];
  notes?: string;
  timestamp: number;
}

export interface AICoachTip {
  id: string;
  type: 'sleep' | 'mood' | 'workout' | 'general';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: number;
}

export interface UserStats {
  averageMood: number;
  averageSleep: number;
  weeklyWorkouts: number;
  streakDays: number;
}
