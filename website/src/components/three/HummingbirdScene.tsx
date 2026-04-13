import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/* ============================================================
   HUMMINGBIRD BODY — built from merged geometries
   Crystal/iridescent material with purple-pink-blue tones
   ============================================================ */
function HummingbirdModel() {
  const groupRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Mesh>(null);
  const rightWingRef = useRef<THREE.Mesh>(null);
  const tailRef = useRef<THREE.Mesh>(null);

  /* Iridescent shader material */
  const iridMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color('#8b5cf6') },
        uColor2: { value: new THREE.Color('#ec4899') },
        uColor3: { value: new THREE.Color('#3b82f6') },
        uFresnelPower: { value: 2.5 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mvPos.xyz);
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform float uFresnelPower;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          float fresnel = pow(1.0 - dot(vNormal, vViewDir), uFresnelPower);

          // Iridescent color shift based on view angle + position
          float t = dot(vNormal, vViewDir) * 0.5 + 0.5;
          t += sin(vPosition.x * 3.0 + uTime * 0.5) * 0.15;
          t += sin(vPosition.y * 2.0 + uTime * 0.3) * 0.1;

          vec3 col;
          if (t < 0.5) {
            col = mix(uColor1, uColor2, t * 2.0);
          } else {
            col = mix(uColor2, uColor3, (t - 0.5) * 2.0);
          }

          // Add bright fresnel edge glow
          vec3 fresnelColor = mix(col, vec3(1.0, 0.85, 1.0), fresnel * 0.7);

          // Sparkle
          float sparkle = pow(max(dot(reflect(-vViewDir, vNormal), vec3(0.5, 1.0, 0.3)), 0.0), 40.0);
          fresnelColor += sparkle * 0.6;

          // Base diffuse
          float diffuse = max(dot(vNormal, normalize(vec3(1.0, 1.5, 1.0))), 0.0);
          fresnelColor *= 0.5 + diffuse * 0.6;

          gl_FragColor = vec4(fresnelColor, 0.92);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, []);

  /* Wing material — more transparent, brighter */
  const wingMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mvPos.xyz);
          vPosition = position;
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        varying vec3 vPosition;

        void main() {
          float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), 1.8);

          vec3 baseColor = mix(
            vec3(0.65, 0.4, 1.0),
            vec3(1.0, 0.5, 0.8),
            sin(vPosition.x * 5.0 + uTime) * 0.5 + 0.5
          );

          vec3 col = mix(baseColor * 0.6, vec3(1.0, 0.9, 1.0), fresnel * 0.8);
          float alpha = 0.35 + fresnel * 0.5;

          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Update shader time
    iridMaterial.uniforms.uTime.value = t;
    wingMaterial.uniforms.uTime.value = t;

    // Wing flap — fast oscillation
    if (leftWingRef.current && rightWingRef.current) {
      const wingAngle = Math.sin(t * 18) * 0.6 + 0.2;
      leftWingRef.current.rotation.z = wingAngle;
      rightWingRef.current.rotation.z = -wingAngle;
      // Slight forward-back
      leftWingRef.current.rotation.y = Math.sin(t * 18 + 0.5) * 0.15;
      rightWingRef.current.rotation.y = -Math.sin(t * 18 + 0.5) * 0.15;
    }

    // Tail bob
    if (tailRef.current) {
      tailRef.current.rotation.x = Math.sin(t * 3) * 0.08 - 0.1;
    }

    // Gentle body bob
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 2.5) * 0.06;
      groupRef.current.rotation.z = Math.sin(t * 1.5) * 0.03;
    }
  });

  return (
    <group ref={groupRef} scale={1.5} position={[0, 0, 0]} rotation={[0, -0.3, 0]}>
      {/* ── BODY (elongated sphere) ── */}
      <mesh material={iridMaterial}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <mesh scale={[1, 1, 1.8]} />
      </mesh>
      {/* Body — scaled ellipsoid */}
      <mesh material={iridMaterial} scale={[0.8, 0.75, 1.4]}>
        <sphereGeometry args={[0.35, 32, 24]} />
      </mesh>

      {/* ── HEAD ── */}
      <mesh material={iridMaterial} position={[0, 0.18, 0.42]}>
        <sphereGeometry args={[0.2, 24, 24]} />
      </mesh>

      {/* ── BEAK ── */}
      <mesh position={[0, 0.16, 0.72]} rotation={[-0.15, 0, 0]}>
        <coneGeometry args={[0.035, 0.4, 8]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* ── EYE (right) ── */}
      <mesh position={[0.12, 0.24, 0.52]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#000" metalness={1} roughness={0} />
      </mesh>
      {/* Eye highlight */}
      <mesh position={[0.13, 0.26, 0.55]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} />
      </mesh>

      {/* ── EYE (left) ── */}
      <mesh position={[-0.12, 0.24, 0.52]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#000" metalness={1} roughness={0} />
      </mesh>
      <mesh position={[-0.13, 0.26, 0.55]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} />
      </mesh>

      {/* ── LEFT WING ── */}
      <mesh ref={leftWingRef} material={wingMaterial} position={[0.2, 0.1, 0.05]}>
        <planeGeometry args={[0.85, 0.35, 8, 4]} />
      </mesh>

      {/* ── RIGHT WING ── */}
      <mesh ref={rightWingRef} material={wingMaterial} position={[-0.2, 0.1, 0.05]}>
        <planeGeometry args={[0.85, 0.35, 8, 4]} />
      </mesh>

      {/* ── TAIL FEATHERS ── */}
      <group ref={tailRef} position={[0, -0.05, -0.5]}>
        <mesh material={iridMaterial} rotation={[0.2, 0, 0]}>
          <planeGeometry args={[0.12, 0.5, 1, 4]} />
        </mesh>
        <mesh material={iridMaterial} rotation={[0.2, 0, 0.2]} position={[0.06, 0, 0]}>
          <planeGeometry args={[0.1, 0.45, 1, 4]} />
        </mesh>
        <mesh material={iridMaterial} rotation={[0.2, 0, -0.2]} position={[-0.06, 0, 0]}>
          <planeGeometry args={[0.1, 0.45, 1, 4]} />
        </mesh>
      </group>

      {/* ── CHEST GLOW ── */}
      <mesh position={[0, 0.05, 0.35]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#c084fc"
          emissive="#a855f7"
          emissiveIntensity={0.8}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}

/* ============================================================
   PARTICLE DUST — floating sparkles around the bird
   ============================================================ */
function ParticleDust({ count = 120 }) {
  const ref = useRef<THREE.Points>(null);

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      sz[i] = Math.random() * 3 + 1;
    }
    return [pos, sz];
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const posArr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] += Math.sin(t * 0.5 + i) * 0.001;
      posArr[i * 3] += Math.cos(t * 0.3 + i * 0.5) * 0.0005;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y = t * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          args={[positions, 3]}
          attach="attributes-position"
        />
        <bufferAttribute
          args={[sizes, 1]}
          attach="attributes-size"
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#c4b5fd"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ============================================================
   SCENE — camera, lights, composition
   ============================================================ */
function Scene() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0.2, 2.8);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.3} color="#a78bfa" />
      <directionalLight position={[3, 4, 2]} intensity={1.2} color="#e0d4ff" />
      <directionalLight position={[-2, 1, -1]} intensity={0.5} color="#ec4899" />
      <pointLight position={[0, 0, 2]} intensity={0.8} color="#818cf8" distance={5} />
      <pointLight position={[1, -1, 0]} intensity={0.4} color="#f472b6" distance={4} />

      {/* Bird with gentle float */}
      <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.3}>
        <HummingbirdModel />
      </Float>

      {/* Floating sparkles */}
      <ParticleDust count={100} />
    </>
  );
}

/* ============================================================
   EXPORTED COMPONENT
   ============================================================ */
export default function HummingbirdScene({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={{ width: '100%', height: '100%', ...style }}>
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
