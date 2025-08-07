import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, X, RotateCw } from 'lucide-react';

interface TimerProps {
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
  duration?: number;
  editMode?: boolean;
}

export const Timer = ({
  size = '2x2',
  className = '',
  duration = 10,
  editMode = false,
}: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);

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
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setShowTimeUpDialog(true);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (!editMode) {
      setIsRunning(!isRunning);
    }
  };

  const resetTimer = () => {
    if (!editMode) {
      setIsRunning(false);
      setTimeLeft(duration * 60);
      setShowTimeUpDialog(false);
    }
  };

  const handleCloseDialog = () => {
    setShowTimeUpDialog(false);
  };

  const handleContinueTimer = () => {
    setTimeLeft(duration * 60);
    setIsRunning(true);
    setShowTimeUpDialog(false);
  };

  const getSizeClasses = () => {
    const totalArea = gridWidth * gridHeight;
    const maxDimension = Math.max(gridWidth, gridHeight);

    // 1x1 - minimal display
    if (gridWidth === 1 && gridHeight === 1) {
      return {
        timeClass: 'text-xs font-mono font-bold',
        buttonClass: 'w-4 h-4',
        iconSize: 10,
        gap: 'gap-1',
        layout: 'compact',
      };
    }

    // 1xN (tall and narrow) or Nx1 (wide and short) - compact display
    if (gridWidth === 1 || gridHeight === 1) {
      return {
        timeClass: 'text-sm font-mono font-bold',
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
        buttonClass: 'w-10 h-10',
        iconSize: 18,
        gap: 'gap-3',
        layout: 'large',
      };
    }

    // 4x4, 4x5, 5x4, 5x5 - extra large
    if (totalArea >= 16) {
      let timeSize = 'text-6xl';
      let buttonSize = 'w-12 h-12';
      let iconSize = 20;

      if (totalArea >= 25) {
        timeSize = 'text-8xl';
        buttonSize = 'w-16 h-16';
        iconSize = 24;
      }

      return {
        timeClass: `${timeSize} font-mono font-bold`,
        buttonClass: buttonSize,
        iconSize: iconSize,
        gap: 'gap-4',
        layout: 'xlarge',
      };
    }

    // Default for other sizes
    return {
      timeClass: 'text-2xl font-mono font-bold',
      buttonClass: 'w-8 h-8',
      iconSize: 16,
      gap: 'gap-2',
      layout: 'standard',
    };
  };

  const { timeClass, buttonClass, iconSize, gap } = getSizeClasses();

  return (
    <>
      <div className={`text-center ${className}`}>
        <motion.div
          className={`${timeClass} mb-2 text-gray-800`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {formatTime(timeLeft)}
        </motion.div>

        <div className={`flex justify-center ${gap}`}>
          <button
            onClick={toggleTimer}
            disabled={editMode}
            className={`${buttonClass} rounded-full transition-colors flex items-center justify-center ${
              editMode
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isRunning
                ? 'bg-red-500 hover:bg-red-600 text-white cursor-pointer'
                : 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
            }`}
          >
            {isRunning ? <Pause size={iconSize} /> : <Play size={iconSize} />}
          </button>

          <button
            onClick={resetTimer}
            disabled={editMode}
            className={`${buttonClass} rounded-full transition-colors flex items-center justify-center ${
              editMode
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-500 hover:bg-gray-600 text-white cursor-pointer'
            }`}
          >
            <RotateCcw size={iconSize} />
          </button>
        </div>
      </div>

      {/* Time's Up Dialog */}
      <AnimatePresence>
        {showTimeUpDialog && (
          <div className='fixed inset-0 z-50 flex items-center justify-center'>
            {/* Backdrop */}
            <motion.div
              className='absolute inset-0 bg-black bg-opacity-50'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDialog}
            />

            {/* Dialog */}
            <motion.div
              className='relative bg-white rounded-lg p-6 shadow-xl max-w-sm mx-4 text-center'
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.3 }}
            >
              <div className='text-2xl font-bold text-gray-800 mb-4'>
                ⏰ Time's Up!
              </div>

              <div className='text-gray-600 mb-6'>
                Your timer has finished. What would you like to do next?
              </div>

              <div className='flex gap-3 justify-center'>
                <button
                  onClick={handleCloseDialog}
                  className='flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors'
                >
                  <X size={16} />
                  Close
                </button>

                <button
                  onClick={handleContinueTimer}
                  className='flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors'
                >
                  <RotateCw size={16} />
                  Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
