import { Collectible, GAME_CONFIG } from "@/types/game";

/**
 * Generate a new collectible positioned between obstacles
 * Offset from obstacle spawn to appear in the gap
 */
export function generateCollectible(
  canvasWidth: number,
  canvasHeight: number
): Collectible {
  // Random vertical position in the safe flying zone (30% to 70% of canvas height)
  const minY = canvasHeight * 0.3;
  const maxY = canvasHeight * 0.7;
  const randomY = minY + Math.random() * (maxY - minY);

  // Position collectible between obstacles (offset by half the obstacle interval)
  const offsetX = canvasWidth + (GAME_CONFIG.OBSTACLE_INTERVAL * GAME_CONFIG.HORIZONTAL_SPEED) / 2;

  return {
    x: offsetX,
    y: randomY,
    width: GAME_CONFIG.COLLECTIBLE_WIDTH,
    height: GAME_CONFIG.COLLECTIBLE_HEIGHT,
    collected: false,
  };
}

/**
 * Move all collectibles horizontally to the left
 */
export function moveCollectibles(collectibles: Collectible[]): Collectible[] {
  return collectibles.map((collectible) => ({
    ...collectible,
    x: collectible.x - GAME_CONFIG.HORIZONTAL_SPEED,
  }));
}

/**
 * Remove collectibles that have moved offscreen
 */
export function removeOffscreenCollectibles(
  collectibles: Collectible[]
): Collectible[] {
  return collectibles.filter(
    (collectible) => collectible.x + collectible.width > 0
  );
}

/**
 * Check if a new collectible should be generated based on frame count
 */
export function shouldGenerateCollectible(frameCount: number): boolean {
  return frameCount % GAME_CONFIG.COLLECTIBLE_INTERVAL === 0;
}

/**
 * Check if monkey has collected any collectibles
 * Returns updated collectibles array and bonus points earned
 */
export function checkCollectibleCollection(
  monkeyX: number,
  monkeyY: number,
  monkeyWidth: number,
  monkeyHeight: number,
  collectibles: Collectible[]
): { collectibles: Collectible[]; bonusPoints: number } {
  let bonusPoints = 0;
  const updatedCollectibles: Collectible[] = [];

  for (const collectible of collectibles) {
    // Check AABB collision
    const collision =
      monkeyX < collectible.x + collectible.width &&
      monkeyX + monkeyWidth > collectible.x &&
      monkeyY < collectible.y + collectible.height &&
      monkeyY + monkeyHeight > collectible.y;

    if (collision && !collectible.collected) {
      // Collectible was collected - award bonus points and don't add to array
      bonusPoints += GAME_CONFIG.COLLECTIBLE_BONUS_POINTS;
    } else {
      // Keep collectible in array
      updatedCollectibles.push(collectible);
    }
  }

  return { collectibles: updatedCollectibles, bonusPoints };
}
