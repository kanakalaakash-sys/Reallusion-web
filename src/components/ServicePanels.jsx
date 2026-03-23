import { Html, Text } from '@react-three/drei';

// Camera: position=[0,0.2,2.2], fov=50 (H-fov≈79°), target=[0,0.2,0]
// Frustum half-width at z=-0.3 ≈ 2.07 units  →  x=±1.2 is safely inside
// Frustum bottom at z≈0 ≈ y=-0.78  →  Advika label must be above y=-0.75
// distanceFactor: higher = larger. 3 at dist≈2.5 gives ~1.2× pixel size (compact cards)
const SERVICES = [
  {
    title: 'Technology',
    icon: '⚡',
    position: [-1.2, 0.35, -0.3],
    rotation: [0, Math.PI / 8, 0],
    items: [
      'Artificial Intelligence',
      'Cloud Transformation',
      'Data & Analytics',
      'Intelligent Automation',
      'Internet of Things',
      'Cybersecurity',
      'Advanced Data Analytics',
      'ERP Support & Integration',
    ],
  },
  {
    title: 'Finance',
    icon: '💹',
    position: [1.2, 0.6, -0.5],
    rotation: [0, -Math.PI / 8, 0],
    items: [
      'Consolidation & MIS',
      'Financial Statement',
      'Audit & Risk Management',
      'End 2 End Accounting',
      'Financial Planning & Analysis',
      'Treasury & Cash Management',
    ],
  },
  {
    title: 'SCM',
    icon: '🔗',
    position: [1.2, -0.3, -0.2],
    rotation: [0, -Math.PI / 8, 0],
    items: [
      'Sourcing & Procurement',
      'Demand & Supply Planning',
      'Logistics Management',
    ],
  },
];

function ServicePanel({ title, icon, items, position, rotation }) {
  return (
    <Html
      transform
      position={position}
      rotation={rotation}
      distanceFactor={1.5}
      zIndexRange={[10, 0]}
      style={{ pointerEvents: 'none' }}
    >
      <div style={{
        width: '175px',
        background: 'rgba(4, 9, 26, 0.88)',
        border: '1px solid rgba(26, 86, 219, 0.55)',
        borderRadius: '10px',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 0 22px rgba(26, 86, 219, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(90deg, #1a56db, #2563eb)',
          padding: '7px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
        }}>
          <span style={{ fontSize: '13px' }}>{icon}</span>
          <span style={{
            color: '#ffffff',
            fontWeight: '700',
            fontSize: '12px',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
          }}>
            {title}
          </span>
          <span style={{
            marginLeft: 'auto',
            fontSize: '8px',
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: '0.5px',
          }}>
            METAYB
          </span>
        </div>

        {/* Items */}
        <div style={{ padding: '6px 0 4px' }}>
          {items.map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '3.5px 12px',
              borderBottom: i < items.length - 1
                ? '1px solid rgba(26, 86, 219, 0.1)'
                : 'none',
            }}>
              <div style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#3b82f6',
                flexShrink: 0,
                boxShadow: '0 0 4px #3b82f6',
              }} />
              <span style={{
                color: '#c8d4f0',
                fontSize: '10.5px',
                lineHeight: '1.4',
              }}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Html>
  );
}

// Advika nameplate — positioned above y=-0.78 (frustum bottom) so it stays visible
export function AdvikaLabel() {
  return (
    <>
      <Text
        position={[0, -0.5, 0.1]}
        fontSize={0.09}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
        letterSpacing={0.05}
      >
        ADVIKA
      </Text>
      <Text
        position={[0, -0.62, 0.1]}
        fontSize={0.055}
        color="#3b82f6"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.02}
      >
        Metayb Brand Ambassador & Solutions Advisor
      </Text>
    </>
  );
}

export function ServicePanels() {
  return (
    <>
      {SERVICES.map((s) => (
        <ServicePanel key={s.title} {...s} />
      ))}
    </>
  );
}
