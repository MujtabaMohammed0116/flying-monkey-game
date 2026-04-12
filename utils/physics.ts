import { Monkey } from '@/types/game';

/**
 * Applies gravity to the monkey's vertical velocity
 * Increases velocityY by the gravity constant (0.5 pixels per frame)
 * 
 * @param monkey - The monkey entity
 * @param gravity - The gravity constant (default 0.5)
 * @returns Updated monkey with increased velocityY
 */
export function applyGravity(monkey: Monkey, gravity: number = 0.5): Monkey {
  return {
    ...monkey,
    velocityY: monkey.velocityY + gravity,
  };
}

/**
 * Applies a flap impulse to the monkey
 * Sets velocityY to the flap velocity constant (-8 pixels per frame)
 * 
 * @param monkey - The monkey entity
 * @param flapVelocity - The flap velocity constant (default -8)
 * @returns Updated monkey with flap velocity
 */
export function applyFlap(monkey: Monkey, flapVelocity: number = -8): Monkey {
  return {
    ...monkey,
    velocityY: flapVelocity,
  };
}

/**
 * Clamps the monkey's downward velocity to a maximum value
 * Prevents the monkey from falling too fast
 * 
 * @param monkey - The monkey entity
 * @param maxVelocity - The maximum downward velocity (default 12)
 * @returns Updated monkey with clamped velocity
 */
export function clampVelocity(monkey: Monkey, maxVelocity: number = 12): Monkey {
  return {
    ...monkey,
    velocityY: Math.min(monkey.velocityY, maxVelocity),
  };
}

/**
 * Updates the monkey's vertical position based on its velocity
 * 
 * @param monkey - The monkey entity
 * @returns Updated monkey with new position
 */
export function updatePosition(monkey: Monkey): Monkey {
  return {
    ...monkey,
    y: monkey.y + monkey.velocityY,
  };
}

/**
 * Checks and handles boundary collisions for the monkey
 * - Top boundary: clamps position to 0 and sets velocity to 0
 * - Bottom boundary: detects collision and returns hitBottom flag
 * 
 * @param monkey - The monkey entity
 * @param canvasHeight - The height of the canvas
 * @returns Object with updated monkey and hitBottom flag
 */
export function checkBoundaries(
  monkey: Monkey,
  canvasHeight: number
): { monkey: Monkey; hitBottom: boolean } {
  let updatedMonkey = { ...monkey };
  let hitBottom = false;

  // Check top boundary
  if (updatedMonkey.y < 0) {
    updatedMonkey.y = 0;
    updatedMonkey.velocityY = 0;
  }

  // Check bottom boundary
  if (updatedMonkey.y + updatedMonkey.height > canvasHeight) {
    hitBottom = true;
  }

  return { monkey: updatedMonkey, hitBottom };
}
