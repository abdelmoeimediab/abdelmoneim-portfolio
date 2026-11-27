/* Portrait renderer (WebGL, no library).
   Draws the cut-out portrait on a fixed, full-viewport canvas over its layout slots. The image is never
   warped, zoomed or displaced: every effect keeps the face exactly as photographed.
   - pointer / finger: where it passes, the portrait is re-drawn as a print halftone (ink dots on a 45° screen),
     then the photo returns as the trail fades
   - travel between slots (scroll): the portrait glides rigidly from the hero into the About frame and turns into
     halftone dots on the way, resolving back to the photo on arrival
   - load: the portrait appears bottom-up behind an organic edge, starting as halftone and resolving to the photo
   - depth: a slight perspective tilt that follows the pointer (a few degrees, no scaling)
   Usage: var p = PortraitGL.create({ src, from: el, to: el });
          p.state.progress / reveal / halftone / offsetX / offsetY / tiltX / tiltY; p.render(); p.destroy().
   Returns null when WebGL is unavailable, so the caller keeps the plain <img>. */
(function () {
  'use strict';

  var VERT = [
    'attribute vec2 aPos;',
    'uniform vec4 uRect;',     // x, y, w, h in CSS px (viewport)
    'uniform vec2 uRes;',      // viewport size in CSS px
    'uniform vec2 uTilt;',     // rotation around x / y axes in radians (small)
    'varying vec2 vUv;',
    'void main() {',
    '  vUv = aPos;',
    '  vec2 c = aPos - 0.5;',
    '  vec2 size = uRect.zw;',
    '  float z = c.x * size.x * sin(uTilt.y) + c.y * size.y * sin(uTilt.x);',
    '  float persp = 1600.0 / (1600.0 - z);',
    '  vec2 p = uRect.xy + size * 0.5 + c * size * persp;',
    '  vec2 clip = p / uRes * 2.0 - 1.0;',
    '  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);',
    '}'
  ].join('\n');

  var FRAG = [
    'precision highp float;',
    'uniform sampler2D uTex;',
    'uniform float uTime;',
    'uniform float uReveal;',   // 0..1 bottom-up appearance
    'uniform float uHalf;',     // 0..1 halftone over the whole portrait (load, travel)
    'uniform float uAspect;',   // w / h of the plane
    'uniform vec2 uSize;',      // plane size in device px
    'uniform float uCell;',     // halftone cell in device px
    'uniform vec3 uInk;',
    'uniform vec3 uTrail[12];', // pointer trail: uv.x, uv.y, strength
    'varying vec2 vUv;',
    'float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
    'float noise(vec2 p) {',
    '  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);',
    '}',
    'float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }',
    'const float A = 0.7853982;',  // 45 degree screen angle
    'void main() {',
    '  vec2 uv = vUv;',
    '  vec4 photo = texture2D(uTex, uv);',
    // halftone: rotate pixel space, find the cell, size the dot by the darkness sampled at the cell centre
    '  vec2 px = uv * uSize;',
    '  mat2 rot = mat2(cos(A), -sin(A), sin(A), cos(A));',
    '  vec2 q = rot * px;',
    '  vec2 cellC = (floor(q / uCell) + 0.5) * uCell;',
    '  vec2 cuv = (transpose2(rot) * cellC) / uSize;',
    '  vec4 s = texture2D(uTex, clamp(cuv, 0.0, 1.0));',
    '  vec3 rgb = s.a > 0.001 ? s.rgb / s.a : vec3(1.0);',
    '  float lum = dot(rgb, vec3(0.299, 0.587, 0.114));',
    '  float rad = sqrt(1.0 - lum) * 0.72 * uCell * s.a;',
    '  float d = length(q - cellC);',
    '  float dotA = 1.0 - smoothstep(rad - 1.0, rad + 0.6, d);',
    '  vec4 tone = vec4(uInk * dotA, dotA);',
    // where the halftone shows: pointer trail (soft discs) and the global amount
    '  float trail = 0.0;',
    '  for (int i = 0; i < 12; i++) {',
    '    vec3 pt = uTrail[i];',
    '    float r = length((uv - pt.xy) * vec2(uAspect, 1.0));',
    '    trail = max(trail, pt.z * smoothstep(0.17, 0.04, r));',
    '  }',
    '  float h = clamp(max(trail, uHalf), 0.0, 1.0);',
    // the edge of the halftone area is broken up so it reads as ink, not as a circle
    '  float grainEdge = smoothstep(0.0, 1.0, h * 1.25 - (fbm(uv * 18.0) - 0.5) * 0.5);',
    '  vec4 c = mix(photo, tone, clamp(grainEdge, 0.0, 1.0));',
    // organic bottom-up reveal
    '  float edge = (1.0 - uv.y) + (fbm(uv * 5.0 + uTime * 0.2) - 0.5) * 0.35;',
    '  float m = 1.0 - smoothstep(uReveal * 1.3 - 0.18, uReveal * 1.3, edge);',
    '  m = uReveal >= 0.999 ? 1.0 : m;',
    '  gl_FragColor = c * m;',
    '}'
  ].join('\n').replace('transpose2(rot)', 'mat2(rot[0][0], rot[1][0], rot[0][1], rot[1][1])');

  function shader(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }

  function ease(p) { return p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(e0, e1, x) { var t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); }

  function create(opts) {
    var canvas = document.createElement('canvas');
    canvas.className = 'portrait-gl';
    canvas.setAttribute('aria-hidden', 'true');
    var gl = canvas.getContext('webgl', { premultipliedAlpha: true, antialias: true, alpha: true });
    if (!gl) return null;

    var prog;
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, shader(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, shader(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    } catch (e) { if (window.console) console.warn('PortraitGL:', e.message); return null; }
    gl.useProgram(prog);

    // Subdivided plane so the perspective tilt stays smooth.
    var SEG = 16, verts = [], idx = [];
    for (var y = 0; y <= SEG; y++) for (var x = 0; x <= SEG; x++) verts.push(x / SEG, y / SEG);
    for (y = 0; y < SEG; y++) for (x = 0; x < SEG; x++) {
      var a = y * (SEG + 1) + x, b = a + 1, c = a + SEG + 1, d = c + 1;
      idx.push(a, b, c, b, d, c);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    var U = {};
    ['uRect', 'uRes', 'uTilt', 'uTex', 'uTime', 'uReveal', 'uHalf', 'uAspect', 'uSize', 'uCell', 'uInk', 'uTrail']
      .forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    var ink = (opts.ink || [28, 35, 32]).map(function (v) { return v / 255; });
    var tex = gl.createTexture(), ready = false;
    var api = {
      canvas: canvas,
      state: { progress: 0, reveal: 0, halftone: 1, offsetX: 0, offsetY: 0, tiltX: 0, tiltY: 0 },
      onReady: null,
      onError: null
    };
    var img = new Image();
    img.decoding = 'async';
    img.onload = function () {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      ready = true;
      if (api.onReady) api.onReady();
    };
    img.onerror = function () { if (api.onError) api.onError(); };
    img.src = opts.src;

    // Pointer / finger trail in plane UV space.
    var N = 12, trail = [], head = 0, lastRect = null, last = null;
    for (var i = 0; i < N; i++) trail.push([0, 0, 0]);
    function feed(cx, cy) {
      if (!lastRect) return;
      var u = (cx - lastRect.x) / lastRect.w, v = (cy - lastRect.y) / lastRect.h;
      if (u < -0.05 || u > 1.05 || v < -0.05 || v > 1.05) return;
      if (last && Math.hypot(cx - last[0], cy - last[1]) < 12) return;
      last = [cx, cy];
      trail[head] = [u, v, 1];
      head = (head + 1) % N;
    }
    function onPointer(e) { feed(e.clientX, e.clientY); }
    function onTouch(e) { var t = e.touches && e.touches[0]; if (t) feed(t.clientX, t.clientY); }
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      var w = window.innerWidth, h = window.innerHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    var t0 = performance.now();
    var trailData = new Float32Array(N * 3);
    function render() {
      if (!ready) return;
      var s = api.state, W = window.innerWidth, H = window.innerHeight;
      var A = opts.from.getBoundingClientRect(), B = opts.to.getBoundingClientRect();
      var pr = Math.max(0, Math.min(1, s.progress)), e = ease(pr);
      var r = { x: lerp(A.left, B.left, e) + s.offsetX, y: lerp(A.top, B.top, e) + s.offsetY, w: lerp(A.width, B.width, e), h: lerp(A.height, B.height, e) };
      lastRect = r;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (r.y > H || r.y + r.h < 0 || r.w < 2) return;
      var travel = Math.sin(Math.PI * pr);
      var half = Math.max(s.halftone, smooth(0.08, 0.55, travel));
      for (var i = 0; i < N; i++) {
        trail[i][2] *= 0.965;
        trailData[i * 3] = trail[i][0]; trailData[i * 3 + 1] = trail[i][1]; trailData[i * 3 + 2] = trail[i][2];
      }
      gl.uniform4f(U.uRect, r.x, r.y, r.w, r.h);
      gl.uniform2f(U.uRes, W, H);
      gl.uniform2f(U.uTilt, s.tiltX, s.tiltY);
      gl.uniform1f(U.uTime, (performance.now() - t0) / 1000);
      gl.uniform1f(U.uReveal, s.reveal);
      gl.uniform1f(U.uHalf, half);
      gl.uniform1f(U.uAspect, r.w / r.h);
      gl.uniform2f(U.uSize, r.w * dpr, r.h * dpr);
      gl.uniform1f(U.uCell, Math.max(5, r.w / 95) * dpr);
      gl.uniform3f(U.uInk, ink[0], ink[1], ink[2]);
      gl.uniform3fv(U.uTrail, trailData);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(U.uTex, 0);
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0);
    }
    api.render = render;

    api.destroy = function () {
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('resize', resize);
      var lose = gl.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
    return api;
  }

  window.PortraitGL = { create: create };
})();
