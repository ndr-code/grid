import React from 'react';
import { Radio } from 'lucide-react';
import { motion } from 'framer-motion';
import type { BaseWidgetProps } from '../../types/types';
import {
  parseGridSize,
  getIconSize,
  getTextSize,
  shouldShowText,
} from '../../utils/widgetUtils';

export interface RadioWidgetProps extends BaseWidgetProps {
  // Radio station information
  station?: {
    id: string;
    name: string;
    frequency?: string;
    streamUrl: string;
    embedUrl?: string;
    logo?: string;
    genre?: string;
    description?: string;
  };

  // Radio playback state
  isPlaying?: boolean;
  isLoading?: boolean;
  volume?: number;
  isMuted?: boolean;

  // Radio controls callbacks
  onPlay?: () => void;
  onStop?: () => void;
  onVolumeChange?: (volume: number) => void;
  onMuteToggle?: () => void;
  onStationChange?: (stationId: string) => void;

  // Display preferences
  showStationName?: boolean;
  showFrequency?: boolean;
  showPlayButton?: boolean;
  showVolumeControl?: boolean;
  showLiveIndicator?: boolean;

  // Popup/external player options
  openInPopup?: boolean;
  popupFeatures?: string;

  // Widget state
  editMode?: boolean;
}

const RadioWidget: React.FC<RadioWidgetProps> = ({
  size = '2x2',
  onClick,
  station,
  isPlaying = false,
  isLoading = false,
  showStationName = true,
  showFrequency = false,
  showLiveIndicator = true,
  editMode = false,
}) => {
  const dimensions = parseGridSize(size);
  const iconSize = getIconSize(dimensions);
  const textSize = getTextSize(dimensions);
  const showText = shouldShowText(dimensions);

  return (
    <motion.div
      className={`flex items-center justify-center text-gray-800 ${
        !editMode ? 'cursor-pointer hover:bg-white/10' : 'cursor-default'
      } rounded-lg transition-colors duration-200`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        width: '100%',
        height: '100%',
      }}
      onClick={!editMode ? onClick : undefined}
    >
      <div className='flex flex-col items-center justify-center space-y-1 p-2 relative'>
        {/* Edit mode indicator */}
        {editMode && (
          <div className='absolute top-0 right-0 w-2 h-2 bg-orange-400 rounded-full opacity-60'></div>
        )}

        {/* Live indicator */}
        {showLiveIndicator && isPlaying && !editMode && (
          <div className='absolute top-0 left-0 w-2 h-2 bg-red-500 rounded-full animate-pulse'></div>
        )}

        {/* Icon with loading/playing state */}
        <div className='flex items-center space-x-1'>
          <div className='relative'>
            <Radio
              size={iconSize}
              className={`${
                editMode
                  ? 'text-gray-500'
                  : isPlaying
                  ? 'text-blue-600'
                  : 'text-gray-900'
              } transition-colors duration-200`}
            />
            {isLoading && !editMode && (
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
              </div>
            )}
          </div>
        </div>

        {/* Widget title */}
        {showText && (
          <motion.span
            className={`font-medium ${
              editMode ? 'text-gray-600' : 'text-gray-900'
            } text-center leading-tight ${textSize} transition-colors duration-200`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            Radio
          </motion.span>
        )}

        {/* Station info for larger widgets */}
        {station &&
          dimensions.width >= 3 &&
          dimensions.height >= 2 &&
          !editMode && (
            <motion.div
              className='text-center space-y-1'
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.2 }}
            >
              {showStationName && (
                <div className='text-xs font-medium text-gray-800 truncate max-w-full'>
                  {station.name}
                </div>
              )}
              {showFrequency && station.frequency && (
                <div className='text-2xs text-gray-600'>
                  {station.frequency}
                </div>
              )}
              {station.genre && (
                <div className='text-2xs text-gray-500'>{station.genre}</div>
              )}
            </motion.div>
          )}

        {/* Default station info for medium widgets */}
        {!station &&
          dimensions.width >= 2 &&
          dimensions.height >= 2 &&
          !editMode && (
            <motion.div
              className='text-center'
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.2 }}
            >
              <div className='text-xs text-gray-500 leading-tight'>
                JAK 101 FM
              </div>
            </motion.div>
          )}
      </div>
    </motion.div>
  );
};

export default RadioWidget;
