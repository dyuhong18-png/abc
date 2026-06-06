import React, { createContext, useContext, useState, useEffect } from 'react';

export const ALL_TOPICS = ['基礎代數', '平面幾何', '三角函數', '向量單元', '微積分初步', '統計與機率', '邏輯推理'];

interface Progress {
  completedTopics: string[];
  totalScore: number;
  lastActive: Date;
  streak: number;
  correctAnswersCount: number;
  totalAnswersCount: number;
}

interface LearningContextType {
  activeTopic: string;
  setActiveTopic: (topic: string) => void;
  progress: Progress;
  addScore: (points: number) => void;
  completeTopic: (topic: string) => void;
  recordAttempt: (isCorrect: boolean) => void;
  resetProgress: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

// Helper to calculate calendar days between two dates
function getDaysBetween(date1: Date, date2: Date): number {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  const diffTime = d2.getTime() - d1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const [activeTopic, setActiveTopic] = useState('基礎代數');
  const [progress, setProgress] = useState<Progress>(() => {
    const saved = localStorage.getItem('mathwhiz_progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      const lastActive = new Date(parsed.lastActive || new Date());
      let streak = parsed.streak || 0;

      // On app load, check if the streak is broken (more than 1 full calendar day missed)
      const today = new Date();
      if (getDaysBetween(lastActive, today) > 1) {
        streak = 0;
      }

      return {
        completedTopics: parsed.completedTopics || [],
        totalScore: parsed.totalScore || 0,
        lastActive,
        streak,
        correctAnswersCount: parsed.correctAnswersCount || 0,
        totalAnswersCount: parsed.totalAnswersCount || 0
      };
    }
    return {
      completedTopics: [],
      totalScore: 0,
      lastActive: new Date(),
      streak: 0,
      correctAnswersCount: 0,
      totalAnswersCount: 0
    };
  });

  useEffect(() => {
    localStorage.setItem('mathwhiz_progress', JSON.stringify(progress));
  }, [progress]);

  const recordActivity = (prev: Progress): { streak: number; lastActive: Date } => {
    const today = new Date();
    const diffDays = getDaysBetween(prev.lastActive, today);
    let newStreak = prev.streak || 0;

    if (newStreak === 0) {
      newStreak = 1;
    } else if (diffDays === 1) {
      newStreak = newStreak + 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }
    // If diffDays is 0 (already practiced today), the streak is maintained but not incremented multiple times on the same day.

    return {
      streak: newStreak,
      lastActive: today
    };
  };

  const addScore = (points: number) => {
    setProgress(prev => {
      const { streak, lastActive } = recordActivity(prev);
      return {
        ...prev,
        totalScore: prev.totalScore + points,
        streak,
        lastActive
      };
    });
  };

  const completeTopic = (topic: string) => {
    setProgress(prev => {
      const { streak, lastActive } = recordActivity(prev);
      return {
        ...prev,
        completedTopics: prev.completedTopics.includes(topic) 
          ? prev.completedTopics 
          : [...prev.completedTopics, topic],
        streak,
        lastActive
      };
    });
  };

  const recordAttempt = (isCorrect: boolean) => {
    setProgress(prev => {
      const { streak, lastActive } = recordActivity(prev);
      return {
        ...prev,
        totalAnswersCount: prev.totalAnswersCount + 1,
        correctAnswersCount: prev.correctAnswersCount + (isCorrect ? 1 : 0),
        streak,
        lastActive
      };
    });
  };

  const resetProgress = () => {
    localStorage.removeItem('mathwhiz_progress');
    setProgress({
      completedTopics: [],
      totalScore: 0,
      lastActive: new Date(),
      streak: 0,
      correctAnswersCount: 0,
      totalAnswersCount: 0
    });
  };

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('mathwhiz_dark_mode');
    return saved === 'true';
  });

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('mathwhiz_dark_mode', String(next));
      return next;
    });
  };

  return (
    <LearningContext.Provider value={{ 
      activeTopic, 
      setActiveTopic, 
      progress, 
      addScore, 
      completeTopic, 
      recordAttempt, 
      resetProgress,
      darkMode,
      toggleDarkMode
    }}>
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
}
