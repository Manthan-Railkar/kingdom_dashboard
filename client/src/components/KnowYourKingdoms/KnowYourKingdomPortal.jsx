import React, { useRef, useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useApp } from '../../context/AppContext';
import { isImagePath, resolveImageUrl } from '../../utils/imageHelpers';
import KingdomDetailModal from './KingdomDetailModal';
import './KnowYourKingdomPortal.css';

// ============================================================
// CONSTANTS
// ============================================================
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const FLAG_WIDTH = 2.2;
const FLAG_HEIGHT = 1.4;
const FLAG_SEGMENTS_X = 40;
const FLAG_SEGMENTS_Y = 28;
const ORBIT_RADIUS = 5;
const PARTICLE_COUNT = 180;

// ============================================================
// HELPERS
// ============================================================

function getFibonacciPosition(index, total, radius) {
  const y = 1 - (index / (total - 1)) * 2;
  const r = Math.sqrt(1 - y * y);
  const theta = GOLDEN_ANGLE * index;
  return new THREE.Vector3(
    Math.cos(theta) * r * radius,
    y * radius * 0.6 + 1,
    Math.sin(theta) * r * radius
  );
}

function createDefaultFlagTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 360;
  const ctx = canvas.getContext('2d');
  // Royal copper gradient background
  const grad = ctx.createLinearGradient(0, 0, 512, 360);
  grad.addColorStop(0, '#1a0e04');
  grad.addColorStop(0.5, '#2a1808');
  grad.addColorStop(1, '#0d0804');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 360);
  // Copper border
  ctx.strokeStyle = '#D4956A';
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 496, 344);
  // Inner border for richness
  ctx.strokeStyle = 'rgba(184, 115, 51, 0.3)';
  ctx.lineWidth = 2;
  ctx.strokeRect(18, 18, 476, 324);
  // Royal "Q" monogram
  ctx.fillStyle = '#D4956A';
  ctx.font = 'bold 110px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Q', 256, 140);
  // Subtitle
  ctx.font = 'bold 32px sans-serif';
  ctx.fillStyle = '#B87333';
  ctx.fillText('QUANTUM 26', 256, 250);
  // Decorative line
  ctx.strokeStyle = 'rgba(212, 149, 106, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(140, 290); ctx.lineTo(372, 290); ctx.stroke();
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createFallbackFlagTexture(letter, color) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 180;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 256, 180);
  grad.addColorStop(0, color || '#B87333');
  grad.addColorStop(1, '#0d0804');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 180);
  // Subtle inner border
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, 248, 172);
  // Letter
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = 'bold 72px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(letter, 128, 90);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ============================================================
// CSS PARTICLE FIELD — Landing page ambient particles
// ============================================================
function CSSParticleField() {
  const particles = useMemo(() =>
    Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 5,
      delay: Math.random() * 7,
      duration: 5 + Math.random() * 10,
    })), []);

  return (
    <div className="kyk-css-particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="kyk-css-particle"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: `${p.size}px`, height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

// ============================================================
// WAVING FLAG — Cloth physics via vertex displacement
// ============================================================
function WavingFlag({ texture }) {
  const meshRef = useRef();

  const { geometry, originalPositions } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(FLAG_WIDTH, FLAG_HEIGHT, FLAG_SEGMENTS_X, FLAG_SEGMENTS_Y);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pos.setX(i, pos.getX(i) + FLAG_WIDTH / 2);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return { geometry: geo, originalPositions: pos.array.slice() };
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const positions = meshRef.current.geometry.attributes.position;
    const t = clock.getElapsedTime();
    for (let i = 0; i < positions.count; i++) {
      const ox = originalPositions[i * 3];
      const oy = originalPositions[i * 3 + 1];
      const wf = Math.pow(Math.max(ox / FLAG_WIDTH, 0), 1.7);
      const z =
        Math.sin(ox * 3.5 + t * 2.5) * 0.12 * wf +
        Math.sin(oy * 2.5 + t * 1.8) * 0.06 * wf +
        Math.cos(ox * 1.5 + oy + t * 3) * 0.04 * wf +
        Math.sin(ox * 5 + oy * 3 + t * 4) * 0.018 * wf;
      positions.setZ(i, z);
    }
    positions.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow>
      <meshStandardMaterial
        map={texture}
        side={THREE.DoubleSide}
        roughness={0.75}
        metalness={0.08}
        color="#ffffff"
      />
    </mesh>
  );
}

// ============================================================
// FLAG POLE — Royal bronze pole with golden ornament
// ============================================================
function FlagPoleModel({ poleHeight = 3.2, defaultTexture }) {
  const flagY = poleHeight - 0.2;

  return (
    <group position={[0, -1, 0]}>
      {/* Pole shaft — warm bronze */}
      <mesh position={[0, poleHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.04, poleHeight, 16]} />
        <meshStandardMaterial color="#8B6B4A" metalness={0.88} roughness={0.15} />
      </mesh>
      {/* Gold top ornament */}
      <mesh position={[0, poleHeight + 0.06, 0]}>
        <sphereGeometry args={[0.065, 16, 16]} />
        <meshStandardMaterial color="#D4956A" metalness={0.85} roughness={0.12} emissive="#B87333" emissiveIntensity={0.25} />
      </mesh>
      {/* Ornament ring detail */}
      <mesh position={[0, poleHeight - 0.02, 0]}>
        <torusGeometry args={[0.035, 0.008, 8, 16]} />
        <meshStandardMaterial color="#D4956A" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Base — dark bronze pedestal */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.13, 0.17, 0.12, 16]} />
        <meshStandardMaterial color="#4A3520" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Base ring detail */}
      <mesh position={[0, 0.12, 0]}>
        <torusGeometry args={[0.13, 0.006, 8, 24]} />
        <meshStandardMaterial color="#B87333" metalness={0.85} roughness={0.15} />
      </mesh>
      {/* Waving flag at top */}
      <group position={[0, flagY, 0]}>
        <WavingFlag texture={defaultTexture} />
      </group>
    </group>
  );
}

// ============================================================
// FLOATING KINGDOM FLAG — Orbiting mini flag cards
// ============================================================
function FloatingKingdomFlag({ position, texture, color, delay, onFlagClick }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();
  const threeColor = useMemo(() => new THREE.Color(color || '#B87333'), [color]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime() + delay;
    groupRef.current.quaternion.copy(camera.quaternion);
    groupRef.current.position.y = position[1] + Math.sin(t * 0.4) * 0.15;
    const tgtScale = hovered ? 1.35 : 1;
    const s = groupRef.current.scale.x + (tgtScale - groupRef.current.scale.x) * 0.1;
    groupRef.current.scale.setScalar(s);
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Copper glow ring behind flag */}
      <mesh position={[0, 0, -0.015]}>
        <ringGeometry args={[0.48, 0.56, 32]} />
        <meshBasicMaterial color={threeColor} transparent opacity={hovered ? 0.45 : 0.1} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      {/* Flag card */}
      <mesh
        onClick={(e) => { e.stopPropagation(); onFlagClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = ''; }}
      >
        <planeGeometry args={[0.9, 0.64]} />
        <meshStandardMaterial map={texture} side={THREE.DoubleSide} emissive={threeColor} emissiveIntensity={hovered ? 0.2 : 0.06} roughness={0.5} metalness={0.15} />
      </mesh>
    </group>
  );
}

// ============================================================
// 3D SCENE PARTICLES — Warm copper floating dust
// ============================================================
function SceneParticles() {
  const pointsRef = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = 3 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.012;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#D4956A" transparent opacity={0.35} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

// ============================================================
// GLOWING TERRAIN — Royal copper wireframe floor
// ============================================================
function GlowingTerrain() {
  const meshRef = useRef();
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.material.emissiveIntensity = 0.03 + Math.sin(clock.getElapsedTime() * 0.4) * 0.012;
    }
  });
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[40, 40, 80, 80]} />
      <meshStandardMaterial color="#0a0806" emissive="#6B4226" emissiveIntensity={0.03} wireframe transparent opacity={0.1} />
    </mesh>
  );
}

// ============================================================
// ORBIT RINGS — Elegant copper-toned decorative torus rings
// ============================================================
function SceneOrbitRings() {
  const r1 = useRef();
  const r2 = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (r1.current) r1.current.rotation.z = t * 0.04;
    if (r2.current) r2.current.rotation.z = -t * 0.025;
  });
  return (
    <group position={[0, 0.5, 0]}>
      <mesh ref={r1} rotation={[Math.PI / 2.3, 0.15, 0]}>
        <torusGeometry args={[ORBIT_RADIUS + 0.1, 0.006, 8, 100]} />
        <meshBasicMaterial color="#B87333" transparent opacity={0.08} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={r2} rotation={[Math.PI / 2.8, -0.3, 0.5]}>
        <torusGeometry args={[ORBIT_RADIUS + 0.3, 0.004, 8, 100]} />
        <meshBasicMaterial color="#D4956A" transparent opacity={0.05} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

// ============================================================
// KINGDOM SCENE — Complete 3D scene graph
// ============================================================
function KingdomScene({ kingdoms, onFlagClick }) {
  const defaultTexture = useMemo(() => createDefaultFlagTexture(), []);

  // Load kingdom flag textures
  const fallbackTextures = useMemo(() => {
    const textures = {};
    kingdoms.forEach((k) => {
      const initial = k.name.split(' ')[1]?.[0] || k.name[0];
      textures[k._id] = createFallbackFlagTexture(initial, k.color);
    });
    return textures;
  }, [kingdoms]);

  const [loadedTextures, setLoadedTextures] = useState({});
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    kingdoms.forEach((k) => {
      if (isImagePath(k.flag)) {
        loader.load(resolveImageUrl(k.flag), (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          setLoadedTextures((prev) => ({ ...prev, [k._id]: tex }));
        }, undefined, () => {});
      }
    });
  }, [kingdoms]);

  const positions = useMemo(() =>
    kingdoms.map((_, i) => getFibonacciPosition(i, kingdoms.length, ORBIT_RADIUS)),
  [kingdoms.length]);

  // Slowly rotate floating flags group
  const floatingGroupRef = useRef();
  useFrame(({ clock }) => {
    if (floatingGroupRef.current) {
      floatingGroupRef.current.rotation.y = clock.getElapsedTime() * 0.06;
    }
  });

  return (
    <>
      {/* Warm charcoal background — matching website's --bg-deepest */}
      <color attach="background" args={['#0a0806']} />

      {/* === NEUTRAL BALANCED LIGHTING — preserves true flag colors === */}
      {/* Strong neutral ambient — no color tinting */}
      <ambientLight intensity={0.9} color="#ffffff" />
      {/* Hemisphere: neutral white sky, subtle warm ground */}
      <hemisphereLight args={['#ffffff', '#2a1a10', 0.4]} />

      {/* Key light — neutral white overhead */}
      <pointLight position={[0, 5, 0]} intensity={2.0} color="#ffffff" distance={14} decay={2} />
      {/* Fill lights — neutral white from multiple angles */}
      <pointLight position={[5, 3, 4]} intensity={0.7} color="#ffffff" distance={14} decay={2} />
      <pointLight position={[-5, 2, -4]} intensity={0.5} color="#ffffff" distance={14} decay={2} />
      <pointLight position={[0, 1, 6]} intensity={0.4} color="#ffffff" distance={12} decay={2} />
      {/* Subtle warm accent on the pole only */}
      <spotLight position={[0, 8, 3]} angle={0.25} penumbra={0.9} intensity={0.4} color="#FFF0E0" castShadow />

      <Stars radius={120} depth={80} count={1500} factor={3} saturation={0.3} fade speed={0.3} />
      <SceneParticles />
      <SceneOrbitRings />
      <GlowingTerrain />

      {/* Central Flag Pole with Quantum flag */}
      <FlagPoleModel defaultTexture={defaultTexture} />

      {/* Floating Kingdom Flags */}
      <group ref={floatingGroupRef}>
        {kingdoms.map((k, i) => (
          <FloatingKingdomFlag
            key={k._id}
            position={[positions[i].x, positions[i].y, positions[i].z]}
            texture={loadedTextures[k._id] || fallbackTextures[k._id]}
            color={k.color}
            delay={i * 0.7}
            onFlagClick={() => onFlagClick(k)}
          />
        ))}
      </group>

      <OrbitControls
        autoRotate
        autoRotateSpeed={0.25}
        enableZoom
        minDistance={3}
        maxDistance={12}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.1}
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
      />

      <EffectComposer>
        <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.9} intensity={0.3} mipmapBlur />
      </EffectComposer>
    </>
  );
}

// ============================================================
// MAIN EXPORT — Portal with landing → expand → 3D scene
// ============================================================
export default function KnowYourKingdomPortal() {
  const { kingdoms } = useApp();
  const [phase, setPhase] = useState('idle'); // 'idle' | 'activating' | 'active'
  const [selectedKingdom, setSelectedKingdom] = useState(null);

  const handleReveal = useCallback(() => {
    setPhase('activating');
    setTimeout(() => setPhase('active'), 1400);
  }, []);

  const handleClose = useCallback(() => {
    setPhase('idle');
  }, []);

  const handleFlagClick = useCallback((kingdom) => {
    setSelectedKingdom(kingdom);
  }, []);

  if (!kingdoms || kingdoms.length === 0) return null;

  return (
    <>
      <div className={`kyk-portal ${phase}`}>
        {/* ===== LANDING STATE ===== */}
        {(phase === 'idle' || phase === 'activating') && (
          <div className="kyk-landing">
            <CSSParticleField />
            <div className="kyk-landing-subtitle">THE PORTAL AWAITS</div>
            <div className="kyk-btn-wrap">
              <button className="kyk-btn" onClick={handleReveal} disabled={phase === 'activating'}>
                {phase === 'activating' ? '✦ ENTERING REALM ✦' : '✦ KNOW YOUR KINGDOM ✦'}
                <div className="kyk-pulse-ring" />
                <div className="kyk-pulse-ring" />
                <div className="kyk-pulse-ring" />
              </button>
            </div>
            <div className="kyk-landing-hint">Click to enter the Kingdom Portal</div>
          </div>
        )}

        {/* ===== 3D SCENE ===== */}
        {(phase === 'activating' || phase === 'active') && (
          <div className="kyk-scene-wrap">
            <Canvas
              camera={{ position: [0, 2, 6], fov: 50 }}
              dpr={[1, 2]}
              shadows
              gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', stencil: false }}
            >
              <Suspense fallback={null}>
                <KingdomScene
                  kingdoms={kingdoms}
                  onFlagClick={handleFlagClick}
                />
              </Suspense>
            </Canvas>

            {/* Info Badge */}
            {phase === 'active' && (
              <div className="kyk-info-badge">
                <h3>KINGDOM PORTAL</h3>
                <p>Click a floating flag to explore a kingdom</p>
              </div>
            )}

            {/* Navigation Panel */}
            {phase === 'active' && (
              <div className="kyk-glass-panel">
                <span className="kyk-glass-title">KINGDOM PORTAL</span>
                <button className="kyk-back-btn" onClick={handleClose}>← BACK</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Kingdom Detail Modal */}
      {selectedKingdom && (
        <KingdomDetailModal kingdom={selectedKingdom} onClose={() => setSelectedKingdom(null)} />
      )}
    </>
  );
}
