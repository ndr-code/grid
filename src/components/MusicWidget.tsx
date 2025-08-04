import React from 'react';
import { AudioLines } from 'lucide-react';

export interface MusicWidgetProps {
  size: string;
  onClick?: () => void;
}

const MusicWidget: React.FC<MusicWidgetProps> = ({ size, onClick }) => {
  // Parse size to determine icon size
  const [width, height] = size.split('x').map(Number);

  // Determine icon size based on widget dimensions
  const getIconSize = () => {
    if (width >= 3 && height >= 3) return 48;
    if (width >= 2 && height >= 2) return 36;
    return 24;
  };

  const iconSize = getIconSize();

  return (
    <div
      className='w-full h-full flex items-center justify-center cursor-pointer hover:bg-white/10 rounded-lg transition-colors duration-200'
      onClick={onClick}
    >
      <AudioLines size={iconSize} className='text-gray-900' />
    </div>
  );
};

export default MusicWidget;
