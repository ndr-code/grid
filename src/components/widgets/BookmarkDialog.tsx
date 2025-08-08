import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SquarePlus,
  SquareX,
  ExternalLink,
  Edit3,
  Save,
  X,
} from 'lucide-react';
import { BookmarkWidget } from './BookmarkWidget';

interface BookmarkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssignToGrid?: (url: string) => void;
  onRemoveWidget?: () => void;
  mode?: 'assign' | 'view';
  initialUrl?: string;
}

export const BookmarkDialog = ({
  open,
  onOpenChange,
  onAssignToGrid,
  onRemoveWidget,
  mode = 'assign',
  initialUrl = 'https://example.com',
}: BookmarkDialogProps) => {
  const [url, setUrl] = useState(initialUrl);
  const [isEditing, setIsEditing] = useState(mode === 'assign');
  const [tempUrl, setTempUrl] = useState(url);

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleAssignToGrid = () => {
    if (isValidUrl(url)) {
      onAssignToGrid?.(url);
      onOpenChange(false);
    }
  };

  const handleRemoveWidget = () => {
    onRemoveWidget?.();
    onOpenChange(false);
  };

  const handleOpenUrl = () => {
    if (isValidUrl(url)) {
      window.open(url, '_blank');
    }
  };

  const handleStartEdit = () => {
    setTempUrl(url);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (isValidUrl(tempUrl)) {
      setUrl(tempUrl);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setTempUrl(url);
    setIsEditing(false);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempUrl(e.target.value);
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
          <Dialog.Portal>
            <Dialog.Overlay asChild>
              <motion.div
                className='fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[100]'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className='flex flex-col items-center justify-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 rounded-lg p-8 shadow-xl max-w-md w-full mx-4 z-[101]'
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  y: -20,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  y: -20,
                }}
                transition={{
                  duration: 0.3,
                  ease: 'easeOut',
                }}
              >
                <Dialog.Title className='text-2xl font-bold text-gray-600 mb-6 text-center'>
                  Bookmark Widget
                </Dialog.Title>

                {/* Bookmark Widget Preview */}
                <div className='mb-6'>
                  <BookmarkWidget size='3x3' url={url} />
                </div>

                {/* URL Input/Display */}
                <div className='w-full mb-6'>
                  {isEditing ? (
                    <motion.div
                      className='space-y-3'
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          URL:
                        </label>
                        <input
                          type='url'
                          value={tempUrl}
                          onChange={handleUrlChange}
                          placeholder='https://example.com'
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                          autoFocus
                        />
                        {tempUrl && !isValidUrl(tempUrl) && (
                          <p className='text-red-500 text-xs mt-1'>
                            Please enter a valid URL
                          </p>
                        )}
                      </div>
                      <div className='flex justify-end space-x-2'>
                        <button
                          onClick={handleCancelEdit}
                          className='px-3 py-1.5 text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm flex items-center gap-1'
                        >
                          <X className='w-3 h-3' />
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          disabled={!isValidUrl(tempUrl)}
                          className='px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded text-sm flex items-center gap-1 transition-colors duration-200'
                        >
                          <Save className='w-3 h-3' />
                          Save
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      className='text-center space-y-2'
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className='text-sm text-gray-600'>Current URL:</div>
                      <div className='text-blue-600 text-sm font-mono break-all'>
                        {formatUrl(url)}
                      </div>
                      <div className='flex justify-center space-x-2 pt-2'>
                        <button
                          onClick={handleOpenUrl}
                          className='px-3 py-1.5 text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm flex items-center gap-1'
                        >
                          <ExternalLink className='w-3 h-3' />
                          Open
                        </button>
                        <button
                          onClick={handleStartEdit}
                          className='px-3 py-1.5 text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm flex items-center gap-1'
                        >
                          <Edit3 className='w-3 h-3' />
                          Edit
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Action Buttons */}
                {!isEditing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.2 }}
                  >
                    {mode === 'assign' ? (
                      <motion.button
                        className='bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer flex items-center gap-2'
                        onClick={handleAssignToGrid}
                        disabled={!isValidUrl(url)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title='Assign to Grid'
                      >
                        <SquarePlus className='w-4 h-4' />
                        Assign to Grid
                      </motion.button>
                    ) : (
                      <motion.button
                        className='bg-red-500 hover:bg-red-600 text-white px-4 py-3 text-sm rounded-lg font-medium transition-colors duration-200 cursor-pointer flex items-center gap-2'
                        onClick={handleRemoveWidget}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title='Remove Widget'
                      >
                        <SquareX className='w-4 h-4' />
                        Remove Widget
                      </motion.button>
                    )}
                  </motion.div>
                )}

                {/* Close Button */}
                <Dialog.Close asChild>
                  <motion.button
                    className='cursor-pointer absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors'
                    aria-label='Close'
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Cross2Icon className='w-4 h-4' />
                  </motion.button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  );
};

export default BookmarkDialog;
