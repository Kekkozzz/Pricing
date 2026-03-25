"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";

interface WizardSceneProps {
  serviceId: string | null;
  step: number;
}

const ACCENT = 0xd4c5a0;

// --- Procedural geometry builders ---

function createLaptop(): THREE.Group {
  const group = new THREE.Group();
  const mat = (o: number) =>
    new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: o });

  // Screen outer frame
  const screenGeo = new THREE.BoxGeometry(2.6, 1.7, 0.05);
  const screen = new THREE.LineSegments(new THREE.EdgesGeometry(screenGeo), mat(0.7));
  screen.position.y = 0.95;
  screen.position.z = -0.3;
  screen.rotation.x = -0.12;
  group.add(screen);

  // Inner screen bezel
  const bezelGeo = new THREE.BoxGeometry(2.3, 1.4, 0.01);
  const bezel = new THREE.LineSegments(new THREE.EdgesGeometry(bezelGeo), mat(0.35));
  bezel.position.y = 0.95;
  bezel.position.z = -0.27;
  bezel.rotation.x = -0.12;
  group.add(bezel);

  // Browser bar
  const barPoints = [
    new THREE.Vector3(-1.1, 1.55, -0.26),
    new THREE.Vector3(1.1, 1.55, -0.26),
  ];
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(barPoints), mat(0.3)));

  // Three dots (browser controls)
  [-0.95, -0.85, -0.75].forEach((x) => {
    const dotGeo = new THREE.CircleGeometry(0.025, 8);
    const dotEdges = new THREE.EdgesGeometry(dotGeo);
    const dot = new THREE.LineSegments(dotEdges, mat(0.4));
    dot.position.set(x, 1.6, -0.255);
    dot.rotation.x = -0.12;
    group.add(dot);
  });

  // Content blocks on screen
  // Hero block
  const heroGeo = new THREE.PlaneGeometry(1.8, 0.4);
  const hero = new THREE.LineSegments(new THREE.EdgesGeometry(heroGeo), mat(0.25));
  hero.position.set(0, 1.2, -0.26);
  hero.rotation.x = -0.12;
  group.add(hero);

  // Two column blocks
  [[-0.5, 0.7], [0.5, 0.7]].forEach(([x, y]) => {
    const blockGeo = new THREE.PlaneGeometry(0.8, 0.35);
    const block = new THREE.LineSegments(new THREE.EdgesGeometry(blockGeo), mat(0.2));
    block.position.set(x, y, -0.26);
    block.rotation.x = -0.12;
    group.add(block);
  });

  // Text lines
  for (let i = 0; i < 3; i++) {
    const w = 0.6 + Math.random() * 0.3;
    const pts = [
      new THREE.Vector3(-0.9, 0.35 - i * 0.12, -0.26),
      new THREE.Vector3(-0.9 + w, 0.35 - i * 0.12, -0.26),
    ];
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat(0.15)));
  }

  // Base/keyboard
  const baseGeo = new THREE.BoxGeometry(2.8, 0.06, 1.7);
  group.add(new THREE.LineSegments(new THREE.EdgesGeometry(baseGeo), mat(0.3)));

  // Trackpad
  const padGeo = new THREE.PlaneGeometry(0.8, 0.5);
  const pad = new THREE.LineSegments(new THREE.EdgesGeometry(padGeo), mat(0.15));
  pad.position.set(0, 0.04, 0.15);
  pad.rotation.x = -Math.PI / 2;
  group.add(pad);

  // Keyboard hints (rows of small lines)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      const pts = [
        new THREE.Vector3(-1.0 + col * 0.25, 0.04, -0.5 + row * 0.2),
        new THREE.Vector3(-0.85 + col * 0.25, 0.04, -0.5 + row * 0.2),
      ];
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat(0.08)));
    }
  }

  return group;
}

function createShoppingBag(): THREE.Group {
  const group = new THREE.Group();
  // Bag body
  const bagGeo = new THREE.BoxGeometry(1.6, 2, 0.9);
  const bagEdges = new THREE.EdgesGeometry(bagGeo);
  const bag = new THREE.LineSegments(
    bagEdges,
    new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.7 })
  );
  group.add(bag);
  // Handle
  const handleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.4, 1, 0),
    new THREE.Vector3(-0.4, 1.6, 0),
    new THREE.Vector3(0.4, 1.6, 0),
    new THREE.Vector3(0.4, 1, 0),
  ]);
  const handleGeo = new THREE.BufferGeometry().setFromPoints(
    handleCurve.getPoints(20)
  );
  const handle = new THREE.Line(
    handleGeo,
    new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.4 })
  );
  group.add(handle);
  // Stripe decoration
  const stripeGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-0.8, 0.2, 0.46),
    new THREE.Vector3(0.8, 0.2, 0.46),
  ]);
  const stripe = new THREE.Line(
    stripeGeo,
    new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.3 })
  );
  group.add(stripe);
  return group;
}

function createDashboard(): THREE.Group {
  const group = new THREE.Group();
  const mat = (o: number) =>
    new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: o });

  // Main frame
  const frameGeo = new THREE.BoxGeometry(2.8, 2, 0.08);
  group.add(new THREE.LineSegments(new THREE.EdgesGeometry(frameGeo), mat(0.7)));

  // Sidebar divider
  const sideX = -0.8;
  const sidePts = [
    new THREE.Vector3(sideX, 1, 0.05),
    new THREE.Vector3(sideX, -1, 0.05),
  ];
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(sidePts), mat(0.4)));

  // Topbar divider
  const topPts = [
    new THREE.Vector3(-1.4, 0.65, 0.05),
    new THREE.Vector3(1.4, 0.65, 0.05),
  ];
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(topPts), mat(0.4)));

  // Sidebar icons (small squares)
  for (let i = 0; i < 5; i++) {
    const iconGeo = new THREE.PlaneGeometry(0.15, 0.15);
    const icon = new THREE.LineSegments(new THREE.EdgesGeometry(iconGeo), mat(0.25));
    icon.position.set(-1.1, 0.4 - i * 0.3, 0.05);
    group.add(icon);
    // Label line next to icon
    const labelPts = [
      new THREE.Vector3(-0.98, 0.4 - i * 0.3, 0.05),
      new THREE.Vector3(-0.85, 0.4 - i * 0.3, 0.05),
    ];
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(labelPts), mat(0.15)));
  }

  // Main chart area (top right)
  const chartPanel = new THREE.PlaneGeometry(1.8, 0.7);
  const chartFrame = new THREE.LineSegments(new THREE.EdgesGeometry(chartPanel), mat(0.3));
  chartFrame.position.set(0.35, 0.2, 0.05);
  group.add(chartFrame);

  // Mini line chart inside
  const chartPoints = [
    new THREE.Vector3(-0.5, 0.05, 0.06),
    new THREE.Vector3(-0.2, 0.25, 0.06),
    new THREE.Vector3(0.1, 0.1, 0.06),
    new THREE.Vector3(0.4, 0.35, 0.06),
    new THREE.Vector3(0.7, 0.2, 0.06),
    new THREE.Vector3(1.0, 0.45, 0.06),
  ];
  const chartCurve = new THREE.CatmullRomCurve3(chartPoints);
  group.add(
    new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(chartCurve.getPoints(30)),
      mat(0.5)
    )
  );

  // Stat cards (bottom right — 3 small cards)
  for (let i = 0; i < 3; i++) {
    const cardGeo = new THREE.PlaneGeometry(0.5, 0.35);
    const card = new THREE.LineSegments(new THREE.EdgesGeometry(cardGeo), mat(0.25));
    card.position.set(-0.3 + i * 0.65, -0.55, 0.05);
    group.add(card);

    // Number placeholder line in card
    const numPts = [
      new THREE.Vector3(-0.45 + i * 0.65, -0.48, 0.06),
      new THREE.Vector3(-0.15 + i * 0.65, -0.48, 0.06),
    ];
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(numPts), mat(0.15)));
  }

  // Data rows (bottom)
  for (let i = 0; i < 2; i++) {
    const rowPts = [
      new THREE.Vector3(-0.6, -0.82 - i * 0.15, 0.05),
      new THREE.Vector3(1.3, -0.82 - i * 0.15, 0.05),
    ];
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rowPts), mat(0.12)));
  }

  return group;
}

function createChart(): THREE.Group {
  const group = new THREE.Group();
  const heights = [0.6, 1.0, 0.8, 1.4, 1.8];
  const barWidth = 0.3;
  const gap = 0.15;
  const totalWidth = heights.length * (barWidth + gap) - gap;
  const startX = -totalWidth / 2 + barWidth / 2;

  heights.forEach((h, i) => {
    const barGeo = new THREE.BoxGeometry(barWidth, h, 0.2);
    const barEdges = new THREE.EdgesGeometry(barGeo);
    const bar = new THREE.LineSegments(
      barEdges,
      new THREE.LineBasicMaterial({
        color: ACCENT,
        transparent: true,
        opacity: 0.3 + (i / heights.length) * 0.4,
      })
    );
    bar.position.set(startX + i * (barWidth + gap), h / 2 - 0.9, 0);
    group.add(bar);
  });

  // Trend line
  const trendPoints = heights.map(
    (h, i) =>
      new THREE.Vector3(startX + i * (barWidth + gap), h - 0.9 + 0.1, 0.15)
  );
  const trendCurve = new THREE.CatmullRomCurve3(trendPoints);
  const trendGeo = new THREE.BufferGeometry().setFromPoints(
    trendCurve.getPoints(40)
  );
  const trend = new THREE.Line(
    trendGeo,
    new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.7 })
  );
  group.add(trend);

  // Base line
  const baseGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-totalWidth / 2 - 0.2, -0.9, 0),
    new THREE.Vector3(totalWidth / 2 + 0.2, -0.9, 0),
  ]);
  const baseLine = new THREE.Line(
    baseGeo,
    new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.3 })
  );
  group.add(baseLine);

  return group;
}

const geometryBuilders: Record<string, () => THREE.Group> = {
  "siti-web": createLaptop,
  "shop-saas": createShoppingBag,
  "web-app": createDashboard,
  "seo-marketing": createChart,
};

export default function WizardScene({ serviceId, step }: WizardSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    currentGroup: THREE.Group | null;
    animId: number;
  } | null>(null);
  const prevServiceRef = useRef<string | null>(null);
  const prevStepRef = useRef<number>(step);

  // Init Three.js
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 5;
    camera.position.y = 0.2;

    // Subtle ambient light
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    sceneRef.current = { renderer, scene, camera, currentGroup: null, animId: 0 };

    // Animation loop
    const animate = () => {
      const ref = sceneRef.current;
      if (!ref) return;
      ref.animId = requestAnimationFrame(animate);

      if (ref.currentGroup) {
        ref.currentGroup.rotation.y += 0.005;
      }

      ref.renderer.render(ref.scene, ref.camera);
    };
    animate();

    // Resize
    const onResize = () => {
      if (!container || !sceneRef.current) return;
      const { renderer: r, camera: c } = sceneRef.current;
      c.aspect = container.clientWidth / container.clientHeight;
      c.updateProjectionMatrix();
      r.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animId);
        sceneRef.current.renderer.dispose();
        container.removeChild(sceneRef.current.renderer.domElement);
        sceneRef.current = null;
      }
    };
  }, []);

  // Handle service change
  useEffect(() => {
    const ref = sceneRef.current;
    if (!ref) return;

    if (serviceId === prevServiceRef.current) {
      // Step change only — pulse
      if (step !== prevStepRef.current && ref.currentGroup) {
        gsap.to(ref.currentGroup.scale, {
          x: 0.85,
          y: 0.85,
          z: 0.85,
          duration: 0.25,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        });
      }
      prevStepRef.current = step;
      return;
    }

    prevServiceRef.current = serviceId;
    prevStepRef.current = step;

    const swapGeometry = () => {
      // Remove old
      if (ref.currentGroup) {
        ref.scene.remove(ref.currentGroup);
        ref.currentGroup.traverse((child) => {
          if (child instanceof THREE.LineSegments || child instanceof THREE.Line) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) child.material.dispose();
          }
        });
      }

      if (!serviceId) {
        ref.currentGroup = null;
        return;
      }

      // Create new
      const builder = geometryBuilders[serviceId];
      if (!builder) return;

      const group = builder();
      group.scale.set(0, 0, 0);
      ref.scene.add(group);
      ref.currentGroup = group;

      // Animate in
      gsap.to(group.scale, {
        x: 0.8,
        y: 0.8,
        z: 0.8,
        duration: 0.6,
        ease: "power2.out",
      });
      gsap.fromTo(
        group.rotation,
        { y: -0.5 },
        { y: 0, duration: 0.8, ease: "power2.out" }
      );
    };

    // If there was an old group, animate it out first
    if (ref.currentGroup) {
      gsap.to(ref.currentGroup.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: swapGeometry,
      });
    } else {
      swapGeometry();
    }
  }, [serviceId, step]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0"
      style={{ pointerEvents: "none" }}
    />
  );
}
