import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/*
  থ্রিডি স্টক (লিভার) — three.js
  view = 'ring'  : স্টকের মাথার দিক থেকে দেখা — লাইট কন্ট্রোল রিং (OFF / পজিশন / হেডলাইট)
  view = 'lever' : সামনে থেকে দেখা — স্টক উপরে তুললে ডান (R), নিচে নামালে বাঁ (L)
  view = 'push'  : উপর থেকে দেখা — সামনে ঠেললে হাই বিম, টেনে আনলে লো বিম
  তিনটাই একই মডেল — তাই একটা বদলালে বাকিগুলোতেও মিল থাকে।
*/

const D2R = Math.PI / 180;
const RING_ANG = { off: -46, park: 0, low: 46 };
const RING_IDS = ['off', 'park', 'low'];
const LEV_ANG = 22;
const PUSH_ANG = 16;
const FOV = 22;
const HALF_H = 3.2; // দৃশ্যের অর্ধেক উচ্চতা (ওয়ার্ল্ড ইউনিট)
const DIST = HALF_H / Math.tan((FOV / 2) * D2R);
const KNOB_X0 = 3.32;
const KNOB_LEN = 1.1;
const CAP_X = KNOB_X0 + KNOB_LEN + 0.004;

const reduced = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SUN_D = 'M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1';
const BEAM_D = 'M13 5h2a7 7 0 010 14h-2zM9 7L3 9M9 11l-6 2M9 15l-6 2';

const FONT = '"Hind Siliguri","Noto Sans Bengali","Nirmala UI",system-ui,sans-serif';

/* ---------- টেক্সচার: রিংয়ের চারপাশের আইকন প্লেট ---------- */
function drawPlate(canvas, active) {
  const S = canvas.width;
  const C = S / 2;
  const U = C / 2.25; // px / ওয়ার্ল্ড ইউনিট
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, S, S);
  const g = ctx.createRadialGradient(C, C, U * 0.4, C, C, C);
  g.addColorStop(0, '#273449');
  g.addColorStop(1, '#0f172a');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(C, C, C - 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 7;
  ctx.strokeStyle = '#475569';
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,255,255,.07)';
  ctx.beginPath();
  ctx.arc(C, C, C - 22, 0, Math.PI * 2);
  ctx.stroke();

  // দাগ (টিক) — আইকনগুলোর মাঝে
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  for (let a = -64; a <= 64; a += 8) {
    const s = Math.sin(a * D2R);
    const c = Math.cos(a * D2R);
    ctx.beginPath();
    ctx.moveTo(C + s * U * 1.04, C - c * U * 1.04);
    ctx.lineTo(C + s * U * 1.12, C - c * U * 1.12);
    ctx.stroke();
  }

  [['off', -46], ['park', 0], ['low', 46]].forEach(([id, a]) => {
    const R = id === 'park' ? 1.6 : 1.5;
    const x = C + Math.sin(a * D2R) * U * R;
    const y = C - Math.cos(a * D2R) * U * R;
    const on = active === id;
    ctx.save();
    if (on) {
      ctx.shadowColor = 'rgba(251,191,36,.9)';
      ctx.shadowBlur = 30;
    }
    ctx.beginPath();
    ctx.arc(x, y, U * 0.46, 0, Math.PI * 2);
    ctx.fillStyle = on ? '#fde68a' : '#e2e8f0';
    ctx.fill();
    ctx.restore();
    ctx.lineWidth = 5;
    ctx.strokeStyle = on ? '#f59e0b' : '#94a3b8';
    ctx.beginPath();
    ctx.arc(x, y, U * 0.46, 0, Math.PI * 2);
    ctx.stroke();

    if (id === 'off') {
      ctx.fillStyle = '#0f172a';
      ctx.font = `800 ${Math.round(U * 0.3)}px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('OFF', x, y + 2);
    } else {
      const k = (U * 0.56) / 24;
      ctx.save();
      ctx.translate(x - 12 * k, y - 12 * k);
      ctx.scale(k, k);
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#0f172a';
      if (id === 'park') {
        ctx.beginPath();
        ctx.arc(12, 12, 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.stroke(new Path2D(SUN_D));
      } else {
        ctx.stroke(new Path2D(BEAM_D));
      }
      ctx.restore();
    }
  });
}

/* ---------- টেক্সচার: নবের মাথা ---------- */
function drawCap(canvas) {
  const S = canvas.width;
  const C = S / 2;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(C, C * 0.9, 10, C, C, C);
  g.addColorStop(0, '#2a3548');
  g.addColorStop(1, '#131a27');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(C, C, C * 0.9, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(C, C, C * 0.46, 0, Math.PI * 2);
  ctx.stroke();
  // হলুদ ইন্ডিকেটর দাগ
  ctx.strokeStyle = '#facc15';
  ctx.lineCap = 'round';
  ctx.lineWidth = S * 0.06;
  ctx.beginPath();
  ctx.moveTo(C, S * 0.1);
  ctx.lineTo(C, S * 0.3);
  ctx.stroke();
  ctx.fillStyle = '#cbd5e1';
  ctx.font = `700 ${Math.round(S * 0.125)}px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ঘোরান', C, C + S * 0.02);
}

function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,.45)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  return t;
}

/* ---------- মডেল ---------- */
function buildRig() {
  const std = (color, rough, metal = 0.1) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
  const M = {
    plastic: std(0x232d3f, 0.4, 0.15),
    dark: std(0x131925, 0.55, 0.1),
    column: std(0x2c3749, 0.5, 0.2),
    chrome: std(0xe2e8f0, 0.2, 1),
    rubber: std(0x0e131d, 0.62, 0.05),
  };

  const rig = new THREE.Group();

  /* স্টিয়ারিং কলাম */
  const columnG = new THREE.Group();
  const col = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.55, 4.2, 72).rotateX(Math.PI / 2), M.column);
  col.position.set(-1.0, 0, 0);
  columnG.add(col);
  [-2.1, 2.1].forEach((z) => {
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.07, 16, 72), M.chrome);
    rim.position.set(-1.0, 0, z);
    columnG.add(rim);
  });
  const hub = new THREE.Mesh(new THREE.CircleGeometry(1.15, 56), M.dark);
  hub.position.set(-1.0, 0, 2.115);
  columnG.add(hub);
  const hubRing = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.035, 12, 64), M.chrome);
  hubRing.position.set(-1.0, 0, 2.12);
  columnG.add(hubRing);
  rig.add(columnG);

  /* পিভটের বস */
  const boss = new THREE.Mesh(new THREE.SphereGeometry(0.68, 40, 28), M.plastic);
  rig.add(boss);

  /* স্টক (লিভার) — পিভট = (0,0,0), লম্বা +X বরাবর */
  const stalk = new THREE.Group();
  const prof = [[0.02, 0.1], [0.36, 0.1], [0.44, 0.35], [0.42, 0.9], [0.38, 1.8], [0.36, 2.6], [0.4, 3.0], [0.44, 3.2], [0.44, KNOB_X0], [0.02, KNOB_X0]];
  const lathe = new THREE.Mesh(new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r, y)), 56).rotateZ(-Math.PI / 2), M.plastic);
  stalk.add(lathe);
  [1.95, 2.1, 2.25].forEach((x) => {
    const g = new THREE.Mesh(new THREE.TorusGeometry(0.385, 0.018, 10, 48).rotateY(Math.PI / 2), M.dark);
    g.position.x = x;
    stalk.add(g);
  });

  /* ঘোরানো রিং (গিয়ার-খাঁজ) */
  const knob = new THREE.Group();
  const sh = new THREE.Shape();
  const N = 40;
  const steps = N * 6;
  for (let i = 0; i <= steps; i += 1) {
    const t = (i / steps) * Math.PI * 2;
    const r = 0.66 + 0.035 * Math.tanh(4 * Math.sin(N * t));
    if (i === 0) sh.moveTo(Math.cos(t) * r, Math.sin(t) * r);
    else sh.lineTo(Math.cos(t) * r, Math.sin(t) * r);
  }
  const gear = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: KNOB_LEN, bevelEnabled: false, steps: 1 }).rotateY(Math.PI / 2).translate(KNOB_X0, 0, 0), M.rubber);
  knob.add(gear);
  const rimBack = new THREE.Mesh(new THREE.TorusGeometry(0.69, 0.04, 12, 64).rotateY(Math.PI / 2), M.chrome);
  rimBack.position.x = KNOB_X0;
  knob.add(rimBack);
  const rimFront = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.035, 12, 64).rotateY(Math.PI / 2), M.chrome);
  rimFront.position.x = CAP_X;
  knob.add(rimFront);

  const capCanvas = document.createElement('canvas');
  capCanvas.width = capCanvas.height = 256;
  drawCap(capCanvas);
  const capTex = new THREE.CanvasTexture(capCanvas);
  capTex.colorSpace = THREE.SRGBColorSpace;
  capTex.anisotropy = 4;
  const cap = new THREE.Mesh(new THREE.CircleGeometry(0.63, 64).rotateY(Math.PI / 2), new THREE.MeshStandardMaterial({ map: capTex, roughness: 0.5, metalness: 0.15 }));
  cap.position.x = CAP_X + 0.002;
  knob.add(cap);

  const markMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xf59e0b, emissiveIntensity: 0.35, roughness: 0.4 });
  const mark = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.045, 0.11), markMat);
  mark.position.set(KNOB_X0 + KNOB_LEN / 2, 0.68, 0);
  knob.add(mark);
  stalk.add(knob);

  /* হাই বিম LED + আভা */
  const ledMat = new THREE.MeshStandardMaterial({ color: 0x334155, emissive: 0x2563eb, emissiveIntensity: 0, roughness: 0.3 });
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.075, 20, 14), ledMat);
  led.position.set(2.85, 0.29, 0.29);
  stalk.add(led);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0x60a5fa, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 }));
  glow.scale.set(1.1, 1.1, 1);
  glow.position.copy(led.position);
  stalk.add(glow);
  rig.add(stalk);

  /* রিংয়ের আইকন প্লেট (শুধু 'ring' দৃশ্যে) */
  const plateCanvas = document.createElement('canvas');
  plateCanvas.width = plateCanvas.height = 768;
  const plateTex = new THREE.CanvasTexture(plateCanvas);
  plateTex.colorSpace = THREE.SRGBColorSpace;
  plateTex.anisotropy = 8;
  const plate = new THREE.Mesh(new THREE.CircleGeometry(2.25, 96).rotateY(Math.PI / 2), new THREE.MeshBasicMaterial({ map: plateTex, transparent: true, toneMapped: false }));
  plate.position.x = KNOB_X0 - 0.1;
  rig.add(plate);

  /* মার্কার বিন্দু (লিভার/পুশ দৃশ্যে) */
  const mk = (x, y, z) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 16), new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.35, metalness: 0.1 }));
    m.position.set(x, y, z);
    rig.add(m);
    return m;
  };
  const MR = 4.9;
  const levMarks = {
    R: mk(MR * Math.cos(LEV_ANG * D2R), MR * Math.sin(LEV_ANG * D2R), 0),
    N: mk(MR, 0, 0),
    L: mk(MR * Math.cos(LEV_ANG * D2R), -MR * Math.sin(LEV_ANG * D2R), 0),
  };
  const pushMarks = {
    high: mk(MR * Math.cos(PUSH_ANG * D2R), 0, -MR * Math.sin(PUSH_ANG * D2R)),
    low: mk(MR, 0, 0),
  };

  return { rig, stalk, knob, columnG, boss, plate, plateCanvas, plateTex, ledMat, glow, levMarks, pushMarks, markMat };
}

export default function Stalk3D({ view = 'lever', ring, turn, high, nudge, onRing, onTurn, onHigh, onFail }) {
  const mountRef = useRef(null);
  const api = useRef(null);
  const live = useRef({});
  live.current = { ring, turn, high, nudge, onRing, onTurn, onHigh, onFail };

  useEffect(() => {
    const mount = mountRef.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch (err) {
      live.current.onFail?.();
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setClearColor(0x000000, 0);
    const el = renderer.domElement;
    el.style.display = 'block';
    el.style.touchAction = 'none';
    el.style.cursor = 'grab';
    mount.appendChild(el);

    const scene = new THREE.Scene();
    const pm = new THREE.PMREMGenerator(renderer);
    const envTex = pm.fromScene(new RoomEnvironment(renderer), 0.04).texture;
    scene.environment = envTex;
    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(6, 8, 10);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x9db8ff, 0.5);
    fill.position.set(-8, -2, 6);
    scene.add(fill);

    const R = buildRig();
    scene.add(R.rig);
    R.plate.visible = view === 'ring';
    R.columnG.visible = view !== 'ring';
    R.boss.visible = view !== 'ring';
    Object.values(R.levMarks).forEach((m) => { m.visible = view === 'lever'; });
    Object.values(R.pushMarks).forEach((m) => { m.visible = view === 'push'; });

    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
    const cfg = {
      ring: { t: [4.0, 0, 0], p: [4.0 + DIST, 1.5, 1.7], up: [0, 1, 0] },
      lever: { t: [3.6, 0, 0], p: [3.6 + 2.4, 2.0, DIST], up: [0, 1, 0] },
      push: { t: [3.6, 0, 0], p: [3.6, DIST, 2.8], up: [0, 0, -1] },
    }[view];
    camera.position.set(...cfg.p);
    camera.up.set(...cfg.up);
    camera.lookAt(...cfg.t);

    /* ---- অবস্থা ---- */
    const cur = { ring: 0, lev: 0, push: 0 };
    const vel = { ring: 0, lev: 0, push: 0 };
    const tgt = { ring: 0, lev: 0, push: 0 };
    let raf = 0;
    let last = 0;
    let lastPlate = '';
    let dead = false;
    const K = 170;
    const Cd = 15;

    const apply = () => {
      R.knob.rotation.x = cur.ring;
      R.stalk.rotation.z = cur.lev;
      R.stalk.rotation.y = cur.push;
    };
    const frame = (t) => {
      raf = 0;
      if (dead) return;
      const dt = Math.min(0.033, Math.max(0.001, (t - last) / 1000));
      last = t;
      let moving = false;
      ['ring', 'lev', 'push'].forEach((k) => {
        if (reduced()) {
          cur[k] = tgt[k];
          vel[k] = 0;
        } else {
          vel[k] += (K * (tgt[k] - cur[k]) - Cd * vel[k]) * dt;
          cur[k] += vel[k] * dt;
        }
        if (Math.abs(tgt[k] - cur[k]) > 1e-4 || Math.abs(vel[k]) > 1e-3) moving = true;
      });
      apply();
      renderer.render(scene, camera);
      if (moving) raf = requestAnimationFrame(frame);
    };
    const invalidate = () => {
      if (dead || raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const sync = (first) => {
      const p = live.current;
      tgt.ring = -RING_ANG[p.ring] * D2R;
      tgt.lev = (p.turn === 'R' ? LEV_ANG : p.turn === 'L' ? -LEV_ANG : 0) * D2R;
      tgt.push = (p.high ? PUSH_ANG : p.nudge ? PUSH_ANG * 0.5 : 0) * D2R;
      if (first) {
        Object.assign(cur, tgt);
        apply();
      }
      // LED ও আভা
      R.ledMat.emissiveIntensity = p.high ? 2.2 : 0;
      R.ledMat.color.set(p.high ? 0x93c5fd : 0x334155);
      R.glow.material.opacity = p.high ? 0.95 : 0;
      // প্লেট (সক্রিয় আইকন হাইলাইট)
      if (lastPlate !== p.ring) {
        lastPlate = p.ring;
        drawPlate(R.plateCanvas, p.ring);
        R.plateTex.needsUpdate = true;
      }
      // মার্কার রং
      const lit = (m, on, color) => {
        m.material.color.set(on ? color : 0xf1f5f9);
        m.material.emissive.set(on ? color : 0x000000);
        m.material.emissiveIntensity = on ? 0.6 : 0;
      };
      const tk = p.turn || 'N';
      Object.entries(R.levMarks).forEach(([id, m]) => lit(m, tk === id, 0xfbbf24));
      lit(R.pushMarks.high, !!p.high, 0x60a5fa);
      lit(R.pushMarks.low, !p.high, 0xfbbf24);
      invalidate();
    };

    /* ---- আকার ---- */
    const resize = () => {
      const w = Math.max(40, mount.clientWidth);
      const h = Math.max(40, mount.clientHeight);
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      invalidate();
    };
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    ro?.observe(mount);
    resize();

    // ফন্ট লোড হলে টেক্সচার আবার আঁকা
    document.fonts?.ready?.then(() => {
      if (dead) return;
      const c = R.knob.children.find((o) => o.material && o.material.map && o.geometry.type === 'CircleGeometry');
      if (c) {
        drawCap(c.material.map.image);
        c.material.map.needsUpdate = true;
      }
      lastPlate = '';
      sync(false);
    });

    /* ---- টানা / ক্লিক ---- */
    const local = (e) => {
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height };
    };
    const toPx = (l, v3) => {
      const v = v3.clone().project(camera);
      return { x: (v.x * 0.5 + 0.5) * l.w, y: (-v.y * 0.5 + 0.5) * l.h };
    };
    const nearest = (a, list) => list.reduce((b, c) => (Math.abs(c.a - a) < Math.abs(b.a - a) ? c : b));
    let drag = null;

    const pick = (e) => {
      const l = local(e);
      const p = live.current;
      if (view === 'ring') {
        const c = toPx(l, new THREE.Vector3(CAP_X, 0, 0));
        let a = (Math.atan2(l.x - c.x, -(l.y - c.y)) * 180) / Math.PI;
        a = Math.max(-70, Math.min(70, a));
        const n = nearest(a, RING_IDS.map((id) => ({ id, a: RING_ANG[id] })));
        p.onRing?.(n.id);
      } else {
        const c = toPx(l, new THREE.Vector3(0, 0, 0));
        const a = (Math.atan2(c.y - l.y, Math.max(l.x - c.x, 8)) * 180) / Math.PI;
        if (view === 'lever') {
          const n = nearest(a, [{ id: 'R', a: LEV_ANG }, { id: 'N', a: 0 }, { id: 'L', a: -LEV_ANG }]);
          p.onTurn?.(n.id === 'N' ? null : n.id);
        } else {
          p.onHigh?.(a > 8);
        }
      }
    };
    const down = (e) => {
      drag = { x: e.clientX, y: e.clientY, moved: false };
      el.setPointerCapture?.(e.pointerId);
      el.style.cursor = 'grabbing';
      if (view !== 'ring') pick(e);
    };
    const move = (e) => {
      if (!drag) return;
      if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 4) drag.moved = true;
      if (view === 'ring' ? drag.moved : true) pick(e);
    };
    const up = () => {
      if (drag && view === 'ring' && !drag.moved) {
        const p = live.current;
        const i = RING_IDS.indexOf(p.ring);
        p.onRing?.(RING_IDS[(i + 1) % RING_IDS.length]);
      }
      drag = null;
      el.style.cursor = 'grab';
    };
    const key2 = (e) => {
      const p = live.current;
      if (view === 'ring') {
        const i = RING_IDS.indexOf(p.ring);
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); p.onRing?.(RING_IDS[Math.min(2, i + 1)]); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); p.onRing?.(RING_IDS[Math.max(0, i - 1)]); }
      } else if (view === 'lever') {
        const order = ['R', 'N', 'L'];
        const i = order.indexOf(p.turn || 'N');
        if (e.key === 'ArrowUp') { e.preventDefault(); const n = order[Math.max(0, i - 1)]; p.onTurn?.(n === 'N' ? null : n); }
        if (e.key === 'ArrowDown') { e.preventDefault(); const n = order[Math.min(2, i + 1)]; p.onTurn?.(n === 'N' ? null : n); }
      } else {
        if (e.key === 'ArrowUp') { e.preventDefault(); p.onHigh?.(true); }
        if (e.key === 'ArrowDown') { e.preventDefault(); p.onHigh?.(false); }
      }
    };
    el.tabIndex = 0;
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('keydown', key2);

    sync(true);
    renderer.render(scene, camera);
    api.current = { sync: () => sync(false) };

    return () => {
      dead = true;
      if (raf) cancelAnimationFrame(raf);
      ro?.disconnect();
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      el.removeEventListener('keydown', key2);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          const ms = Array.isArray(o.material) ? o.material : [o.material];
          ms.forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); });
        }
      });
      envTex.dispose();
      pm.dispose();
      renderer.dispose();
      if (el.parentNode === mount) mount.removeChild(el);
      api.current = null;
    };
  }, [view]);

  useEffect(() => { api.current?.sync(); }, [ring, turn, high, nudge]);

  /* ---- HTML লেবেল ---- */
  const LROWS = [
    { id: 'R', top: '20.5%', act: 'উপরে তুলুন', mark: 'ডান ইন্ডিকেটর (R)' },
    { id: 'N', top: '50%', act: 'মাঝে নামান', mark: 'নিউট্রাল / অফ' },
    { id: 'L', top: '79.5%', act: 'নিচে নামান', mark: 'বাঁ ইন্ডিকেটর (L)' },
  ];
  const lab = (on, tone) => `block text-xs font-bold leading-tight ${on ? (tone === 'blue' ? 'text-blue-700' : 'text-slate-900') : 'text-slate-600'}`;

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-200" style={{ aspectRatio: view === 'ring' ? '4 / 3' : '17 / 10' }}>
      <div ref={mountRef} className="absolute inset-0" />

      {view === 'ring' && (
        <span className="pointer-events-none absolute inset-x-0 bottom-1.5 text-center text-xs font-semibold text-slate-500">রিং টেনে ঘোরান, বা চাপ দিয়ে পরেরটায় যান</span>
      )}

      {view === 'lever' && LROWS.map((r) => {
        const on = (turn || 'N') === r.id;
        return (
          <button key={r.id} type="button" onClick={() => onTurn?.(r.id === 'N' ? null : r.id)} aria-pressed={on} className="absolute right-1 -translate-y-1/2 text-left" style={{ top: r.top, left: '65%' }}>
            <span className={lab(on)}>{r.act}</span>
            <span className="block text-[11px] leading-tight text-slate-500">{r.mark}</span>
          </button>
        );
      })}

      {view === 'push' && (
        <>
          <div className="pointer-events-none absolute inset-x-2 top-1.5 rounded-md border border-sky-300 bg-sky-200/80 py-0.5 text-center text-xs font-bold text-sky-800">▲ সামনে — উইন্ডশিল্ডের দিকে</div>
          <div className="pointer-events-none absolute inset-x-2 bottom-1.5 rounded-md border border-slate-300 bg-slate-200/90 py-0.5 text-center text-xs font-bold text-slate-600">▼ পেছনে — চালকের (আপনার) দিকে</div>
          <button type="button" onClick={() => onHigh?.(true)} aria-pressed={!!high} className="absolute right-1 -translate-y-1/2 text-left" style={{ top: '28.9%', left: '65%' }}>
            <span className={lab(high, 'blue')}>হাই বিম</span>
            <span className="block text-[11px] leading-tight text-slate-500">সামনে ঠেলুন</span>
          </button>
          <button type="button" onClick={() => onHigh?.(false)} aria-pressed={!high} className="absolute right-1 -translate-y-1/2 text-left" style={{ top: '50%', left: '65%' }}>
            <span className={lab(!high)}>লো বিম</span>
            <span className="block text-[11px] leading-tight text-slate-500">টেনে নিজের দিকে</span>
          </button>
          <span className={`pointer-events-none absolute bottom-9 right-2 rounded-full px-2.5 py-0.5 text-xs font-bold ${high ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-800'}`}>{high ? '↑ সামনে ঠেলা' : '↓ পেছনে টানা'}</span>
        </>
      )}
    </div>
  );
}
