export interface GridBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  widget?: {
    type: 'clock' | 'timer' | 'notes' | 'music' | 'radio';
    data?: Record<string, unknown>;
  };
}

export interface Position {
  x: number;
  y: number;
}
