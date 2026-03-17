import React, { useEffect, useRef, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useLipsync } from '../../hooks/useLipsync';
import { useHeadTracking } from '../../hooks/useHeadTracking';

export function Character(props) {
  const { client } = props;
  const modelUrl = client?.avatar || import.meta.env.VITE_MODEL_PATH;

  useEffect(() => {
    if (client?.avatar) useGLTF.preload(client.avatar);
  }, [client?.avatar]);

  const { nodes, materials, scene, animations } = useGLTF(modelUrl);
  const nikhilRef = useRef();
  const { actions, mixer } = useAnimations(animations, nikhilRef);

  const activeAnimationName =
    animations && animations.find((a) => a.name === 'Idle')
      ? 'Idle'
      : animations?.[0]?.name;

  const [animation, setAnimation] = useState(activeAnimationName);

  useEffect(() => {
    if (!animation || !actions) return;
    const currentAction = actions[animation] || actions[Object.keys(actions)[0]];
    if (!currentAction) return;

    currentAction.reset().fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5).play();
    return () => {
      if (currentAction.fadeOut) currentAction.fadeOut(0.5);
    };
  }, [animation, actions, mixer]);

  useEffect(() => {
    if (client?.convaiClient?.current) {
      client.convaiClient.current.sendTextChunk('');
    }
  }, [client]);

  useEffect(() => {
    if (client?.isTalking) setAnimation('Idle');
  }, [client?.isTalking]);

  useLipsync({ client, characterRef: nikhilRef, nodes, scene });
  useHeadTracking({ client, nodes });

  return (
    <group ref={nikhilRef} {...props} dispose={null}>
      {scene ? <primitive object={scene} /> : null}
    </group>
  );
}

useGLTF.preload(import.meta.env.VITE_MODEL_PATH)

