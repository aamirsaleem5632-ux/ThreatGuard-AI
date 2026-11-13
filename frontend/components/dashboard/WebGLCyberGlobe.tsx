'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Preload, PresentationControls } from '@react-three/drei';

// Convert Lat/Long degrees into 3D Cartesian coordinates on a sphere of given radius
function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// 3D Spline Arc bridging two threat coordinates across space
function CyberFlightArc({
  start,
  end,
  color,
  elevation = 0.5
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
  elevation?: number;
}) {
  const curvePoints = useMemo(() => {
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const midLength = mid.length();
    if (midLength > 0.001) {
      mid.normalize().multiplyScalar(midLength + elevation);
    }
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return curve.getPoints(36);
  }, [start, end, elevation]);

  const lineObject = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.75,
    });
    return new THREE.Line(geometry, material);
  }, [curvePoints, color]);

  return <primitive object={lineObject} />;
}

// Hotspot Marker with pulsing glow
function ThreatNodeMarker({
  position,
  color,
  threatCount,
  label,
  onHover,
  onLeave
}: {
  position: THREE.Vector3;
  color: string;
  threatCount: number;
  label: string;
  onHover: (info: { label: string; threats: number }) => void;
  onLeave: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (pulseRef.current) {
      const t = (state.clock.getElapsedTime() * 3) % (Math.PI * 2);
      const s = 1 + Math.sin(t) * 0.45;
      pulseRef.current.scale.set(s, s, s);
      const mat = pulseRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = Math.max(0.1, 0.6 - Math.sin(t) * 0.4);
    }
  });

  return (
    <group position={position}>
      {/* Outer pulsing ping wave */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>

      {/* Solid core sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover({ label, threats: threatCount });
        }}
        onPointerOut={() => onLeave()}
      >
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.4}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

// Camera transition controller responding smoothly to "Threat Radar Rail" toggle
function CameraRig({ isRailOpen }: { isRailOpen: boolean }) {
  const { camera } = useThree();

  useFrame(() => {
    // When the Threat Radar Rail is open, shift camera target smoothly to balance visual space
    const targetX = isRailOpen ? -0.35 : 0;
    const targetY = isRailOpen ? 0.05 : 0;
    const targetZ = isRailOpen ? 4.9 : 4.6;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.06);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.06);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.06);
    camera.lookAt(targetX * 0.5, targetY * 0.5, 0);
  });

  return null;
}

// 3D Rotating Cyber Globe Model with Obsidian Purple and Violet Emissive Lighting
function CyberGlobeMesh({
  onHoverNode,
  onLeaveNode
}: {
  onHoverNode: (info: { label: string; threats: number }) => void;
  onLeaveNode: () => void;
}) {
  const globeGroupRef = useRef<THREE.Group>(null);
  const outerRingsRef = useRef<THREE.Group>(null);
  const purpleHaloRef = useRef<THREE.Mesh>(null);

  // Global Threat Cities mapped to 3D positions on radius 2.0 (Strict Obsidian Purple/Violet Aesthetic)
  const nodes = useMemo(() => {
    return [
      { id: 'nyc', label: 'US-East (New York)', lat: 40.71, lon: -74.0, count: 142, color: '#A4CB94' },
      { id: 'sfo', label: 'US-West (San Francisco)', lat: 37.77, lon: -122.41, count: 88, color: '#51945A' },
      { id: 'fra', label: 'EU-Central (Frankfurt)', lat: 50.11, lon: 8.68, count: 320, color: '#5D9860' },
      { id: 'lon', label: 'EU-West (London)', lat: 51.5, lon: -0.12, count: 175, color: '#CBE5B9' },
      { id: 'tok', label: 'AP-East (Tokyo)', lat: 35.67, lon: 139.65, count: 284, color: '#51945A' },
      { id: 'sin', label: 'AP-South (Singapore)', lat: 1.35, lon: 103.81, count: 98, color: '#5D9860' },
      { id: 'syd', label: 'AP-Southeast (Sydney)', lat: -33.86, lon: 151.2, count: 64, color: '#51945A' },
      { id: 'sao', label: 'SA-East (São Paulo)', lat: -23.55, lon: -46.63, count: 67, color: '#5D9860' },
      { id: 'dxb', label: 'ME-Central (Dubai)', lat: 25.2, lon: 55.27, count: 72, color: '#A4CB94' },
    ].map((n) => ({
      ...n,
      pos: latLongToVector3(n.lat, n.lon, 2.0),
    }));
  }, []);

  // Cyber trajectories connecting high-activity nodes (Vibrant Purple & Violet Arcs)
  const flightArcs = useMemo(() => {
    const getNode = (id: string) => nodes.find((n) => n.id === id);
    return [
      { from: getNode('fra')!, to: getNode('nyc')!, color: '#5D9860', elev: 0.65 },
      { from: getNode('tok')!, to: getNode('sfo')!, color: '#51945A', elev: 0.75 },
      { from: getNode('fra')!, to: getNode('tok')!, color: '#A4CB94', elev: 0.8 },
      { from: getNode('lon')!, to: getNode('dxb')!, color: '#CBE5B9', elev: 0.5 },
      { from: getNode('sin')!, to: getNode('syd')!, color: '#5D9860', elev: 0.55 },
      { from: getNode('nyc')!, to: getNode('sao')!, color: '#51945A', elev: 0.6 },
    ];
  }, [nodes]);

  // Rotate smoothly on each frame
  useFrame((_, delta) => {
    if (globeGroupRef.current) {
      globeGroupRef.current.rotation.y += delta * 0.12;
    }
    if (outerRingsRef.current) {
      outerRingsRef.current.rotation.y -= delta * 0.08;
      outerRingsRef.current.rotation.x += delta * 0.04;
    }
    if (purpleHaloRef.current) {
      purpleHaloRef.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <group>
      {/* Primary Cyber Globe Hierarchy */}
      <group ref={globeGroupRef}>
        {/* Deep dark obsidian core sphere */}
        <mesh>
          <sphereGeometry args={[1.96, 48, 48]} />
          <meshStandardMaterial
            color="#030705"
            roughness={0.7}
            metalness={0.8}
            emissive="#07110A"
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* High-tech Violet Wireframe Globe */}
        <mesh>
          <sphereGeometry args={[2.0, 36, 36]} />
          <meshStandardMaterial
            color="#5D9860"
            wireframe
            emissive="#3E7948"
            emissiveIntensity={0.65}
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* Equatorial & Latitude Purple Neon Rings */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.005, 2.02, 64]} />
          <meshBasicMaterial color="#51945A" side={THREE.DoubleSide} transparent opacity={0.65} />
        </mesh>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <ringGeometry args={[2.005, 2.015, 64]} />
          <meshBasicMaterial color="#5D9860" side={THREE.DoubleSide} transparent opacity={0.45} />
        </mesh>
        <mesh rotation={[-Math.PI / 3, 0, 0]}>
          <ringGeometry args={[2.005, 2.015, 64]} />
          <meshBasicMaterial color="#245A34" side={THREE.DoubleSide} transparent opacity={0.45} />
        </mesh>

        {/* Surface Threat Node Markers */}
        {nodes.map((node) => (
          <ThreatNodeMarker
            key={node.id}
            position={node.pos}
            color={node.color}
            threatCount={node.count}
            label={node.label}
            onHover={onHoverNode}
            onLeave={onLeaveNode}
          />
        ))}

        {/* Cyber Flight Arcs */}
        {flightArcs.map((arc, idx) => (
          <CyberFlightArc
            key={idx}
            start={arc.from.pos}
            end={arc.to.pos}
            color={arc.color}
            elevation={arc.elev}
          />
        ))}
      </group>

      {/* Outer Purple Emissive Lattice Halo */}
      <group ref={outerRingsRef}>
        <mesh ref={purpleHaloRef}>
          <icosahedronGeometry args={[2.28, 1]} />
          <meshStandardMaterial
            color="#5D9860"
            wireframe
            emissive="#51945A"
            emissiveIntensity={0.55}
            transparent
            opacity={0.18}
          />
        </mesh>

        {/* Planetary Orbital Ring */}
        <mesh rotation={[Math.PI / 2.3, 0.4, 0]}>
          <ringGeometry args={[2.6, 2.62, 96]} />
          <meshBasicMaterial color="#3E7948" side={THREE.DoubleSide} transparent opacity={0.3} />
        </mesh>
      </group>
    </group>
  );
}

interface WebGLCyberGlobeProps {
  isRailOpen?: boolean;
}

// Resilient Error Boundary specifically safeguarding Three.js & WebGL rendering
class CanvasErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('[ThreatGuard AI] WebGL Canvas safely switched to 2D Holographic Radar fallback:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// 2D Holographic Radar Scope Visualizer (Obsidian Purple/Violet Re-skinned)
function HolographicRadarFallback({
  activeTooltip,
  setActiveTooltip,
  railState
}: {
  activeTooltip: { label: string; threats: number } | null;
  setActiveTooltip: (info: { label: string; threats: number } | null) => void;
  railState: boolean;
}) {
  const radarNodes = [
    { id: 'fra', label: 'EU-Central (Frankfurt)', x: 48, y: 38, count: 320, color: '#5D9860' },
    { id: 'nyc', label: 'US-East (New York)', x: 28, y: 44, count: 142, color: '#A4CB94' },
    { id: 'tok', label: 'AP-East (Tokyo)', x: 78, y: 46, count: 284, color: '#51945A' },
    { id: 'sin', label: 'AP-South (Singapore)', x: 68, y: 62, count: 98, color: '#5D9860' },
    { id: 'lon', label: 'EU-West (London)', x: 44, y: 34, count: 175, color: '#CBE5B9' },
    { id: 'syd', label: 'AP-Southeast (Sydney)', x: 84, y: 76, count: 64, color: '#51945A' },
  ];

  return (
    <div className="relative w-full h-[320px] rounded-xl overflow-hidden bg-[#030705]/90 border border-purple-500/15 flex items-center justify-center select-none">
      {/* Background radial purple ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(81,148,90,0.12)_0%,transparent_70%)] pointer-events-none" />

      {/* Grid crosshairs */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="w-full h-full border border-purple-500/30" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-purple-500/40" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-purple-500/40" />
      </div>

      {/* Concentric Radar Rings */}
      <div className="relative w-64 h-64 rounded-full border border-purple-500/25 flex items-center justify-center">
        <div className="w-48 h-48 rounded-full border border-purple-500/20 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border border-purple-500/25 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border border-violet-500/30 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            </div>
          </div>
        </div>

        {/* Sweeping Radar Beam */}
        <div className="absolute inset-0 rounded-full animate-radar-sweep pointer-events-none overflow-hidden">
          <div className="w-1/2 h-1/2 bg-gradient-to-br from-purple-600/40 via-violet-700/15 to-transparent origin-bottom-right" />
        </div>

        {/* Threat Trajectory Arcs */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          <path d="M 122 97 Q 95 105 71 112" fill="none" stroke="#A8CE91" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
          <path d="M 122 97 Q 160 100 199 117" fill="none" stroke="#A4CB94" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />
          <path d="M 199 117 Q 185 140 174 158" fill="none" stroke="#5D9860" strokeWidth="1.5" opacity="0.5" />
        </svg>

        {/* Active Node Pins */}
        {radarNodes.map((node) => (
          <div
            key={node.id}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
            onMouseEnter={() => setActiveTooltip({ label: node.label, threats: node.count })}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <span
              className="absolute -inset-1 rounded-full animate-ping opacity-60"
              style={{ backgroundColor: node.color }}
            />
            <span
              className="relative block w-2.5 h-2.5 rounded-full border border-white shadow-md"
              style={{ backgroundColor: node.color }}
            />
          </div>
        ))}
      </div>

      {/* Floating Node Telemetry Tooltip */}
      {activeTooltip && (
        <div className="absolute top-4 right-4 pointer-events-none bg-[#07110A]/95 border border-purple-500/30 px-3.5 py-2 rounded-xl text-xs font-mono text-white shadow-[0_0_20px_rgba(104,166,109,0.3)] backdrop-blur-md animate-in fade-in zoom-in-95 z-20">
          <div className="text-purple-300 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <span>{activeTooltip.label}</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">
            Active Threat Indicators: <strong className="text-violet-300 font-bold">{activeTooltip.threats}</strong>
          </div>
        </div>
      )}

      {/* Status Hint */}
      <div className="absolute bottom-2.5 left-3 flex items-center gap-2 pointer-events-none text-[10px] font-mono text-zinc-400 bg-[#030705]/80 px-2.5 py-1 rounded-md border border-purple-500/15 backdrop-blur-sm z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
        <span>Holographic Threat Radar</span>
        <span className="text-violet-300">• Telemetry Active</span>
        {railState && <span className="text-purple-300 font-semibold">• Sensor Synced</span>}
      </div>
    </div>
  );
}

export default function WebGLCyberGlobe({ isRailOpen = false }: WebGLCyberGlobeProps) {
  const [activeTooltip, setActiveTooltip] = useState<{ label: string; threats: number } | null>(null);
  const [railState, setRailState] = useState(isRailOpen);
  const [isClient, setIsClient] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setIsClient(true);
    // Safe WebGL support check
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(false);
    }
  }, []);

  // Sync with prop & listen to global Threat Radar Rail toggle events
  useEffect(() => {
    setRailState(isRailOpen);
  }, [isRailOpen]);

  useEffect(() => {
    function handleRailToggle(e: Event) {
      try {
        const customEvent = e as CustomEvent<{ open?: boolean }>;
        if (customEvent.detail && typeof customEvent.detail.open === 'boolean') {
          setRailState(customEvent.detail.open);
        } else {
          setRailState((prev) => !prev);
        }
      } catch {
        // Silently preserve state
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('threatguard:toggle-radar-rail', handleRailToggle);
      return () => {
        window.removeEventListener('threatguard:toggle-radar-rail', handleRailToggle);
      };
    }
  }, []);

  const fallbackUI = (
    <HolographicRadarFallback
      activeTooltip={activeTooltip}
      setActiveTooltip={setActiveTooltip}
      railState={railState}
    />
  );

  // If not mounted or WebGL context is not supported, safely render holographic radar
  if (!isClient || !hasWebGL) {
    return fallbackUI;
  }

  return (
    <div className="relative w-full h-[320px] select-none overflow-hidden rounded-xl bg-[#030305]/80 border border-purple-500/15">
      <CanvasErrorBoundary fallback={fallbackUI}>
        {/* 3D WebGL Canvas */}
        <Canvas
          camera={{ position: [0, 0, 4.6], fov: 48 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onCreated={({ gl }) => {
            // Protect against context loss
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              e.preventDefault();
              setHasWebGL(false);
            });
          }}
        >
          {/* Ambient Dark Purple Fill */}
          <ambientLight intensity={0.5} color="#0F0E18" />

          {/* Violet Accent Directional Light */}
          <directionalLight position={[5, 4, 6]} intensity={1.6} color="#A855F7" />

          {/* Royal Purple Point Light Accent */}
          <pointLight position={[-4, -3, 3]} intensity={1.8} color="#8B5CF6" distance={12} />

          {/* Top Lilac Rim Light */}
          <pointLight position={[0, 6, 0]} intensity={1.1} color="#C084FC" distance={10} />

          {/* Camera Rig with smooth lerp on rail toggle */}
          <CameraRig isRailOpen={railState} />

          <PresentationControls
            global
            cursor={false}
            config={{ mass: 2, tension: 500 }}
            snap={{ mass: 4, tension: 1500 }}
            rotation={[0.08, 0.08, 0]}
            polar={[-0.35, 0.25]}
            azimuth={[-0.45, 0.45]}
          >
            {/* Interactive 3D Cyber Globe */}
            <CyberGlobeMesh
              onHoverNode={(info) => setActiveTooltip(info)}
              onLeaveNode={() => setActiveTooltip(null)}
            />
          </PresentationControls>
          <Preload all />
        </Canvas>
      </CanvasErrorBoundary>

      {/* Floating 3D Node Telemetry Tooltip */}
      {activeTooltip && (
        <div className="absolute top-4 right-4 pointer-events-none bg-[#0B0A10]/95 border border-purple-500/30 px-3.5 py-2 rounded-xl text-xs font-mono text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] backdrop-blur-md animate-in fade-in zoom-in-95">
          <div className="text-purple-300 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <span>{activeTooltip.label}</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">
            Active Threat Indicators: <strong className="text-violet-300 font-bold">{activeTooltip.threats}</strong>
          </div>
        </div>
      )}

      {/* Interactive Controls & Status Hint */}
      <div className="absolute bottom-2.5 left-3 flex items-center gap-2 pointer-events-none text-[10px] font-mono text-zinc-400 bg-[#030305]/80 px-2.5 py-1 rounded-md border border-purple-500/15 backdrop-blur-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
        <span>Three.js WebGL Engine</span>
        <span className="text-purple-300">• Drag to Inspect</span>
        {railState && <span className="text-violet-300 font-semibold">• Camera Centered</span>}
      </div>
    </div>
  );
}
