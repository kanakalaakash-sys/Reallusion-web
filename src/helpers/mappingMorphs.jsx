// Convai viseme index → Avaturn ARKit blendshape mapping

const VisemeIndexMap = {
  0: 'sil',
  1: 'PP',
  2: 'FF',
  3: 'TH',
  4: 'DD',
  5: 'KK',
  6: 'CH',
  7: 'SS',
  8: 'NN',
  9: 'RR',
  10: 'AA',
  11: 'E',
  12: 'I',
  13: 'O',
  14: 'U',
};

const ARKit = {
  sil: {},
  PP: { jawOpen: 0.05, mouthClose: 0.8, mouthRollLower: 0.3, mouthRollUpper: 0.3 },
  FF: { jawOpen: 0.1, mouthLowerDownLeft: 0.4, mouthLowerDownRight: 0.4, mouthUpperUpLeft: 0.1, mouthUpperUpRight: 0.1 },
  TH: { jawOpen: 0.15, tongueOut: 0.8, mouthShrugLower: 0.2 },
  DD: { jawOpen: 0.15, mouthShrugLower: 0.3, mouthStretchLeft: 0.2, mouthStretchRight: 0.2 },
  KK: { jawOpen: 0.3, mouthShrugUpper: 0.2 },
  CH: { jawOpen: 0.2, mouthFunnel: 0.3, mouthRollLower: 0.2 },
  SS: { jawOpen: 0.1, mouthSmileLeft: 0.3, mouthSmileRight: 0.3, mouthStretchLeft: 0.2, mouthStretchRight: 0.2 },
  NN: { jawOpen: 0.2, mouthClose: 0.3 },
  RR: { jawOpen: 0.2, mouthFunnel: 0.2, mouthPucker: 0.2, mouthRollLower: 0.3 },
  AA: { jawOpen: 0.7, mouthShrugLower: 0.3, mouthStretchLeft: 0.2, mouthStretchRight: 0.2 },
  E:  { jawOpen: 0.4, mouthSmileLeft: 0.4, mouthSmileRight: 0.4, mouthStretchLeft: 0.3, mouthStretchRight: 0.3 },
  I:  { jawOpen: 0.25, mouthSmileLeft: 0.5, mouthSmileRight: 0.5, mouthStretchLeft: 0.4, mouthStretchRight: 0.4 },
  O:  { jawOpen: 0.5, mouthFunnel: 0.5, mouthPucker: 0.2 },
  U:  { jawOpen: 0.3, mouthFunnel: 0.4, mouthPucker: 0.6 },
};

// All ARKit targets we touch — used to zero out each frame
const ALL_TARGETS = [
  'jawOpen', 'mouthClose', 'mouthFunnel', 'mouthPucker',
  'mouthSmileLeft', 'mouthSmileRight', 'mouthStretchLeft', 'mouthStretchRight',
  'mouthShrugLower', 'mouthShrugUpper', 'mouthRollLower', 'mouthRollUpper',
  'mouthLowerDownLeft', 'mouthLowerDownRight', 'mouthUpperUpLeft', 'mouthUpperUpRight',
  'tongueOut',
];

export const VisemeToARKit = (viseme, blendShapeRef) => {
  if (typeof viseme !== 'object') return;

  const blendShape = {};
  for (const t of ALL_TARGETS) blendShape[t] = 0;

  for (const key in viseme) {
    const visemeValue = viseme[key];
    const visemeName = VisemeIndexMap[parseInt(key)];
    if (!visemeName) continue;
    const targets = ARKit[visemeName];
    for (const target in targets) {
      blendShape[target] += targets[target] * visemeValue;
    }
  }

  blendShapeRef.current.push(blendShape);
};
