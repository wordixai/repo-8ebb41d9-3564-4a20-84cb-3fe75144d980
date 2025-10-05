import { create } from 'zustand';
import { DrawingElement, Tool, WhiteboardState } from '@/types/whiteboard';

interface WhiteboardStore extends WhiteboardState {
  addElement: (element: DrawingElement) => void;
  updateElement: (id: string, updates: Partial<DrawingElement>) => void;
  deleteElement: (id: string) => void;
  setSelectedTool: (tool: Tool) => void;
  setSelectedElement: (id: string | null) => void;
  setStrokeColor: (color: string) => void;
  setFillColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setOpacity: (opacity: number) => void;
  clearCanvas: () => void;
}

export const useWhiteboardStore = create<WhiteboardStore>((set) => ({
  elements: [],
  selectedTool: 'select',
  selectedElementId: null,
  strokeColor: '#1e293b',
  fillColor: 'transparent',
  strokeWidth: 2,
  opacity: 1,

  addElement: (element) =>
    set((state) => ({
      elements: [...state.elements, element],
    })),

  updateElement: (id, updates) =>
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
    })),

  deleteElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
    })),

  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setSelectedElement: (id) => set({ selectedElementId: id }),
  setStrokeColor: (color) => set({ strokeColor: color }),
  setFillColor: (color) => set({ fillColor: color }),
  setStrokeWidth: (width) => set({ strokeWidth: width }),
  setOpacity: (opacity) => set({ opacity: opacity }),
  clearCanvas: () => set({ elements: [], selectedElementId: null }),
}));