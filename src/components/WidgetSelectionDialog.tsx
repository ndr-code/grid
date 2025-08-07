import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Timer, StickyNote, AudioLines, Radio } from 'lucide-react';

interface WidgetSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectWidget: (
    widgetType: 'clock' | 'timer' | 'notes' | 'music' | 'radio'
  ) => void;
}

export const WidgetSelectionDialog = ({
  open,
  onOpenChange,
  onSelectWidget,
}: WidgetSelectionDialogProps) => {
  const handleSelectWidget = (
    widgetType: 'clock' | 'timer' | 'notes' | 'music' | 'radio'
  ) => {
    onSelectWidget(widgetType);
    onOpenChange(false);
  };

  const widgets = [
    {
      type: 'clock' as const,
      name: 'Clock',
      icon: Clock,
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'Digital clock widget',
    },
    {
      type: 'timer' as const,
      name: 'Timer',
      icon: Timer,
      color: 'bg-green-500 hover:bg-green-600',
      description: 'Timer timer widget',
    },
    {
      type: 'notes' as const,
      name: 'Notes',
      icon: StickyNote,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      description: 'Note-taking widget',
    },
    {
      type: 'music' as const,
      name: 'Music',
      icon: AudioLines,
      color: 'bg-purple-500 hover:bg-purple-600',
      description: 'Music player widget',
    },
    {
      type: 'radio' as const,
      name: 'Radio',
      icon: Radio,
      color: 'bg-red-500 hover:bg-red-600',
      description: 'Radio player widget',
    },
  ];

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
                  Select Widget
                </Dialog.Title>

                <div className='grid grid-cols-1 gap-3 w-full'>
                  {widgets.map((widget) => (
                    <motion.button
                      key={widget.type}
                      className={`${widget.color} text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer flex items-center gap-3`}
                      onClick={() => handleSelectWidget(widget.type)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <widget.icon className='w-5 h-5' />
                      <div className='text-left'>
                        <div className='font-semibold'>{widget.name}</div>
                        <div className='text-xs opacity-90'>
                          {widget.description}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

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
