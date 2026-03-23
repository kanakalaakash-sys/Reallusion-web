import { useFrame } from '@react-three/fiber';
import _, { bind } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { lerpMorphTarget } from '../helpers/lerpMorphTarget';
import { VisemeToARKit } from '../helpers/mappingMorphs';
import * as THREE from 'three';

/**
 * useLipsync : Runs morphs at 100fps and manages frame skips with blinking.
 * Configured for Avaturn ARKit blendshapes.
 * @characterRef : Reference to the character group where lipsync is to be performed.
 */
export const useLipsync = ({ client, characterRef, nodes, scene }) => {
  const [tick, setTick] = useState(true);
  const blendShapeRef = useRef([]);
  const currentBlendFrame = useRef(0);

  // Reset blendShapeRef and frame index when facial data clears
  useEffect(() => {
    if (client?.facialData.length === 0) {
      blendShapeRef.current = [];
      currentBlendFrame.current = 0;
    }
  }, [client?.facialData]);

  const [blink, setBlink] = useState(false);

  const throttledUpdate = _.throttle(updateAnimation, 10);
  function updateAnimation() {
    setTick((tick) => {
      if (tick) return tick;
      return true;
    });
    requestAnimationFrame(throttledUpdate);
  }

  useEffect(() => {
    requestAnimationFrame(throttledUpdate);
    return () => {
      cancelAnimationFrame(throttledUpdate);
    };
  }, []);

  const [startClock, setStartClock] = useState(false);

  useFrame((state, _delta) => {
    if (!characterRef.current || !nodes || !scene) return;

    if (tick) {
      if (!startClock || !client?.isTalking) {
        state.clock.elapsedTime = 0;
        if (startClock) setStartClock(false);
      }

      if (client?.isTalking) {
        setStartClock(true);
      }

      if (startClock) {
        const frameSkipNumber = 10;
        if (
          Math.floor(state.clock.elapsedTime * 100) -
            currentBlendFrame.current >
          frameSkipNumber
        ) {
          for (let i = 0; i < frameSkipNumber; i++) {
            blendShapeRef.current.push(0);
          }
          currentBlendFrame.current += frameSkipNumber;
        } else if (
          Math.floor(state.clock.elapsedTime * 100) -
            currentBlendFrame.current <
          -frameSkipNumber
        ) {
          blendShapeRef.current.splice(-frameSkipNumber);
          currentBlendFrame.current -= frameSkipNumber + 1;
        }
      }

      // Eye blink — RPM uses eyeBlinkLeft / eyeBlinkRight
      lerpMorphTarget('eyeBlinkLeft', blink ? 1 : 0, 0.5, scene);
      lerpMorphTarget('eyeBlinkRight', blink ? 1 : 0, 0.5, scene);

      // Build blendshape frame from Convai facial data
      if (client?.facialData.length > 0) {
        VisemeToARKit(
          client?.facialData[currentBlendFrame.current],
          blendShapeRef
        );
      }

      // Apply blendshapes
      if (currentBlendFrame.current <= blendShapeRef?.current?.length) {
        const frame = blendShapeRef.current[currentBlendFrame.current - 1];
        for (const blend in frame) {
          lerpMorphTarget(blend, frame[blend], 1, scene);
        }
        currentBlendFrame.current += 1;
      }

      setTick(false);
    }
  });

  // Reset all blendshapes when character stops talking
  useEffect(() => {
    if (!client?.isTalking) {
      scene.traverse((child) => {
        if (child.isSkinnedMesh && child.morphTargetDictionary) {
          for (const target in child.morphTargetDictionary) {
            const index = child.morphTargetDictionary[target];
            if (
              index === undefined ||
              child.morphTargetInfluences[index] === undefined
            ) {
              return;
            }
            child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
              child.morphTargetInfluences[index],
              0,
              1
            );
          }
        }
      });
    }
  }, [client?.isTalking, scene]);

  // Eye blink loop
  useEffect(() => {
    let blinkTimeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, [200]);
      }, THREE.MathUtils.randInt(1000, 5000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);
};
