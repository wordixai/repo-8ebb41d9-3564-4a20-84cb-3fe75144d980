import { Canvas } from '@/components/Whiteboard/Canvas';
import { Toolbar } from '@/components/Whiteboard/Toolbar';
import { PropertiesPanel } from '@/components/Whiteboard/PropertiesPanel';

const Index = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Canvas />
      <Toolbar />
      <PropertiesPanel />
    </div>
  );
};

export default Index;