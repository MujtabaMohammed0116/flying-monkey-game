import { Obstacle, GAME_CONFIG } from '@/types/game';

/**
 * Generates a new obstacle with a random gap position
 * Gap position is randomly placed between 20% and 80% of canvas height
 * 
 * @param canvasWidth - The width of the canvas
 * @param canvasHeight - The height of the canvas
 * @returns A new obstacle positioned at the right edge of the canvas
 */
export function generateObstacle(
  canvasWidth: number,
  canvasHeight: number
): Obstacle {
  // Random gap position between 20% and 80% of canvas height
  const minGapY = canvasHeight * GAME_CONFIG.GAP_MIN_POSITION;
  const maxGapY = canvasHeight * GAME_CONFIG.GAP_MAX_POSITION;
  const gapY = minGapY + Math.random() * (maxGapY - minGapY);

  return {
    x: canvasWidth,
    gapY,
    gapHeight: GAME_CONFIG.GAP_HEIGHT,
    width: GAME_CONFIG.OBSTACLE_WIDTH,
    scored: false,
  };
}

/**
 * Moves all obstacles left by the horizontal speed
 * Each obstacle moves 3 pixels per frame
 * 
 * @param obstacles - Array of obstacles to move
 * @returns Updated array with all obstacles moved left
 */
export function moveObstacles(obstacles: Obstacle[]): Obstacle[] {
  return obstacles.map(obstacle => ({
    ...obstacle,
    x: obstacle.x - GAME_CONFIG.HORIZONTAL_SPEED,
  }));
}

/**
 * Removes obstacles that have moved completely off the left side of the screen
 * An obstacle is offscreen when x + width < 0
 * 
 * @param obstacles - Array of obstacles to filter
 * @returns Filtered array with offscreen obstacles removed
 */
export function removeOffscreenObstacles(obstacles: Obstacle[]): Obstacle[] {
  return obstacles.filter(obstacle => obstacle.x + obstacle.width >= 0);
}

/**
 * Checks if a new obstacle should be generated based on the frame count
 * Obstacles are generated every 90 frames
 * 
 * @param frameCount - The current frame count
 * @returns True if a new obstacle should be generated
 */
export function shouldGenerateObstacle(frameCount: number): boolean {
  return frameCount % GAME_CONFIG.OBSTACLE_INTERVAL === 0;
}
