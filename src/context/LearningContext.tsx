import React, { createContext, useContext, useState, useEffect } from 'react';

interface Progress {
  completedTopics: string[];
  totalScore: number;
  lastActive: Date;
}

interface LearningContextType {
  activeTopic: string;
  setActiveTopic: (topic: string) => void;
  progress: Progress;
  addScore: (points: number) => void;
  completeTopic: (topic: string) => void;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const [activeTopic, setActiveTopic] = useState('基礎代數');
  const [progress, setProgress] = useState<Progress>(() => {
    const saved = localStorage.getItem('mathwhiz_progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, lastActive: new Date(parsed.lastActive) };
    }
    return {
      completedTopics: [],
      totalScore: 0,
      lastActive: new Date()
    };
  });

  useEffect(() => {
    localStorage.setItem('mathwhiz_progress', JSON.stringify(progress));
  }, [progress]);

  const addScore = (points: number) => {
    setProgress(prev => ({
      ...prev,
      totalScore: prev.totalScore + points,
      lastActive: new Date()
    }));
  };

  const completeTopic = (topic: string) => {
    setProgress(prev => ({
      ...prev,
      completedTopics: prev.completedTopics.includes(topic) 
        ? prev.completedTopics 
        : [...prev.completedTopics, topic],
      lastActive: new Date()
    }));
  };

  return (
    <LearningContext.Provider value={{ activeTopic, setActiveTopic, progress, addScore, completeTopic }}>
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
