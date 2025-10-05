export type Tool = 'select' | 'rectangle' | 'circle' | 'line' | 'arrow' | 'text' | 'pen' | 'eraser';

export interface Point {
  x: number;
  y: number;
}

export interface DrawingElement {
  id: string;
  type: Tool;
  x: number;
  y: number;
  width?: number;
  height?: number;
  points?: Point[];
  text?: string;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  opacity: number;
}

export interface WhiteboardState {
  elements: DrawingElement[];
  selectedTool: Tool;
  selectedElementId: string | null;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  opacity: number;
}