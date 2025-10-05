import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  MousePointer2,
  Square,
  Circle,
  Minus,
  ArrowRight,
  Type,
  Pen,
  Eraser,
  Download,
  Trash2,
  Undo,
  Redo,
} from 'lucide-react';
import { useWhiteboardStore } from '@/stores/useWhiteboardStore';
import { Tool } from '@/types/whiteboard';
import { cn } from '@/lib/utils';

const tools: { id: Tool; icon: typeof MousePointer2; label: string }[] = [
  { id: 'select', icon: MousePointer2, label: 'Select' },
  { id: 'rectangle', icon: Square, label: 'Rectangle' },
  { id: 'circle', icon: Circle, label: 'Circle' },
  { id: 'line', icon: Minus, label: 'Line' },
  { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'pen', icon: Pen, label: 'Pen' },
  { id: 'eraser', icon: Eraser, label: 'Eraser' },
];

export function Toolbar() {
  const { selectedTool, setSelectedTool, clearCanvas } = useWhiteboardStore();

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white border rounded-lg shadow-lg p-2 flex items-center gap-1">
      {tools.map((tool, index) => (
        <div key={tool.id} className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedTool(tool.id)}
            className={cn(
              'h-9 w-9',
              selectedTool === tool.id && 'bg-primary text-primary-foreground'
            )}
            title={tool.label}
          >
            <tool.icon className="h-4 w-4" />
          </Button>
          {(index === 0 || index === 5) && <Separator orientation="vertical" className="mx-1 h-6" />}
        </div>
      ))}

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button variant="ghost" size="icon" className="h-9 w-9" title="Undo">
        <Undo className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-9 w-9" title="Redo">
        <Redo className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button variant="ghost" size="icon" className="h-9 w-9" title="Download">
        <Download className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        onClick={clearCanvas}
        title="Clear Canvas"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}