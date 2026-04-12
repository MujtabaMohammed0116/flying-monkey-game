import { Monkey, Obstacle } from '@/types/game';

/**
 * Checks if the monkey has passed any obstacles and updates scoring
 * Increments score when monkey's x position passes obstacle's right edge
 * Each obstacle can only score once (tracked by scored flag)
 * 
 * @param monkey - The monkey entity
 * @param obstacles - Array of obstacles to check
 * @returns Object with updated obstacles array and score increment
 */
export function checkScoring(
  monkey: Monkey,
  obstacles: Obstacle[]
): { obstacles: Obstacle[]; scoreIncrement: number } {
  let scoreIncrement = 0;
  
  const updatedObstacles = obstacles.map(obstacle => {
    // Check if monkey has passed the obstacle and it hasn't been scored yet
    if (!obstacle.scored && monkey.x > obstacle.x + obstacle.width) {
      scoreIncrement += 1;
      return { ...obstacle, scored: true };
    }
    return obstacle;
  });
  
  return { obstacles: updatedObstacles, scoreIncrement };
}

/**
 * Updates the best score if the current score is higher
 * Tracks the highest score achieved across game sessions
 * 
 * @param currentScore - The current game score
 * @param bestScore - The current best score
 * @returns The updated best score
 */
export function updateBestScore(currentScore: number, bestScore: number): number {
  return Math.max(currentScore, bestScore);
}
