/* Portrait renderer (WebGL, no library).
   Draws the cut-out portrait as a finely subdivided plane on a fixed, full-viewport canvas so it can be
   moved between two layout slots and deformed in a shader:
   - pointer / finger trail: a liquid ripple with a little film grain where it passes, fading out
   - travel between slots (driven by scroll): the image turns fluid and bows with scroll speed, then settles
   - reveal: the portrait emerges bottom-up behind an organic noise edge
   Usage: var p = PortraitGL.create({ src, from: el, to: el }); p.state.progress / reveal / offsetX/Y; p.destroy().
   Returns null when WebGL is unavailable, so the caller keeps the plain <img>. */
(function () {
  'use strict';

  var VERT = [
    'attribute vec2 aPos;',
    'uniform vec4 uRect;',      // x, y, w, h in CSS px (viewport)
    'uniform vec2 uRes;',       // viewport size in CSS px
    'uniform float uBow;',      // sideways bow in px (scroll speed)
    'uniform float uSag;',      // vertical sag in px (travel)
    'varying vec2 vUv;',
    'void main() {',
    '  vUv = aPos;',
    '  vec2 p = uRect.xy + aPos * uRect.zw;',
    '  p.x += sin(aPos.y * 3.14159) * uBow;',
    '  p.y += sin(aPos.x * 3.14159) * uSag;',
    '  vec2 clip = p / uRes * 2.0 - 1.0;',
    '  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);',
    '}'
  ].join('\n');

  var FRAG = [
    'precision highp float;',
    'uniform sampler2D uTex;',
    'uniform float uTime;',
    'uniform float uFlow;',     // 0..1 liquidity while travelling
    'uniform float uReveal;',   // 0..1 bottom-up reveal
    'uniform float uAspect;',   // w / h of the plane
    'uniform vec3 uTrail[10];', // trail points: uv.x, uv.y, strength
    'varying vec2 vUv;',
    'float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
    'float noise(vec2 p) {',
    '  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);',
    '}',
    'float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }',
    'void main() {',
    '  vec2 uv = vUv;',
    '  float t = uTime;',
    // liquid field while travelling
    '  vec2 flow = (vec2(fbm(uv * 2.6 + vec2(t * 0.4, 0.0)), fbm(uv * 2.6 + vec2(7.1, t * 0.35))) - 0.5) * 2.0;',
    '  vec2 disp = flow * 0.075 * uFlow;',
    '  float drip = noise(vec2(uv.x * 16.0, t * 0.6));',
    '  disp.y -= uFlow * 0.1 * drip * drip;',      // streaks that run downwards while travelling
    // pointer trail: ripple rings + grain
    '  float grain = 0.0;',
    '  for (int i = 0; i < 10; i++) {',
    '    vec3 pt = uTrail[i];',
    '    vec2 d = (uv - pt.xy) * vec2(uAspect, 1.0);',
    '    float r = length(d);',
    '    float f = pt.z * smoothstep(0.2, 0.0, r);',
    '    disp -= d / vec2(uAspect, 1.0) * f * 0.28;',  // soft lens: magnifies under the pointer
    '    disp += normalize(d + 1e-5) * f * f * 0.004 * sin(r * 34.0 - t * 4.0) / vec2(uAspect, 1.0);',
    '    grain = max(grain, f * f);',
    '  }',
    '  disp = clamp(disp, -0.03, 0.03);',
    '  grain = clamp(grain, 0.0, 1.0);',
    '  vec2 suv = uv + disp;',
    '  vec4 c = texture2D(uTex, suv);',
    // a whisper of channel offset only inside the trail
    '  float split = grain * 0.0022;',
    '  c.r = texture2D(uTex, suv + vec2(split, 0.0)).r;',
    '  c.b = texture2D(uTex, suv - vec2(split, 0.0)).b;',
    '  float g = (hash(uv * 900.0 + fract(t) * 37.0) - 0.5) * 0.16 * grain;',
    '  c.rgb += g * c.a;',
    // organic bottom-up reveal
    '  float edge = (1.0 - uv.y) + (fbm(uv * 5.0 + t * 0.2) - 0.5) * 0.35;',
    '  float m = smoothstep(uReveal * 1.3 - 0.18, uReveal * 1.3, edge);',
    '  m = 1.0 - m;',
    '  m = uReveal >= 0.999 ? 1.0 : m;',
    '  gl_FragColor = c * m;',
    '}'
  ].join('\n');

  function shader(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }

  function ease(p) { return p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }
  function lerp(a, b, t) { return a + (b - a) * t; }

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
    } catch (e) { return null; }
    gl.useProgram(prog);

    // Subdivided plane so the vertex bow is smooth.
    var SEG = 40, verts = [], idx = [];
    for (var y = 0; y <= SEG; y++) for (var x = 0; x <= SEG; x++) verts.push(x / SEG, y / SEG);
    for (y = 0; y < SEG; y++) for (x = 0; x < SEG; x++) {
      var a = y * (SEG + 1) + x, b = a + 1, c = a + SEG + 1, d = c + 1;
      idx.push(a, b, c, b, d, c);
    }
    var vb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    var ib = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    var U = {};
    ['uRect', 'uRes', 'uBow', 'uSag', 'uTex', 'uTime', 'uFlow', 'uReveal', 'uAspect', 'uTrail'].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    var tex = gl.createTexture(), ready = false;
    var api = {
      canvas: canvas,
      state: { progress: 0, reveal: 0, offsetX: 0, offsetY: 0, velocity: 0 },
      onReady: null,
      onError: null,
      destroy: destroy
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

    // Pointer / finger trail (stored in plane UV space).
    var trail = [], N = 10, lastRect = null, last = null;
    for (var i = 0; i < N; i++) trail.push([0, 0, 0]);
    var head = 0;
    function feed(cx, cy) {
      if (!lastRect) return;
      var u = (cx - lastRect.x) / lastRect.w, v = (cy - lastRect.y) / lastRect.h;
      if (u < -0.1 || u > 1.1 || v < -0.1 || v > 1.1) return;
      if (last && Math.hypot(cx - last[0], cy - last[1]) < 14) return;
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

    var t0 = performance.now(), flow = 0, bow = 0;
    var trailData = new Float32Array(N * 3);
    function render() {
      if (!ready) return;
      var s = api.state, W = window.innerWidth, H = window.innerHeight;
      var A = opts.from.getBoundingClientRect(), B = opts.to.getBoundingClientRect();
      var e = ease(Math.max(0, Math.min(1, s.progress)));
      var r = { x: lerp(A.left, B.left, e) + s.offsetX, y: lerp(A.top, B.top, e) + s.offsetY, w: lerp(A.width, B.width, e), h: lerp(A.height, B.height, e) };
      lastRect = r;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (r.y > H || r.y + r.h < 0 || r.w < 2) return;
      var travel = Math.sin(Math.PI * Math.max(0, Math.min(1, s.progress)));
      var v = Math.max(-1, Math.min(1, s.velocity / 2500));
      flow += (Math.min(1, travel + Math.abs(v) * 0.4) - flow) * 0.15;
      bow += (v * r.w * 0.12 * (0.35 + travel) - bow) * 0.12;
      for (var i = 0; i < N; i++) { trail[i][2] *= 0.95; trailData[i * 3] = trail[i][0]; trailData[i * 3 + 1] = trail[i][1]; trailData[i * 3 + 2] = trail[i][2]; }
      gl.uniform4f(U.uRect, r.x, r.y, r.w, r.h);
      gl.uniform2f(U.uRes, W, H);
      gl.uniform1f(U.uBow, bow);
      gl.uniform1f(U.uSag, -bow * 0.35);
      gl.uniform1f(U.uTime, (performance.now() - t0) / 1000);
      gl.uniform1f(U.uFlow, flow);
      gl.uniform1f(U.uReveal, s.reveal);
      gl.uniform1f(U.uAspect, r.w / r.h);
      gl.uniform3fv(U.uTrail, trailData);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(U.uTex, 0);
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0);
    }
    api.render = render;

    function destroy() {
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('resize', resize);
      var lose = gl.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }
    return api;
  }

  window.PortraitGL = { create: create };
})();
