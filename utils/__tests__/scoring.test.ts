import { Monkey, Obstacle } from '@/types/game';
import { checkScoring, updateBestScore } from '../scoring';

describe('Scoring Utility Functions', () => {
  const createTestMonkey = (overrides?: Partial<Monkey>): Monkey => ({
    x: 100,
    y: 300,
    velocityY: 0,
    width: 40,
    height: 40,
    ...overrides,
  });

  const createTestObstacle = (overrides?: Partial<Obstacle>): Obstacle => ({
    x: 200,
    gapY: 300,
    gapHeight: 160,
    width: 60,
    scored: false,
    ...overrides,
  });

  describe('checkScoring', () => {
    it('should increment score when monkey passes an unscored obstacle', () => {
      const monkey = createTestMonkey({ x: 270 }); // Past obstacle at x=200, width=60
      const obstacles = [createTestObstacle({ x: 200, scored: false })];
      
      const result = checkScoring(monkey, obstacles);
      
      expect(result.scoreIncrement).toBe(1);
      expect(result.obstacles[0].scored).toBe(true);
    });

    it('should not increment score when monkey has not passed obstacle', () => {
      const monkey = createTestMonkey({ x: 100 }); // Before obstacle at x=200
      const obstacles = [createTestObstacle({ x: 200, scored: false })];
      
      const result = checkScoring(monkey, obstacles);
      
      expect(result.scoreIncrement).toBe(0);
      expect(result.obstacles[0].scored).toBe(false);
    });

    it('should not increment score for already scored obstacle', () => {
      const monkey = createTestMonkey({ x: 270 }); // Past obstacle
      const obstacles = [createTestObstacle({ x: 200, scored: true })];
      
      const result = checkScoring(monkey, obstacles);
      
      expect(result.scoreIncrement).toBe(0);
      expect(result.obstacles[0].scored).toBe(true);
    });

    it('should handle multiple obstacles and score only passed ones', () => {
      const monkey = createTestMonkey({ x: 270 });
      const obstacles = [
        createTestObstacle({ x: 200, scored: false }), // Passed
        createTestObstacle({ x: 300, scored: false }), // Not passed yet
        createTestObstacle({ x: 150, scored: true }),  // Already scored
      ];
      
      const result = checkScoring(monkey, obstacles);
      
      expect(result.scoreIncrement).toBe(1);
      expect(result.obstacles[0].scored).toBe(true);
      expect(result.obstacles[1].scored).toBe(false);
      expect(result.obstacles[2].scored).toBe(true);
    });

    it('should score multiple obstacles in one check if monkey passed them all', () => {
      const monkey = createTestMonkey({ x: 500 });
      const obstacles = [
        createTestObstacle({ x: 200, scored: false }),
        createTestObstacle({ x: 350, scored: false }),
      ];
      
      const result = checkScoring(monkey, obstacles);
      
      expect(result.scoreIncrement).toBe(2);
      expect(result.obstacles[0].scored).toBe(true);
      expect(result.obstacles[1].scored).toBe(true);
    });

    it('should handle empty obstacle array', () => {
      const monkey = createTestMonkey({ x: 270 });
      const obstacles: Obstacle[] = [];
      
      const result = checkScoring(monkey, obstacles);
      
      expect(result.scoreIncrement).toBe(0);
      expect(result.obstacles).toEqual([]);
    });

    it('should check exact boundary: monkey.x > obstacle.x + obstacle.width', () => {
      const monkey = createTestMonkey({ x: 260 }); // Exactly at obstacle.x + width
      const obstacles = [createTestObstacle({ x: 200, width: 60, scored: false })];
      
      const result = checkScoring(monkey, obstacles);
      
      expect(result.scoreIncrement).toBe(0);
      expect(result.obstacles[0].scored).toBe(false);
    });

    it('should score when monkey is just past the boundary', () => {
      const monkey = createTestMonkey({ x: 261 }); // Just past obstacle.x + width
      const obstacles = [createTestObstacle({ x: 200, width: 60, scored: false })];
      
      const result = checkScoring(monkey, obstacles);
      
      expect(result.scoreIncrement).toBe(1);
      expect(result.obstacles[0].scored).toBe(true);
    });
  });

  describe('updateBestScore', () => {
    it('should return current score when it is higher than best score', () => {
      const result = updateBestScore(10, 5);
      expect(result).toBe(10);
    });

    it('should return best score when it is higher than current score', () => {
      const result = updateBestScore(5, 10);
      expect(result).toBe(10);
    });

    it('should return same value when current and best scores are equal', () => {
      const result = updateBestScore(7, 7);
      expect(result).toBe(7);
    });

    it('should handle zero scores', () => {
      const result = updateBestScore(0, 0);
      expect(result).toBe(0);
    });

    it('should handle first game (best score is 0)', () => {
      const result = updateBestScore(5, 0);
      expect(result).toBe(5);
    });

    it('should handle large score values', () => {
      const result = updateBestScore(9999, 8888);
      expect(result).toBe(9999);
    });
  });
});
