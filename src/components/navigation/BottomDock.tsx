import {
  AlarmClock,
  SquarePen,
  AudioLines,
  Radio,
  Bookmark,
  Clock3,
  CheckSquare,
  Music,
} from 'lucide-react';
import { Tooltip, TooltipProvider } from '../ui/Tooltip';

interface BottomDockProps {
  editMode?: boolean;
  onClockClick: () => void;
  onAnalogClockClick: () => void;
  onTimerClick: () => void;
  onNotesClick: () => void;
  onBookmarkClick: () => void;
  onTodoListClick: () => void;
  onAmbientSoundClick: () => void;
  onMusicClick: () => void;
  onRadioClick: () => void;
  onWidgetDragStart?: (widgetType: string) => void;
  onWidgetDragEnd?: () => void;
}

export const BottomDock = ({
  editMode = false,
  onClockClick,
  onAnalogClockClick,
  onTimerClick,
  onNotesClick,
  onBookmarkClick,
  onTodoListClick,
  onAmbientSoundClick,
  onMusicClick,
  onRadioClick,
  onWidgetDragStart,
  onWidgetDragEnd,
}: BottomDockProps) => {
  const handleDragStart = (e: React.DragEvent, widgetType: string) => {
    if (editMode) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('widget-type', widgetType);
    e.dataTransfer.effectAllowed = 'copy';
    // Notify parent component that widget drag has started
    if (onWidgetDragStart) {
      onWidgetDragStart(widgetType);
    }
  };

  const handleDragEnd = () => {
    // Notify parent component that widget drag has ended
    if (onWidgetDragEnd) {
      onWidgetDragEnd();
    }
  };

  // Separator component
  const Separator = () => <div className='h-8 w-px bg-white/20'></div>;

  return (
    <TooltipProvider>
      <div className='h-16 bg-white/10 w-full flex-shrink-0 border-t-2 border-white/20 flex items-center justify-center gap-6 px-8'>
        {/* First Section: Digital Clock, Analog Clock, Timer */}
        <Tooltip content={editMode ? 'Disabled in Edit Mode' : 'Digital Clock'}>
          <div
            draggable={!editMode}
            onDragStart={(e) => handleDragStart(e, 'clock')}
            onDragEnd={handleDragEnd}
            className='inline-block'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width={24}
              height={24}
              viewBox='0 0 24 24'
              className={`w-6 h-6 text-white transition-all duration-200 ${
                editMode
                  ? 'opacity-20 cursor-not-allowed'
                  : 'cursor-pointer hover:scale-110 hover:-translate-y-1'
              }`}
              onClick={editMode ? undefined : onClockClick}
            >
              <path
                fill='currentColor'
                d='M2 6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2M2 8h20v8H2m1-7v1.5h3.25L3 15h1.75L8 10.5V9m1.25 0v1.5h1.5V9M12 9v1.5h1.5V15H15V9m2 0a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1m-2.5 1.5h2v3h-2m-8.25 0V15h1.5v-1.5'
              ></path>
            </svg>
          </div>
        </Tooltip>

        <Tooltip content={editMode ? 'Disabled in Edit Mode' : 'Analog Clock'}>
          <div className='inline-block'>
            <Clock3
              className={`w-6 h-6 text-white transition-all duration-200 ${
                editMode
                  ? 'opacity-20 cursor-not-allowed'
                  : 'cursor-pointer hover:scale-110 hover:-translate-y-1'
              }`}
              onClick={editMode ? undefined : onAnalogClockClick}
            />
          </div>
        </Tooltip>

        <Tooltip content={editMode ? 'Disabled in Edit Mode' : 'Timer'}>
          <div
            draggable={!editMode}
            onDragStart={(e) => handleDragStart(e, 'timer')}
            onDragEnd={handleDragEnd}
            className='inline-block'
          >
            <AlarmClock
              className={`w-6 h-6 text-white transition-all duration-200 ${
                editMode
                  ? 'opacity-20 cursor-not-allowed'
                  : 'cursor-pointer hover:scale-110 hover:-translate-y-1'
              }`}
              onClick={editMode ? undefined : onTimerClick}
            />
          </div>
        </Tooltip>

        <Separator />

        {/* Second Section: Notes, Bookmark, Todo List */}
        <Tooltip content={editMode ? 'Disabled in Edit Mode' : 'Notes'}>
          <div
            draggable={!editMode}
            onDragStart={(e) => handleDragStart(e, 'notes')}
            onDragEnd={handleDragEnd}
            className='inline-block'
          >
            <SquarePen
              className={`w-6 h-6 text-white transition-all duration-200 ${
                editMode
                  ? 'opacity-20 cursor-not-allowed'
                  : 'cursor-pointer hover:scale-110 hover:-translate-y-1'
              }`}
              onClick={editMode ? undefined : onNotesClick}
            />
          </div>
        </Tooltip>

        <Tooltip content={editMode ? 'Disabled in Edit Mode' : 'Todo List'}>
          <div className='inline-block'>
            <CheckSquare
              className={`w-6 h-6 text-white transition-all duration-200 ${
                editMode
                  ? 'opacity-20 cursor-not-allowed'
                  : 'cursor-pointer hover:scale-110 hover:-translate-y-1'
              }`}
              onClick={editMode ? undefined : onTodoListClick}
            />
          </div>
        </Tooltip>

        <Tooltip content={editMode ? 'Disabled in Edit Mode' : 'Bookmark'}>
          <div
            draggable={!editMode}
            onDragStart={(e) => handleDragStart(e, 'bookmark')}
            onDragEnd={handleDragEnd}
            className='inline-block'
          >
            <Bookmark
              className={`w-6 h-6 text-white transition-all duration-200 ${
                editMode
                  ? 'opacity-20 cursor-not-allowed'
                  : 'cursor-pointer hover:scale-110 hover:-translate-y-1'
              }`}
              onClick={editMode ? undefined : onBookmarkClick}
            />
          </div>
        </Tooltip>

        <Separator />

        {/* Third Section: Ambient Sound, Music (AudioLines), Radio */}
        <Tooltip content={editMode ? 'Disabled in Edit Mode' : 'Ambient Sound'}>
          <div className='inline-block'>
            <AudioLines
              className={`w-6 h-6 text-white transition-all duration-200 ${
                editMode
                  ? 'opacity-20 cursor-not-allowed'
                  : 'cursor-pointer hover:scale-110 hover:-translate-y-1'
              }`}
              onClick={editMode ? undefined : onAmbientSoundClick}
            />
          </div>
        </Tooltip>

        <Tooltip content={editMode ? 'Disabled in Edit Mode' : 'Music'}>
          <div
            draggable={!editMode}
            onDragStart={(e) => handleDragStart(e, 'music')}
            onDragEnd={handleDragEnd}
            className='inline-block'
          >
            <Music
              className={`w-6 h-6 text-white transition-all duration-200 ${
                editMode
                  ? 'opacity-20 cursor-not-allowed'
                  : 'cursor-pointer hover:scale-110 hover:-translate-y-1'
              }`}
              onClick={editMode ? undefined : onMusicClick}
            />
          </div>
        </Tooltip>

        <Tooltip content={editMode ? 'Disabled in Edit Mode' : 'Radio'}>
          <div
            draggable={!editMode}
            onDragStart={(e) => handleDragStart(e, 'radio')}
            onDragEnd={handleDragEnd}
            className='inline-block'
          >
            <Radio
              className={`w-6 h-6 text-white transition-all duration-200 ${
                editMode
                  ? 'opacity-20 cursor-not-allowed'
                  : 'cursor-pointer hover:scale-110 hover:-translate-y-1'
              }`}
              onClick={editMode ? undefined : onRadioClick}
            />
          </div>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
