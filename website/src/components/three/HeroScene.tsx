import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════════════════
   ORBITING PARTICLES — dots orbiting the main shape
   ═══════════════════════════════════════════════════════════════════════ */

function OrbitingParticles({ count = 60 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 1.5;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  const sizes = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      arr[i] = 0.8 + Math.random() * 1.5;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.08;
    ref.current.rotation.x += delta * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#8b5cf6"
        size={0.025}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   WIREFRAME STRUCTURE — triple-layer with glow
   ═══════════════════════════════════════════════════════════════════════ */

function WireStructure() {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  // Vertex positions for dots — deduplicated
  const vertices = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2.2, 1);
    const pos = geo.getAttribute("position");
    const points: THREE.Vector3[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < pos.count; i++) {
      const key = `${pos.getX(i).toFixed(2)},${pos.getY(i).toFixed(2)},${pos.getZ(i).toFixed(2)}`;
      if (!seen.has(key)) {
        seen.add(key);
        points.push(new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)));
      }
    }
    return points;
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current || !innerRef.current) return;
    // Auto rotation
    groupRef.current.rotation.y += delta * 0.15;
    groupRef.current.rotation.x += delta * 0.06;
    // Inner counter-rotation
    innerRef.current.rotation.y -= delta * 0.1;
    innerRef.current.rotation.z += delta * 0.08;
    // Mouse follow — stronger
    const tx = pointer.y * 0.5;
    const tz = pointer.x * 0.4;
    groupRef.current.rotation.x += (tx - groupRef.current.rotation.x) * delta * 0.8;
    groupRef.current.rotation.z += (tz - groupRef.current.rotation.z) * delta * 0.8;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Outer wireframe — violet */}
        <mesh>
          <icosahedronGeometry args={[2.2, 1]} />
          <meshBasicMaterial
            color="#8b5cf6"
            wireframe
            transparent
            opacity={0.18}
          />
        </mesh>

        {/* Middle wireframe — indigo, counter-rotating */}
        <group ref={innerRef}>
          <mesh>
            <icosahedronGeometry args={[1.5, 1]} />
            <meshBasicMaterial
              color="#6366f1"
              wireframe
              transparent
              opacity={0.12}
            />
          </mesh>
        </group>

        {/* Inner wireframe — cyan, smallest */}
        <mesh rotation={[0.3, 0.5, 0]}>
          <icosahedronGeometry args={[0.9, 1]} />
          <meshBasicMaterial
            color="#06b6d4"
            wireframe
            transparent
            opacity={0.15}
          />
        </mesh>

        {/* Vertex dots — outer */}
        {vertices.map((v, i) => (
          <mesh key={i} position={v}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0.7} />
          </mesh>
        ))}

        {/* Center core — glowing sphere */}
        <mesh>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.3} />
        </mesh>

        {/* Center glow — larger, softer */}
        <mesh>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshBasicMaterial color="#7c3aed" transparent opacity={0.08} />
        </mesh>

        {/* Outer glow halo */}
        <mesh>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshBasicMaterial
            color="#8b5cf6"
            transparent
            opacity={0.02}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Orbiting particles */}
        <OrbitingParticles count={80} />
      </group>
    </Float>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   CANVAS
   ═══════════════════════════════════════════════════════════════════════ */

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "auto" }}
    >
      <WireStructure />
    </Canvas>
  );
}
