import { motion } from 'framer-motion';
import { SquarePen } from 'lucide-react';

interface NotesProps {
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
}

export const Notes = ({ size = '2x2', className = '' }: NotesProps) => {
  // Helper function to parse grid dimensions from size string
  const parseGridSize = (gridSize: string) => {
    const [w, h] = gridSize.split('x').map(Number);
    return { width: w, height: h };
  };

  const { width: gridWidth, height: gridHeight } = parseGridSize(size);
  const totalArea = gridWidth * gridHeight;

  const getIconSize = () => {
    const maxDimension = Math.max(gridWidth, gridHeight);

    // 1x1 - minimal display
    if (gridWidth === 1 && gridHeight === 1) return 14;

    // 1xN or Nx1 - compact display
    if (gridWidth === 1 || gridHeight === 1) return 18;

    // 2x2 - standard size
    if (gridWidth === 2 && gridHeight === 2) return 24;

    // 2x3, 3x2 - medium size
    if (totalArea >= 6 && totalArea <= 8 && maxDimension <= 3) return 32;

    // 3x3, 3x4, 4x3 - large size
    if (totalArea >= 9 && totalArea <= 12) return 48;

    // 4x4+ - extra large
    if (totalArea >= 16) {
      if (totalArea >= 25) return 80; // 5x5+
      if (totalArea >= 20) return 72; // 4x5, 5x4
      return 64; // 4x4
    }

    return 32; // default
  };

  const getTextSize = () => {
    // 1x1 - no text
    if (gridWidth === 1 && gridHeight === 1) return '';

    // 1xN or Nx1 - minimal text
    if (gridWidth === 1 || gridHeight === 1) return 'text-xs';

    // 2x2 - small text
    if (gridWidth === 2 && gridHeight === 2) return 'text-sm';

    // 2x3, 3x2 - base text
    if (totalArea >= 6 && totalArea <= 8) return 'text-base';

    // 3x3, 3x4, 4x3 - large text
    if (totalArea >= 9 && totalArea <= 12) return 'text-lg';

    // 4x4+ - extra large text
    if (totalArea >= 16) {
      if (totalArea >= 25) return 'text-4xl'; // 5x5+
      if (totalArea >= 20) return 'text-3xl'; // 4x5, 5x4
      return 'text-2xl'; // 4x4
    }

    return 'text-base'; // default
  };

  const shouldShowText = () => {
    return gridWidth !== 1 || gridHeight !== 1; // Show text for anything larger than 1x1
  };

  const getIcon = () => {
    const iconSize = getIconSize();

    // Always use SquarePen icon for consistency
    return <SquarePen size={iconSize} className='text-gray-900' />;
  };

  return (
    <motion.div
      className={`flex items-center justify-center text-gray-800 ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <div className='flex flex-col items-center justify-center space-y-1'>
        {getIcon()}
        {shouldShowText() && (
          <motion.span
            className={`font-medium text-gray-900 text-center leading-tight ${getTextSize()}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            Notes
          </motion.span>
        )}
      </div>
    </motion.div>
  );
};
