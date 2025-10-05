import { useRef, useEffect, useState } from 'react';
import { useWhiteboardStore } from '@/stores/useWhiteboardStore';
import { DrawingElement, Point } from '@/types/whiteboard';
import { v4 as uuidv4 } from 'uuid';

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentElement, setCurrentElement] = useState<DrawingElement | null>(null);

  const {
    elements,
    selectedTool,
    strokeColor,
    fillColor,
    strokeWidth,
    opacity,
    addElement,
    updateElement,
    selectedElementId,
  } = useWhiteboardStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawElements();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    drawElements();
  }, [elements, currentElement]);

  const drawElements = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    [...elements, currentElement].filter(Boolean).forEach((element) => {
      if (!element) return;
      drawElement(ctx, element);
    });
  };

  const drawElement = (ctx: CanvasRenderingContext2D, element: DrawingElement) => {
    ctx.globalAlpha = element.opacity;
    ctx.strokeStyle = element.strokeColor;
    ctx.fillStyle = element.fillColor;
    ctx.lineWidth = element.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (element.type) {
      case 'rectangle':
        if (element.width && element.height) {
          if (element.fillColor !== 'transparent') {
            ctx.fillRect(element.x, element.y, element.width, element.height);
          }
          ctx.strokeRect(element.x, element.y, element.width, element.height);
        }
        break;

      case 'circle':
        if (element.width && element.height) {
          const radiusX = Math.abs(element.width) / 2;
          const radiusY = Math.abs(element.height) / 2;
          const centerX = element.x + element.width / 2;
          const centerY = element.y + element.height / 2;
          
          ctx.beginPath();
          ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
          if (element.fillColor !== 'transparent') {
            ctx.fill();
          }
          ctx.stroke();
        }
        break;

      case 'line':
      case 'arrow':
        if (element.width !== undefined && element.height !== undefined) {
          ctx.beginPath();
          ctx.moveTo(element.x, element.y);
          ctx.lineTo(element.x + element.width, element.y + element.height);
          ctx.stroke();

          if (element.type === 'arrow') {
            drawArrowhead(
              ctx,
              element.x,
              element.y,
              element.x + element.width,
              element.y + element.height
            );
          }
        }
        break;

      case 'pen':
        if (element.points && element.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(element.points[0].x, element.points[0].y);
          for (let i = 1; i < element.points.length; i++) {
            ctx.lineTo(element.points[i].x, element.points[i].y);
          }
          ctx.stroke();
        }
        break;

      case 'text':
        if (element.text) {
          ctx.font = '16px sans-serif';
          ctx.fillStyle = element.strokeColor;
          ctx.fillText(element.text, element.x, element.y);
        }
        break;
    }

    ctx.globalAlpha = 1;
  };

  const drawArrowhead = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
  ) => {
    const headLength = 15;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool === 'select') return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setStartPoint({ x, y });

    if (selectedTool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        const element: DrawingElement = {
          id: uuidv4(),
          type: 'text',
          x,
          y,
          text,
          strokeColor,
          fillColor,
          strokeWidth,
          opacity,
        };
        addElement(element);
      }
      return;
    }

    const element: DrawingElement = {
      id: uuidv4(),
      type: selectedTool,
      x,
      y,
      width: 0,
      height: 0,
      points: selectedTool === 'pen' ? [{ x, y }] : undefined,
      strokeColor,
      fillColor,
      strokeWidth,
      opacity,
    };

    setCurrentElement(element);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint || !currentElement) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool === 'pen') {
      setCurrentElement({
        ...currentElement,
        points: [...(currentElement.points || []), { x, y }],
      });
    } else {
      setCurrentElement({
        ...currentElement,
        width: x - startPoint.x,
        height: y - startPoint.y,
      });
    }
  };

  const handleMouseUp = () => {
    if (currentElement) {
      addElement(currentElement);
      setCurrentElement(null);
    }
    setIsDrawing(false);
    setStartPoint(null);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="absolute inset-0 cursor-crosshair"
      style={{ backgroundColor: '#fafafa' }}
    />
  );
}