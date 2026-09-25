import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const frames = [
  [
    "The signature",
    "A single, sculpted mark. One clear focal point.",
    { ry: -0.35, rx: 0.08, s: 1.35 },
  ],
  [
    "A different angle",
    "The camera reveals depth and a coral inner edge.",
    { ry: 0.65, rx: 0.15, s: 1.4 },
  ],
  [
    "Inside the detail",
    "A close-up of the same geometry, not a new graphic.",
    { ry: 0.95, rx: -0.2, s: 2.35, z: 6.2 },
  ],
  [
    "Opening up",
    "The three parts separate to reveal a passage.",
    { ry: 0.15, s: 1.6, spread: 0.6 },
  ],
  [
    "Three connected parts",
    "The build is made legible: intelligence, design, engineering.",
    { ry: -0.35, rx: 0.12, s: 1.25, spread: 1.3 },
  ],
  [
    "A wider perspective",
    "The parts rotate into a shared spatial system.",
    { ry: -0.8, rx: 0.4, rz: 0.12, s: 1.1, spread: 1.6 },
  ],
  [
    "The threshold",
    "The A becomes the entrance to the next scene.",
    { ry: 0, rx: 0, s: 1.7, spread: 0.1, tunnel: 0.5, z: 6 },
  ],
  [
    "Through the A",
    "The camera pushes into nested structures.",
    { ry: 0, s: 2.2, tunnel: 1, z: 3.6, solid: 0.3 },
  ],
  [
    "A field of possibility",
    "Small units carry the form forward.",
    { ry: -0.15, s: 1.15, nodes: 1, scatter: 1.3, solid: 0, tunnel: 0.4 },
  ],
  [
    "Intelligence connects",
    "Dispersed units gather into an ordered volume.",
    { ry: 0.5, rx: 0.18, s: 1.1, nodes: 1, scatter: 0.55, solid: 0 },
  ],
  [
    "A visible structure",
    "The connected points resolve into the A.",
    { ry: 0.25, s: 1.6, nodes: 1, scatter: 0, solid: 0 },
  ],
  [
    "A system, assembled",
    "The geometry becomes solid again.",
    { ry: -0.25, s: 1.4, nodes: 0.15, solid: 1 },
  ],
  [
    "Make room for the work",
    "The A opens into a frame for evidence.",
    { ry: 0.45, rx: -0.1, s: 1.1, spread: 1.6, cards: 0.4, cardShift: 0 },
  ],
  [
    "HeuriSight",
    "First project: a deliberate pause to read.",
    { ry: 0.2, s: 1.2, spread: 2, solid: 0.65, cards: 1, cardShift: 0 },
  ],
  [
    "RD Fitness",
    "The project rail moves through the same space.",
    { ry: -0.2, s: 1.2, spread: 2, solid: 0.65, cards: 1, cardShift: 1 },
  ],
  [
    "CodeCraft",
    "The second transition maintains direction and rhythm.",
    { ry: -0.5, s: 1.2, spread: 2, solid: 0.65, cards: 1, cardShift: 2 },
  ],
  [
    "The parts return",
    "Project frames recede; the A reconnects.",
    { ry: -0.65, rx: 0.15, s: 1.1, spread: 0.7, cards: 0.2, cardShift: 2 },
  ],
  [
    "A new perspective",
    "The final orbit settles the scene.",
    { ry: 0.4, rx: 0.15, s: 1.4 },
  ],
  [
    "The invitation",
    "The letter makes space for a clear next step.",
    { ry: -0.18, rx: 0.04, s: 1.25 },
  ],
  [
    "Aletheia, resolved",
    "A calm closing frame. The movement has a destination.",
    { ry: 0, rx: 0, s: 1.3 },
  ],
];
const chapters = [
  [
    "01 / A BEGINNING",
    "Intelligence.<br>With intention.",
    "One idea becomes a system.<br>One A becomes a world.",
  ],
  [
    "02 / THE WHOLE BUILD",
    "From possibility.<br>To something real.",
    "AI engineering, thoughtful interfaces<br>and the systems that connect them.",
  ],
  [
    "03 / CONNECTIONS",
    "Complexity.<br>Made useful.",
    "Models. Data. Software.<br>Designed to work together.",
  ],
  [
    "04 / SELECTED WORK",
    "Ideas are good.<br>Proof is better.",
    "A closer look at the products<br>and platforms we build.",
  ],
  [
    "05 / WHAT COMES NEXT",
    "Your next idea.<br>Starts here.",
    "Aletheia AI.<br>Let’s make something worth building.",
  ],
];
const base = {
  rx: 0,
  ry: 0,
  rz: 0,
  s: 1.3,
  spread: 0,
  z: 7,
  solid: 1,
  nodes: 0,
  scatter: 0,
  tunnel: 0,
  cards: 0,
  cardShift: 0,
};
const state = { ...base, ...frames[0][2] };
const sceneMount = document.querySelector("#scene");
const slider = document.querySelector("#scrub");
const playButton = document.querySelector("#play");
const board = document.querySelector("#frames");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
let renderer;
try {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: true,
    powerPreference: "high-performance",
  });
} catch {
  document.body.classList.add("no-webgl");
  document.querySelector("#fallback").hidden = false;
}

if (renderer) start();
else {
  frames.forEach(([title, summary], i) => {
    const p = document.createElement("p");
    p.textContent = `${String(i + 1).padStart(2, "0")} — ${title}. ${summary}`;
    board.append(p);
  });
  document.querySelector("#download").disabled = true;
}
function start() {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  sceneMount.append(renderer.domElement);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#f0f1f6");
  const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 100);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight("#ffffff", "#6770b1", 0.75));
  const key = new THREE.DirectionalLight("#ffffff", 2);
  key.position.set(-3, 6, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -8;
  key.shadow.camera.right = 8;
  key.shadow.camera.top = 8;
  key.shadow.camera.bottom = -8;
  key.shadow.normalBias = 0.025;
  scene.add(key);
  const rim = new THREE.DirectionalLight("#ccd2ff", 0.8);
  rim.position.set(5, 2, -2);
  scene.add(rim);
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.ShadowMaterial({ opacity: 0.11 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -2.2;
  floor.receiveShadow = true;
  scene.add(floor);
  const world = new THREE.Group();
  scene.add(world);
  const mark = new THREE.Group();
  world.add(mark);
  const polygons = [
    [
      [-1.3, -1.1],
      [-0.65, -1.1],
      [0.26, 1.3],
      [-0.26, 1.3],
    ],
    [
      [0.26, 1.3],
      [1.3, -1.1],
      [0.65, -1.1],
      [0, 0.614],
    ],
    [
      [-0.392, -0.42],
      [0.392, -0.42],
      [0.544, -0.82],
      [-0.544, -0.82],
    ],
  ];
  const colors = ["#0619db", "#0619db", "#ff3712"];
  const pieces = polygons.map((points, i) => {
    const shape = new THREE.Shape(points.map((p) => new THREE.Vector2(...p)));
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.42,
      bevelEnabled: true,
      bevelThickness: 0.07,
      bevelSize: 0.055,
      bevelSegments: 4,
      steps: 1,
    });
    geo.translate(0, 0, -0.21);
    const mat = new THREE.MeshPhysicalMaterial({
      color: colors[i],
      roughness: 0.38,
      metalness: 0,
      specularIntensity: 0.2,
      clearcoat: 0.15,
      clearcoatRoughness: 0.25,
      envMapIntensity: 0.25,
      transparent: true,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mark.add(mesh);
    return mesh;
  });
  const tunnel = new THREE.Group();
  world.add(tunnel);
  const rings = [];
  for (let i = 0; i < 10; i++) {
    const shape = new THREE.Shape([
      new THREE.Vector2(0, 1.55),
      new THREE.Vector2(-1.65, -1.25),
      new THREE.Vector2(1.65, -1.25),
      new THREE.Vector2(0, 1.55),
    ]);
    const hole = new THREE.Path([
      new THREE.Vector2(0, 1.36),
      new THREE.Vector2(1.4, -1.1),
      new THREE.Vector2(-1.4, -1.1),
      new THREE.Vector2(0, 1.36),
    ]);
    shape.holes.push(hole);
    const mesh = new THREE.Mesh(
      new THREE.ExtrudeGeometry(shape, { depth: 0.09, bevelEnabled: false }),
      new THREE.MeshStandardMaterial({
        color: i % 3 === 0 ? "#ff6548" : "#3645ff",
        metalness: 0.2,
        roughness: 0.35,
        transparent: true,
        opacity: 0,
      }),
    );
    mesh.position.z = -1 - i * 1.9;
    tunnel.add(mesh);
    rings.push(mesh);
  }
  const random = (i) => {
    const n = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    return n - Math.floor(n);
  };
  const inside = (p, poly) => {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i],
        b = poly[j];
      if (
        a[1] > p[1] !== b[1] > p[1] &&
        p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]
      )
        c = !c;
    }
    return c;
  };
  const points = [];
  for (let i = 0; points.length < 240 && i < 9000; i++) {
    const x = random(i * 3) * 2.7 - 1.35,
      y = random(i * 3 + 1) * 2.5 - 1.15;
    if (polygons.some((p) => inside([x, y], p)))
      points.push({
        x,
        y,
        z: (random(i * 3 + 2) - 0.5) * 0.4,
        dx: (random(i + 700) - 0.5) * 5,
        dy: (random(i + 900) - 0.5) * 4,
        dz: (random(i + 1100) - 0.5) * 5,
      });
  }
  const nodeMat = new THREE.MeshPhysicalMaterial({
    color: "#3645ff",
    roughness: 0.25,
    metalness: 0.2,
    transparent: true,
  });
  const nodes = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(0.043, 1),
    nodeMat,
    points.length,
  );
  mark.add(nodes);
  const dummy = new THREE.Object3D();
  points.forEach((_, i) =>
    nodes.setColorAt(
      i,
      new THREE.Color(colors[i % 11 === 0 ? 1 : i % 17 === 0 ? 2 : 0]),
    ),
  );
  const projects = [
    [
      "01",
      "HeuriSight",
      "AI / EDUCATION",
      "Intelligent assessment.",
      "Retrieval + reasoning.",
      "#2839ff",
    ],
    [
      "02",
      "RD Fitness",
      "WEB / PLATFORM",
      "A connected digital home.",
      "Fitness + memberships.",
      "#ff6548",
    ],
    [
      "03",
      "CodeCraft",
      "AI / DEVELOPER TOOLS",
      "Intelligence in the terminal.",
      "An AI coding workflow.",
      "#253025",
    ],
  ];
  const projectGroup = new THREE.Group();
  world.add(projectGroup);
  const cards = projects.map((p) => {
    const c = document.createElement("canvas");
    c.width = 1200;
    c.height = 760;
    const x = c.getContext("2d");
    x.fillStyle = "#fbfaf5";
    x.fillRect(0, 0, 1200, 760);
    x.fillStyle = p[5];
    x.fillRect(0, 0, 1200, 16);
    x.font = "24px monospace";
    x.fillText("ALETHEIA / SELECTED WORK", 70, 85);
    x.fillStyle = "#777b80";
    x.fillText(p[2], 70, 155);
    x.fillStyle = p[5];
    x.font = "160px Arial";
    x.fillText(p[0], 925, 620);
    x.fillStyle = "#171921";
    x.font = "bold 92px Arial";
    x.fillText(p[1], 65, 340);
    x.font = "32px Arial";
    x.fillText(p[3], 70, 465);
    x.fillText(p[4], 70, 515);
    x.fillStyle = "#858890";
    x.font = "20px monospace";
    x.fillText("PROJECT TITLE CARD / MOTION CONCEPT", 70, 695);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3.4, 2.15),
      new THREE.MeshBasicMaterial({
        toneMapped: false,
        map: tex,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      }),
    );
    projectGroup.add(mesh);
    return mesh;
  });
  const clock = gsap.timeline({
    paused: true,
    defaults: { ease: "power1.inOut" },
  });
  frames.forEach((f, i) => {
    if (i > 0)
      clock.to(state, { ...base, ...f[2], duration: 1.65 }, (i - 1) * 2 + 0.35);
    clock.addLabel("frame-" + (i + 1), i * 2);
  });
  let mode = "main",
    lastChapter = -1,
    playback = null,
    trigger = null,
    disposed = false;
  function render() {
    if (disposed) return;
    const mobile = mode === "main" && window.innerWidth < 600;
    const offset = mode === "main" ? (mobile ? 0 : 1.65) : 0;
    world.position.set(offset, mobile ? -0.72 : 0, 0);
    mark.rotation.set(state.rx, state.ry, state.rz);
    mark.scale.setScalar((state.s * (mobile ? 0.75 : 1)) / (1 + state.spread * 0.5));
    pieces.forEach((m, i) => {
      m.position.set(
        (i === 0 ? -1 : i === 1 ? 1 : 0) * state.spread,
        i === 2 ? -state.spread * 0.6 : state.spread * 0.15,
        (i === 2 ? state.spread * 0.6 : 0) + i * 0.018,
      );
      m.rotation.z = (i === 0 ? -0.3 : i === 1 ? 0.3 : 0) * state.spread;
      m.material.opacity = state.solid;
      m.visible = state.solid > 0.005;
    });
    nodes.visible = state.nodes > 0.005;
    nodeMat.opacity = state.nodes;
    if (nodes.visible) {
      points.forEach((p, i) => {
        dummy.position.set(
          p.x + p.dx * state.scatter,
          p.y + p.dy * state.scatter,
          p.z + p.dz * state.scatter,
        );
        dummy.rotation.set(
          state.scatter * i * 0.05,
          state.scatter * i * 0.04,
          0,
        );
        dummy.updateMatrix();
        nodes.setMatrixAt(i, dummy.matrix);
      });
      nodes.instanceMatrix.needsUpdate = true;
    }
    tunnel.scale.setScalar(mobile ? 0.8 : 1.1);
    rings.forEach((m, i) => {
      m.material.opacity = state.tunnel * (1 - i * 0.055);
      m.visible = state.tunnel > 0.005;
      m.rotation.z = state.tunnel * i * 0.025;
    });
    projectGroup.position.set(0, mobile ? 0 : 0.1, 1.0);
    projectGroup.scale.setScalar(mobile ? 0.75 : 1);
    cards.forEach((m, i) => {
      const d = i - state.cardShift;
      m.position.set(d * 3.9, 0, -Math.abs(d) * 1.1);
      m.rotation.y = -d * 0.17;
      m.material.opacity = state.cards * Math.max(0, 1 - Math.abs(d) * 0.8);
      m.visible = m.material.opacity > 0.005;
    });
    camera.position.set(
      mode === "main" && !mobile ? 0.2 : 0,
      mobile ? 0.35 : 0.25,
      state.z * (mobile ? 1.18 : 1),
    );
    camera.lookAt(mode === "main" && !mobile ? 0.15 : 0, 0, 0);
    renderer.render(scene, camera);
    if (mode === "main") {
      const t = clock.time(),
        index = Math.min(19, Math.round(t / 2)),
        chapter = Math.min(4, Math.floor(index / 4));
      if (chapter !== lastChapter) {
        const c = chapters[chapter];
        document.querySelector("#act").textContent = c[0];
        document.querySelector("#headline").innerHTML = c[1];
        document.querySelector("#description").innerHTML = c[2];
        lastChapter = chapter;
      }
      const nearestBoundary = [7, 15, 23, 31].reduce((a, b) =>
        Math.abs(t - a) < Math.abs(t - b) ? a : b,
      );
      const distance = Math.abs(t - nearestBoundary);
      const visibility = Math.min(1, distance / 0.55);
      const copy = document.querySelector(".copy");
      copy.style.opacity = String(visibility);
      copy.style.transform = `translateY(${(t < nearestBoundary ? -1 : 1) * (1 - visibility) * 25}px)`;
      const pct = Math.round(clock.progress() * 100);
      slider.value = String(Math.round(clock.progress() * 1000));
      document.querySelector("#progress").textContent = pct + "%";
      document.querySelector("#frame-number").textContent =
        String(index + 1).padStart(2, "0") + " / 20";
      document.querySelector("#frame-name").textContent = frames[index][0];
    }
  }
  clock.eventCallback("onUpdate", render);
  // Render the same 3D scene at the 20 exact timeline labels, using one WebGL context.
  mode = "board";
  renderer.setPixelRatio(1);
  renderer.setSize(600, 400, false);
  camera.aspect = 1.5;
  camera.updateProjectionMatrix();
  const thumbs = [];
  frames.forEach(([title, summary], i) => {
    clock.time(i * 2, false);
    render();
    const button = document.createElement("button");
    button.className = "frame";
    button.type = "button";
    button.setAttribute("aria-label", `View frame ${i + 1}: ${title}`);
    const c = document.createElement("canvas");
    c.width = 600;
    c.height = 400;
    c.getContext("2d").drawImage(renderer.domElement, 0, 0);
    c.setAttribute("aria-hidden", "true");
    button.append(c);
    const titleEl = document.createElement("span");
    titleEl.className = "frame-title";
    const n = document.createElement("small");
    n.textContent = String(i + 1).padStart(2, "0");
    titleEl.append(n, document.createTextNode(title));
    const desc = document.createElement("span");
    desc.className = "frame-summary";
    desc.textContent = summary;
    button.append(titleEl, desc);
    board.append(button);
    thumbs.push(c);
    button.addEventListener("click", () => seek(i / 19));
  });
  mode = "main";
  clock.time(0, false);
  function resize() {
    const bounds = sceneMount.getBoundingClientRect();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(bounds.width, bounds.height, false);
    camera.aspect = bounds.width / bounds.height;
    camera.updateProjectionMatrix();
    render();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(sceneMount);
  resize();
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    trigger = ScrollTrigger.create({
      trigger: "#journey",
      pin: "#stage",
      start: "top top",
      end: () => "+=" + Math.max(6000, window.innerHeight * 11),
      animation: clock,
      scrub: 0.45,
      invalidateOnRefresh: true,
    });
    return () => {
      trigger = null;
      stop();
    };
  });
  function stop() {
    playback?.kill();
    playback = null;
    playButton.textContent = reduced.matches
      ? "Motion reduced"
      : "Play sequence ↗";
  }
  function seek(progress) {
    stop();
    progress = Math.max(0, Math.min(1, progress));
    if (trigger) {
      window.scrollTo({
        top: trigger.start + progress * (trigger.end - trigger.start),
        behavior: "instant",
      });
      trigger.getTween()?.pause();
      clock.progress(progress, false);
    } else {
      document
        .querySelector("#journey")
        .scrollIntoView({ behavior: "instant" });
      clock.progress(progress, false);
    }
  }
  playButton.addEventListener("click", () => {
    if (playback) {
      stop();
      return;
    }
    if (!trigger) return;
    let p = clock.progress();
    if (p > 0.995) {
      seek(0);
      p = 0;
    }
    const proxy = { value: p };
    playButton.textContent = "Pause sequence";
    playback = gsap.to(proxy, {
      value: 1,
      duration: (1 - p) * 38,
      ease: "none",
      onUpdate: () =>
        window.scrollTo({
          top: trigger.start + proxy.value * (trigger.end - trigger.start),
          behavior: "instant",
        }),
      onComplete: stop,
    });
  });
  slider.addEventListener("input", () => seek(Number(slider.value) / 1000));
  document.querySelector("#restart").addEventListener("click", (e) => {
    e.preventDefault();
    seek(0);
  });
  document.querySelector("#back-film").addEventListener("click", (e) => {
    e.preventDefault();
    seek(0);
  });
  document.querySelector("#view-board").addEventListener("click", () => stop());
  const interrupt = () => {
    if (playback) stop();
  };
  window.addEventListener("wheel", interrupt, { passive: true });
  window.addEventListener("touchstart", interrupt, { passive: true });
  window.addEventListener("keydown", (e) => {
    if (
      [
        "ArrowDown",
        "ArrowUp",
        "PageDown",
        "PageUp",
        "Home",
        "End",
        "Escape",
        " ",
      ].includes(e.key)
    )
      interrupt();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
  });
  function updatePreference() {
    stop();
    playButton.disabled = reduced.matches;
    resize();
  }
  reduced.addEventListener("change", updatePreference);
  updatePreference();
  document.querySelector("#download").addEventListener("click", () => {
    const c = document.createElement("canvas");
    c.width = 2400;
    c.height = 2400;
    const x = c.getContext("2d");
    x.fillStyle = "#fbfaf5";
    x.fillRect(0, 0, c.width, c.height);
    x.fillStyle = "#171921";
    x.font = "52px Arial";
    x.fillText("ALETHEIA / ONE A. TWENTY MOMENTS.", 60, 85);
    x.font = "23px Arial";
    x.fillText("Motion direction 01 — A as a portal / concept study", 60, 130);
    thumbs.forEach((thumb, i) => {
      const col = i % 4,
        row = Math.floor(i / 4),
        px = 60 + col * 580,
        py = 180 + row * 420;
      x.drawImage(thumb, px, py, 540, 360);
      x.fillStyle = "#171921";
      x.font = "24px Arial";
      x.fillText(
        String(i + 1).padStart(2, "0") + "  " + frames[i][0],
        px,
        py + 394,
      );
    });
    const a = document.createElement("a");
    a.download = "aletheia-20-frame-motion-board.png";
    a.href = c.toDataURL("image/png");
    a.click();
  });
  document.fonts.ready.then(() => {
    if (!disposed) ScrollTrigger.refresh();
  });
  function cleanup() {
    if (disposed) return;
    stop();
    mm.revert();
    clock.kill();
    observer.disconnect();
    reduced.removeEventListener("change", updatePreference);
    window.removeEventListener("wheel", interrupt);
    window.removeEventListener("touchstart", interrupt);
    scene.traverse((o) => {
      o.geometry?.dispose();
      if (o.material) {
        const materials = Array.isArray(o.material) ? o.material : [o.material];
        materials.forEach((m) => {
          m.map?.dispose();
          m.dispose();
        });
      }
    });
    environment.dispose();
    renderer.dispose();
    disposed = true;
  }
  if (import.meta.hot) import.meta.hot.dispose(cleanup);
  window.addEventListener("pagehide", (e) => {
    if (!e.persisted) cleanup();
  });
}
