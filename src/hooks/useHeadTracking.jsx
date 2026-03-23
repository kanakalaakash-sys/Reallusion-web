import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// RPM v2.0 bone names
export const useHeadTracking = ({ client, nodes }) => {
  useFrame((state, _delta) => {
    if (!nodes) return;
    if (
      client?.action?.currentAction &&
      client?.action?.currentAction !== 'None'
    ) {
      return;
    }

    const leftEye = nodes.LeftEye;
    const rightEye = nodes.RightEye;
    const head = nodes.Head;
    if (!head) return;

    const cameraWorldPosition = state.camera.getWorldPosition(
      new THREE.Vector3()
    );

    head.lookAt(cameraWorldPosition);

    if (leftEye) leftEye.lookAt(cameraWorldPosition);
    if (rightEye) rightEye.lookAt(cameraWorldPosition);
  });
};
