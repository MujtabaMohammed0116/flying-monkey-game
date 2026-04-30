// Game state type
export type GameState = 'start' | 'intro' | 'playing' | 'gameOver';

// Monkey entity interface
export interface Monkey {
  x: number;           // Horizontal position (fixed during gameplay)
  y: number;           // Vertical position
  velocityY: number;   // Vertical velocity (pixels per frame)
  width: number;       // Sprite width
  height: number;      // Sprite height
}

// Obstacle entity interface
export interface Obstacle {
  x: number;           // Horizontal position
  gapY: number;        // Vertical center of the gap
  gapHeight: number;   // Height of the passable gap (160px)
  width: number;       // Width of the obstacle pipes
  scored: boolean;     // Whether this obstacle has contributed to score
}

// Bounding box for collision detection
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Collectible entity interface
export interface Collectible {
  x: number;           // Horizontal position
  y: number;           // Vertical position
  width: number;       // Collectible width
  height: number;      // Collectible height
  collected: boolean;  // Whether this collectible has been collected
}

// Game configuration constants
export const GAME_CONFIG = {
  GRAVITY: 0.45,                   // slightly softer gravity for mobile feel
  FLAP_VELOCITY: -8,               // pixels per frame
  MAX_FALL_VELOCITY: 10,           // pixels per frame (reduced for more control)
  HORIZONTAL_SPEED: 2.5,           // pixels per frame (slower = more playable on mobile)
  OBSTACLE_INTERVAL: 100,          // frames (slightly more time between obstacles)
  GAP_HEIGHT: 200,                 // pixels (increased from 160 to match bigger monkey)
  MONKEY_WIDTH: 56,                // pixels (increased from 40)
  MONKEY_HEIGHT: 56,               // pixels (increased from 40)
  MONKEY_HITBOX_INSET: 12,         // pixels (larger inset for bigger monkey = fair hitbox)
  OBSTACLE_WIDTH: 65,              // pixels
  TARGET_FPS: 60,                  // frames per second
  MONKEY_START_X: 100,             // pixels from left
  GAP_MIN_POSITION: 0.2,           // 20% of canvas height
  GAP_MAX_POSITION: 0.8,           // 80% of canvas height
  COLLECTIBLE_INTERVAL: 270,       // frames
  COLLECTIBLE_WIDTH: 36,           // pixels (slightly bigger to match scale)
  COLLECTIBLE_HEIGHT: 36,          // pixels
  COLLECTIBLE_BONUS_POINTS: 5,     // bonus points per collectible
} as const;
