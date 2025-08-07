import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface PomodoroProps {
  size?:
    | '1x1'
    | '1x2'
    | '1x3'
    | '1x4'
    | '1x5'
    | '2x1'
    | '2x2'
    | '2x3'
    | '2x4'
    | '2x5'
    | '3x1'
    | '3x2'
    | '3x3'
    | '3x4'
    | '3x5'
    | '4x1'
    | '4x2'
    | '4x3'
    | '4x4'
    | '4x5'
    | '5x1'
    | '5x2'
    | '5x3'
    | '5x4'
    | '5x5';
  className?: string;
  workDuration?: number;
  breakDuration?: number;
}

export const Pomodoro = ({
  size = '2x2',
  className = '',
  workDuration = 25,
  breakDuration = 5,
}: PomodoroProps) => {
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [session, setSession] = useState<'work' | 'break'>('work');

  // Helper function to parse grid dimensions from size string
  const parseGridSize = (gridSize: string) => {
    const [w, h] = gridSize.split('x').map(Number);
    return { width: w, height: h };
  };

  const { width: gridWidth, height: gridHeight } = parseGridSize(size);

  useEffect(() => {
    let interval: number;

    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);

      if (session === 'work') {
        setSession('break');
        setTimeLeft(breakDuration * 60);
      } else {
        setSession('work');
        setTimeLeft(workDuration * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, session, workDuration, breakDuration]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (session === 'work') {
      setTimeLeft(workDuration * 60);
    } else {
      setTimeLeft(breakDuration * 60);
    }
  };

  const getSizeClasses = () => {
    const totalArea = gridWidth * gridHeight;
    const maxDimension = Math.max(gridWidth, gridHeight);

    // 1x1 - minimal display
    if (gridWidth === 1 && gridHeight === 1) {
      return {
        timeClass: 'text-xs font-mono font-bold',
        sessionClass: 'text-xs',
        buttonClass: 'w-4 h-4',
        iconSize: 10,
        gap: 'gap-1',
        layout: 'minimal',
      };
    }

    // 1xN (tall and narrow) or Nx1 (wide and short) - compact display
    if (gridWidth === 1 || gridHeight === 1) {
      return {
        timeClass: 'text-sm font-mono font-bold',
        sessionClass: 'text-xs',
        buttonClass: 'w-5 h-5',
        iconSize: 12,
        gap: 'gap-1',
        layout: 'compact',
      };
    }

    // 2x2 - standard size
    if (gridWidth === 2 && gridHeight === 2) {
      return {
        timeClass: 'text-lg font-mono font-bold',
        sessionClass: 'text-xs',
        buttonClass: 'w-6 h-6',
        iconSize: 12,
        gap: 'gap-1',
        layout: 'standard',
      };
    }

    // 2x3, 3x2 - medium size
    if (totalArea >= 6 && totalArea <= 8 && maxDimension <= 3) {
      return {
        timeClass: 'text-2xl font-mono font-bold',
        sessionClass: 'text-sm',
        buttonClass: 'w-8 h-8',
        iconSize: 16,
        gap: 'gap-2',
        layout: 'medium',
      };
    }

    // 3x3, 3x4, 4x3 - large size
    if (totalArea >= 9 && totalArea <= 12) {
      return {
        timeClass: 'text-4xl font-mono font-bold',
        sessionClass: 'text-lg',
        buttonClass: 'w-10 h-10',
        iconSize: 18,
        gap: 'gap-3',
        layout: 'large',
      };
    }

    // 4x4, 4x5, 5x4, 5x5 - extra large
    if (totalArea >= 16) {
      let timeSize = 'text-6xl';
      let sessionSize = 'text-xl';
      let buttonSize = 'w-12 h-12';
      let iconSize = 20;

      if (totalArea >= 25) {
        timeSize = 'text-8xl';
        sessionSize = 'text-2xl';
        buttonSize = 'w-16 h-16';
        iconSize = 24;
      }

      return {
        timeClass: `${timeSize} font-mono font-bold`,
        sessionClass: sessionSize,
        buttonClass: buttonSize,
        iconSize: iconSize,
        gap: 'gap-4',
        layout: 'xlarge',
      };
    }

    // Default for other sizes
    return {
      timeClass: 'text-2xl font-mono font-bold',
      sessionClass: 'text-sm',
      buttonClass: 'w-8 h-8',
      iconSize: 16,
      gap: 'gap-2',
      layout: 'standard',
    };
  };

  const { timeClass, sessionClass, buttonClass, iconSize, gap, layout } =
    getSizeClasses();

  return (
    <div className={`text-center ${className}`}>
      <div className={`${sessionClass} text-gray-500 mb-1`}>
        {session === 'work' ? 'Work' : 'Break'}
      </div>

      <motion.div
        className={`${timeClass} mb-2 ${
          session === 'work' ? 'text-red-500' : 'text-green-500'
        }`}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {formatTime(timeLeft)}
      </motion.div>

      {layout !== 'minimal' && (
        <div className={`flex justify-center ${gap}`}>
          <button
            onClick={toggleTimer}
            className={`${buttonClass} rounded-full transition-colors cursor-pointer flex items-center justify-center ${
              isRunning
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isRunning ? <Pause size={iconSize} /> : <Play size={iconSize} />}
          </button>

          <button
            onClick={resetTimer}
            className={`${buttonClass} rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-colors cursor-pointer flex items-center justify-center`}
          >
            <RotateCcw size={iconSize} />
          </button>
        </div>
      )}
    </div>
  );
};
