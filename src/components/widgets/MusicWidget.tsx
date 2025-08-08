import React from 'react';
import { AudioLines } from 'lucide-react';
import { motion } from 'framer-motion';
import type { BaseWidgetProps } from '../../types/types';
import {
  parseGridSize,
  getIconSize,
  getTextSize,
  shouldShowText,
} from '../../utils/widgetUtils';

export interface MusicWidgetProps extends BaseWidgetProps {
  // Music playback state
  isPlaying?: boolean;
  isMuted?: boolean;
  volume?: number;

  // Current track information
  currentTrack?: {
    id: string;
    title: string;
    description?: string;
    youtubeId?: string;
    category?: string;
  };

  // Music controls callbacks
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onVolumeChange?: (volume: number) => void;
  onMuteToggle?: () => void;

  // Display preferences
  showTrackName?: boolean;
  showPlayButton?: boolean;
  showVolumeControl?: boolean;

  // Widget state
  editMode?: boolean;
}

const MusicWidget: React.FC<MusicWidgetProps> = ({ size = '2x2', onClick }) => {
  const dimensions = parseGridSize(size);
  const iconSize = getIconSize(dimensions);
  const textSize = getTextSize(dimensions);
  const showText = shouldShowText(dimensions);

  return (
    <motion.div
      className='flex items-center justify-center text-gray-800 cursor-pointer hover:bg-white/10 rounded-lg transition-colors duration-200'
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        width: '100%',
        height: '100%',
      }}
      onClick={onClick}
    >
      <div className='flex flex-col items-center justify-center space-y-1'>
        <AudioLines size={iconSize} className='text-gray-900' />
        {showText && (
          <motion.span
            className={`font-medium text-gray-900 text-center leading-tight ${textSize}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            Music
          </motion.span>
        )}
      </div>
    </motion.div>
  );
};

export default MusicWidget;
