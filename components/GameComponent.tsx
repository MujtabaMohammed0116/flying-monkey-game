"use client";

import { useEffect, useRef, useState } from "react";
import { GameState, Monkey, Obstacle, Collectible, GAME_CONFIG } from "@/types/game";

export default function GameComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Game state management
  const [gameState, setGameState] = useState<GameState>("start");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [monkey, setMonkey] = useState<Monkey>({
    x: GAME_CONFIG.MONKEY_START_X,
    y: 0, // Will be set to canvasHeight/2 when canvas is ready
    velocityY: 0,
    width: GAME_CONFIG.MONKEY_WIDTH,
    height: GAME_CONFIG.MONKEY_HEIGHT,
  });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [frameCount, setFrameCount] = useState(0);

  // Handle flap action
  const handleFlap = () => {
    if (gameState === "playing") {
      const { applyFlap } = require("@/utils/physics");
      setMonkey((prev) => applyFlap(prev, GAME_CONFIG.FLAP_VELOCITY));
    }
  };

  // Handle game start
  const handleStart = () => {
    if (gameState === "start") {
      setGameState("intro");
      // Auto-dismiss intro after 3 seconds
      setTimeout(() => {
        setGameState("playing");
      }, 3000);
    } else if (gameState === "intro") {
      // Allow manual dismissal
      setGameState("playing");
    }
  };

  // Handle game restart
  const handleRestart = () => {
    if (gameState === "gameOver") {
      // Reset all game state
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

  // Input handling with mobile optimization
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (gameState === "start" || gameState === "intro") {
          handleStart();
        } else if (gameState === "playing") {
          handleFlap();
        } else if (gameState === "gameOver") {
          handleRestart();
        }
      }
    };

    const handleClick = (e: MouseEvent | TouchEvent) => {
      e.preventDefault(); // Prevent default touch behavior
      if (gameState === "start" || gameState === "intro") {
        handleStart();
      } else if (gameState === "playing") {
        handleFlap();
      } else if (gameState === "gameOver") {
        handleRestart();
      }
    };

    // Add both mouse and touch events for better mobile support
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleClick);
    window.addEventListener("touchstart", handleClick, { passive: false });

    // Prevent pull-to-refresh and other mobile gestures
    const preventDefaultTouch = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    document.addEventListener("touchmove", preventDefaultTouch, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchstart", handleClick);
      document.removeEventListener("touchmove", preventDefaultTouch);
    };
  }, [gameState, canvasSize.height]);

  // Handle canvas resize to fill viewport with mobile optimization
  useEffect(() => {
    const updateCanvasSize = () => {
      // Use window.innerWidth/Height for better mobile support
      const width = window.innerWidth;
      const height = window.innerHeight;
      setCanvasSize({ width, height });
      
      // Prevent mobile browser UI from interfering
      if (typeof window !== 'undefined') {
        // Set viewport height for mobile browsers
        document.documentElement.style.setProperty('--vh', `${height * 0.01}px`);
      }
    };

    // Set initial size
    updateCanvasSize();

    // Add resize listener with debounce for performance
    let resizeTimeout: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateCanvasSize, 100);
    };

    window.addEventListener("resize", debouncedResize);
    window.addEventListener("orientationchange", updateCanvasSize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", debouncedResize);
      window.removeEventListener("orientationchange", updateCanvasSize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Initialize monkey position when canvas size is available
  useEffect(() => {
    if (canvasSize.height > 0) {
      setMonkey((prev) => ({
        ...prev,
        y: canvasSize.height / 2,
      }));
    }
  }, [canvasSize.height]);

  // Main game loop with requestAnimationFrame
  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: false, // Disable transparency for better performance
      desynchronized: true, // Reduce latency on mobile
    });
    if (!ctx) {
      console.error("Failed to get 2D context from canvas");
      return;
    }

    // Enable image smoothing for better emoji rendering on mobile
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    let animationFrameId: number;

    const gameLoop = () => {
      // Import utility functions
      const { applyGravity, clampVelocity, updatePosition, checkBoundaries } = require("@/utils/physics");
      const { moveObstacles, removeOffscreenObstacles, shouldGenerateObstacle, generateObstacle } = require("@/utils/obstacles");
      const { checkMonkeyObstacleCollision } = require("@/utils/collision");
      const { checkScoring, updateBestScore } = require("@/utils/scoring");
      const { moveCollectibles, removeOffscreenCollectibles, shouldGenerateCollectible, generateCollectible, checkCollectibleCollection } = require("@/utils/collectibles");

      // Clear canvas with jungle green background
      ctx.fillStyle = "#2d5016"; // Dark jungle green
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

      // Add lighter green gradient for depth
      const gradient = ctx.createLinearGradient(0, 0, 0, canvasSize.height);
      gradient.addColorStop(0, "#4a7c2c");
      gradient.addColorStop(1, "#2d5016");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

      // 1. Apply physics updates (gravity, velocity, position)
      let updatedMonkey = applyGravity(monkey, GAME_CONFIG.GRAVITY);
      updatedMonkey = clampVelocity(updatedMonkey, GAME_CONFIG.MAX_FALL_VELOCITY);
      updatedMonkey = updatePosition(updatedMonkey);

      // 2. Check boundaries
      const { monkey: boundaryCheckedMonkey, hitBottom } = checkBoundaries(
        updatedMonkey,
        canvasSize.height
      );
      updatedMonkey = boundaryCheckedMonkey;

      // 3. Update obstacles (move and remove offscreen)
      let updatedObstacles = moveObstacles(obstacles);
      updatedObstacles = removeOffscreenObstacles(updatedObstacles);

      // 4. Generate new obstacles
      const newFrameCount = frameCount + 1;
      if (shouldGenerateObstacle(newFrameCount)) {
        const newObstacle = generateObstacle(canvasSize.width, canvasSize.height);
        updatedObstacles = [...updatedObstacles, newObstacle];
      }

      // 5. Update collectibles (move and remove offscreen)
      let updatedCollectibles = moveCollectibles(collectibles);
      updatedCollectibles = removeOffscreenCollectibles(updatedCollectibles);

      // 6. Generate new collectibles
      if (shouldGenerateCollectible(newFrameCount)) {
        const newCollectible = generateCollectible(canvasSize.width, canvasSize.height);
        updatedCollectibles = [...updatedCollectibles, newCollectible];
      }

      // 7. Check collectible collection
      const { collectibles: afterCollectionCollectibles, bonusPoints } = checkCollectibleCollection(
        updatedMonkey.x,
        updatedMonkey.y,
        updatedMonkey.width,
        updatedMonkey.height,
        updatedCollectibles
      );
      updatedCollectibles = afterCollectionCollectibles;

      // 8. Check collision detection
      const hasCollision = checkMonkeyObstacleCollision(
        updatedMonkey,
        updatedObstacles,
        canvasSize.height,
        GAME_CONFIG.MONKEY_HITBOX_INSET
      );

      // 9. Check scoring
      const { obstacles: scoredObstacles, scoreIncrement } = checkScoring(
        updatedMonkey,
        updatedObstacles
      );
      updatedObstacles = scoredObstacles;

      // Play sound when passing obstacle
      if (scoreIncrement > 0) {
        const { playPassSound } = require("@/utils/sounds");
        playPassSound();
      }

      // Play sound when collecting bonus
      if (bonusPoints > 0) {
        const { playCollectSound } = require("@/utils/sounds");
        playCollectSound();
      }

      const newScore = score + scoreIncrement + bonusPoints;

      // Render obstacles as wooden branches
      updatedObstacles.forEach((obstacle: Obstacle) => {
        const gapHalfHeight = obstacle.gapHeight / 2;
        
        // Draw wooden texture for branches
        ctx.fillStyle = "#654321"; // Brown wood color
        ctx.strokeStyle = "#3d2817"; // Darker brown for outline
        ctx.lineWidth = 3;
        
        // Top branch
        ctx.fillRect(
          obstacle.x,
          0,
          obstacle.width,
          obstacle.gapY - gapHalfHeight
        );
        ctx.strokeRect(
          obstacle.x,
          0,
          obstacle.width,
          obstacle.gapY - gapHalfHeight
        );
        
        // Add wood grain lines to top branch
        ctx.strokeStyle = "#8b6914";
        ctx.lineWidth = 1;
        for (let i = 10; i < obstacle.gapY - gapHalfHeight; i += 20) {
          ctx.beginPath();
          ctx.moveTo(obstacle.x, i);
          ctx.lineTo(obstacle.x + obstacle.width, i);
          ctx.stroke();
        }
        
        // Bottom branch
        ctx.fillStyle = "#654321";
        ctx.strokeStyle = "#3d2817";
        ctx.lineWidth = 3;
        ctx.fillRect(
          obstacle.x,
          obstacle.gapY + gapHalfHeight,
          obstacle.width,
          canvasSize.height - (obstacle.gapY + gapHalfHeight)
        );
        ctx.strokeRect(
          obstacle.x,
          obstacle.gapY + gapHalfHeight,
          obstacle.width,
          canvasSize.height - (obstacle.gapY + gapHalfHeight)
        );
        
        // Add wood grain lines to bottom branch
        ctx.strokeStyle = "#8b6914";
        ctx.lineWidth = 1;
        for (let i = obstacle.gapY + gapHalfHeight + 10; i < canvasSize.height; i += 20) {
          ctx.beginPath();
          ctx.moveTo(obstacle.x, i);
          ctx.lineTo(obstacle.x + obstacle.width, i);
          ctx.stroke();
        }
      });

      // Render collectibles (bananas)
      ctx.font = "30px Arial";
      updatedCollectibles.forEach((collectible: Collectible) => {
        ctx.fillText(
          "🍌",
          collectible.x,
          collectible.y + collectible.height
        );
      });

      // Render swinging rope/vine above monkey
      ctx.strokeStyle = "#8b7355"; // Brown rope color
      ctx.lineWidth = 2;
      ctx.beginPath();
      // Calculate rope swing based on monkey's velocity for dynamic effect
      const ropeSwing = updatedMonkey.velocityY * 2;
      const ropeStartX = updatedMonkey.x + updatedMonkey.width / 2 + ropeSwing;
      const ropeStartY = 0;
      const ropeEndX = updatedMonkey.x + updatedMonkey.width / 2;
      const ropeEndY = updatedMonkey.y;
      
      // Draw curved rope
      ctx.moveTo(ropeStartX, ropeStartY);
      ctx.quadraticCurveTo(
        ropeStartX + ropeSwing / 2,
        ropeEndY / 2,
        ropeEndX,
        ropeEndY
      );
      ctx.stroke();

      // Render monkey with emoji
      ctx.font = "40px Arial";
      ctx.fillText(
        "🐵",
        updatedMonkey.x,
        updatedMonkey.y + updatedMonkey.height
      );

      // Render HUD (score) with better visibility on jungle background
      ctx.fillStyle = "#ffffff"; // White text
      ctx.strokeStyle = "#000000"; // Black outline
      ctx.lineWidth = 3;
      ctx.font = "bold 32px Arial";
      ctx.textAlign = "right";
      // Draw text outline
      ctx.strokeText(`Score: ${newScore}`, canvasSize.width - 20, 50);
      // Draw text fill
      ctx.fillText(`Score: ${newScore}`, canvasSize.width - 20, 50);

      // 10. Trigger game over on collision or bottom boundary hit
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
        return; // Stop the game loop
      }

      // 11. Update state
      setMonkey(updatedMonkey);
      setObstacles(updatedObstacles);
      setCollectibles(updatedCollectibles);
      setScore(newScore);
      setFrameCount(newFrameCount);

      // Continue the loop
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    // Start the game loop
    animationFrameId = requestAnimationFrame(gameLoop);

    // Cleanup on unmount or when gameState changes
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, monkey, obstacles, collectibles, score, bestScore, frameCount, canvasSize]);

  return (
    <div 
      className="relative w-full h-screen overflow-hidden touch-none"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        touchAction: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="block"
        style={{
          touchAction: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      />
      
      {/* Start screen overlay */}
      {gameState === "start" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
          <h1 className="text-6xl font-bold mb-8">Flying Monkey</h1>
          <p className="text-2xl">Press Space or Click to Start</p>
        </div>
      )}
      
      {/* Intro message overlay */}
      {gameState === "intro" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-green-900 to-green-950 bg-opacity-90 text-white">
          <div className="text-5xl mb-6">🐵</div>
          <p className="text-3xl text-center px-8 leading-relaxed">
            Hi I&apos;m a naughty monkey and i like to jump and fly!
          </p>
          <p className="text-lg mt-8 opacity-75">Press Space or Click to continue</p>
        </div>
      )}
      
      {/* Game over screen overlay */}
      {gameState === "gameOver" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
          <h2 className="text-5xl font-bold mb-6">Game Over</h2>
          <p className="text-3xl mb-4">Score: {score}</p>
          <p className="text-2xl mb-8">Best Score: {bestScore}</p>
          <p className="text-xl">Press Space or Click to Play Again</p>
        </div>
      )}
    </div>
  );
}
