import { Monkey, Obstacle, BoundingBox } from '@/types/game';

/**
 * Gets the monkey's hitbox with an inset applied on all sides
 * The inset makes collision detection more forgiving for the player
 * 
 * @param monkey - The monkey entity
 * @param inset - The number of pixels to inset on all sides (default 4)
 * @returns Bounding box representing the monkey's collision hitbox
 */
export function getMonkeyHitbox(monkey: Monkey, inset: number = 4): BoundingBox {
  return {
    x: monkey.x + inset,
    y: monkey.y + inset,
    width: monkey.width - inset * 2,
    height: monkey.height - inset * 2,
  };
}

/**
 * Gets the hitboxes for an obstacle's top and bottom pipes
 * The gap between the pipes is where the monkey can safely pass
 * 
 * @param obstacle - The obstacle entity
 * @param canvasHeight - The height of the canvas
 * @returns Object containing bounding boxes for top and bottom pipes
 */
export function getObstacleHitboxes(
  obstacle: Obstacle,
  canvasHeight: number
): { top: BoundingBox; bottom: BoundingBox } {
  const gapHalfHeight = obstacle.gapHeight / 2;
  
  return {
    top: {
      x: obstacle.x,
      y: 0,
      width: obstacle.width,
      height: obstacle.gapY - gapHalfHeight,
    },
    bottom: {
      x: obstacle.x,
      y: obstacle.gapY + gapHalfHeight,
      width: obstacle.width,
      height: canvasHeight - (obstacle.gapY + gapHalfHeight),
    },
  };
}

/**
 * Checks if two axis-aligned bounding boxes (AABB) are colliding
 * Uses standard AABB collision detection algorithm
 * 
 * @param a - First bounding box
 * @param b - Second bounding box
 * @returns True if the boxes are overlapping, false otherwise
 */
export function checkAABBCollision(a: BoundingBox, b: BoundingBox): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/**
 * Checks if the monkey is colliding with any obstacles
 * Tests the monkey's hitbox against all obstacle pipes (top and bottom)
 * 
 * @param monkey - The monkey entity
 * @param obstacles - Array of obstacles to check against
 * @param canvasHeight - The height of the canvas
 * @param hitboxInset - The inset to apply to the monkey's hitbox (default 4)
 * @returns True if the monkey is colliding with any obstacle, false otherwise
 */
export function checkMonkeyObstacleCollision(
  monkey: Monkey,
  obstacles: Obstacle[],
  canvasHeight: number,
  hitboxInset: number = 4
): boolean {
  const monkeyHitbox = getMonkeyHitbox(monkey, hitboxInset);
  
  for (const obstacle of obstacles) {
    const { top, bottom } = getObstacleHitboxes(obstacle, canvasHeight);
    
    if (
      checkAABBCollision(monkeyHitbox, top) ||
      checkAABBCollision(monkeyHitbox, bottom)
    ) {
      return true;
    }
  }
  
  return false;
}
