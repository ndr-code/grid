import { useState, useEffect } from 'react';

// Import types and constants
import { BOX_SIZE, GAP } from './constants';

// Import components
import { ControlButtons } from './components/ControlButtons';
import { ConfirmDialog } from './components/ui/ConfirmDialog';
import { ContextMenu } from './components/ui/ContextMenu';
import { WidgetSelectionDialog } from './components/WidgetSelectionDialog';
import { ColorPicker } from './components/ui/ColorPicker';
import Grid from './components/Grid';
import { ClockDialog } from './components/widgets/ClockDialog';
import { TimerDialog } from './components/widgets/TimerDialog';
import { NotesDialog } from './components/widgets/NotesDialog';
import { MusicDialog } from './components/widgets/MusicDialog';
import { RadioDialog } from './components/widgets/RadioDialog';
import { BottomDock } from './components/navigation/BottomDock';
import { MotivationalQuotes } from './components/MotivationalQuotes';

// Import custom hooks and utilities
import { useEditMode } from './hooks';
import { getBounds } from './utils';

// Main App Component
function App() {
  // Edit Mode Hook
  const {
    boxes,
    isDragging,
    dragStartBox,
    dragOverBox,
    showResetDialog,
    isResetting,
    showSpawnDialog,
    isSpawning,
    showExplodeDialog,
    isExploding,
    editMode,
    historyIndex,
    history,
    contextMenu,
    colorPicker,
    assignmentMode,
    mergePreview,
    explodingBoxId,
    invalidMergeTarget,
    isDraggingWidget,
    toggleEditMode,
    undo,
    redo,
    resetGrid,
    confirmReset,
    spawnGrid,
    confirmSpawn,
    explodeGrid,
    confirmExplode,
    addBox,
    deleteBox,
    unmergeBox,
    changeBoxColor,
    mergeBoxes,
    getGhostPositions,
    handleColorHover,
    handleColorLeave,
    setShowResetDialog,
    setShowSpawnDialog,
    setShowExplodeDialog,
    setDragStartBox,
    setDragOverBox,
    setIsDragging,
    setContextMenu,
    setColorPicker,
    startAssignmentMode,
    cancelAssignmentMode,
    assignWidgetToBox,
    deleteWidget,
    directAssignWidget,
    startWidgetDrag,
    endWidgetDrag,
    handleWidgetDragEnterGrid,
    handleWidgetDragLeaveGrid,
  } = useEditMode();

  // Dialog state
  const [showClockDialog, setShowClockDialog] = useState(false);
  const [clockDialogMode, setClockDialogMode] = useState<'assign' | 'view'>(
    'assign'
  );
  const [selectedClockBoxId, setSelectedClockBoxId] = useState<string | null>(
    null
  );
  const [showTimerDialog, setShowTimerDialog] = useState(false);
  const [timerDialogMode, setTimerDialogMode] = useState<'assign' | 'view'>(
    'assign'
  );
  const [selectedTimerBoxId, setSelectedTimerBoxId] = useState<string | null>(
    null
  );
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [showMusicDialog, setShowMusicDialog] = useState(false);
  const [showRadioDialog, setShowRadioDialog] = useState(false);
  const [isMusicMinimized, setIsMusicMinimized] = useState(false);
  const [showWidgetSelectionDialog, setShowWidgetSelectionDialog] =
    useState(false);
  const [selectedBoxIdForWidget, setSelectedBoxIdForWidget] = useState<
    string | null
  >(null);

  // Mouse tracking for click vs drag detection
  const [mouseDownPos, setMouseDownPos] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Derived state
  const bounds = getBounds(boxes);
  const gridWidth = (bounds.maxX - bounds.minX + 1) * (BOX_SIZE + GAP) - GAP;
  const gridHeight = (bounds.maxY - bounds.minY + 1) * (BOX_SIZE + GAP) - GAP;

  // Handle widget assignment by drag
  const handleAssignWidgetByDrag = (boxId: string, widgetType: string) => {
    if (
      widgetType === 'clock' ||
      widgetType === 'timer' ||
      widgetType === 'notes' ||
      widgetType === 'music' ||
      widgetType === 'radio'
    ) {
      startAssignmentMode(widgetType);
      // Assign immediately without delay since assignment mode is now active
      assignWidgetToBox(boxId);
    }
  };

  // ESC key to cancel assignment mode, Ctrl+Z/Y for undo/redo in edit mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && assignmentMode.active) {
        cancelAssignmentMode();
      }

      // Undo/Redo shortcuts in edit mode
      if (editMode && (e.ctrlKey || e.metaKey)) {
        if (e.key === 'z' && !e.shiftKey && historyIndex > 0) {
          e.preventDefault();
          undo();
        } else if (
          (e.key === 'y' || (e.key === 'z' && e.shiftKey)) &&
          historyIndex < history.length - 1
        ) {
          e.preventDefault();
          redo();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    assignmentMode.active,
    editMode,
    historyIndex,
    history.length,
    cancelAssignmentMode,
    undo,
    redo,
  ]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenu.visible) {
        const target = event.target as HTMLElement;
        // Don't close if clicking on the context menu itself
        if (!target.closest('[data-context-menu]')) {
          setContextMenu({ visible: false, x: 0, y: 0, boxId: '' });
        }
      }
    };

    if (contextMenu.visible) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu.visible, setContextMenu]);

  // Handle opening widget selection dialog
  const handleOpenWidgetSelection = (boxId: string) => {
    setSelectedBoxIdForWidget(boxId);
    setShowWidgetSelectionDialog(true);
    // Close context menu
    setContextMenu({ visible: false, x: 0, y: 0, boxId: '' });
  };

  // Handle widget selection from dialog
  const handleSelectWidget = (
    widgetType: 'clock' | 'timer' | 'notes' | 'music' | 'radio'
  ) => {
    if (selectedBoxIdForWidget) {
      // Directly assign widget to the selected box without using assignment mode
      directAssignWidget(selectedBoxIdForWidget, widgetType);
    }
    setShowWidgetSelectionDialog(false);
    setSelectedBoxIdForWidget(null);
  };

  return (
    <div
      className={`min-h-screen flex flex-col relative transition-all duration-300 ${
        editMode ? 'border-12 bg-gray-800 edit-mode-border' : 'bg-gray-900'
      }`}
    >
      <div className='absolute px-4 pt-4'>
        <div className='text-gray-300 text-sm font-medium mb-1'>Grid</div>
        <MotivationalQuotes
          speed={60}
          pauseDuration={5000}
          className='text-gray-500'
        />
      </div>
      {/* Main Content Area */}
      <div className='flex-1 flex items-center justify-center p-8 relative'>
        <ControlButtons
          editMode={editMode}
          assignmentMode={assignmentMode}
          onToggleEdit={toggleEditMode}
          onUndo={undo}
          onRedo={redo}
          onReset={resetGrid}
          onExplode={explodeGrid}
          onSpawn={spawnGrid}
          onCancelAssignment={cancelAssignmentMode}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
        />

        <ConfirmDialog
          open={showResetDialog}
          onOpenChange={setShowResetDialog}
          onConfirm={confirmReset}
          isProcessing={isResetting}
          title='Reset Grid'
          description='This will remove all boxes and reset the grid to empty state. Are you sure?'
          confirmText='Yes, Reset'
          processingText='Resetting...'
        />

        <ConfirmDialog
          open={showSpawnDialog}
          onOpenChange={setShowSpawnDialog}
          onConfirm={confirmSpawn}
          isProcessing={isSpawning}
          title='Spawn 7x7 Grid'
          description='This will replace all current boxes with a new 7x7 grid of individual boxes. Are you sure?'
          confirmText='Yes, Spawn'
          processingText='Spawning...'
        />

        <ConfirmDialog
          open={showExplodeDialog}
          onOpenChange={setShowExplodeDialog}
          onConfirm={confirmExplode}
          isProcessing={isExploding}
          title='Explode All Boxes'
          description='This will break down all merged boxes into individual 1x1 boxes and remove all widgets. Are you sure?'
          confirmText='Yes, Explode'
          processingText='Exploding...'
        />

        <Grid
          boxes={boxes}
          editMode={editMode}
          isDragging={isDragging}
          isDraggingWidget={isDraggingWidget}
          dragStartBox={dragStartBox}
          dragOverBox={dragOverBox}
          bounds={bounds}
          gridWidth={gridWidth}
          gridHeight={gridHeight}
          ghostPositions={getGhostPositions()}
          assignmentMode={assignmentMode}
          mergePreview={mergePreview}
          explodingBoxId={explodingBoxId}
          invalidMergeTarget={invalidMergeTarget}
          onAddBox={addBox}
          onAssignWidget={assignWidgetToBox}
          onAssignWidgetByDrag={handleAssignWidgetByDrag}
          onWidgetDragEnterGrid={handleWidgetDragEnterGrid}
          onWidgetDragLeaveGrid={handleWidgetDragLeaveGrid}
          onClockWidgetClick={(boxId: string) => {
            if (!editMode) {
              setSelectedClockBoxId(boxId);
              setClockDialogMode('view');
              setShowClockDialog(true);
            }
          }}
          onTimerWidgetClick={(boxId: string) => {
            if (!editMode) {
              setSelectedTimerBoxId(boxId);
              setTimerDialogMode('view');
              setShowTimerDialog(true);
            }
          }}
          onNotesWidgetClick={() => {
            if (!editMode) {
              setShowNotesDialog(true);
            }
          }}
          onMusicWidgetClick={() => {
            if (!editMode) {
              setShowMusicDialog(true);
            }
          }}
          onRadioWidgetClick={() => {
            if (!editMode) {
              setShowRadioDialog(true);
            }
          }}
          onMouseDown={(e, boxId) => {
            if (e.button === 0 && editMode) {
              e.preventDefault();
              setMouseDownPos({ x: e.clientX, y: e.clientY });
              setDragStartBox(boxId);
              setDragOverBox(null);
              setIsDragging(false);
            }
          }}
          onContextMenu={(e, boxId) => {
            e.preventDefault();
            setContextMenu({
              visible: true,
              x: e.clientX,
              y: e.clientY,
              boxId: boxId,
            });
          }}
          onShowContextMenu={(e, boxId) => {
            e.preventDefault();
            setContextMenu({
              visible: true,
              x: e.clientX,
              y: e.clientY,
              boxId: boxId,
            });
          }}
          onMouseEnter={(boxId) => {
            if (dragStartBox && dragStartBox !== boxId && editMode) {
              setDragOverBox(boxId);
              setIsDragging(true);
            }
          }}
          onMouseLeave={(boxId) => {
            if (isDragging && editMode && dragOverBox === boxId) {
              setDragOverBox(null);
            }
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            e.stopPropagation();

            // Check if this was a click (no significant mouse movement) vs drag
            if (mouseDownPos && editMode && dragStartBox) {
              const mouseMovement =
                Math.abs(e.clientX - mouseDownPos.x) +
                Math.abs(e.clientY - mouseDownPos.y);
              const isClick = mouseMovement < 5; // Less than 5px movement = click

              if (isClick) {
                // This was a click, show context menu with slight delay
                setTimeout(() => {
                  setContextMenu({
                    visible: true,
                    x: e.clientX,
                    y: e.clientY,
                    boxId: dragStartBox,
                  });
                }, 50);
              } else if (
                isDragging &&
                dragStartBox &&
                dragOverBox &&
                dragStartBox !== dragOverBox
              ) {
                // This was a drag, merge boxes
                mergeBoxes(dragStartBox, dragOverBox);
              }
            }

            // Reset states
            setIsDragging(false);
            setDragStartBox(null);
            setDragOverBox(null);
            setMouseDownPos(null);
          }}
          onGhostBoxDrop={(ghostX, ghostY) => {
            if (dragStartBox && editMode) {
              // Simple approach: just add a box at ghost position
              addBox(ghostX, ghostY);
              setIsDragging(false);
              setDragStartBox(null);
              setDragOverBox(null);
            }
          }}
        />

        <ContextMenu
          visible={contextMenu.visible}
          x={contextMenu.x}
          y={contextMenu.y}
          box={boxes.find((box) => box.id === contextMenu.boxId)}
          editMode={editMode}
          onDelete={() => deleteBox(contextMenu.boxId)}
          onUnmerge={() => unmergeBox(contextMenu.boxId)}
          onColorHover={handleColorHover}
          onColorLeave={handleColorLeave}
          onDeleteWidget={() => deleteWidget(contextMenu.boxId)}
          onAssignWidget={() => handleOpenWidgetSelection(contextMenu.boxId)}
          onChangeWidget={() => handleOpenWidgetSelection(contextMenu.boxId)}
        />

        <ColorPicker
          visible={colorPicker.visible}
          x={colorPicker.x}
          y={colorPicker.y}
          onColorSelect={(color) => changeBoxColor(colorPicker.boxId, color)}
          onMouseEnter={() =>
            setColorPicker((prev) => ({ ...prev, visible: true }))
          }
          onMouseLeave={() =>
            setColorPicker({ visible: false, x: 0, y: 0, boxId: '' })
          }
        />

        <ClockDialog
          open={showClockDialog}
          onOpenChange={setShowClockDialog}
          onAssignToGrid={() => startAssignmentMode('clock')}
          onRemoveWidget={() => {
            if (selectedClockBoxId) {
              deleteWidget(selectedClockBoxId);
              setSelectedClockBoxId(null);
            }
          }}
          mode={clockDialogMode}
        />
        <TimerDialog
          open={showTimerDialog}
          onOpenChange={setShowTimerDialog}
          onAssignToGrid={() => startAssignmentMode('timer')}
          onRemoveWidget={() => {
            if (selectedTimerBoxId) {
              deleteWidget(selectedTimerBoxId);
              setSelectedTimerBoxId(null);
            }
          }}
          mode={timerDialogMode}
        />
        <NotesDialog open={showNotesDialog} onOpenChange={setShowNotesDialog} />
        <RadioDialog open={showRadioDialog} onOpenChange={setShowRadioDialog} />
        <MusicDialog
          open={showMusicDialog}
          onOpenChange={setShowMusicDialog}
          isMinimized={isMusicMinimized}
          onMinimize={setIsMusicMinimized}
          editMode={editMode}
        />
        <WidgetSelectionDialog
          open={showWidgetSelectionDialog}
          onOpenChange={setShowWidgetSelectionDialog}
          onSelectWidget={handleSelectWidget}
        />
      </div>

      {/* Bottom Dock */}
      <BottomDock
        editMode={editMode}
        onWidgetDragStart={startWidgetDrag}
        onWidgetDragEnd={endWidgetDrag}
        onClockClick={() => {
          if (!editMode) {
            setClockDialogMode('assign');
            setSelectedClockBoxId(null);
            setShowClockDialog(true);
          }
        }}
        onTimerClick={() => {
          if (!editMode) {
            setTimerDialogMode('assign');
            setSelectedTimerBoxId(null);
            setShowTimerDialog(true);
          }
        }}
        onNotesClick={() => {
          if (!editMode) {
            setShowNotesDialog(true);
          }
        }}
        onMusicClick={() => {
          if (!editMode) {
            if (isMusicMinimized) {
              setIsMusicMinimized(false);
              setShowMusicDialog(true);
            } else {
              setShowMusicDialog(true);
            }
          }
        }}
        onRadioClick={() => {
          if (!editMode) {
            setShowRadioDialog(true);
          }
        }}
      />
    </div>
  );
}

export default App;
