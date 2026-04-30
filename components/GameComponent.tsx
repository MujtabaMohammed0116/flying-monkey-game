"use client";

import { useEffect, useRef, useState } from "react";
import { GameState, Monkey, Obstacle, Collectible, GAME_CONFIG } from "@/types/game";

// ─── Draw a fully custom monkey ───────────────────────────────────────────────
function drawMonkey(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  velocityY: number
) {
  const cx = x + width / 2;
  const cy = y + height / 2;
  const scale = width / 40; // base size 40px

  ctx.save();
  ctx.translate(cx, cy);

  // Tilt monkey slightly based on velocity (feels alive)
  const tilt = Math.max(-0.3, Math.min(0.3, velocityY * 0.04));
  ctx.rotate(tilt);

  // ── Tail (behind body) ──
  ctx.strokeStyle = "#7a4a1e";
  ctx.lineWidth = 3 * scale;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(8 * scale, 4 * scale);
  ctx.bezierCurveTo(18 * scale, 0, 18 * scale, -12 * scale, 10 * scale, -14 * scale);
  ctx.stroke();

  // ── Body ──
  const bodyGrad = ctx.createRadialGradient(-2 * scale, 0, 1, 0, 0, 12 * scale);
  bodyGrad.addColorStop(0, "#c8813a");
  bodyGrad.addColorStop(1, "#8b4513");
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(0, 4 * scale, 9 * scale, 11 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── Belly (lighter patch) ──
  ctx.fillStyle = "#e8b87a";
  ctx.beginPath();
  ctx.ellipse(0, 5 * scale, 5 * scale, 7 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── Left arm (raised, holding rope) ──
  ctx.strokeStyle = "#8b4513";
  ctx.lineWidth = 4 * scale;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-6 * scale, -2 * scale);
  ctx.quadraticCurveTo(-14 * scale, -10 * scale, -10 * scale, -16 * scale);
  ctx.stroke();

  // ── Right arm (raised, holding rope) ──
  ctx.beginPath();
  ctx.moveTo(6 * scale, -2 * scale);
  ctx.quadraticCurveTo(14 * scale, -10 * scale, 10 * scale, -16 * scale);
  ctx.stroke();

  // ── Left hand ──
  ctx.fillStyle = "#c8813a";
  ctx.beginPath();
  ctx.arc(-10 * scale, -16 * scale, 3 * scale, 0, Math.PI * 2);
  ctx.fill();

  // ── Right hand ──
  ctx.beginPath();
  ctx.arc(10 * scale, -16 * scale, 3 * scale, 0, Math.PI * 2);
  ctx.fill();

  // ── Left leg ──
  ctx.strokeStyle = "#8b4513";
  ctx.lineWidth = 4 * scale;
  ctx.beginPath();
  ctx.moveTo(-5 * scale, 13 * scale);
  ctx.quadraticCurveTo(-10 * scale, 18 * scale, -7 * scale, 22 * scale);
  ctx.stroke();

  // ── Right leg ──
  ctx.beginPath();
  ctx.moveTo(5 * scale, 13 * scale);
  ctx.quadraticCurveTo(10 * scale, 18 * scale, 7 * scale, 22 * scale);
  ctx.stroke();

  // ── Left foot ──
  ctx.fillStyle = "#8b4513";
  ctx.beginPath();
  ctx.ellipse(-7 * scale, 23 * scale, 4 * scale, 2.5 * scale, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // ── Right foot ──
  ctx.beginPath();
  ctx.ellipse(7 * scale, 23 * scale, 4 * scale, 2.5 * scale, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // ── Head ──
  const headGrad = ctx.createRadialGradient(-3 * scale, -22 * scale, 1, 0, -20 * scale, 11 * scale);
  headGrad.addColorStop(0, "#d4924a");
  headGrad.addColorStop(1, "#8b4513");
  ctx.fillStyle = headGrad;
  ctx.beginPath();
  ctx.arc(0, -20 * scale, 11 * scale, 0, Math.PI * 2);
  ctx.fill();

  // ── Ears ──
  ctx.fillStyle = "#8b4513";
  ctx.beginPath();
  ctx.arc(-11 * scale, -22 * scale, 4 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(11 * scale, -22 * scale, 4 * scale, 0, Math.PI * 2);
  ctx.fill();
  // Inner ear
  ctx.fillStyle = "#e8a0a0";
  ctx.beginPath();
  ctx.arc(-11 * scale, -22 * scale, 2 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(11 * scale, -22 * scale, 2 * scale, 0, Math.PI * 2);
  ctx.fill();

  // ── Face (muzzle) ──
  ctx.fillStyle = "#e8b87a";
  ctx.beginPath();
  ctx.ellipse(0, -17 * scale, 6 * scale, 5 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── Eyes ──
  ctx.fillStyle = "#1a0a00";
  ctx.beginPath();
  ctx.arc(-4 * scale, -22 * scale, 2 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(4 * scale, -22 * scale, 2 * scale, 0, Math.PI * 2);
  ctx.fill();
  // Eye shine
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(-3 * scale, -23 * scale, 0.8 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(5 * scale, -23 * scale, 0.8 * scale, 0, Math.PI * 2);
  ctx.fill();

  // ── Nose ──
  ctx.fillStyle = "#5a2d0c";
  ctx.beginPath();
  ctx.arc(-1.5 * scale, -16 * scale, 1.2 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(1.5 * scale, -16 * scale, 1.2 * scale, 0, Math.PI * 2);
  ctx.fill();

  // ── Smile ──
  ctx.strokeStyle = "#5a2d0c";
  ctx.lineWidth = 1.2 * scale;
  ctx.beginPath();
  ctx.arc(0, -15 * scale, 3 * scale, 0.2, Math.PI - 0.2);
  ctx.stroke();

  ctx.restore();
}

// ─── Draw rope attached to monkey's hands ─────────────────────────────────────
function drawRope(
  ctx: CanvasRenderingContext2D,
  monkeyX: number,
  monkeyY: number,
  monkeyWidth: number,
  velocityY: number
) {
  const scale = monkeyWidth / 40;
  const cx = monkeyX + monkeyWidth / 2;
  const cy = monkeyY + monkeyWidth / 2;
  const tilt = Math.max(-0.3, Math.min(0.3, velocityY * 0.04));

  // Hand positions (matching drawMonkey's hand coords, rotated by tilt)
  const lhLocalX = -10 * scale;
  const lhLocalY = -16 * scale;
  const rhLocalX = 10 * scale;
  const rhLocalY = -16 * scale;

  const cos = Math.cos(tilt);
  const sin = Math.sin(tilt);

  const lhX = cx + lhLocalX * cos - lhLocalY * sin;
  const lhY = cy + lhLocalX * sin + lhLocalY * cos;
  const rhX = cx + rhLocalX * cos - rhLocalY * sin;
  const rhY = cy + rhLocalX * sin + rhLocalY * cos;

  // Rope swing offset based on velocity
  const swing = velocityY * 1.5;

  // Draw rope from top of screen to each hand
  ctx.lineWidth = 3;
  ctx.lineCap = "round";

  // Left rope strand
  const ropeGrad = ctx.createLinearGradient(lhX + swing, 0, lhX, lhY);
  ropeGrad.addColorStop(0, "#a0784a");
  ropeGrad.addColorStop(1, "#6b4c2a");
  ctx.strokeStyle = ropeGrad;
  ctx.beginPath();
  ctx.moveTo(lhX + swing, 0);
  ctx.quadraticCurveTo(lhX + swing * 0.5, lhY * 0.5, lhX, lhY);
  ctx.stroke();

  // Right rope strand
  const ropeGrad2 = ctx.createLinearGradient(rhX + swing, 0, rhX, rhY);
  ropeGrad2.addColorStop(0, "#a0784a");
  ropeGrad2.addColorStop(1, "#6b4c2a");
  ctx.strokeStyle = ropeGrad2;
  ctx.beginPath();
  ctx.moveTo(rhX + swing, 0);
  ctx.quadraticCurveTo(rhX + swing * 0.5, rhY * 0.5, rhX, rhY);
  ctx.stroke();

  // Rope knot dots for texture
  ctx.fillStyle = "#5a3a1a";
  for (let t = 0.2; t < 1; t += 0.25) {
    const kx = lhX + swing + (lhX - lhX - swing) * t + swing * (1 - t);
    const ky = lhY * t;
    ctx.beginPath();
    ctx.arc(kx, ky, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ─── Draw rich jungle background ──────────────────────────────────────────────
function drawJungleBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frameCount: number
) {
  // Sky gradient (deep jungle canopy)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, "#0a1f0a");
  skyGrad.addColorStop(0.3, "#1a3d0f");
  skyGrad.addColorStop(0.7, "#2d5a1b");
  skyGrad.addColorStop(1, "#1a3d0f");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // ── Far background trees (parallax layer 1 - slowest) ──
  const bgOffset = (frameCount * 0.3) % width;
  ctx.fillStyle = "#1a4a0a";
  for (let i = -1; i < 3; i++) {
    const tx = i * (width / 2) - bgOffset + 40;
    // Tree trunk
    ctx.fillStyle = "#2d1a0a";
    ctx.fillRect(tx - 8, height * 0.4, 16, height * 0.6);
    // Tree canopy layers
    ctx.fillStyle = "#1a4a0a";
    ctx.beginPath();
    ctx.arc(tx, height * 0.35, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1f5c0d";
    ctx.beginPath();
    ctx.arc(tx - 20, height * 0.28, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(tx + 25, height * 0.3, 50, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Mid background trees (parallax layer 2) ──
  const midOffset = (frameCount * 0.8) % width;
  for (let i = -1; i < 4; i++) {
    const tx = i * (width / 3) - midOffset + 80;
    ctx.fillStyle = "#1a3d08";
    ctx.fillRect(tx - 6, height * 0.5, 12, height * 0.5);
    ctx.fillStyle = "#245c10";
    ctx.beginPath();
    ctx.arc(tx, height * 0.45, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2d7014";
    ctx.beginPath();
    ctx.arc(tx + 15, height * 0.38, 35, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Hanging vines (background) ──
  const vineOffset = (frameCount * 0.5) % (width / 2);
  ctx.strokeStyle = "#2d5a1b";
  ctx.lineWidth = 3;
  for (let i = 0; i < 6; i++) {
    const vx = (i * width / 5) - vineOffset + 30;
    const sway = Math.sin(frameCount * 0.02 + i) * 8;
    ctx.beginPath();
    ctx.moveTo(vx, 0);
    ctx.bezierCurveTo(
      vx + sway, height * 0.3,
      vx - sway, height * 0.6,
      vx + sway * 0.5, height * 0.85
    );
    ctx.stroke();
    // Vine leaves
    ctx.fillStyle = "#3a7a1a";
    for (let j = 0.2; j < 0.9; j += 0.2) {
      const lx = vx + sway * j * 2;
      const ly = height * j;
      ctx.beginPath();
      ctx.ellipse(lx + 8, ly, 10, 5, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(lx - 8, ly + 10, 10, 5, -0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ── Ground foliage ──
  const groundGrad = ctx.createLinearGradient(0, height * 0.85, 0, height);
  groundGrad.addColorStop(0, "#1a3d08");
  groundGrad.addColorStop(1, "#0d2004");
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, height * 0.88, width, height * 0.12);

  // Ground bushes
  const bushOffset = (frameCount * 1.5) % (width / 3);
  for (let i = -1; i < 5; i++) {
    const bx = i * (width / 3) - bushOffset + 50;
    ctx.fillStyle = "#245c10";
    ctx.beginPath();
    ctx.arc(bx, height * 0.9, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2d7014";
    ctx.beginPath();
    ctx.arc(bx + 20, height * 0.88, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1f5c0d";
    ctx.beginPath();
    ctx.arc(bx - 15, height * 0.91, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Foreground large leaves (closest layer) ──
  const leafOffset = (frameCount * 2) % (width / 2);
  ctx.fillStyle = "#1a5c08";
  for (let i = -1; i < 4; i++) {
    const lx = i * (width / 2.5) - leafOffset;
    // Top leaves
    ctx.save();
    ctx.translate(lx, -10);
    ctx.rotate(0.3);
    ctx.fillStyle = "#1a5c08";
    ctx.beginPath();
    ctx.ellipse(0, 40, 18, 55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#245c10";
    ctx.beginPath();
    ctx.ellipse(0, 40, 8, 50, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Bottom leaves
    ctx.save();
    ctx.translate(lx + 60, height + 10);
    ctx.rotate(-0.4);
    ctx.fillStyle = "#1a5c08";
    ctx.beginPath();
    ctx.ellipse(0, -40, 18, 55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ── Atmospheric light rays ──
  ctx.save();
  ctx.globalAlpha = 0.04;
  for (let i = 0; i < 5; i++) {
    const rx = (i * width / 4) + Math.sin(frameCount * 0.01 + i) * 20;
    const rayGrad = ctx.createLinearGradient(rx, 0, rx + 40, height);
    rayGrad.addColorStop(0, "#90ff60");
    rayGrad.addColorStop(1, "transparent");
    ctx.fillStyle = rayGrad;
    ctx.beginPath();
    ctx.moveTo(rx, 0);
    ctx.lineTo(rx + 60, 0);
    ctx.lineTo(rx + 100, height);
    ctx.lineTo(rx + 40, height);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

// ─── Draw wooden branch obstacle ──────────────────────────────────────────────
function drawBranch(
  ctx: CanvasRenderingContext2D,
  x: number,
  topHeight: number,
  bottomY: number,
  bottomHeight: number,
  width: number
) {
  // Main wood gradient
  const woodGrad = ctx.createLinearGradient(x, 0, x + width, 0);
  woodGrad.addColorStop(0, "#3d2010");
  woodGrad.addColorStop(0.3, "#7a4a1e");
  woodGrad.addColorStop(0.7, "#654321");
  woodGrad.addColorStop(1, "#3d2010");

  // Top branch
  ctx.fillStyle = woodGrad;
  ctx.beginPath();
  ctx.roundRect(x, 0, width, topHeight, [0, 0, 8, 8]);
  ctx.fill();

  // Bottom branch
  ctx.beginPath();
  ctx.roundRect(x, bottomY, width, bottomHeight, [8, 8, 0, 0]);
  ctx.fill();

  // Wood grain lines - top
  ctx.strokeStyle = "rgba(0,0,0,0.2)";
  ctx.lineWidth = 1;
  for (let i = 15; i < topHeight; i += 18) {
    ctx.beginPath();
    ctx.moveTo(x + 4, i);
    ctx.bezierCurveTo(x + width * 0.3, i + 2, x + width * 0.7, i - 2, x + width - 4, i);
    ctx.stroke();
  }

  // Wood grain lines - bottom
  for (let i = bottomY + 15; i < bottomY + bottomHeight; i += 18) {
    ctx.beginPath();
    ctx.moveTo(x + 4, i);
    ctx.bezierCurveTo(x + width * 0.3, i + 2, x + width * 0.7, i - 2, x + width - 4, i);
    ctx.stroke();
  }

  // Highlight edge
  ctx.strokeStyle = "rgba(255,200,100,0.15)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 3, 0);
  ctx.lineTo(x + 3, topHeight);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 3, bottomY);
  ctx.lineTo(x + 3, bottomY + bottomHeight);
  ctx.stroke();

  // Branch tip knot (top)
  ctx.fillStyle = "#2d1a08";
  ctx.beginPath();
  ctx.ellipse(x + width / 2, topHeight - 6, width * 0.35, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Branch tip knot (bottom)
  ctx.beginPath();
  ctx.ellipse(x + width / 2, bottomY + 6, width * 0.35, 6, 0, 0, Math.PI * 2);
  ctx.fill();
}

// ─── Draw banana collectible ───────────────────────────────────────────────────
function drawBanana(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  frameCount: number
) {
  const bob = Math.sin(frameCount * 0.08) * 3; // gentle bobbing
  ctx.save();
  ctx.translate(x + size / 2, y + size / 2 + bob);

  // Glow effect
  ctx.shadowColor = "#ffdd00";
  ctx.shadowBlur = 12;

  // Banana body
  ctx.strokeStyle = "#c8a000";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.4, Math.PI * 1.1, Math.PI * 0.1, false);
  ctx.stroke();

  // Banana fill
  ctx.strokeStyle = "#ffe135";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.4, Math.PI * 1.1, Math.PI * 0.1, false);
  ctx.stroke();

  // Stem
  ctx.strokeStyle = "#8b6914";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(size * 0.35, -size * 0.15);
  ctx.lineTo(size * 0.2, -size * 0.4);
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.restore();
}

export default function GameComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const [gameState, setGameState] = useState<GameState>("start");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [monkey, setMonkey] = useState<Monkey>({
    x: GAME_CONFIG.MONKEY_START_X,
    y: 0,
    velocityY: 0,
    width: GAME_CONFIG.MONKEY_WIDTH,
    height: GAME_CONFIG.MONKEY_HEIGHT,
  });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [frameCount, setFrameCount] = useState(0);

  const handleFlap = () => {
    if (gameState === "playing") {
      const { applyFlap } = require("@/utils/physics");
      setMonkey((prev) => applyFlap(prev, GAME_CONFIG.FLAP_VELOCITY));
    }
  };

  const handleStart = () => {
    if (gameState === "start") {
      setGameState("intro");
      setTimeout(() => setGameState("playing"), 3000);
    } else if (gameState === "intro") {
      setGameState("playing");
    }
  };

  const handleRestart = () => {
    if (gameState === "gameOver") {
      setScore(0);
      setObstacles([]);
      setCollectibles([]);
      setMonkey({
        x: GAME_CONFIG.MONKEY_START_X,
        y: canvasSize.height / 2,
        velocityY: 0,
        width: GAME_CONFIG.MONKEY_WIDTH,
        height: GAME_CONFIG.MONKEY_HEIGHT,
      });
      setFrameCount(0);
      setGameState("playing");
    }
  };

  // Input handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (gameState === "start" || gameState === "intro") handleStart();
        else if (gameState === "playing") handleFlap();
        else if (gameState === "gameOver") handleRestart();
      }
    };
    const handleClick = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if (gameState === "start" || gameState === "intro") handleStart();
      else if (gameState === "playing") handleFlap();
      else if (gameState === "gameOver") handleRestart();
    };
    const preventDefaultTouch = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleClick);
    window.addEventListener("touchstart", handleClick, { passive: false });
    document.addEventListener("touchmove", preventDefaultTouch, { passive: false });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchstart", handleClick);
      document.removeEventListener("touchmove", preventDefaultTouch);
    };
  }, [gameState, canvasSize.height]);

  // Canvas resize
  useEffect(() => {
    const updateCanvasSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setCanvasSize({ width, height });
      document.documentElement.style.setProperty("--vh", `${height * 0.01}px`);
    };
    updateCanvasSize();
    let resizeTimeout: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateCanvasSize, 100);
    };
    window.addEventListener("resize", debouncedResize);
    window.addEventListener("orientationchange", updateCanvasSize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      window.removeEventListener("orientationchange", updateCanvasSize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Set initial monkey Y
  useEffect(() => {
    if (canvasSize.height > 0) {
      setMonkey((prev) => ({ ...prev, y: canvasSize.height / 2 }));
    }
  }, [canvasSize.height]);

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvasSize.width === 0 || canvasSize.height === 0) return;

    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Render non-playing states (so monkey is visible immediately)
    if (gameState !== "playing") {
      drawJungleBackground(ctx, canvasSize.width, canvasSize.height, frameCount);
      if (monkey.y > 0) {
        drawRope(ctx, monkey.x, monkey.y, monkey.width, monkey.velocityY);
        drawMonkey(ctx, monkey.x, monkey.y, monkey.width, monkey.height, monkey.velocityY);
      }
      return;
    }

    let animationFrameId: number;

    const gameLoop = () => {
      const { applyGravity, clampVelocity, updatePosition, checkBoundaries } = require("@/utils/physics");
      const { moveObstacles, removeOffscreenObstacles, shouldGenerateObstacle, generateObstacle } = require("@/utils/obstacles");
      const { checkMonkeyObstacleCollision } = require("@/utils/collision");
      const { checkScoring, updateBestScore } = require("@/utils/scoring");
      const { moveCollectibles, removeOffscreenCollectibles, shouldGenerateCollectible, generateCollectible, checkCollectibleCollection } = require("@/utils/collectibles");

      const newFrameCount = frameCount + 1;

      // ── Background ──
      drawJungleBackground(ctx, canvasSize.width, canvasSize.height, newFrameCount);

      // ── Physics ──
      let updatedMonkey = applyGravity(monkey, GAME_CONFIG.GRAVITY);
      updatedMonkey = clampVelocity(updatedMonkey, GAME_CONFIG.MAX_FALL_VELOCITY);
      updatedMonkey = updatePosition(updatedMonkey);
      const { monkey: boundaryCheckedMonkey, hitBottom } = checkBoundaries(updatedMonkey, canvasSize.height);
      updatedMonkey = boundaryCheckedMonkey;

      // ── Obstacles ──
      let updatedObstacles = moveObstacles(obstacles);
      updatedObstacles = removeOffscreenObstacles(updatedObstacles);
      if (shouldGenerateObstacle(newFrameCount)) {
        updatedObstacles = [...updatedObstacles, generateObstacle(canvasSize.width, canvasSize.height)];
      }

      // ── Collectibles ──
      let updatedCollectibles = moveCollectibles(collectibles);
      updatedCollectibles = removeOffscreenCollectibles(updatedCollectibles);
      if (shouldGenerateCollectible(newFrameCount)) {
        updatedCollectibles = [...updatedCollectibles, generateCollectible(canvasSize.width, canvasSize.height)];
      }
      const { collectibles: afterCollectionCollectibles, bonusPoints } = checkCollectibleCollection(
        updatedMonkey.x, updatedMonkey.y, updatedMonkey.width, updatedMonkey.height, updatedCollectibles
      );
      updatedCollectibles = afterCollectionCollectibles;

      // ── Collision & Scoring ──
      const hasCollision = checkMonkeyObstacleCollision(updatedMonkey, updatedObstacles, canvasSize.height, GAME_CONFIG.MONKEY_HITBOX_INSET);
      const { obstacles: scoredObstacles, scoreIncrement } = checkScoring(updatedMonkey, updatedObstacles);
      updatedObstacles = scoredObstacles;

      if (scoreIncrement > 0) { const { playPassSound } = require("@/utils/sounds"); playPassSound(); }
      if (bonusPoints > 0) { const { playCollectSound } = require("@/utils/sounds"); playCollectSound(); }

      const newScore = score + scoreIncrement + bonusPoints;

      // ── Render obstacles ──
      updatedObstacles.forEach((obstacle: Obstacle) => {
        const gapHalfHeight = obstacle.gapHeight / 2;
        const topHeight = obstacle.gapY - gapHalfHeight;
        const bottomY = obstacle.gapY + gapHalfHeight;
        const bottomHeight = canvasSize.height - bottomY;
        drawBranch(ctx, obstacle.x, topHeight, bottomY, bottomHeight, obstacle.width);
      });

      // ── Render collectibles ──
      updatedCollectibles.forEach((collectible: Collectible) => {
        drawBanana(ctx, collectible.x, collectible.y, collectible.width, newFrameCount);
      });

      // ── Render rope then monkey ──
      drawRope(ctx, updatedMonkey.x, updatedMonkey.y, updatedMonkey.width, updatedMonkey.velocityY);
      drawMonkey(ctx, updatedMonkey.x, updatedMonkey.y, updatedMonkey.width, updatedMonkey.height, updatedMonkey.velocityY);

      // ── HUD ──
      ctx.save();
      ctx.font = "bold 28px Arial";
      ctx.textAlign = "right";
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(0,0,0,0.8)";
      ctx.strokeText(`Score: ${newScore}`, canvasSize.width - 20, 50);
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`Score: ${newScore}`, canvasSize.width - 20, 50);
      ctx.restore();

      // ── Game over ──
      if (hasCollision || hitBottom) {
        const { playGameOverSound } = require("@/utils/sounds");
        playGameOverSound();
        setGameState("gameOver");
        setBestScore(updateBestScore(newScore, bestScore));
        setScore(newScore);
        setMonkey(updatedMonkey);
        setObstacles(updatedObstacles);
        setCollectibles(updatedCollectibles);
        setFrameCount(newFrameCount);
        return;
      }

      setMonkey(updatedMonkey);
      setObstacles(updatedObstacles);
      setCollectibles(updatedCollectibles);
      setScore(newScore);
      setFrameCount(newFrameCount);

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, monkey, obstacles, collectibles, score, bestScore, frameCount, canvasSize]);

  return (
    <div
      className="relative w-full h-screen overflow-hidden touch-none"
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        touchAction: "none",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="block"
        style={{ touchAction: "none", WebkitTapHighlightColor: "transparent" }}
      />

      {/* Start screen */}
      {gameState === "start" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 text-white">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">🌿 Flying Monkey 🌿</h1>
          <p className="text-xl opacity-80">Tap or Press Space to Start</p>
        </div>
      )}

      {/* Intro screen */}
      {gameState === "intro" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-green-950 to-green-900 bg-opacity-90 text-white">
          <p className="text-2xl text-center px-8 leading-relaxed font-semibold drop-shadow">
            Hi! I&apos;m a naughty monkey and I like to jump and fly!
          </p>
          <p className="text-base mt-6 opacity-60">Tap to continue</p>
        </div>
      )}

      {/* Game over screen */}
      {gameState === "gameOver" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-65 text-white">
          <h2 className="text-5xl font-bold mb-4 drop-shadow-lg">Game Over</h2>
          <p className="text-3xl mb-2">Score: {score}</p>
          <p className="text-xl mb-8 opacity-75">Best: {bestScore}</p>
          <p className="text-lg opacity-80">Tap or Press Space to Play Again</p>
        </div>
      )}
    </div>
  );
}
