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
  GRAVITY: 0.5,                    // pixels per frame squared
  FLAP_VELOCITY: -8,               // pixels per frame
  MAX_FALL_VELOCITY: 12,           // pixels per frame
  HORIZONTAL_SPEED: 3,             // pixels per frame
  OBSTACLE_INTERVAL: 90,           // frames
  GAP_HEIGHT: 160,                 // pixels
  MONKEY_WIDTH: 40,                // pixels
  MONKEY_HEIGHT: 40,               // pixels
  MONKEY_HITBOX_INSET: 4,          // pixels
  OBSTACLE_WIDTH: 60,              // pixels
  TARGET_FPS: 60,                  // frames per second
  MONKEY_START_X: 100,             // pixels from left
  GAP_MIN_POSITION: 0.2,           // 20% of canvas height
  GAP_MAX_POSITION: 0.8,           // 80% of canvas height
  COLLECTIBLE_INTERVAL: 270,       // frames (3x the obstacle interval - less frequent)
  COLLECTIBLE_WIDTH: 30,           // pixels
  COLLECTIBLE_HEIGHT: 30,          // pixels
  COLLECTIBLE_BONUS_POINTS: 5,     // bonus points per collectible
} as const;
