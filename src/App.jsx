import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import { Experience } from './components/Experience';
import { useConvaiClient } from './hooks/useConvaiClient';
import ChatBubble from './components/chat/Chat';

function App() {
  const { client } = useConvaiClient(
    import.meta.env.VITE_CHARACTER_ID,
    import.meta.env.VITE_CONVAI_KEY
  );

  return (
    <>
      <Loader />
      <Canvas
        shadows
        camera={{
          position: [0, 0.2, 2.2],
          fov: 50,
        }}
      >
        <Experience client={client} />
      </Canvas>
      <ChatBubble client={client} />
    </>
  );
}

export default App;
