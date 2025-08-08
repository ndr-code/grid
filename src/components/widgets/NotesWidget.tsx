import { motion } from 'framer-motion';
import { SquarePen } from 'lucide-react';
import type { BaseWidgetProps } from '../../types/types';
import {
  parseGridSize,
  getIconSize,
  getTextSize,
  shouldShowText,
} from '../../utils/widgetUtils';

interface NotesProps extends BaseWidgetProps {
  // Notes data
  notes?: Array<{
    id: string;
    title: string;
    content: string;
    createdAt: Date;
  }>;

  // Notes count display
  showNotesCount?: boolean;
  maxDisplayCount?: number;

  // Notes preview
  showPreview?: boolean;
  previewLength?: number;

  // Notes management callbacks
  onAddNote?: (note: { title: string; content: string }) => void;
  onEditNote?: (
    noteId: string,
    note: { title: string; content: string }
  ) => void;
  onDeleteNote?: (noteId: string) => void;

  // Display preferences
  showAddButton?: boolean;
  showLastModified?: boolean;

  // Widget state
  editMode?: boolean;
}

export const Notes = ({
  size = '2x2',
  className = '',
  notes = [],
  showNotesCount = true,
  showPreview = false,
  previewLength = 50,
  showLastModified = false,
  editMode = false,
  onClick,
}: NotesProps) => {
  const dimensions = parseGridSize(size);
  const iconSize = getIconSize(dimensions);
  const textSize = getTextSize(dimensions);
  const showText = shouldShowText(dimensions);

  // Get the most recent note for preview
  const latestNote =
    notes.length > 0
      ? notes.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0]
      : null;

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <motion.div
      className={`flex items-center justify-center text-gray-800 ${
        !editMode ? 'cursor-pointer hover:bg-white/10' : 'cursor-default'
      } rounded-lg transition-colors duration-200 ${className}`}
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

        {/* Icon and count */}
        <div className='flex items-center space-x-1'>
          <SquarePen
            size={iconSize}
            className={`${
              editMode ? 'text-gray-500' : 'text-gray-900'
            } transition-colors duration-200`}
          />
          {showNotesCount && notes.length > 0 && !editMode && (
            <span className='text-xs bg-blue-500 text-white rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center'>
              {notes.length}
            </span>
          )}
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
            Notes
          </motion.span>
        )}

        {/* Preview content for larger widgets */}
        {showPreview &&
          latestNote &&
          dimensions.width >= 3 &&
          dimensions.height >= 2 &&
          !editMode && (
            <motion.div
              className='text-center space-y-1'
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.2 }}
            >
              <div className='text-xs font-medium text-gray-800 truncate max-w-full'>
                {truncateText(latestNote.title || 'Untitled', 20)}
              </div>
              <div className='text-2xs text-gray-600 leading-tight'>
                {truncateText(latestNote.content, previewLength)}
              </div>
              {showLastModified && (
                <div className='text-2xs text-gray-500'>
                  {formatDate(latestNote.createdAt)}
                </div>
              )}
            </motion.div>
          )}

        {/* Empty state for larger widgets */}
        {notes.length === 0 &&
          dimensions.width >= 2 &&
          dimensions.height >= 2 && (
            <motion.div
              className='text-center'
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.2 }}
            >
              <div className='text-xs text-gray-500 leading-tight'>
                No notes yet
              </div>
            </motion.div>
          )}
      </div>
    </motion.div>
  );
};
