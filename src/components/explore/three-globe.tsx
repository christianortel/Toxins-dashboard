"use client";

import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { mockEntities } from "@/data/mock/entities";
import { useExploreStore } from "@/stores/explore-store";
import { selectNationalAtlas } from "@/lib/map/entity-priority";
import type { AnyMapEntity, LayerGroupId } from "@/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const GLOBE_RADIUS = 1;
const CAMERA_DIST = 2.5;
const ENTITY_POINT_SIZE = 6; // px, scaled by devicePixelRatio
const HOVER_POINT_SIZE = 9;
const RAYCASTER_THRESHOLD = 0.015;

const EARTH_TEXTURE_URL =
  "https://unpkg.com/three-globe/example/img/earth-night.jpg";

/** Group → hex color matching CSS design tokens */
const GROUP_COLORS: Record<LayerGroupId, number> = {
  official: 0xc4784a,
  emerging: 0xb5924a,
  wildlife: 0x6b8f71,
  reproductive: 0x7a9eb5,
  regulatory: 0x8a8a96,
};

// ─── Coordinate helpers ────────────────────────────────────────────────────────

function latLonToVec3(
  lat: number,
  lon: number,
  r: number = GLOBE_RADIUS
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ThreeGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const rafRef = useRef<number>(0);
  const entityMapRef = useRef<Map<number, string>>(new Map()); // index → entity id
  const hoveredIdxRef = useRef<number | null>(null);
  const colorsRef = useRef<Float32Array | null>(null);
  const sizesRef = useRef<Float32Array | null>(null);

  const activeLayers = useExploreStore((s) => s.activeLayers);
  const activeGroups = useExploreStore((s) => s.activeGroups);
  const timelineYear = useExploreStore((s) => s.timelineYear);
  const cameraBand = useExploreStore((s) => s.cameraBand);
  const setSelectedEntity = useExploreStore((s) => s.setSelectedEntity);

  // Filter + band-aware atlas selection
  const visibleEntities = useMemo<AnyMapEntity[]>(() => {
    const eligible = mockEntities.filter((e) => {
      if (!activeGroups.has(e.layerGroup)) return false;
      if (!activeLayers.has(e.layerId)) return false;
      // Timeline
      if (e.year !== undefined) {
        const end = e.yearEnd ?? 2030;
        if (timelineYear < e.year || timelineYear > end) return false;
      }
      return true;
    });

    // At national band, apply quality-gated atlas selection
    if (cameraBand === "national") {
      return selectNationalAtlas(eligible);
    }
    return eligible;
  }, [activeLayers, activeGroups, timelineYear, cameraBand]);

  // ── Initialization ──────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el || rendererRef.current) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x0a0a0b, 1);
    el.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      el.clientWidth / el.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, CAMERA_DIST);
    cameraRef.current = camera;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 1.4;
    controls.maxDistance = 5;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controls.addEventListener("start", () => {
      controls.autoRotate = false;
    });
    controlsRef.current = controls;

    // Globe sphere
    const sphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const loader = new THREE.TextureLoader();
    // Use a dark procedural fallback while the texture loads
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x1a2744,
      shininess: 8,
      specular: 0x223355,
    });
    const globe = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(globe);

    loader.load(
      EARTH_TEXTURE_URL,
      (texture) => {
        sphereMat.map = texture;
        sphereMat.color.set(0xffffff);
        sphereMat.needsUpdate = true;
      },
      undefined,
      () => {
        // Texture failed — dark procedural sphere remains
      }
    );

    // Atmosphere glow (additive blending outer sphere)
    const atmGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.025, 32, 32);
    const atmMat = new THREE.MeshPhongMaterial({
      color: 0x1a4060,
      transparent: true,
      opacity: 0.07,
      side: THREE.FrontSide,
      depthWrite: false,
    });
    scene.add(new THREE.Mesh(atmGeo, atmMat));

    // Resize handler
    function onResize() {
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    // Click handler
    function onClick(ev: MouseEvent) {
      if (!sceneRef.current || !cameraRef.current || !pointsRef.current) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((ev.clientX - rect.left) / rect.width) * 2 - 1,
        -((ev.clientY - rect.top) / rect.height) * 2 + 1
      );
      const ray = new THREE.Raycaster();
      ray.params.Points = { threshold: RAYCASTER_THRESHOLD };
      ray.setFromCamera(ndc, cameraRef.current);
      const hits = ray.intersectObject(pointsRef.current);
      if (hits.length > 0) {
        const idx = hits[0].index;
        if (idx !== undefined) {
          const entityId = entityMapRef.current.get(idx);
          if (entityId) setSelectedEntity(entityId);
        }
      }
    }
    renderer.domElement.addEventListener("click", onClick);

    // Hover handler
    let lastHoverMove = 0;
    function onMouseMove(ev: MouseEvent) {
      const now = Date.now();
      if (now - lastHoverMove < 30) return; // throttle to 30fps
      lastHoverMove = now;
      if (!cameraRef.current || !pointsRef.current) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((ev.clientX - rect.left) / rect.width) * 2 - 1,
        -((ev.clientY - rect.top) / rect.height) * 2 + 1
      );
      const ray = new THREE.Raycaster();
      ray.params.Points = { threshold: RAYCASTER_THRESHOLD };
      ray.setFromCamera(ndc, cameraRef.current);
      const pts = pointsRef.current;
      const hits = ray.intersectObject(pts);

      const prevIdx = hoveredIdxRef.current;
      const newIdx = hits.length > 0 ? (hits[0].index ?? null) : null;
      if (prevIdx === newIdx) return;

      const sizes = sizesRef.current;
      if (sizes) {
        if (prevIdx !== null) {
          sizes[prevIdx] = ENTITY_POINT_SIZE;
        }
        if (newIdx !== null) {
          sizes[newIdx] = HOVER_POINT_SIZE;
        }
        (pts.geometry.attributes.size as THREE.BufferAttribute).needsUpdate = true;
      }
      hoveredIdxRef.current = newIdx;
      renderer.domElement.style.cursor =
        newIdx !== null ? "pointer" : "";
    }
    renderer.domElement.addEventListener("mousemove", onMouseMove);

    // Render loop — report camera distance to store for band detection
    let lastDist = -1;
    function animate() {
      rafRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
      // Throttle band updates to avoid re-render storms
      const dist = camera.position.length();
      if (Math.abs(dist - lastDist) > 0.01) {
        lastDist = dist;
        useExploreStore.getState().setCameraDistance(dist);
      }
    }
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      renderer.domElement.removeEventListener("click", onClick);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      controls.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      rendererRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Entity points update ────────────────────────────────────────────────────
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove old points
    if (pointsRef.current) {
      scene.remove(pointsRef.current);
      pointsRef.current.geometry.dispose();
      (pointsRef.current.material as THREE.Material).dispose();
      pointsRef.current = null;
    }

    if (visibleEntities.length === 0) return;

    const count = visibleEntities.length;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count).fill(ENTITY_POINT_SIZE);
    const idxMap = new Map<number, string>();

    const c = new THREE.Color();
    visibleEntities.forEach((e, i) => {
      const pos = latLonToVec3(e.latitude, e.longitude, GLOBE_RADIUS * 1.004);
      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;

      c.set(GROUP_COLORS[e.layerGroup] ?? 0x8a8a96);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      idxMap.set(i, e.id);
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: { opacity: { value: 0.9 } },
      vertexShader: /* glsl */ `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float opacity;
        varying vec3 vColor;
        void main() {
          float r = distance(gl_PointCoord, vec2(0.5));
          if (r > 0.5) discard;
          // Soft edge
          float alpha = 1.0 - smoothstep(0.35, 0.5, r);
          gl_FragColor = vec4(vColor, alpha * opacity);
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    const pts = new THREE.Points(geo, mat);
    scene.add(pts);
    pointsRef.current = pts;
    entityMapRef.current = idxMap;
    colorsRef.current = colors;
    sizesRef.current = sizes;
    hoveredIdxRef.current = null;
  }, [visibleEntities]);

  return (
    <div className="relative h-full w-full" ref={containerRef}>
      {/* Vignette overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          boxShadow: "inset 0 0 140px 60px rgba(10,10,11,0.6)",
        }}
      />
      {/* Entity count */}
      <div className="pointer-events-none absolute left-4 bottom-20 z-20">
        <div className="rounded-md glass border border-border/40 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-text-muted">
          <span className="text-foreground tabular-nums">
            {visibleEntities.length}
          </span>{" "}
          / {mockEntities.length} entities visible
        </div>
      </div>
    </div>
  );
}
