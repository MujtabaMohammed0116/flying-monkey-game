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

  // Input handling
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

    const handleClick = () => {
      if (gameState === "start" || gameState === "intro") {
        handleStart();
      } else if (gameState === "playing") {
        handleFlap();
      } else if (gameState === "gameOver") {
        handleRestart();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClick);
    };
  }, [gameState, canvasSize.height]);

  // Handle canvas resize to fill viewport
  useEffect(() => {
    const updateCanvasSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setCanvasSize({ width, height });
    };

    // Set initial size
    updateCanvasSize();

    // Add resize listener
    window.addEventListener("resize", updateCanvasSize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
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

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get 2D context from canvas");
      return;
    }

    let animationFrameId: number;

    const gameLoop = () => {
      // Import utility functions
      const { applyGravity, clampVelocity, updatePosition, checkBoundaries } = require("@/utils/physics");
      const { moveObstacles, removeOffscreenObstacles, shouldGenerateObstacle, generateObstacle } = require("@/utils/obstacles");
      const { checkMonkeyObstacleCollision } = require("@/utils/collision");
      const { checkScoring, updateBestScore } = require("@/utils/scoring");
      const { moveCollectibles, removeOffscreenCollectibles, shouldGenerateCollectible, generateCollectible, checkCollectibleCollection } = require("@/utils/collectibles");

      // Clear canvas
      ctx.fillStyle = "#87CEEB"; // Sky blue background
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

      // Render obstacles
      ctx.fillStyle = "#228B22"; // Forest green for pipes
      updatedObstacles.forEach((obstacle) => {
        const gapHalfHeight = obstacle.gapHeight / 2;
        // Top pipe
        ctx.fillRect(
          obstacle.x,
          0,
          obstacle.width,
          obstacle.gapY - gapHalfHeight
        );
        // Bottom pipe
        ctx.fillRect(
          obstacle.x,
          obstacle.gapY + gapHalfHeight,
          obstacle.width,
          canvasSize.height - (obstacle.gapY + gapHalfHeight)
        );
      });

      // Render collectibles (milk bottles)
      ctx.font = "30px Arial";
      updatedCollectibles.forEach((collectible) => {
        ctx.fillText(
          "🍼",
          collectible.x,
          collectible.y + collectible.height
        );
      });

      // Render monkey with emoji
      ctx.font = "40px Arial";
      ctx.fillText(
        "🐵",
        updatedMonkey.x,
        updatedMonkey.y + updatedMonkey.height
      );

      // Render HUD (score)
      ctx.fillStyle = "#000000";
      ctx.font = "bold 32px Arial";
      ctx.textAlign = "right";
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
    <div className="relative w-full h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="block"
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
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white">
          <div className="text-5xl mb-6">🐵</div>
          <p className="text-3xl text-center px-8 leading-relaxed">
            Hi I'm a naughty monkey and i like to jump and fly!
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
