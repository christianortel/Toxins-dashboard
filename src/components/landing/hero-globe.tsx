"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

const GLOBE_RADIUS = 1;
const CAMERA_DIST = 2.8;
const EARTH_TEXTURE_URL =
  "https://unpkg.com/three-globe/example/img/earth-night.jpg";

export function HeroGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || rendererRef.current) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    const camera = new THREE.PerspectiveCamera(
      40,
      el.clientWidth / el.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.2, CAMERA_DIST);

    const sphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x1a2744,
      shininess: 8,
      specular: 0x223355,
      transparent: true,
      opacity: 0.55,
    });
    const globe = new THREE.Mesh(sphereGeo, sphereMat);
    globe.rotation.y = -1.2;
    scene.add(globe);

    const loader = new THREE.TextureLoader();
    loader.load(
      EARTH_TEXTURE_URL,
      (texture) => {
        sphereMat.map = texture;
        sphereMat.color.set(0xffffff);
        sphereMat.needsUpdate = true;
      },
      undefined,
      () => {}
    );

    const atmGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.03, 32, 32);
    const atmMat = new THREE.MeshPhongMaterial({
      color: 0x1a4060,
      transparent: true,
      opacity: 0.045,
      side: THREE.FrontSide,
      depthWrite: false,
    });
    scene.add(new THREE.Mesh(atmGeo, atmMat));

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

    let raf = 0;
    function animate() {
      raf = requestAnimationFrame(animate);
      globe.rotation.y += 0.0008;
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      rendererRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.35 }}
      aria-hidden="true"
    />
  );
}
