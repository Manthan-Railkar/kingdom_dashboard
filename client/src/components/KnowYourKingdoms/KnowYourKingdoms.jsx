import React, { useRef, useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useApp } from '../../context/AppContext';
import { isImagePath, resolveImageUrl } from '../../utils/imageHelpers';
import KingdomDetailModal from './KingdomDetailModal';
import './KnowYourKingdoms.css';

// ============================================================
// CONSTANTS
// ============================================================
const SPHERE_RADIUS = 1.8;
const AUTO_SPEED = 0.003;
const FRICTION = 0.96;
const SENSITIVITY = 0.008;
const PARTICLE_COUNT = 150;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

// ============================================================
// HELPERS
// ============================================================

/** Fibonacci sphere distribution — evenly spaces N points on a sphere */
function getFibonacciPosition(index, total, radius) {
  const y = 1 - (index / (total - 1)) * 2; // -1 to 1
  const r = Math.sqrt(1 - y * y);
  const theta = GOLDEN_ANGLE * index;
  return new THREE.Vector3(
    Math.cos(theta) * r * radius,
    y * radius,
    Math.sin(theta) * r * radius
  );
}

/** Create a canvas-based fallback texture for kingdoms without flag images */
function createFallbackTexture(letter, color, accentColor) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 128, 96);
  grad.addColorStop(0, color || '#B87333');
  grad.addColorStop(1, accentColor || '#D4956A');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 96);

  // Subtle inner border
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 2;
  ctx.strokeRect(3, 3, 122, 90);

  // Kingdom initial
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = 'bold 42px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(letter, 64, 48);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ============================================================
// SPACE PARTICLES — Ambient cosmic dust
// ============================================================
function SpaceParticles() {
  const pointsRef = useRef();

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const sz = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = 2.5 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sz[i] = 0.008 + Math.random() * 0.025;
    }
    return [pos, sz];
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.015;
      pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.08) * 0.04;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={PARTICLE_COUNT} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#8899cc"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ============================================================
// ASTRONAUT CENTER — Floating sprite at origin
// ============================================================
function AstronautCenter() {
  const spriteRef = useRef();
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    new THREE.TextureLoader().load('/astronaut.png', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
    });
  }, []);

  useFrame(({ clock }) => {
    if (spriteRef.current) {
      const t = clock.getElapsedTime();
      spriteRef.current.position.y = Math.sin(t * 0.7) * 0.06;
      spriteRef.current.position.x = Math.sin(t * 0.4) * 0.02;
    }
  });

  if (!texture) return null;

  return (
    <sprite ref={spriteRef} scale={[0.9, 0.9, 1]}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  );
}

// ============================================================
// ORBIT RINGS — Decorative orbital paths
// ============================================================
function OrbitRings() {
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.05;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.03;
  });

  return (
    <group>
      {/* Primary orbit ring */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2.2, 0.2, 0]}>
        <torusGeometry args={[SPHERE_RADIUS + 0.05, 0.005, 8, 80]} />
        <meshBasicMaterial color="#B87333" transparent opacity={0.12} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* Secondary ring */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 2.8, -0.4, 0.6]}>
        <torusGeometry args={[SPHERE_RADIUS + 0.15, 0.003, 8, 80]} />
        <meshBasicMaterial color="#6688cc" transparent opacity={0.07} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

// ============================================================
// FLAG CARD — Individual kingdom flag in 3D space
// ============================================================
function FlagCard({ kingdom, position, texture, dragDistRef, onFlagClick }) {
  const groupRef = useRef();
  const glowRef = useRef();
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();
  const color = useMemo(() => new THREE.Color(kingdom.color || '#B87333'), [kingdom.color]);
  const targetScale = useRef(1);

  useFrame(() => {
    if (!groupRef.current) return;

    // Billboard — always face camera
    groupRef.current.quaternion.copy(camera.quaternion);

    // Smooth scale animation
    targetScale.current = hovered ? 1.35 : 1;
    const s = groupRef.current.scale.x;
    const newScale = s + (targetScale.current - s) * 0.12;
    groupRef.current.scale.setScalar(newScale);

    // Glow pulse on hover
    if (glowRef.current) {
      const targetOpacity = hovered ? 0.55 : 0.15;
      glowRef.current.material.opacity += (targetOpacity - glowRef.current.material.opacity) * 0.1;
    }
  });

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    if (dragDistRef.current < 6) {
      onFlagClick(kingdom);
    }
  }, [kingdom, onFlagClick, dragDistRef]);

  return (
    <group ref={groupRef} position={position}>
      {/* Glow ring — blooms nicely */}
      <mesh ref={glowRef} position={[0, 0, -0.02]}>
        <ringGeometry args={[0.24, 0.30, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Flag image plane */}
      <mesh
        onClick={handleClick}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = ''; }}
      >
        <planeGeometry args={[0.44, 0.32]} />
        <meshStandardMaterial
          map={texture}
          emissive={color}
          emissiveIntensity={hovered ? 0.25 : 0.06}
          roughness={0.6}
          metalness={0.2}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Thin border frame */}
      <mesh position={[0, 0, 0.001]}>
        <planeGeometry args={[0.47, 0.35]} />
        <meshBasicMaterial color={color} transparent opacity={hovered ? 0.4 : 0.12} wireframe />
      </mesh>
    </group>
  );
}

// ============================================================
// FLAG SPHERE — Rotating group of all kingdom flags
// ============================================================
function FlagSphere({ kingdoms, velocityRef, isDraggingRef, dragDistRef, onFlagClick, isModalOpen }) {
  const groupRef = useRef();

  // Pre-create fallback textures
  const fallbackTextures = useMemo(() => {
    const textures = {};
    kingdoms.forEach((k) => {
      const initial = k.name.split(' ')[1]?.[0] || k.name[0];
      textures[k._id] = createFallbackTexture(initial, k.color, k.accentColor);
    });
    return textures;
  }, [kingdoms]);

  // Load real flag textures progressively
  const [loadedTextures, setLoadedTextures] = useState({});
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    kingdoms.forEach((k) => {
      if (isImagePath(k.flag)) {
        loader.load(
          resolveImageUrl(k.flag),
          (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            setLoadedTextures((prev) => ({ ...prev, [k._id]: tex }));
          },
          undefined,
          () => {} // Silently fail — use fallback
        );
      }
    });
  }, [kingdoms]);

  // Fibonacci positions for each kingdom
  const positions = useMemo(() => {
    return kingdoms.map((_, i) => getFibonacciPosition(i, kingdoms.length, SPHERE_RADIUS));
  }, [kingdoms.length]);

  // Physics animation loop
  useFrame(() => {
    if (!groupRef.current) return;

    if (isModalOpen) {
      // Decelerate when modal is open
      velocityRef.current.y *= 0.92;
      velocityRef.current.x *= 0.92;
    } else if (!isDraggingRef.current) {
      // Apply friction
      velocityRef.current.y *= FRICTION;
      velocityRef.current.x *= FRICTION;
      // Auto-rotate (diminishes when spinning fast)
      const speedRatio = Math.min(Math.abs(velocityRef.current.y) / 0.04, 1);
      velocityRef.current.y += AUTO_SPEED * (1 - speedRatio);
    }

    groupRef.current.rotation.y += velocityRef.current.y;
    groupRef.current.rotation.x += velocityRef.current.x;

    // Clamp vertical rotation
    groupRef.current.rotation.x = THREE.MathUtils.clamp(groupRef.current.rotation.x, -0.7, 0.7);
  });

  return (
    <group ref={groupRef}>
      {kingdoms.map((k, i) => (
        <FlagCard
          key={k._id}
          kingdom={k}
          position={positions[i]}
          texture={loadedTextures[k._id] || fallbackTextures[k._id]}
          dragDistRef={dragDistRef}
          onFlagClick={onFlagClick}
        />
      ))}
    </group>
  );
}

// ============================================================
// KINGDOM SCENE — Full scene graph (lights, effects, objects)
// ============================================================
function KingdomScene({ kingdoms, velocityRef, isDraggingRef, dragDistRef, onFlagClick, isModalOpen }) {
  return (
    <>
      {/* Background & fog */}
      <color attach="background" args={['#040210']} />
      <fog attach="fog" args={['#040210', 5, 14]} />

      {/* Lighting */}
      <ambientLight intensity={0.2} color="#4466aa" />
      <pointLight position={[0, 0, 0]} intensity={2} color="#D4956A" distance={5} decay={2} />
      <pointLight position={[3, 2, 2]} intensity={0.4} color="#6688cc" distance={8} decay={2} />
      <pointLight position={[-2, -1, 3]} intensity={0.2} color="#9966cc" distance={6} decay={2} />

      {/* Starfield background */}
      <Stars radius={80} depth={60} count={1500} factor={3} saturation={0.1} fade speed={0.5} />

      {/* Scene objects */}
      <SpaceParticles />
      <OrbitRings />
      <AstronautCenter />
      <FlagSphere
        kingdoms={kingdoms}
        velocityRef={velocityRef}
        isDraggingRef={isDraggingRef}
        dragDistRef={dragDistRef}
        onFlagClick={onFlagClick}
        isModalOpen={isModalOpen}
      />

      {/* Postprocessing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.25}
          luminanceSmoothing={0.9}
          intensity={0.7}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

// ============================================================
// MAIN EXPORT — Canvas wrapper + interaction handlers + modal
// ============================================================
export default function KnowYourKingdoms() {
  const { kingdoms } = useApp();
  const [selectedKingdom, setSelectedKingdom] = useState(null);

  // Shared refs for physics (accessed by both DOM handlers and R3F useFrame)
  const velocityRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const dragDistRef = useRef(0);

  // ---- Pointer / Mouse handlers ----
  const handlePointerDown = useCallback((e) => {
    isDraggingRef.current = true;
    dragDistRef.current = 0;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    lastPointerRef.current = { x: clientX, y: clientY };
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isDraggingRef.current) return;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    const dx = clientX - lastPointerRef.current.x;
    const dy = clientY - lastPointerRef.current.y;
    dragDistRef.current += Math.abs(dx) + Math.abs(dy);
    velocityRef.current.y = dx * SENSITIVITY;
    velocityRef.current.x = dy * SENSITIVITY * 0.5; // Vertical is more subtle
    lastPointerRef.current = { x: clientX, y: clientY };
  }, []);

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const handleFlagClick = useCallback((kingdom) => {
    setSelectedKingdom(kingdom);
  }, []);

  if (!kingdoms || kingdoms.length === 0) return null;

  return (
    <>
      <div className="kyk-section">
        <div className="kyk-title">✦ KNOW YOUR KINGDOMS ✦</div>

        <div
          className="kyk-canvas-wrap"
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          <Canvas
            camera={{ position: [0, 0.2, 4.2], fov: 48 }}
            dpr={[1, 2]}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance',
              stencil: false,
            }}
          >
            <Suspense fallback={null}>
              <KingdomScene
                kingdoms={kingdoms}
                velocityRef={velocityRef}
                isDraggingRef={isDraggingRef}
                dragDistRef={dragDistRef}
                onFlagClick={handleFlagClick}
                isModalOpen={!!selectedKingdom}
              />
            </Suspense>
          </Canvas>
        </div>

        <div className="kyk-hint">⟵ Drag to explore the cosmos ⟶</div>
      </div>

      {/* Kingdom Detail Modal */}
      {selectedKingdom && (
        <KingdomDetailModal
          kingdom={selectedKingdom}
          onClose={() => setSelectedKingdom(null)}
        />
      )}
    </>
  );
}
