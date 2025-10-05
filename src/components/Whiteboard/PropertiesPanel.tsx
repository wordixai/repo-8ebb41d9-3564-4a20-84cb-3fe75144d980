import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useWhiteboardStore } from '@/stores/useWhiteboardStore';

export function PropertiesPanel() {
  const {
    strokeColor,
    fillColor,
    strokeWidth,
    opacity,
    setStrokeColor,
    setFillColor,
    setStrokeWidth,
    setOpacity,
  } = useWhiteboardStore();

  return (
    <div className="absolute top-4 right-4 z-10 bg-white border rounded-lg shadow-lg p-4 w-64">
      <h3 className="font-semibold mb-4 text-sm">Properties</h3>

      <div className="space-y-4">
        <div>
          <Label className="text-xs mb-2 block">Stroke Color</Label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="w-12 h-8 rounded border cursor-pointer"
            />
            <span className="text-xs text-muted-foreground">{strokeColor}</span>
          </div>
        </div>

        <div>
          <Label className="text-xs mb-2 block">Fill Color</Label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={fillColor === 'transparent' ? '#ffffff' : fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              className="w-12 h-8 rounded border cursor-pointer"
            />
            <button
              onClick={() => setFillColor('transparent')}
              className="text-xs px-2 py-1 border rounded hover:bg-accent"
            >
              None
            </button>
          </div>
        </div>

        <div>
          <Label className="text-xs mb-2 block">Stroke Width: {strokeWidth}px</Label>
          <Slider
            value={[strokeWidth]}
            onValueChange={([value]) => setStrokeWidth(value)}
            min={1}
            max={20}
            step={1}
          />
        </div>

        <div>
          <Label className="text-xs mb-2 block">Opacity: {Math.round(opacity * 100)}%</Label>
          <Slider
            value={[opacity * 100]}
            onValueChange={([value]) => setOpacity(value / 100)}
            min={0}
            max={100}
            step={5}
          />
        </div>
      </div>
    </div>
  );
}