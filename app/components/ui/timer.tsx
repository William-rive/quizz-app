'use client';

import React, { useEffect, useState } from 'react';
import { Progress } from './progress';

interface TimerProps {
  initialSeconds: number;
  onTimeUp: () => void;
  onProgress: (progress: number) => void;
}

const Timer: React.FC<TimerProps> = ({
  initialSeconds,
  onTimeUp,
  onProgress,
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [progress, setProgress] = useState(100); // Début de la progression à 100 %

  useEffect(() => {
    if (seconds > 0) {
      const timerId = setTimeout(() => {
        const newSeconds = seconds - 1;
        const newProgress = (newSeconds / initialSeconds) * 100;
        setSeconds(newSeconds);
        setProgress(newProgress);
        onProgress(newProgress); 
      }, 1000);

      return () => clearTimeout(timerId);
    } else {
      onTimeUp();
    }
  }, [seconds, onTimeUp, initialSeconds, onProgress]);

  return (
    <div className="flex flex-col items-center top-0 absolute md:right-16">
      <p>Temps restant :</p>
      <Progress value={progress} />
    </div>
  );
};

export default Timer;
