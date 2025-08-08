import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Bookmark, Edit2, Trash2, ExternalLink, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BookmarkWidget from './widgets/BookmarkWidget';
import type { GridBox } from '../types/types';

interface BookmarkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssignToGrid: (url: string) => void;
  onRemoveWidget: () => void;
  onEditBookmark?: (boxId: string, newUrl: string) => void;
  allBoxes?: GridBox[];
}

export function BookmarkDialog({
  open,
  onOpenChange,
  onAssignToGrid,
  onRemoveWidget,
  onEditBookmark,
  allBoxes = [],
}: BookmarkDialogProps) {
  const [newUrl, setNewUrl] = useState('');
  const [editingBoxId, setEditingBoxId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);

  // Get all bookmark widgets from boxes
  const bookmarkWidgets = allBoxes.filter(
    (box) => box.widget?.type === 'bookmark'
  );

  // Validate URL
  useEffect(() => {
    const urlToValidate = editingBoxId ? editUrl : newUrl;
    try {
      new URL(urlToValidate);
      setIsValidUrl(urlToValidate.length > 0);
    } catch {
      setIsValidUrl(false);
    }
  }, [newUrl, editUrl, editingBoxId]);

  const handleSubmit = () => {
    if (editingBoxId && onEditBookmark) {
      // Edit existing bookmark
      onEditBookmark(editingBoxId, editUrl);
      setEditingBoxId(null);
      setEditUrl('');
    } else if (isValidUrl) {
      // Create new bookmark
      onAssignToGrid(newUrl);
      setNewUrl('');
      onOpenChange(false);
    }
  };

  const handleEdit = (boxId: string, currentUrl: string) => {
    setEditingBoxId(boxId);
    setEditUrl(currentUrl);
  };

  const handleCancelEdit = () => {
    setEditingBoxId(null);
    setEditUrl('');
  };

  const openBookmark = (url: string) => {
    window.open(url, '_blank');
  };

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            className='fixed inset-0 bg-black/50 z-50'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <motion.div
            className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-full max-w-md max-h-[90vh] overflow-y-auto'
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className='p-6'>
              <Dialog.Title className='flex items-center gap-2 text-xl font-semibold text-gray-900 mb-6'>
                <Bookmark className='h-5 w-5' />
                Bookmark Manager
              </Dialog.Title>

              <button
                onClick={() => onOpenChange(false)}
                className='absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'
              >
                <X className='h-4 w-4' />
              </button>

              <div className='space-y-4'>
                {/* Add New Bookmark Section */}
                <div className='space-y-3'>
                  <h3 className='text-sm font-medium flex items-center gap-2'>
                    <Plus className='h-4 w-4' />
                    Add New Bookmark
                  </h3>

                  <div className='flex gap-2'>
                    <input
                      type='url'
                      placeholder='Enter URL (e.g., https://example.com)'
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      className='flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && isValidUrl && !editingBoxId) {
                          handleSubmit();
                        }
                      }}
                    />
                    <button
                      onClick={handleSubmit}
                      disabled={!isValidUrl || !!editingBoxId}
                      className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
                    >
                      Assign to Grid
                    </button>
                  </div>

                  {newUrl && !isValidUrl && (
                    <p className='text-xs text-red-500'>
                      Please enter a valid URL (e.g., https://example.com)
                    </p>
                  )}
                </div>

                {/* Existing Bookmarks Section */}
                {bookmarkWidgets.length > 0 && (
                  <div className='space-y-3'>
                    <h3 className='text-sm font-medium'>
                      Saved Bookmarks ({bookmarkWidgets.length})
                    </h3>

                    <div className='space-y-2 max-h-60 overflow-y-auto'>
                      <AnimatePresence>
                        {bookmarkWidgets.map((box) => {
                          const url =
                            (box.widget?.data?.url as string) ||
                            'https://example.com';
                          const isEditing = editingBoxId === box.id;

                          return (
                            <motion.div
                              key={box.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className='flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50'
                            >
                              {/* Bookmark Widget Preview */}
                              <div className='w-12 h-12 flex-shrink-0'>
                                <BookmarkWidget
                                  size='1x1'
                                  url={url}
                                  className='w-full h-full'
                                />
                              </div>

                              {/* URL Info */}
                              <div className='flex-1 min-w-0'>
                                {isEditing ? (
                                  <div className='space-y-2'>
                                    <input
                                      type='url'
                                      value={editUrl}
                                      onChange={(e) =>
                                        setEditUrl(e.target.value)
                                      }
                                      className='w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500'
                                      autoFocus
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' && isValidUrl) {
                                          handleSubmit();
                                        } else if (e.key === 'Escape') {
                                          handleCancelEdit();
                                        }
                                      }}
                                    />
                                    <div className='flex gap-2'>
                                      <button
                                        onClick={handleSubmit}
                                        disabled={!isValidUrl}
                                        className='px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={handleCancelEdit}
                                        className='px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors'
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <p className='text-sm font-medium text-gray-900 truncate'>
                                      {formatUrl(url)}
                                    </p>
                                    <p className='text-xs text-gray-500 truncate'>
                                      {url}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Action Buttons */}
                              {!isEditing && (
                                <div className='flex gap-1'>
                                  <button
                                    onClick={() => openBookmark(url)}
                                    className='p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors'
                                    title='Open in new tab'
                                  >
                                    <ExternalLink className='h-4 w-4' />
                                  </button>
                                  <button
                                    onClick={() => handleEdit(box.id, url)}
                                    className='p-1 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors'
                                    title='Edit URL'
                                  >
                                    <Edit2 className='h-4 w-4' />
                                  </button>
                                  <button
                                    onClick={() => {
                                      // Remove the widget from the grid
                                      if (onRemoveWidget) {
                                        onRemoveWidget();
                                      }
                                    }}
                                    className='p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors'
                                    title='Remove from grid'
                                  >
                                    <Trash2 className='h-4 w-4' />
                                  </button>
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {bookmarkWidgets.length === 0 && (
                  <div className='text-center py-8 text-gray-500'>
                    <Bookmark className='h-12 w-12 mx-auto mb-3 text-gray-300' />
                    <p className='text-sm'>No bookmarks saved yet</p>
                    <p className='text-xs text-gray-400'>
                      Add a URL above to create your first bookmark
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default BookmarkDialog;
