/**
 * Manual verification script for scoring functions
 * This demonstrates the scoring logic works correctly
 */

import { Monkey, Obstacle } from '@/types/game';
import { checkScoring, updateBestScore } from '../scoring';

// Test data
const monkey: Monkey = {
  x: 270,
  y: 300,
  velocityY: 0,
  width: 40,
  height: 40,
};

const obstacles: Obstacle[] = [
  {
    x: 200,
    gapY: 300,
    gapHeight: 160,
    width: 60,
    scored: false,
  },
  {
    x: 350,
    gapY: 250,
    gapHeight: 160,
    width: 60,
    scored: false,
  },
];

console.log('=== Scoring Function Verification ===\n');

// Test 1: checkScoring when monkey passes first obstacle
console.log('Test 1: Monkey at x=270, first obstacle at x=200 (width=60)');
console.log('Expected: Score increment = 1, first obstacle marked as scored');
const result1 = checkScoring(monkey, obstacles);
console.log('Result:', result1);
console.log('✓ Score increment:', result1.scoreIncrement === 1 ? 'PASS' : 'FAIL');
console.log('✓ First obstacle scored:', result1.obstacles[0].scored ? 'PASS' : 'FAIL');
console.log('✓ Second obstacle not scored:', !result1.obstacles[1].scored ? 'PASS' : 'FAIL');
console.log();

// Test 2: checkScoring when monkey hasn't passed obstacle
const monkey2: Monkey = { ...monkey, x: 100 };
console.log('Test 2: Monkey at x=100, first obstacle at x=200');
console.log('Expected: Score increment = 0, no obstacles scored');
const result2 = checkScoring(monkey2, obstacles);
console.log('Result:', result2);
console.log('✓ Score increment:', result2.scoreIncrement === 0 ? 'PASS' : 'FAIL');
console.log('✓ No obstacles scored:', !result2.obstacles[0].scored && !result2.obstacles[1].scored ? 'PASS' : 'FAIL');
console.log();

// Test 3: checkScoring with already scored obstacle
const scoredObstacles: Obstacle[] = [
  { ...obstacles[0], scored: true },
  obstacles[1],
];
console.log('Test 3: Monkey at x=270, first obstacle already scored');
console.log('Expected: Score increment = 0, no change to scored flags');
const result3 = checkScoring(monkey, scoredObstacles);
console.log('Result:', result3);
console.log('✓ Score increment:', result3.scoreIncrement === 0 ? 'PASS' : 'FAIL');
console.log('✓ First obstacle still scored:', result3.obstacles[0].scored ? 'PASS' : 'FAIL');
console.log();

// Test 4: updateBestScore when current is higher
console.log('Test 4: updateBestScore(10, 5)');
console.log('Expected: 10');
const bestScore1 = updateBestScore(10, 5);
console.log('Result:', bestScore1);
console.log('✓ Best score updated:', bestScore1 === 10 ? 'PASS' : 'FAIL');
console.log();

// Test 5: updateBestScore when best is higher
console.log('Test 5: updateBestScore(5, 10)');
console.log('Expected: 10');
const bestScore2 = updateBestScore(5, 10);
console.log('Result:', bestScore2);
console.log('✓ Best score maintained:', bestScore2 === 10 ? 'PASS' : 'FAIL');
console.log();

// Test 6: updateBestScore when equal
console.log('Test 6: updateBestScore(7, 7)');
console.log('Expected: 7');
const bestScore3 = updateBestScore(7, 7);
console.log('Result:', bestScore3);
console.log('✓ Best score unchanged:', bestScore3 === 7 ? 'PASS' : 'FAIL');
console.log();

console.log('=== All Verification Tests Complete ===');
