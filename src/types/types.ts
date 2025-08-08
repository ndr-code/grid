export type WidgetSize =
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

export interface BaseWidgetProps {
  size?: WidgetSize;
  className?: string;
  onClick?: () => void;
}

export interface GridDimensions {
  width: number;
  height: number;
  totalArea: number;
  maxDimension: number;
}

export interface GridBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  widget?: {
    type: 'clock' | 'timer' | 'notes' | 'music' | 'radio' | 'bookmark';
    data?: Record<string, unknown>;
  };
}

export interface Position {
  x: number;
  y: number;
}
