import { Monkey } from '@/types/game';
import {
  applyGravity,
  applyFlap,
  clampVelocity,
  updatePosition,
  checkBoundaries,
} from '../physics';

describe('Physics Utility Functions', () => {
  const createTestMonkey = (overrides?: Partial<Monkey>): Monkey => ({
    x: 100,
    y: 300,
    velocityY: 0,
    width: 40,
    height: 40,
    ...overrides,
  });

  describe('applyGravity', () => {
    it('should increase velocityY by 0.5 (default gravity)', () => {
      const monkey = createTestMonkey({ velocityY: 0 });
      const result = applyGravity(monkey);
      expect(result.velocityY).toBe(0.5);
    });

    it('should increase velocityY by custom gravity value', () => {
      const monkey = createTestMonkey({ velocityY: 2 });
      const result = applyGravity(monkey, 1.5);
      expect(result.velocityY).toBe(3.5);
    });

    it('should not modify other monkey properties', () => {
      const monkey = createTestMonkey();
      const result = applyGravity(monkey);
      expect(result.x).toBe(monkey.x);
      expect(result.y).toBe(monkey.y);
      expect(result.width).toBe(monkey.width);
      expect(result.height).toBe(monkey.height);
    });
  });

  describe('applyFlap', () => {
    it('should set velocityY to -8 (default flap velocity)', () => {
      const monkey = createTestMonkey({ velocityY: 5 });
      const result = applyFlap(monkey);
      expect(result.velocityY).toBe(-8);
    });

    it('should set velocityY to custom flap velocity', () => {
      const monkey = createTestMonkey({ velocityY: 5 });
      const result = applyFlap(monkey, -10);
      expect(result.velocityY).toBe(-10);
    });

    it('should not modify other monkey properties', () => {
      const monkey = createTestMonkey();
      const result = applyFlap(monkey);
      expect(result.x).toBe(monkey.x);
      expect(result.y).toBe(monkey.y);
      expect(result.width).toBe(monkey.width);
      expect(result.height).toBe(monkey.height);
    });
  });

  describe('clampVelocity', () => {
    it('should clamp velocityY to 12 when exceeding max', () => {
      const monkey = createTestMonkey({ velocityY: 15 });
      const result = clampVelocity(monkey);
      expect(result.velocityY).toBe(12);
    });

    it('should not modify velocityY when below max', () => {
      const monkey = createTestMonkey({ velocityY: 8 });
      const result = clampVelocity(monkey);
      expect(result.velocityY).toBe(8);
    });

    it('should handle negative velocities correctly', () => {
      const monkey = createTestMonkey({ velocityY: -5 });
      const result = clampVelocity(monkey);
      expect(result.velocityY).toBe(-5);
    });

    it('should use custom max velocity', () => {
      const monkey = createTestMonkey({ velocityY: 20 });
      const result = clampVelocity(monkey, 15);
      expect(result.velocityY).toBe(15);
    });
  });

  describe('updatePosition', () => {
    it('should update y position based on velocityY', () => {
      const monkey = createTestMonkey({ y: 300, velocityY: 5 });
      const result = updatePosition(monkey);
      expect(result.y).toBe(305);
    });

    it('should handle negative velocity (upward movement)', () => {
      const monkey = createTestMonkey({ y: 300, velocityY: -8 });
      const result = updatePosition(monkey);
      expect(result.y).toBe(292);
    });

    it('should not modify other monkey properties', () => {
      const monkey = createTestMonkey({ velocityY: 5 });
      const result = updatePosition(monkey);
      expect(result.x).toBe(monkey.x);
      expect(result.velocityY).toBe(monkey.velocityY);
      expect(result.width).toBe(monkey.width);
      expect(result.height).toBe(monkey.height);
    });
  });

  describe('checkBoundaries', () => {
    const canvasHeight = 600;

    it('should clamp position to 0 and set velocity to 0 when above top boundary', () => {
      const monkey = createTestMonkey({ y: -10, velocityY: -5 });
      const result = checkBoundaries(monkey, canvasHeight);
      expect(result.monkey.y).toBe(0);
      expect(result.monkey.velocityY).toBe(0);
      expect(result.hitBottom).toBe(false);
    });

    it('should detect bottom boundary collision', () => {
      const monkey = createTestMonkey({ y: 570, height: 40 }); // y + height = 610 > 600
      const result = checkBoundaries(monkey, canvasHeight);
      expect(result.hitBottom).toBe(true);
    });

    it('should not detect collision when within boundaries', () => {
      const monkey = createTestMonkey({ y: 300 });
      const result = checkBoundaries(monkey, canvasHeight);
      expect(result.hitBottom).toBe(false);
      expect(result.monkey.y).toBe(300);
    });

    it('should handle monkey exactly at bottom boundary', () => {
      const monkey = createTestMonkey({ y: 560, height: 40 }); // y + height = 600
      const result = checkBoundaries(monkey, canvasHeight);
      expect(result.hitBottom).toBe(false);
    });

    it('should handle monkey exactly at top boundary', () => {
      const monkey = createTestMonkey({ y: 0, velocityY: 2 });
      const result = checkBoundaries(monkey, canvasHeight);
      expect(result.hitBottom).toBe(false);
      expect(result.monkey.y).toBe(0);
      expect(result.monkey.velocityY).toBe(2); // velocity not changed when at boundary
    });
  });
});
