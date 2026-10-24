'use client';

/*
 * The "third i" planet: a soft, cloud-banded globe with atom-style orbit rings,
 * rendered in React Three Fiber. It drifts between sections — each section declares
 * where it should sit via data-orb="x y scale hue" (x,y in -1..1 viewport space).
 */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const noise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const vertex = /* glsl */ `
uniform float uTime; uniform float uAgitation;
varying vec3 vNormalW; varying vec3 vPosW; varying vec3 vDir;
${noise}
void main(){
  // a whisper of surface movement so the globe never looks like a static ball
  float d = snoise(position*2.0 + vec3(0.0, uTime*0.15, 0.0)) * (0.012 + uAgitation*0.03);
  vec3 p = position + normal * d;
  vDir = normalize(position);
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vPosW = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const fragment = /* glsl */ `
uniform float uTime; uniform float uHue;
varying vec3 vNormalW; varying vec3 vPosW; varying vec3 vDir;
${noise}
vec3 pal(float t){
  // violet → blue → pink → amber loop (the studio's four service colours, tuned for a white page)
  vec3 a = vec3(0.50,0.40,0.98), b = vec3(0.22,0.56,0.98), c = vec3(0.95,0.40,0.68), d = vec3(0.96,0.66,0.28);
  t = fract(t) * 4.0;
  if (t < 1.0) return mix(a,b,smoothstep(0.0,1.0,t));
  if (t < 2.0) return mix(b,c,smoothstep(1.0,2.0,t));
  if (t < 3.0) return mix(c,d,smoothstep(2.0,3.0,t));
  return mix(d,a,smoothstep(3.0,4.0,t));
}
void main(){
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(cameraPosition - vPosW);
  vec3 L = normalize(vec3(-0.6, 0.7, 0.8));
  float diff = clamp(dot(N, L), 0.0, 1.0);
  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.4);

  // surface: soft cloud bands drifting across the globe
  vec3 d = normalize(vDir);
  float n1 = snoise(d*2.4 + vec3(uTime*0.05, 0.0, uTime*0.03));
  float n2 = snoise(d*5.0 - vec3(0.0, uTime*0.08, 0.0));
  float bands = sin(d.y*5.0 + n1*1.6 + n2*0.3);
  float cloud = smoothstep(0.1, 1.1, n1*0.6 + n2*0.3);

  vec3 base = pal(uHue + 0.03*bands);
  vec3 deep = pal(uHue + 0.08) * 0.78;
  vec3 col = mix(deep, base, 0.5 + 0.5*smoothstep(-1.0, 1.0, bands));
  col = mix(col, vec3(1.0), cloud*0.45);            // pale cloud swirls

  // lighting: lit side bright, shadow side a softer tone rather than black
  vec3 shade = mix(col*0.68, col, diff);
  shade = mix(shade, min(col*1.2, vec3(1.0)), pow(diff, 3.0)*0.45);
  // luminous atmosphere rim
  shade += mix(col, vec3(1.0), 0.7) * fres * 0.95;
  // small specular glint
  vec3 H = normalize(L + V);
  shade += vec3(1.0) * pow(max(dot(N, H), 0.0), 60.0) * 0.3;
  gl_FragColor = vec4(shade, 1.0);
}`;

function readTargets() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-orb]'));
  const mobile = window.innerWidth < 820;
  const mid = window.innerHeight * 0.5;
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.top <= mid && r.bottom >= mid) {
      const raw = (mobile && el.dataset.orbM) || el.dataset.orb || '0 0 0 0';
      let [x, y, s, h] = raw.split(' ').map(Number);
      // data-orb-rel: y is a fraction of the section's own height, so the planet scrolls with it
      if (el.dataset.orbRel !== undefined) {
        const py = r.top + y * r.height;
        y = 1 - (2 * py) / window.innerHeight;
      }
      return { x, y, s, h };
    }
  }
  return { x: 0.5, y: 0, s: 0, h: 0 };
}

// three atom-style orbits: radius, tilt, colour, speed
const orbits = [
  { r: 1.55, rot: [Math.PI / 2.3, 0.2, 0] as [number, number, number], color: '#6b4ef0', speed: 0.55 },
  { r: 1.9, rot: [Math.PI / 1.8, -0.35, 0.4] as [number, number, number], color: '#1f7cf5', speed: -0.4 },
  { r: 2.2, rot: [Math.PI / 2.9, 0.9, -0.3] as [number, number, number], color: '#ec4b9b', speed: 0.3 },
];

function Planet({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const globe = useRef<THREE.Mesh>(null!);
  const rings = useRef<THREE.Group[]>([]);
  const electrons = useRef<THREE.Mesh[]>([]);
  const { viewport, pointer } = useThree();
  const state = useRef({ x: 0.45, y: 0, s: 1, h: 0, scrollV: 0, lastY: 0, tiltX: 0, tiltY: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHue: { value: 0 },
      uAgitation: { value: 0 },
    }),
    [],
  );

  const particles = useMemo(() => {
    const count = 700;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.7 + Math.random() * 1.6;
      const t = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 0.7 * (r - 1.2);
      arr.set([Math.cos(t) * r, y, Math.sin(t) * r], i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    return geo;
  }, []);
  const pts = useRef<THREE.Points>(null!);

  // start exactly where the first section wants the planet, so pages that hide it never flash it
  useEffect(() => {
    const t = readTargets();
    Object.assign(state.current, { x: t.x, y: t.y, s: t.s, h: t.h });
  }, []);

  useFrame((_, dt) => {
    const st = state.current;
    const t = readTargets();
    const k = 1 - Math.pow(0.0015, dt); // frame-rate independent ease
    st.x += (t.x - st.x) * k;
    st.y += (t.y - st.y) * k;
    st.s += (t.s - st.s) * k;
    // hue takes the shortest way round the colour loop
    let dh = t.h - (st.h % 1);
    if (dh > 0.5) dh -= 1; if (dh < -0.5) dh += 1;
    st.h += dh * k * 0.6;

    const sy = window.scrollY;
    st.scrollV += (Math.abs(sy - st.lastY) * 0.02 - st.scrollV) * 0.08;
    st.lastY = sy;

    if (!reduced) uniforms.uTime.value += dt;
    uniforms.uHue.value = st.h;
    uniforms.uAgitation.value = Math.min(st.scrollV, 1.5);

    // the whole system leans gently toward the cursor
    st.tiltX += (-pointer.y * 0.22 - st.tiltX) * 0.05;
    st.tiltY += (pointer.x * 0.3 - st.tiltY) * 0.05;

    const unit = Math.min(viewport.width, viewport.height);
    group.current.position.set((st.x * viewport.width) / 2, (st.y * viewport.height) / 2, 0);
    group.current.scale.setScalar(Math.max(st.s, 0.0001) * unit * 0.21);
    group.current.rotation.set(st.tiltX, st.tiltY, 0);
    group.current.visible = st.s > 0.02;

    if (!reduced) {
      globe.current.rotation.y += dt * 0.1;
      const time = uniforms.uTime.value;
      orbits.forEach((o, i) => {
        const ring = rings.current[i];
        const e = electrons.current[i];
        if (ring) ring.rotation.z = o.rot[2] + time * 0.05 * (i % 2 ? -1 : 1);
        if (e) {
          const a = time * o.speed + i * 2.1;
          e.position.set(Math.cos(a) * o.r, Math.sin(a) * o.r, 0);
        }
      });
      pts.current.rotation.y += dt * 0.04;
    }
  });

  return (
    <group ref={group}>
      <mesh ref={globe} rotation={[0.3, 0, -0.25]}>
        <icosahedronGeometry args={[1, 48]} />
        <shaderMaterial vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} />
      </mesh>
      {orbits.map((o, i) => (
        <group key={o.r} rotation={o.rot} ref={(el) => { if (el) rings.current[i] = el; }}>
          <mesh>
            <torusGeometry args={[o.r, 0.007, 8, 220]} />
            <meshBasicMaterial color={o.color} transparent opacity={0.55} depthWrite={false} />
          </mesh>
          <mesh ref={(el) => { if (el) electrons.current[i] = el; }} position={[o.r, 0, 0]}>
            <sphereGeometry args={[0.065, 16, 16]} />
            <meshBasicMaterial color={o.color} />
          </mesh>
        </group>
      ))}
      <points ref={pts} geometry={particles} rotation={[0.35, 0, 0.12]}>
        <pointsMaterial size={0.02} color="#4a78f0" transparent opacity={0.45} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
}

export default function Orb({ reduced }: { reduced: boolean }) {
  return (
    <Canvas
      className="orb-canvas"
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      eventSource={typeof document !== 'undefined' ? document.body : undefined}
      eventPrefix="client"
    >
      <Planet reduced={reduced} />
    </Canvas>
  );
}
