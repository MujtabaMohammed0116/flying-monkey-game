import {
  getMonkeyHitbox,
  getObstacleHitboxes,
  checkAABBCollision,
  checkMonkeyObstacleCollision,
} from '../collision';
import { Monkey, Obstacle } from '@/types/game';

describe('Collision Detection', () => {
  describe('getMonkeyHitbox', () => {
    it('should return hitbox with 4px inset by default', () => {
      const monkey: Monkey = {
        x: 100,
        y: 200,
        width: 40,
        height: 40,
        velocityY: 0,
      };

      const hitbox = getMonkeyHitbox(monkey);

      expect(hitbox).toEqual({
        x: 104,
        y: 204,
        width: 32,
        height: 32,
      });
    });

    it('should apply custom inset value', () => {
      const monkey: Monkey = {
        x: 100,
        y: 200,
        width: 40,
        height: 40,
        velocityY: 0,
      };

      const hitbox = getMonkeyHitbox(monkey, 8);

      expect(hitbox).toEqual({
        x: 108,
        y: 208,
        width: 24,
        height: 24,
      });
    });
  });

  describe('getObstacleHitboxes', () => {
    it('should return correct top and bottom pipe hitboxes', () => {
      const obstacle: Obstacle = {
        x: 400,
        gapY: 300,
        gapHeight: 160,
        width: 60,
        scored: false,
      };
      const canvasHeight = 600;

      const hitboxes = getObstacleHitboxes(obstacle, canvasHeight);

      expect(hitboxes.top).toEqual({
        x: 400,
        y: 0,
        width: 60,
        height: 220, // gapY (300) - gapHeight/2 (80)
      });

      expect(hitboxes.bottom).toEqual({
        x: 400,
        y: 380, // gapY (300) + gapHeight/2 (80)
        width: 60,
        height: 220, // canvasHeight (600) - 380
      });
    });
  });

  describe('checkAABBCollision', () => {
    it('should detect collision when boxes overlap', () => {
      const boxA = { x: 100, y: 100, width: 40, height: 40 };
      const boxB = { x: 120, y: 120, width: 40, height: 40 };

      expect(checkAABBCollision(boxA, boxB)).toBe(true);
    });

    it('should not detect collision when boxes do not overlap', () => {
      const boxA = { x: 100, y: 100, width: 40, height: 40 };
      const boxB = { x: 200, y: 200, width: 40, height: 40 };

      expect(checkAABBCollision(boxA, boxB)).toBe(false);
    });

    it('should detect collision when boxes touch edges', () => {
      const boxA = { x: 100, y: 100, width: 40, height: 40 };
      const boxB = { x: 140, y: 100, width: 40, height: 40 };

      expect(checkAABBCollision(boxA, boxB)).toBe(false);
    });

    it('should detect collision when one box is inside another', () => {
      const boxA = { x: 100, y: 100, width: 100, height: 100 };
      const boxB = { x: 120, y: 120, width: 20, height: 20 };

      expect(checkAABBCollision(boxA, boxB)).toBe(true);
    });
  });

  describe('checkMonkeyObstacleCollision', () => {
    const monkey: Monkey = {
      x: 100,
      y: 200,
      width: 40,
      height: 40,
      velocityY: 0,
    };
    const canvasHeight = 600;

    it('should return false when no obstacles present', () => {
      const collision = checkMonkeyObstacleCollision(monkey, [], canvasHeight);
      expect(collision).toBe(false);
    });

    it('should return false when monkey passes through gap safely', () => {
      const obstacle: Obstacle = {
        x: 100,
        gapY: 220, // Monkey at y=200, height=40, so monkey spans 200-240
        gapHeight: 160, // Gap spans 140-300
        width: 60,
        scored: false,
      };

      const collision = checkMonkeyObstacleCollision(
        monkey,
        [obstacle],
        canvasHeight
      );
      expect(collision).toBe(false);
    });

    it('should return true when monkey collides with top pipe', () => {
      const obstacle: Obstacle = {
        x: 100,
        gapY: 250, // Gap spans 170-330
        gapHeight: 160,
        width: 60,
        scored: false,
      };

      const monkeyHigh: Monkey = {
        ...monkey,
        y: 100, // Monkey at 100-140, should hit top pipe (0-170)
      };

      const collision = checkMonkeyObstacleCollision(
        monkeyHigh,
        [obstacle],
        canvasHeight
      );
      expect(collision).toBe(true);
    });

    it('should return true when monkey collides with bottom pipe', () => {
      const obstacle: Obstacle = {
        x: 100,
        gapY: 200, // Gap spans 120-280
        gapHeight: 160,
        width: 60,
        scored: false,
      };

      const monkeyLow: Monkey = {
        ...monkey,
        y: 400, // Monkey at 400-440, should hit bottom pipe (280-600)
      };

      const collision = checkMonkeyObstacleCollision(
        monkeyLow,
        [obstacle],
        canvasHeight
      );
      expect(collision).toBe(true);
    });

    it('should check all obstacles in the array', () => {
      const obstacles: Obstacle[] = [
        {
          x: 300,
          gapY: 220,
          gapHeight: 160,
          width: 60,
          scored: false,
        },
        {
          x: 100,
          gapY: 100, // This one should collide
          gapHeight: 160,
          width: 60,
          scored: false,
        },
      ];

      const collision = checkMonkeyObstacleCollision(
        monkey,
        obstacles,
        canvasHeight
      );
      expect(collision).toBe(true);
    });

    it('should apply custom hitbox inset', () => {
      const obstacle: Obstacle = {
        x: 100,
        gapY: 220,
        gapHeight: 160,
        width: 60,
        scored: false,
      };

      // With larger inset, monkey hitbox is smaller and should pass through
      const collision = checkMonkeyObstacleCollision(
        monkey,
        [obstacle],
        canvasHeight,
        10
      );
      expect(collision).toBe(false);
    });
  });
});
