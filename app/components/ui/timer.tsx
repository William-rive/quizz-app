'use client';

import React, { useEffect, useState } from 'react';
import { Progress } from './progress';

interface TimerProps {
  initialSeconds: number;
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ initialSeconds, onTimeUp }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [progress, setProgress] = useState(100); // Début de la progression à 100 %

  useEffect(() => {
    if (seconds > 0) {
      const timerId = setTimeout(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
        setProgress(prevProgress => prevProgress - 100 / initialSeconds);
      }, 1000);

      return () => clearTimeout(timerId);
    } else {
      onTimeUp();
    }
  }, [seconds, onTimeUp, initialSeconds]);

  return (
    <div className="flex flex-col items-center top-0 absolute md:right-16">
      <p>Temps restant :</p>
      <Progress value={progress} /> {/* Affichage de la progression */}
    </div>
  );
};

export default Timer;
