import type { GridDimensions, WidgetSize } from '../types/types';

// Helper function to parse grid dimensions from size string
export const parseGridSize = (gridSize: WidgetSize): GridDimensions => {
  const [w, h] = gridSize.split('x').map(Number);
  const width = w;
  const height = h;
  const totalArea = width * height;
  const maxDimension = Math.max(width, height);

  return {
    width,
    height,
    totalArea,
    maxDimension,
  };
};

// Get responsive icon size based on grid dimensions
export const getIconSize = (dimensions: GridDimensions): number => {
  const {
    width: gridWidth,
    height: gridHeight,
    totalArea,
    maxDimension,
  } = dimensions;

  // 1x1 - minimal display
  if (gridWidth === 1 && gridHeight === 1) return 24;

  // 1xN or Nx1 - compact display
  if (gridWidth === 1 || gridHeight === 1) return 24;

  // 2x2 - standard size
  if (gridWidth === 2 && gridHeight === 2) return 24;

  // 2x3, 3x2 - medium size
  if (totalArea >= 6 && totalArea <= 8 && maxDimension <= 3) return 32;

  // 3x3, 3x4, 4x3 - large size
  if (totalArea >= 9 && totalArea <= 12) return 48;

  // 4x4+ - extra large
  if (totalArea >= 16) {
    if (totalArea >= 25) return 80; // 5x5+
    if (totalArea >= 20) return 72; // 4x5, 5x4
    return 64; // 4x4
  }

  return 32; // default
};

// Get responsive text size class based on grid dimensions
export const getTextSize = (dimensions: GridDimensions): string => {
  const { width: gridWidth, height: gridHeight, totalArea } = dimensions;

  // Don't show text for any 1xN (width = 1) or 2x1
  if (gridWidth === 1) return ''; // All 1xN cases
  if (gridWidth === 2 && gridHeight === 1) return ''; // 2x1

  // 2x2 - small text
  if (gridWidth === 2 && gridHeight === 2) return 'text-sm';

  // 2x3, 3x2 - base text
  if (totalArea >= 6 && totalArea <= 8) return 'text-base';

  // 3x3, 3x4, 4x3 - large text
  if (totalArea >= 9 && totalArea <= 12) return 'text-lg';

  // 4x4+ - extra large text
  if (totalArea >= 16) {
    if (totalArea >= 25) return 'text-4xl'; // 5x5+
    if (totalArea >= 20) return 'text-3xl'; // 4x5, 5x4
    return 'text-2xl'; // 4x4
  }

  return 'text-base'; // default
};

// Get smaller text size for secondary text (like URLs)
export const getSecondaryTextSize = (dimensions: GridDimensions): string => {
  const { width: gridWidth, height: gridHeight, totalArea } = dimensions;

  // Don't show secondary text for any 1xN (width = 1) or 2x1
  if (gridWidth === 1) return ''; // All 1xN cases
  if (gridWidth === 2 && gridHeight === 1) return ''; // 2x1

  // Show secondary text only for medium and larger sizes
  if (totalArea >= 6) return 'text-xs';

  return '';
};

// Check if text should be displayed based on size
export const shouldShowText = (dimensions: GridDimensions): boolean => {
  const { width: gridWidth, height: gridHeight } = dimensions;

  // Don't show text for any 1xN (width = 1) or 2x1
  if (gridWidth === 1) return false; // All 1xN cases
  if (gridWidth === 2 && gridHeight === 1) return false; // 2x1
  return true;
};

// Check if secondary text (like URL) should be displayed
export const shouldShowSecondaryText = (
  dimensions: GridDimensions
): boolean => {
  const { totalArea } = dimensions;
  // Show secondary text only for medium and larger sizes
  return totalArea >= 6;
};
