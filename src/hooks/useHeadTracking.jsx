import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const useHeadTracking = ({ client, nodes }) => {
  useFrame((state, _delta) => {
    if (!nodes) return;
    if (
      client?.action?.currentAction &&
      client?.action?.currentAction !== 'None'
    ) {
      return;
    }

    const leftEye = nodes.CC_Base_L_Eye;
    const rightEye = nodes.CC_Base_R_Eye;
    const head = nodes.CC_Base_Head;
    if (!leftEye || !rightEye || !head) return;

    const cameraWorldPosition = state.camera.getWorldPosition(
      new THREE.Vector3()
    );
    leftEye.rotation.set(1.5, 1.6, 1.6);
    rightEye.rotation.set(1.5, 1.6, 1.6);
    head.lookAt(cameraWorldPosition);
  });
};
