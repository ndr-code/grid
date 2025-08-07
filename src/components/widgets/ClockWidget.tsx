import { motion } from 'framer-motion';
import { useGlobalTime } from '../../hooks';

interface ClockProps {
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
  showDate?: boolean;
  className?: string;
}

export const Clock = ({
  size = '2x2',
  showDate = true,
  className = '',
}: ClockProps) => {
  const currentTime = useGlobalTime();

  // Helper function to parse grid dimensions from size string
  const parseGridSize = (gridSize: string) => {
    const [w, h] = gridSize.split('x').map(Number);
    return { width: w, height: h };
  };

  const { width: gridWidth, height: gridHeight } = parseGridSize(size);

  const getSizeClasses = () => {
    // 1x1 - minimal display
    if (gridWidth === 1 && gridHeight === 1) {
      return {
        timeClass: 'text-sm font-mono font-bold',
        dateClass: 'text-2xs',
        layout: 'minimal',
      };
    }

    // 1xN (tall and narrow) - stack vertically
    if (gridWidth === 1 && gridHeight >= 2) {
      if (gridHeight === 2) {
        return {
          timeClass: 'text-2xl font-mono font-bold leading-tight',
          dateClass: 'text-xs',
          layout: 'vertical-1x2',
        };
      } else if (gridHeight === 3) {
        return {
          timeClass: 'text-2xl font-mono font-bold leading-tight',
          dateClass: 'text-xs',
          layout: 'vertical-1x3',
        };
      } else if (gridHeight === 4) {
        return {
          timeClass: 'text-3xl font-mono font-bold leading-tight py-1',
          dateClass: 'text-xs py-1',
          layout: 'vertical-1x4',
        };
      } else if (gridHeight === 5) {
        return {
          timeClass: 'text-3xl font-mono font-bold leading-tight py-1',
          dateClass: 'text-xs py-1',
          layout: 'vertical-1x5',
        };
      } else {
        // For 1x6 and above, use the original vertical-split layout
        return {
          timeClass: 'text-2xl font-mono font-bold py-0.5',
          dateClass: 'text-xs pt-2',
          layout: 'vertical-split',
        };
      }
    }

    // Nx1 (wide and short) - horizontal layout
    if (gridHeight === 1 && gridWidth >= 2) {
      // 4x1 and 5x1 - special horizontal layout with separator
      if (gridWidth >= 4) {
        return {
          timeClass: 'text-xl font-mono font-bold',
          dateClass: 'text-sm',
          layout: 'horizontal-with-separator',
        };
      }
      // 2x1, 3x1 - regular horizontal layout
      return {
        timeClass: 'text-md font-mono font-bold',
        dateClass: 'text-xs -translate-y-1',
        layout: 'horizontal',
      };
    }

    // 2x2 - custom layout: HH:MM Mon, Aug 4
    if (gridWidth === 2 && gridHeight === 2) {
      return {
        timeClass: 'text-3xl font-mono font-bold',
        dateClass: 'text-xs',
        layout: '2x2-custom',
      };
    }

    // 5x2 - base style for wide horizontal layouts
    if (gridWidth === 5 && gridHeight === 2) {
      return {
        timeClass: 'text-5xl font-mono font-bold',
        dateClass: 'text-base',
        layout: 'large',
      };
    }

    // 4x2 - same as 5x2 (large size)
    if (gridWidth === 4 && gridHeight === 2) {
      return {
        timeClass: 'text-4xl font-mono font-bold',
        dateClass: 'text-base',
        layout: 'large',
      };
    }

    // 2x4 - special vertical layout: HH MM DD Mon Aug 4 2025
    if (gridWidth === 2 && gridHeight === 4) {
      return {
        timeClass: 'text-4xl font-mono font-bold leading-tight',
        dateClass: 'text-md py-1',
        layout: 'vertical-2x4',
      };
    }

    // 2x5 - special vertical layout: HH MM DD Mon Aug 4 2025
    if (gridWidth === 2 && gridHeight === 5) {
      return {
        timeClass: 'text-5xl font-mono font-bold leading-tight',
        dateClass: 'text-md py-1',
        layout: 'vertical-2x5',
      };
    }

    // 2x3 - special vertical layout: HH MM DD Mon Aug 4
    if (gridWidth === 2 && gridHeight === 3) {
      return {
        timeClass: 'text-3xl font-mono font-bold leading-tight',
        dateClass: 'text-sm py-1',
        layout: 'vertical-2x3',
      };
    }

    // 3x2 - medium size
    if (gridWidth === 3 && gridHeight === 2) {
      return {
        timeClass: 'text-3xl font-mono font-bold',
        dateClass: 'text-sm',
        layout: 'medium',
      };
    }

    // 3x3 - large size
    if (gridWidth === 3 && gridHeight === 3) {
      return {
        timeClass: 'text-3xl font-mono font-bold',
        dateClass: 'text-base',
        layout: 'large',
      };
    }

    // 3x4 - special vertical layout: HH MM DD Mon Aug 4
    if (gridWidth === 3 && gridHeight === 4) {
      return {
        timeClass: 'text-5xl font-mono font-bold leading-tight',
        dateClass: 'text-md py-1',
        layout: 'vertical-3x4',
      };
    }

    // 3x5 - special vertical layout: HH MM DD Mon Aug 4 2025
    if (gridWidth === 3 && gridHeight === 5) {
      return {
        timeClass: 'text-6xl font-mono font-bold leading-tight',
        dateClass: 'text-md py-1',
        layout: 'vertical-3x5',
      };
    }

    // 4x5 - special vertical layout: HH MM DD Mon Aug 4 2025
    if (gridWidth === 4 && gridHeight === 5) {
      return {
        timeClass: 'text-5xl font-mono font-bold leading-tight',
        dateClass: 'text-md py-1',
        layout: 'vertical-4x5',
      };
    }
    // 4x3 - large size
    if (
      (gridWidth === 4 && gridHeight === 3) ||
      (gridWidth === 4 && gridHeight === 4)
    ) {
      return {
        timeClass: 'text-5xl font-mono font-bold',
        dateClass: 'text-base',
        layout: 'large',
      };
    }
    // 5x3 - large size
    if (gridWidth === 5 && gridHeight === 3) {
      return {
        timeClass: 'text-6xl font-mono font-bold',
        dateClass: 'text-lg',
        layout: 'large',
      };
    }

    // 4x4, 5x4, 5x5 - extra large
    if (
      (gridWidth === 4 && gridHeight === 4) ||
      (gridWidth === 5 && gridHeight === 4) ||
      (gridWidth === 5 && gridHeight === 5)
    ) {
      let timeSize = 'text-4xl';
      let dateSize = 'text-lg';

      if (gridWidth === 5 && gridHeight === 5) {
        timeSize = 'text-6xl';
        dateSize = 'text-2xl';
      } else if (gridWidth === 5 && gridHeight === 4) {
        timeSize = 'text-5xl';
        dateSize = 'text-xl';
      }

      return {
        timeClass: `${timeSize} font-mono font-bold`,
        dateClass: dateSize,
        layout: 'xlarge',
      };
    }

    // Default for other sizes
    return {
      timeClass: 'text-xl font-mono font-bold',
      dateClass: 'text-sm',
      layout: 'standard',
    };
  };

  const { timeClass, dateClass, layout } = getSizeClasses();

  return (
    <div className={`text-center ${className}`}>
      {layout === '2x2-custom' ? (
        // 2x2 layout: HH:MM Mon, Aug 4
        <div className='flex flex-col items-center justify-center h-full'>
          <motion.div
            className={`${timeClass} text-neutral-600 mb-1`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {currentTime.toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
            })}
          </motion.div>
          {showDate && (
            <motion.div
              className={`${dateClass} text-gray-600`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              {currentTime.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </motion.div>
          )}
        </div>
      ) : layout === 'vertical-1x2' ? (
        // 1x2 layout: HH MM Aug 4
        <div className='flex flex-col items-center justify-center h-full'>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {currentTime.getHours().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            {currentTime.getMinutes().toString().padStart(2, '0')}
          </motion.div>
          {showDate && (
            <motion.div
              className={`${dateClass} text-gray-600 mt-0.5`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              {currentTime.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </motion.div>
          )}
        </div>
      ) : layout === 'vertical-1x3' ? (
        // 1x3 layout: HH MM SS Aug 4
        <div className='flex flex-col items-center justify-center h-full'>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {currentTime.getHours().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            {currentTime.getMinutes().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            {currentTime.getSeconds().toString().padStart(2, '0')}
          </motion.div>
          {showDate && (
            <motion.div
              className={`${dateClass} text-gray-600 mt-0.5`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.2 }}
            >
              {currentTime.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </motion.div>
          )}
        </div>
      ) : layout === 'vertical-1x4' ? (
        // 1x4 layout: HH MM SS hari Aug 4
        <div className='flex flex-col items-center justify-center h-full'>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {currentTime.getHours().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            {currentTime.getMinutes().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            {currentTime.getSeconds().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${dateClass} text-gray-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.15 }}
          >
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'short',
            })}
          </motion.div>
          {showDate && (
            <motion.div
              className={`${dateClass} text-gray-600`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.2 }}
            >
              {currentTime.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </motion.div>
          )}
        </div>
      ) : layout === 'vertical-1x5' ? (
        // 1x5 layout: HH MM SS hari Aug 4 (same as 1x4)
        <div className='flex flex-col items-center justify-center h-full'>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {currentTime.getHours().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            {currentTime.getMinutes().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            {currentTime.getSeconds().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${dateClass} text-gray-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.15 }}
          >
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'short',
            })}
          </motion.div>
          {showDate && (
            <motion.div
              className={`${dateClass} text-gray-600`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.2 }}
            >
              {currentTime.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </motion.div>
          )}
        </div>
      ) : layout === 'vertical-2x3' ? (
        // 2x3 layout: HH MM DD Mon Aug 4
        <div className='flex flex-col items-center justify-center h-full'>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {currentTime.getHours().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            {currentTime.getMinutes().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            {currentTime.getSeconds().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${dateClass} text-gray-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.15 }}
          >
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'short',
            })}
          </motion.div>
          {showDate && (
            <motion.div
              className={`${dateClass} text-gray-600`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.2 }}
            >
              {currentTime.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </motion.div>
          )}
        </div>
      ) : layout === 'vertical-2x4' ? (
        // 2x4 layout: HH MM DD Mon Aug 4 2025
        <div className='flex flex-col items-center justify-center h-full'>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {currentTime.getHours().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            {currentTime.getMinutes().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            {currentTime.getSeconds().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${dateClass} text-gray-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.15 }}
          >
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'short',
            })}
          </motion.div>
          {showDate && (
            <>
              <motion.div
                className={`${dateClass} text-gray-600 leading-none`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.2 }}
              >
                {currentTime.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </motion.div>
              <motion.div
                className={`${dateClass} text-gray-600`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.2 }}
              >
                {currentTime.getFullYear()}
              </motion.div>
            </>
          )}
        </div>
      ) : layout === 'vertical-2x5' ? (
        // 2x5 layout: HH MM DD Mon Aug 4 2025
        <div className='flex flex-col items-center justify-center h-full'>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {currentTime.getHours().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            {currentTime.getMinutes().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            {currentTime.getSeconds().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${dateClass} text-gray-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.15 }}
          >
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'short',
            })}
          </motion.div>
          {showDate && (
            <>
              <motion.div
                className={`${dateClass} text-gray-600 leading-none`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.2 }}
              >
                {currentTime.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </motion.div>
              <motion.div
                className={`${dateClass} text-gray-600`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.2 }}
              >
                {currentTime.getFullYear()}
              </motion.div>
            </>
          )}
        </div>
      ) : layout === 'vertical-3x4' ? (
        // 3x4 layout: HH MM DD Mon Aug 4
        <div className='flex flex-col items-center justify-center h-full'>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {currentTime.getHours().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            {currentTime.getMinutes().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            {currentTime.getSeconds().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${dateClass} text-gray-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.15 }}
          >
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'short',
            })}
          </motion.div>
          {showDate && (
            <motion.div
              className={`${dateClass} text-gray-600`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.2 }}
            >
              {currentTime.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </motion.div>
          )}
        </div>
      ) : layout === 'vertical-3x5' ? (
        // 3x5 layout: HH MM DD Mon Aug 4 2025
        <div className='flex flex-col items-center justify-center h-full'>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {currentTime.getHours().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            {currentTime.getMinutes().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            {currentTime.getSeconds().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${dateClass} text-gray-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.15 }}
          >
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'short',
            })}
          </motion.div>
          {showDate && (
            <>
              <motion.div
                className={`${dateClass} text-gray-600 leading-none`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.2 }}
              >
                {currentTime.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </motion.div>
              <motion.div
                className={`${dateClass} text-gray-600`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.2 }}
              >
                {currentTime.getFullYear()}
              </motion.div>
            </>
          )}
        </div>
      ) : layout === 'vertical-4x5' ? (
        // 4x5 layout: HH MM DD Mon Aug 4 2025
        <div className='flex flex-col items-center justify-center h-full'>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {currentTime.getHours().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            {currentTime.getMinutes().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            {currentTime.getSeconds().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${dateClass} text-gray-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.15 }}
          >
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'short',
            })}
          </motion.div>
          {showDate && (
            <>
              <motion.div
                className={`${dateClass} text-gray-600 leading-none`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.2 }}
              >
                {currentTime.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </motion.div>
              <motion.div
                className={`${dateClass} text-gray-600`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.2 }}
              >
                {currentTime.getFullYear()}
              </motion.div>
            </>
          )}
        </div>
      ) : layout === 'vertical-split' ? (
        // Vertical layout for 1xN (tall and narrow) - split time into hours/minutes
        <div className='flex flex-col items-center justify-center'>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {currentTime.getHours().toString().padStart(2, '0')}
          </motion.div>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            {currentTime.getMinutes().toString().padStart(2, '0')}
          </motion.div>
          {showDate && gridHeight >= 4 && (
            <motion.div
              className={`${dateClass} text-gray-600 mt-1`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              {currentTime.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </motion.div>
          )}
        </div>
      ) : layout === 'vertical-compact' ? (
        // Compact vertical layout for smaller 1xN
        <div className='flex flex-col items-center justify-center'>
          <motion.div
            className={`${timeClass} text-neutral-600 leading-none`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {currentTime.toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
            })}
          </motion.div>
          {showDate && (
            <motion.div
              className={`${dateClass} text-gray-600`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              {currentTime.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </motion.div>
          )}
        </div>
      ) : layout === 'horizontal-with-separator' ? (
        // Horizontal layout with separator for 4x1 and 5x1: HH:MM:SS | Mon Date
        <div className='flex items-center justify-center space-x-3'>
          <motion.div
            className={`${timeClass} text-neutral-600`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {currentTime.toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </motion.div>
          {showDate && (
            <>
              <div className='text-gray-400 text-lg font-light'>|</div>
              <motion.div
                className={`${dateClass} text-gray-600`}
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                {currentTime.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </motion.div>
            </>
          )}
        </div>
      ) : (
        // Regular horizontal layout for other variants
        <motion.div
          className={`${timeClass} text-neutral-600 mb-1`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {layout === 'minimal'
            ? currentTime.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
              })
            : currentTime.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
        </motion.div>
      )}

      {showDate &&
        layout !== 'vertical-split' &&
        layout !== 'vertical-compact' &&
        layout !== 'vertical-1x2' &&
        layout !== 'vertical-1x3' &&
        layout !== 'vertical-1x4' &&
        layout !== 'vertical-1x5' &&
        layout !== 'vertical-2x3' &&
        layout !== 'vertical-2x4' &&
        layout !== 'vertical-2x5' &&
        layout !== 'vertical-3x4' &&
        layout !== 'vertical-3x5' &&
        layout !== 'vertical-4x5' &&
        layout !== '2x2-custom' &&
        layout !== 'horizontal-with-separator' && (
          <motion.div
            className={`${dateClass} text-gray-600`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            {layout === 'minimal' || layout === 'horizontal'
              ? currentTime.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : layout === 'xlarge'
              ? currentTime.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : layout === 'large'
              ? currentTime.toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : currentTime.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'long',
                  day: 'numeric',
                })}
          </motion.div>
        )}
    </div>
  );
};
