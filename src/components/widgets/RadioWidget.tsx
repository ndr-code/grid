import React from 'react';
import { Radio } from 'lucide-react';

export interface RadioWidgetProps {
  size: string;
  onClick?: () => void;
}

const RadioWidget: React.FC<RadioWidgetProps> = ({ size, onClick }) => {
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
      <Radio
        size={iconSize}
        className='text-gray-900 hover:text-gray-700 transition-colors duration-200'
      />
    </div>
  );
};

export default RadioWidget;
