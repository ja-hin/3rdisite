/*
 * Real-time Navier–Stokes ink simulation (Stam "stable fluids" on the GPU).
 * Velocity + dye fields, vorticity confinement, Jacobi pressure solve.
 * No dependencies — plain WebGL1/WebGL2.
 */

export type FluidHandle = {
  splat: (x: number, y: number, dx: number, dy: number, color: [number, number, number]) => void;
  burst: (count?: number) => void;
  setIntensity: (v: number) => void;
  destroy: () => void;
};

type Options = {
  simRes?: number;
  dyeRes?: number;
  palette?: [number, number, number][];
  reducedMotion?: boolean;
};

const baseVS = `
precision highp float;
attribute vec2 aPosition;
varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
uniform vec2 texelSize;
void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const clearFS = `
precision mediump float; varying vec2 vUv;
uniform sampler2D uTexture; uniform float value;
void main () { gl_FragColor = value * texture2D(uTexture, vUv); }`;

const splatFS = `
precision highp float; varying vec2 vUv;
uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius;
void main () {
  vec2 p = vUv - point.xy; p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  vec3 base = texture2D(uTarget, vUv).xyz;
  gl_FragColor = vec4(base + splat, 1.0);
}`;

const advectionFS = `
precision highp float; varying vec2 vUv;
uniform sampler2D uVelocity; uniform sampler2D uSource;
uniform vec2 texelSize; uniform vec2 dyeTexelSize; uniform float dt; uniform float dissipation;
vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
  vec2 st = uv / tsize - 0.5; vec2 iuv = floor(st); vec2 fuv = fract(st);
  vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
  vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
  vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
  vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
  return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
}
void main () {
  vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
  vec4 result = bilerp(uSource, coord, dyeTexelSize);
  gl_FragColor = result / (1.0 + dissipation * dt);
}`;

const divergenceFS = `
precision mediump float;
varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uVelocity, vL).x; float R = texture2D(uVelocity, vR).x;
  float T = texture2D(uVelocity, vT).y; float B = texture2D(uVelocity, vB).y;
  vec2 C = texture2D(uVelocity, vUv).xy;
  if (vL.x < 0.0) { L = -C.x; } if (vR.x > 1.0) { R = -C.x; }
  if (vT.y > 1.0) { T = -C.y; } if (vB.y < 0.0) { B = -C.y; }
  gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`;

const curlFS = `
precision mediump float;
varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uVelocity, vL).y; float R = texture2D(uVelocity, vR).y;
  float T = texture2D(uVelocity, vT).x; float B = texture2D(uVelocity, vB).x;
  gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`;

const vorticityFS = `
precision highp float;
varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt;
void main () {
  float L = texture2D(uCurl, vL).x; float R = texture2D(uCurl, vR).x;
  float T = texture2D(uCurl, vT).x; float B = texture2D(uCurl, vB).x;
  float C = texture2D(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C; force.y *= -1.0;
  vec2 vel = texture2D(uVelocity, vUv).xy + force * dt;
  vel = min(max(vel, -1000.0), 1000.0);
  gl_FragColor = vec4(vel, 0.0, 1.0);
}`;

const pressureFS = `
precision mediump float;
varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
uniform sampler2D uPressure; uniform sampler2D uDivergence;
void main () {
  float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x;
  float div = texture2D(uDivergence, vUv).x;
  gl_FragColor = vec4((L + R + B + T - div) * 0.25, 0.0, 0.0, 1.0);
}`;

const gradientFS = `
precision mediump float;
varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
uniform sampler2D uPressure; uniform sampler2D uVelocity;
void main () {
  float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x;
  vec2 vel = texture2D(uVelocity, vUv).xy - vec2(R - L, T - B);
  gl_FragColor = vec4(vel, 0.0, 1.0);
}`;

// Display: shaded like a glossy liquid surface — dye density acts as a height map.
const displayFS = `
precision highp float;
varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
uniform sampler2D uTexture; uniform vec2 texelSize; uniform float intensity;
void main () {
  vec3 c = texture2D(uTexture, vUv).rgb;
  float hl = length(texture2D(uTexture, vL).rgb);
  float hr = length(texture2D(uTexture, vR).rgb);
  float ht = length(texture2D(uTexture, vT).rgb);
  float hb = length(texture2D(uTexture, vB).rgb);
  vec3 n = normalize(vec3(hl - hr, hb - ht, length(texelSize) * 6.0));
  vec3 light = normalize(vec3(-0.35, 0.55, 1.0));
  float diffuse = clamp(dot(n, light) + 0.55, 0.55, 1.15);
  float spec = pow(clamp(dot(reflect(-light, n), vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 28.0);
  c = c * diffuse * intensity;
  c += spec * 0.35 * smoothstep(0.02, 0.25, length(c));
  c = c / (1.0 + c * 0.35);
  float a = clamp(max(c.r, max(c.g, c.b)), 0.0, 1.0);
  gl_FragColor = vec4(c, a);
}`;

type FBO = {
  texture: WebGLTexture; fbo: WebGLFramebuffer; width: number; height: number;
  texelX: number; texelY: number; attach: (id: number) => number;
};
type DoubleFBO = { width: number; height: number; texelX: number; texelY: number; read: FBO; write: FBO; swap: () => void };

export function createFluid(canvas: HTMLCanvasElement, opts: Options = {}): FluidHandle | null {
  const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false, premultipliedAlpha: true };
  let gl = canvas.getContext('webgl2', params) as WebGL2RenderingContext | WebGLRenderingContext | null;
  const isWebGL2 = !!gl;
  if (!gl) gl = (canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params)) as WebGLRenderingContext | null;
  if (!gl) return null;

  let halfFloatType: number;
  let supportLinear: boolean;
  let internalFormat: number;
  if (isWebGL2) {
    const g2 = gl as WebGL2RenderingContext;
    if (!g2.getExtension('EXT_color_buffer_float')) return null;
    supportLinear = !!g2.getExtension('OES_texture_float_linear') || true; // half-float linear is core in WebGL2
    halfFloatType = g2.HALF_FLOAT;
    internalFormat = g2.RGBA16F;
  } else {
    const ext = gl.getExtension('OES_texture_half_float');
    if (!ext) return null;
    supportLinear = !!gl.getExtension('OES_texture_half_float_linear');
    halfFloatType = ext.HALF_FLOAT_OES;
    internalFormat = gl.RGBA;
  }
  const g = gl;

  const palette = opts.palette ?? [[0.42, 0.31, 0.94], [0.12, 0.49, 0.96], [0.35, 0.72, 1.0], [0.55, 0.45, 0.98]];
  const config = {
    simRes: opts.simRes ?? 128,
    dyeRes: opts.dyeRes ?? 720,
    densityDissipation: 1.15,
    velocityDissipation: 0.35,
    pressure: 0.8,
    pressureIterations: 18,
    curl: 22,
    splatRadius: 0.19,
    splatForce: 5200,
    intensity: 0.56,
  };

  // --- shader programs ---
  function compile(type: number, src: string) {
    const s = g.createShader(type)!;
    g.shaderSource(s, src);
    g.compileShader(s);
    if (!g.getShaderParameter(s, g.COMPILE_STATUS)) console.warn(g.getShaderInfoLog(s));
    return s;
  }
  const vs = compile(g.VERTEX_SHADER, baseVS);
  function program(fsSrc: string) {
    const p = g.createProgram()!;
    g.attachShader(p, vs);
    g.attachShader(p, compile(g.FRAGMENT_SHADER, fsSrc));
    g.bindAttribLocation(p, 0, 'aPosition');
    g.linkProgram(p);
    const uniforms: Record<string, WebGLUniformLocation> = {};
    const n = g.getProgramParameter(p, g.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) {
      const name = g.getActiveUniform(p, i)!.name;
      uniforms[name] = g.getUniformLocation(p, name)!;
    }
    return { p, u: uniforms, bind() { g.useProgram(p); } };
  }
  const clearP = program(clearFS);
  const splatP = program(splatFS);
  const advectionP = program(advectionFS);
  const divergenceP = program(divergenceFS);
  const curlP = program(curlFS);
  const vorticityP = program(vorticityFS);
  const pressureP = program(pressureFS);
  const gradientP = program(gradientFS);
  const displayP = program(displayFS);

  // --- fullscreen quad ---
  g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer());
  g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), g.STATIC_DRAW);
  g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, g.createBuffer());
  g.bufferData(g.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), g.STATIC_DRAW);
  g.vertexAttribPointer(0, 2, g.FLOAT, false, 0, 0);
  g.enableVertexAttribArray(0);

  function blit(target: FBO | null) {
    if (target) {
      g.viewport(0, 0, target.width, target.height);
      g.bindFramebuffer(g.FRAMEBUFFER, target.fbo);
    } else {
      g.viewport(0, 0, g.drawingBufferWidth, g.drawingBufferHeight);
      g.bindFramebuffer(g.FRAMEBUFFER, null);
    }
    g.drawElements(g.TRIANGLES, 6, g.UNSIGNED_SHORT, 0);
  }

  function createFBO(w: number, h: number, filter: number): FBO {
    g.activeTexture(g.TEXTURE0);
    const texture = g.createTexture()!;
    g.bindTexture(g.TEXTURE_2D, texture);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, filter);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, filter);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
    g.texImage2D(g.TEXTURE_2D, 0, internalFormat, w, h, 0, g.RGBA, halfFloatType, null);
    const fbo = g.createFramebuffer()!;
    g.bindFramebuffer(g.FRAMEBUFFER, fbo);
    g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, texture, 0);
    g.viewport(0, 0, w, h);
    g.clear(g.COLOR_BUFFER_BIT);
    return {
      texture, fbo, width: w, height: h, texelX: 1 / w, texelY: 1 / h,
      attach(id: number) { g.activeTexture(g.TEXTURE0 + id); g.bindTexture(g.TEXTURE_2D, texture); return id; },
    };
  }
  function createDouble(w: number, h: number, filter: number): DoubleFBO {
    let a = createFBO(w, h, filter);
    let b = createFBO(w, h, filter);
    return {
      width: w, height: h, texelX: 1 / w, texelY: 1 / h,
      get read() { return a; }, get write() { return b; },
      swap() { const t = a; a = b; b = t; },
    } as DoubleFBO;
  }

  function getRes(res: number) {
    const w = g.drawingBufferWidth, h = g.drawingBufferHeight;
    const ar = w > h ? w / h : h / w;
    const min = Math.round(res), max = Math.round(res * ar);
    return w > h ? { w: max, h: min } : { w: min, h: max };
  }

  const linear = supportLinear ? g.LINEAR : g.NEAREST;
  let dye!: DoubleFBO, velocity!: DoubleFBO, divergence!: FBO, curl!: FBO, pressure!: DoubleFBO;
  let ready = false;

  function initFramebuffers() {
    const s = getRes(config.simRes), d = getRes(config.dyeRes);
    dye = createDouble(d.w, d.h, linear);
    velocity = createDouble(s.w, s.h, linear);
    divergence = createFBO(s.w, s.h, g.NEAREST);
    curl = createFBO(s.w, s.h, g.NEAREST);
    pressure = createDouble(s.w, s.h, g.NEAREST);
    // verify render target support
    if (g.checkFramebufferStatus(g.FRAMEBUFFER) !== g.FRAMEBUFFER_COMPLETE) throw new Error('fbo');
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.floor(canvas.clientWidth * dpr), h = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
      initFramebuffers();
      ready = true;
      return true;
    }
    return false;
  }

  try { resize(); if (!ready) { initFramebuffers(); ready = true; } } catch { return null; }

  function splat(x: number, y: number, dx: number, dy: number, color: [number, number, number]) {
    const ar = canvas.width / canvas.height;
    splatP.bind();
    g.uniform1i(splatP.u.uTarget, velocity.read.attach(0));
    g.uniform1f(splatP.u.aspectRatio, ar);
    g.uniform2f(splatP.u.point, x, y);
    g.uniform3f(splatP.u.color, dx, dy, 0);
    g.uniform1f(splatP.u.radius, (config.splatRadius / 100) * (ar > 1 ? ar : 1));
    blit(velocity.write); velocity.swap();
    g.uniform1i(splatP.u.uTarget, dye.read.attach(0));
    g.uniform3f(splatP.u.color, color[0], color[1], color[2]);
    blit(dye.write); dye.swap();
  }

  let colorIndex = 0;
  function nextColor(scale = 0.16): [number, number, number] {
    colorIndex = (colorIndex + 1) % palette.length;
    const c = palette[colorIndex];
    return [c[0] * scale, c[1] * scale, c[2] * scale];
  }

  function burst(count = 6) {
    for (let i = 0; i < count; i++) {
      const x = Math.random(), y = Math.random();
      const a = Math.random() * Math.PI * 2;
      const f = 700 + Math.random() * 900;
      splat(x, y, Math.cos(a) * f, Math.sin(a) * f, nextColor(0.45));
    }
  }

  function step(dt: number) {
    g.disable(g.BLEND);
    curlP.bind();
    g.uniform2f(curlP.u.texelSize, velocity.texelX, velocity.texelY);
    g.uniform1i(curlP.u.uVelocity, velocity.read.attach(0));
    blit(curl);

    vorticityP.bind();
    g.uniform2f(vorticityP.u.texelSize, velocity.texelX, velocity.texelY);
    g.uniform1i(vorticityP.u.uVelocity, velocity.read.attach(0));
    g.uniform1i(vorticityP.u.uCurl, curl.attach(1));
    g.uniform1f(vorticityP.u.curl, config.curl);
    g.uniform1f(vorticityP.u.dt, dt);
    blit(velocity.write); velocity.swap();

    divergenceP.bind();
    g.uniform2f(divergenceP.u.texelSize, velocity.texelX, velocity.texelY);
    g.uniform1i(divergenceP.u.uVelocity, velocity.read.attach(0));
    blit(divergence);

    clearP.bind();
    g.uniform1i(clearP.u.uTexture, pressure.read.attach(0));
    g.uniform1f(clearP.u.value, config.pressure);
    blit(pressure.write); pressure.swap();

    pressureP.bind();
    g.uniform2f(pressureP.u.texelSize, velocity.texelX, velocity.texelY);
    g.uniform1i(pressureP.u.uDivergence, divergence.attach(0));
    for (let i = 0; i < config.pressureIterations; i++) {
      g.uniform1i(pressureP.u.uPressure, pressure.read.attach(1));
      blit(pressure.write); pressure.swap();
    }

    gradientP.bind();
    g.uniform2f(gradientP.u.texelSize, velocity.texelX, velocity.texelY);
    g.uniform1i(gradientP.u.uPressure, pressure.read.attach(0));
    g.uniform1i(gradientP.u.uVelocity, velocity.read.attach(1));
    blit(velocity.write); velocity.swap();

    advectionP.bind();
    g.uniform2f(advectionP.u.texelSize, velocity.texelX, velocity.texelY);
    g.uniform2f(advectionP.u.dyeTexelSize, velocity.texelX, velocity.texelY);
    const vid = velocity.read.attach(0);
    g.uniform1i(advectionP.u.uVelocity, vid);
    g.uniform1i(advectionP.u.uSource, vid);
    g.uniform1f(advectionP.u.dt, dt);
    g.uniform1f(advectionP.u.dissipation, config.velocityDissipation);
    blit(velocity.write); velocity.swap();

    g.uniform2f(advectionP.u.dyeTexelSize, dye.texelX, dye.texelY);
    g.uniform1i(advectionP.u.uVelocity, velocity.read.attach(0));
    g.uniform1i(advectionP.u.uSource, dye.read.attach(1));
    g.uniform1f(advectionP.u.dissipation, config.densityDissipation);
    blit(dye.write); dye.swap();
  }

  function render() {
    g.disable(g.BLEND);
    displayP.bind();
    g.uniform2f(displayP.u.texelSize, 1 / g.drawingBufferWidth, 1 / g.drawingBufferHeight);
    g.uniform1i(displayP.u.uTexture, dye.read.attach(0));
    g.uniform1f(displayP.u.intensity, config.intensity);
    blit(null);
  }

  // --- pointer ---
  const pointer = { x: 0, y: 0, px: 0, py: 0, moved: false, init: false };
  function onMove(e: PointerEvent) {
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = 1 - (e.clientY - r.top) / r.height;
    if (!pointer.init) { pointer.px = x; pointer.py = y; pointer.init = true; }
    pointer.x = x; pointer.y = y; pointer.moved = true;
  }
  window.addEventListener('pointermove', onMove, { passive: true });

  let raf = 0;
  let last = performance.now();
  let idle = 0;
  let visible = true;
  const onVis = () => { visible = document.visibilityState === 'visible'; last = performance.now(); };
  document.addEventListener('visibilitychange', onVis);

  function frame() {
    raf = requestAnimationFrame(frame);
    if (!visible) return;
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.016666);
    last = now;
    if (resize()) burst(3);

    if (pointer.moved) {
      pointer.moved = false;
      let dx = pointer.x - pointer.px, dy = pointer.y - pointer.py;
      const ar = canvas.width / canvas.height;
      if (ar < 1) dx *= ar; else dy /= ar;
      if (Math.abs(dx) + Math.abs(dy) > 0.0001) {
        splat(pointer.x, pointer.y, dx * config.splatForce, dy * config.splatForce, nextColor(0.11));
      }
      pointer.px = pointer.x; pointer.py = pointer.y;
      idle = 0;
    } else {
      idle += dt;
      // ambient drift so the ink is never fully still
      if (idle > 3.5) {
        idle = 0;
        const a = Math.random() * Math.PI * 2;
        splat(0.15 + Math.random() * 0.7, 0.15 + Math.random() * 0.7, Math.cos(a) * 360, Math.sin(a) * 360, nextColor(0.24));
      }
    }
    step(dt);
    render();
  }

  burst(4);
  if (opts.reducedMotion) {
    // a single settled frame, no animation loop
    for (let i = 0; i < 40; i++) step(0.016);
    render();
  } else {
    raf = requestAnimationFrame(frame);
  }

  return {
    splat,
    burst,
    setIntensity(v: number) { config.intensity = v; },
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
      g.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
