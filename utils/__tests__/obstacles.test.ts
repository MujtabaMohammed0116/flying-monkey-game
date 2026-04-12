import {
  generateObstacle,
  moveObstacles,
  removeOffscreenObstacles,
  shouldGenerateObstacle,
} from '../obstacles';
import { Obstacle, GAME_CONFIG } from '@/types/game';

describe('Obstacle Utilities', () => {
  describe('generateObstacle', () => {
    it('should generate an obstacle at the right edge of the canvas', () => {
      const canvasWidth = 800;
      const canvasHeight = 600;
      const obstacle = generateObstacle(canvasWidth, canvasHeight);

      expect(obstacle.x).toBe(canvasWidth);
      expect(obstacle.width).toBe(GAME_CONFIG.OBSTACLE_WIDTH);
      expect(obstacle.gapHeight).toBe(GAME_CONFIG.GAP_HEIGHT);
      expect(obstacle.scored).toBe(false);
    });

    it('should generate gap position between 20% and 80% of canvas height', () => {
      const canvasWidth = 800;
      const canvasHeight = 600;
      const minGapY = canvasHeight * 0.2; // 120
      const maxGapY = canvasHeight * 0.8; // 480

      // Generate multiple obstacles to test randomness
      for (let i = 0; i < 50; i++) {
        const obstacle = generateObstacle(canvasWidth, canvasHeight);
        expect(obstacle.gapY).toBeGreaterThanOrEqual(minGapY);
        expect(obstacle.gapY).toBeLessThanOrEqual(maxGapY);
      }
    });

    it('should generate obstacles with consistent properties', () => {
      const canvasWidth = 1024;
      const canvasHeight = 768;
      const obstacle = generateObstacle(canvasWidth, canvasHeight);

      expect(obstacle.gapHeight).toBe(160);
      expect(obstacle.width).toBe(60);
      expect(obstacle.scored).toBe(false);
    });
  });

  describe('moveObstacles', () => {
    it('should move all obstacles left by 3 pixels', () => {
      const obstacles: Obstacle[] = [
        { x: 800, gapY: 300, gapHeight: 160, width: 60, scored: false },
        { x: 500, gapY: 400, gapHeight: 160, width: 60, scored: false },
        { x: 200, gapY: 250, gapHeight: 160, width: 60, scored: false },
      ];

      const moved = moveObstacles(obstacles);

      expect(moved[0].x).toBe(797);
      expect(moved[1].x).toBe(497);
      expect(moved[2].x).toBe(197);
    });

    it('should not modify other obstacle properties', () => {
      const obstacles: Obstacle[] = [
        { x: 800, gapY: 300, gapHeight: 160, width: 60, scored: false },
      ];

      const moved = moveObstacles(obstacles);

      expect(moved[0].gapY).toBe(300);
      expect(moved[0].gapHeight).toBe(160);
      expect(moved[0].width).toBe(60);
      expect(moved[0].scored).toBe(false);
    });

    it('should handle empty obstacle array', () => {
      const obstacles: Obstacle[] = [];
      const moved = moveObstacles(obstacles);

      expect(moved).toEqual([]);
    });

    it('should preserve scored flag when moving obstacles', () => {
      const obstacles: Obstacle[] = [
        { x: 800, gapY: 300, gapHeight: 160, width: 60, scored: true },
      ];

      const moved = moveObstacles(obstacles);

      expect(moved[0].scored).toBe(true);
    });
  });

  describe('removeOffscreenObstacles', () => {
    it('should remove obstacles that are completely offscreen', () => {
      const obstacles: Obstacle[] = [
        { x: -100, gapY: 300, gapHeight: 160, width: 60, scored: false }, // Offscreen
        { x: 200, gapY: 400, gapHeight: 160, width: 60, scored: false },  // Onscreen
        { x: -50, gapY: 250, gapHeight: 160, width: 60, scored: false },  // Offscreen
      ];

      const filtered = removeOffscreenObstacles(obstacles);

      expect(filtered).toHaveLength(1);
      expect(filtered[0].x).toBe(200);
    });

    it('should keep obstacles at the boundary (x + width = 0)', () => {
      const obstacles: Obstacle[] = [
        { x: -60, gapY: 300, gapHeight: 160, width: 60, scored: false }, // x + width = 0
      ];

      const filtered = removeOffscreenObstacles(obstacles);

      expect(filtered).toHaveLength(1);
    });

    it('should remove obstacles just past the boundary (x + width < 0)', () => {
      const obstacles: Obstacle[] = [
        { x: -61, gapY: 300, gapHeight: 160, width: 60, scored: false }, // x + width = -1
      ];

      const filtered = removeOffscreenObstacles(obstacles);

      expect(filtered).toHaveLength(0);
    });

    it('should handle empty obstacle array', () => {
      const obstacles: Obstacle[] = [];
      const filtered = removeOffscreenObstacles(obstacles);

      expect(filtered).toEqual([]);
    });

    it('should keep all onscreen obstacles', () => {
      const obstacles: Obstacle[] = [
        { x: 800, gapY: 300, gapHeight: 160, width: 60, scored: false },
        { x: 500, gapY: 400, gapHeight: 160, width: 60, scored: false },
        { x: 200, gapY: 250, gapHeight: 160, width: 60, scored: false },
      ];

      const filtered = removeOffscreenObstacles(obstacles);

      expect(filtered).toHaveLength(3);
    });
  });

  describe('shouldGenerateObstacle', () => {
    it('should return true when frameCount is a multiple of 90', () => {
      expect(shouldGenerateObstacle(0)).toBe(true);
      expect(shouldGenerateObstacle(90)).toBe(true);
      expect(shouldGenerateObstacle(180)).toBe(true);
      expect(shouldGenerateObstacle(270)).toBe(true);
      expect(shouldGenerateObstacle(900)).toBe(true);
    });

    it('should return false when frameCount is not a multiple of 90', () => {
      expect(shouldGenerateObstacle(1)).toBe(false);
      expect(shouldGenerateObstacle(45)).toBe(false);
      expect(shouldGenerateObstacle(89)).toBe(false);
      expect(shouldGenerateObstacle(91)).toBe(false);
      expect(shouldGenerateObstacle(135)).toBe(false);
    });

    it('should handle large frame counts', () => {
      expect(shouldGenerateObstacle(9000)).toBe(true);
      expect(shouldGenerateObstacle(9001)).toBe(false);
    });
  });
});
