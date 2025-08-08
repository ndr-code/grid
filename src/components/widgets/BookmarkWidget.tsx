import { Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import type { BaseWidgetProps } from '../../types/types';
import {
  parseGridSize,
  getIconSize,
  getTextSize,
  getSecondaryTextSize,
  shouldShowText,
  shouldShowSecondaryText,
} from '../../utils/widgetUtils';

interface BookmarkWidgetProps extends BaseWidgetProps {
  url?: string;
  onLeftClick?: () => void;
  onRightClick?: (e: React.MouseEvent) => void;
}

export function BookmarkWidget({
  size = '2x2',
  className = '',
  onClick,
  onLeftClick,
  onRightClick,
  url = 'https://example.com',
}: BookmarkWidgetProps) {
  const dimensions = parseGridSize(size);

  const getIcon = () => {
    const iconSize = getIconSize(dimensions);
    return <Bookmark size={iconSize} className='text-gray-900' />;
  };

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.button === 2) {
      // Right click
      if (onRightClick) {
        onRightClick(e);
      }
    } else if (e.button === 0) {
      // Left click
      if (onLeftClick) {
        onLeftClick();
      } else if (onClick) {
        onClick();
      } else {
        // Default behavior: open URL in new tab
        window.open(url, '_blank');
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onRightClick) {
      onRightClick(e);
    }
  };

  return (
    <motion.div
      className={`flex items-center justify-center text-gray-800 cursor-pointer hover:bg-white/10 rounded-lg transition-colors duration-200 ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        width: '100%',
        height: '100%',
      }}
      onMouseDown={handleClick}
      onContextMenu={handleContextMenu}
    >
      <div className='flex flex-col items-center justify-center space-y-1 px-2 py-1'>
        {getIcon()}
        {shouldShowText(dimensions) && (
          <motion.span
            className={`font-medium text-gray-900 text-center leading-tight ${getTextSize(
              dimensions
            )}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            Bookmark
          </motion.span>
        )}
        {shouldShowSecondaryText(dimensions) && (
          <motion.span
            className={`text-gray-600 text-center leading-tight truncate max-w-full ${getSecondaryTextSize(
              dimensions
            )}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.2 }}
            title={url}
          >
            {formatUrl(url)}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}

export default BookmarkWidget;
