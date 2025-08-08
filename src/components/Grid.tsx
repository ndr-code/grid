import React from 'react';
import type { GridBox, Position } from '../types/types';
import { BOX_SIZE, GAP } from '../constants';
import { Clock } from './widgets/ClockWidget';
import { Timer } from './widgets/TimerWidget';
import { Notes } from './widgets/NotesWidget';
import MusicWidget from './widgets/MusicWidget';
import RadioWidget from './widgets/RadioWidget';
import BookmarkWidget from './widgets/BookmarkWidget';

interface GridProps {
  boxes: GridBox[];
  editMode: boolean;
  isDragging: boolean;
  isDraggingWidget: boolean;
  dragStartBox: string | null;
  dragOverBox: string | null;
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  gridWidth: number;
  gridHeight: number;
  ghostPositions: Position[];
  assignmentMode: {
    active: boolean;
    widgetType: string | null;
  };
  mergePreview: {
    visible: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    boxIds: string[];
  } | null;
  explodingBoxId: string | null;
  invalidMergeTarget: string | null;
  onAddBox: (x: number, y: number) => void;
  onAssignWidget: (boxId: string) => void;
  onAssignWidgetByDrag?: (boxId: string, widgetType: string) => void;
  onClockWidgetClick: (boxId: string) => void;
  onTimerWidgetClick: (boxId: string) => void;
  onNotesWidgetClick: () => void;
  onMusicWidgetClick: () => void;
  onRadioWidgetClick: () => void;
  onBookmarkWidgetClick: () => void;
  onBookmarkWidgetLeftClick?: (boxId: string, url: string) => void;
  onBookmarkWidgetRightClick?: (e: React.MouseEvent, boxId: string) => void;
  onMouseDown: (e: React.MouseEvent, boxId: string) => void;
  onContextMenu: (e: React.MouseEvent, boxId: string) => void;
  onShowContextMenu?: (e: React.MouseEvent, boxId: string) => void;
  onMouseEnter: (boxId: string) => void;
  onMouseLeave: (boxId: string) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onGhostBoxDrop?: (ghostX: number, ghostY: number) => void;
  onWidgetDragEnterGrid?: () => void;
  onWidgetDragLeaveGrid?: () => void;
}

const getPixelPosition = (
  x: number,
  y: number,
  bounds: { minX: number; maxX: number; minY: number; maxY: number }
) => ({
  left: (x - bounds.minX) * (BOX_SIZE + GAP),
  top: (y - bounds.minY) * (BOX_SIZE + GAP),
});

const Grid: React.FC<GridProps> = ({
  boxes,
  editMode,
  isDragging,
  isDraggingWidget,
  dragStartBox,
  dragOverBox,
  bounds,
  gridWidth,
  gridHeight,
  ghostPositions,
  assignmentMode,
  mergePreview,
  explodingBoxId,
  invalidMergeTarget,
  onAddBox,
  onAssignWidget,
  onAssignWidgetByDrag,
  onClockWidgetClick,
  onTimerWidgetClick,
  onNotesWidgetClick,
  onMusicWidgetClick,
  onRadioWidgetClick,
  onBookmarkWidgetClick,
  onBookmarkWidgetLeftClick,
  onBookmarkWidgetRightClick,
  onMouseDown,
  onContextMenu,
  onShowContextMenu,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
  onGhostBoxDrop,
  onWidgetDragEnterGrid,
  onWidgetDragLeaveGrid,
}) => {
  const renderWidgetContent = (box: GridBox) => {
    if (!box.widget) return null;

    // Determine size based on box dimensions
    const getWidgetSize = (box: GridBox) => {
      const { width, height } = box;
      return `${width}x${height}` as
        | '1x1'
        | '1x2'
        | '1x3'
        | '1x4'
        | '1x5'
        | '2x1'
        | '2x2'
        | '2x3'
        | '2x4'
        | '2x5'
        | '3x1'
        | '3x2'
        | '3x3'
        | '3x4'
        | '3x5'
        | '4x1'
        | '4x2'
        | '4x3'
        | '4x4'
        | '4x5'
        | '5x1'
        | '5x2'
        | '5x3'
        | '5x4'
        | '5x5';
    };

    const widgetSize = getWidgetSize(box);

    switch (box.widget.type) {
      case 'clock':
        return <Clock size={widgetSize} />;
      case 'timer':
        return <Timer size={widgetSize} editMode={editMode} />;
      case 'notes':
        return <Notes size={widgetSize} />;
      case 'music':
        return (
          <MusicWidget size={widgetSize} onClick={() => onMusicWidgetClick()} />
        );
      case 'radio':
        return (
          <RadioWidget size={widgetSize} onClick={() => onRadioWidgetClick()} />
        );
      case 'bookmark': {
        const bookmarkUrl =
          (box.widget.data?.url as string) || 'https://example.com';
        return (
          <BookmarkWidget
            size={widgetSize}
            url={bookmarkUrl}
            onLeftClick={() => {
              if (onBookmarkWidgetLeftClick) {
                onBookmarkWidgetLeftClick(box.id, bookmarkUrl);
              } else {
                // Default: open URL in new tab
                window.open(bookmarkUrl, '_blank');
              }
            }}
            onRightClick={(e) => {
              if (onBookmarkWidgetRightClick) {
                onBookmarkWidgetRightClick(e, box.id);
              }
            }}
            onClick={() => onBookmarkWidgetClick()}
          />
        );
      }
      default:
        return null;
    }
  };

  const handleBoxClick = (e: React.MouseEvent, box: GridBox) => {
    if (assignmentMode.active) {
      onAssignWidget(box.id);
    } else if (box.widget) {
      if (box.widget.type === 'clock') {
        onClockWidgetClick(box.id);
      } else if (box.widget.type === 'timer') {
        onTimerWidgetClick(box.id);
      } else if (box.widget.type === 'notes') {
        onNotesWidgetClick();
      } else if (box.widget.type === 'music') {
        onMusicWidgetClick();
      } else if (box.widget.type === 'radio') {
        onRadioWidgetClick();
      } else if (box.widget.type === 'bookmark') {
        onBookmarkWidgetClick();
      }
    } else if (!editMode && !box.widget && onShowContextMenu) {
      // Show context menu for empty boxes in non-edit mode
      e.stopPropagation();
      onShowContextMenu(e, box.id);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    // Allow drop operation in non-edit mode for widget replacement
    if (!editMode) {
      e.dataTransfer.dropEffect = 'copy';
    } else {
      e.dataTransfer.dropEffect = 'none';
    }
  };

  const handleDrop = (e: React.DragEvent, boxId: string) => {
    e.preventDefault();
    const widgetType = e.dataTransfer.getData('widget-type');
    if (widgetType && !editMode && onAssignWidgetByDrag) {
      // Find the box - allow widget replacement by removing the widget check
      const box = boxes.find((b) => b.id === boxId);
      if (box) {
        // Trigger widget assignment with specific type (will replace existing widget if any)
        onAssignWidgetByDrag(boxId, widgetType);
      }
    }
  };

  return (
    <div
      className='relative'
      style={{
        width: Math.max(gridWidth, BOX_SIZE),
        height: Math.max(gridHeight, BOX_SIZE),
        transform: 'translate(-50%, -50%)',
        position: 'absolute',
        left: '50%',
        top: '50%',
      }}
      onDragEnter={() => {
        if (onWidgetDragEnterGrid) {
          onWidgetDragEnterGrid();
        }
      }}
      onDragLeave={(e) => {
        if (onWidgetDragLeaveGrid) {
          // Check if we're really leaving the grid (not just entering a child element)
          const rect = e.currentTarget.getBoundingClientRect();
          const isLeavingGrid =
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom;

          if (isLeavingGrid) {
            onWidgetDragLeaveGrid();
          }
        }
      }}
    >
      {/* Ghost boxes */}
      {editMode &&
        ghostPositions.map((pos) => {
          const position = getPixelPosition(pos.x, pos.y, bounds);
          return (
            <div
              key={`ghost-${pos.x}-${pos.y}`}
              className='absolute rounded-xl border-2 transition-all duration-200 cursor-pointer opacity-10'
              style={{
                width: BOX_SIZE,
                height: BOX_SIZE,
                left: position.left,
                top: position.top,
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderColor: 'rgba(255, 255, 255, 0.7)',
                zIndex: 2,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.7';
                e.currentTarget.style.backgroundColor =
                  'rgba(255, 255, 255, 0.7)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.9)';
                // Handle drag over ghost box
                if (dragStartBox) {
                  onMouseEnter(`ghost-${pos.x}-${pos.y}`);
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.1';
                e.currentTarget.style.backgroundColor =
                  'rgba(255, 255, 255, 0.5)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.7)';
                // Handle drag leave ghost box
                if (dragStartBox) {
                  onMouseLeave(`ghost-${pos.x}-${pos.y}`);
                }
              }}
              onClick={() => {
                if (dragStartBox && isDragging) {
                  // Handle drop to ghost box
                  if (onGhostBoxDrop) {
                    onGhostBoxDrop(pos.x, pos.y);
                  }
                } else {
                  // Normal add box behavior
                  onAddBox(pos.x, pos.y);
                }
              }}
            />
          );
        })}

      {/* Merge preview */}
      {mergePreview && mergePreview.visible && (
        <div
          className='absolute rounded-xl border-4 border-white bg-white/40 pointer-events-none z-10'
          style={{
            left: (mergePreview.x - bounds.minX) * (BOX_SIZE + GAP),
            top: (mergePreview.y - bounds.minY) * (BOX_SIZE + GAP),
            width:
              mergePreview.width * BOX_SIZE + (mergePreview.width - 1) * GAP,
            height:
              mergePreview.height * BOX_SIZE + (mergePreview.height - 1) * GAP,
          }}
        />
      )}

      {/* Grid boxes */}
      {boxes.map((box) => {
        const position = getPixelPosition(box.x, box.y, bounds);

        return (
          <div key={box.id}>
            <div
              data-box-id={box.id}
              className={`absolute rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl cursor-pointer
                ${isDragging && dragStartBox === box.id ? 'opacity-70' : ''} 
                ${dragOverBox === box.id ? 'ring-2 ring-blue-400' : ''}
                ${invalidMergeTarget === box.id ? 'ring-3 ring-red-500' : ''}
                ${assignmentMode.active && !box.widget ? 'assignment-glow' : ''}
                ${assignmentMode.active && box.widget ? 'opacity-50' : ''}
                ${explodingBoxId === box.id ? 'animate-explode' : ''}
                ${
                  isDraggingWidget && !editMode
                    ? 'ring-2 ring-green-400 ring-opacity-50'
                    : ''
                }
              `}
              style={{
                backgroundColor: box.color || '#ffffff',
                width: BOX_SIZE * box.width + GAP * (box.width - 1),
                height: BOX_SIZE * box.height + GAP * (box.height - 1),
                left: position.left,
                top: position.top,
                zIndex: 5,
              }}
              onClick={(e) => handleBoxClick(e, box)}
              onMouseDown={(e) => onMouseDown(e, box.id)}
              onContextMenu={(e) => onContextMenu(e, box.id)}
              onMouseEnter={() => onMouseEnter(box.id)}
              onMouseLeave={() => onMouseLeave(box.id)}
              onMouseUp={onMouseUp}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, box.id)}
              draggable={false}
            >
              {/* Widget content */}
              {box.widget && (
                <div className='w-full h-full flex items-center justify-center'>
                  <div className='flex items-center justify-center'>
                    {renderWidgetContent(box)}
                  </div>
                </div>
              )}

              {/* Assignment mode overlay */}
              {assignmentMode.active && !box.widget && (
                <div
                  className='absolute inset-0 rounded-xl opacity-30'
                  style={{
                    background: `repeating-linear-gradient(
                      45deg,
                      transparent,
                      transparent 8px,
                      rgba(59, 130, 246, 0.6) 8px,
                      rgba(59, 130, 246, 0.6) 16px
                    )`,
                    animation: 'dash',
                    backgroundSize: '800px 800px',
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Grid;
