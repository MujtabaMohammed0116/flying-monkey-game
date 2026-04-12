# Design Document: Flying Monkey Game

## Overview

Flying Monkey is a browser-based arcade game built with Next.js 14+, React 18+, and TypeScript. The game implements Flappy Bird-style mechanics where a monkey character automatically moves forward while gravity pulls it downward, and the player taps/clicks to make it flap upward. The core challenge is navigating through randomly positioned obstacles without collision.

The architecture follows a component-based design with clear separation between game logic, rendering, and state management. The game loop runs at 60 FPS using `requestAnimationFrame`, handling physics updates, collision detection, obstacle generation, and rendering in each frame.

### Key Design Decisions

1. **Canvas-based rendering**: HTML5 Canvas API provides the performance needed for smooth 60 FPS gameplay with multiple moving entities
2. **Single-component architecture**: All game logic encapsulated in one React client component for simplicity and performance
3. **Functional game loop**: Pure functions for physics, collision detection, and scoring enable easier testing and reasoning
4. **Immutable state updates**: React state management with immutable updates for predictable behavior
5. **Responsive canvas**: Full viewport rendering with resize handling for cross-device compatibility

---

## Architecture

### High-Level Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js App Router                    │
│                      (app/page.tsx)                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              GameComponent (Client Component)            │
│  ┌───────────────────────────────────────────────────┐  │
│  │              React State Management                │  │
│  │  - gameState: 'start' | 'playing' | 'gameOver'    │  │
│  │  - score, bestScore                                │  │
│  │  - monkey: { x, y, velocityY }                     │  │
│  │  - obstacles: Obstacle[]                           │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │                  Game Loop                         │  │
│  │  (requestAnimationFrame)                           │  │
│  │                                                     │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────┐ │  │
│  │  │   Physics   │→ │  Collision   │→ │ Scoring  │ │  │
│  │  │   Update    │  │  Detection   │  │  Logic   │ │  │
│  │  └─────────────┘  └──────────────┘  └──────────┘ │  │
│  │         │                                          │  │
│  │         ▼                                          │  │
│  │  ┌─────────────┐  ┌──────────────┐               │  │
│  │  │  Obstacle   │  │   Rendering  │               │  │
│  │  │ Generation  │  │    Engine    │               │  │
│  │  └─────────────┘  └──────────────┘               │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Canvas Rendering Layer                │  │
│  │  - Background rendering                            │  │
│  │  - Monkey sprite rendering                         │  │
│  │  - Obstacle rendering                              │  │
│  │  - HUD rendering                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │                Input Handling                      │  │
│  │  - Keyboard events (spacebar)                      │  │
│  │  - Mouse/touch events (click/tap)                  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Component Responsibilities

**GameComponent**: Single React client component that:
- Manages all game state using React hooks
- Initializes and controls the game loop lifecycle
- Handles user input events
- Renders the canvas and UI overlays
- Coordinates between game logic modules

**Game Loop**: Core update cycle that:
- Runs at 60 FPS via `requestAnimationFrame`
- Updates physics (gravity, velocity, position)
- Generates and moves obstacles
- Detects collisions
- Updates score
- Triggers rendering

**Rendering Engine**: Canvas-based renderer that:
- Clears and redraws the canvas each frame
- Renders scrolling background
- Renders monkey sprite with current position
- Renders all active obstacles
- Renders HUD with current score

**Input Handler**: Event listener system that:
- Captures spacebar, click, and tap events
- Applies flap impulse during gameplay
- Triggers game state transitions (start, restart)

---

## Components and Interfaces

### Core Data Structures

```typescript
// Game state enum
type GameState = 'start' | 'playing' | 'gameOver';

// Monkey entity
interface Monkey {
  x: number;           // Horizontal position (fixed during gameplay)
  y: number;           // Vertical position
  velocityY: number;   // Vertical velocity (pixels per frame)
  width: number;       // Sprite width
  height: number;      // Sprite height
}

// Obstacle entity
interface Obstacle {
  x: number;           // Horizontal position
  gapY: number;        // Vertical center of the gap
  gapHeight: number;   // Height of the passable gap (160px)
  width: number;       // Width of the obstacle pipes
  scored: boolean;     // Whether this obstacle has contributed to score
}

// Game configuration constants
interface GameConfig {
  GRAVITY: number;              // 0.5 pixels per frame squared
  FLAP_VELOCITY: number;        // -8 pixels per frame
  MAX_FALL_VELOCITY: number;    // 12 pixels per frame
  HORIZONTAL_SPEED: number;     // 3 pixels per frame
  OBSTACLE_INTERVAL: number;    // 90 frames
  GAP_HEIGHT: number;           // 160 pixels
  MONKEY_HITBOX_INSET: number;  // 4 pixels
  TARGET_FPS: number;           // 60
}
```

### Module Interfaces

```typescript
// Physics module
interface PhysicsEngine {
  applyGravity(monkey: Monkey, gravity: number): Monkey;
  applyFlap(monkey: Monkey, flapVelocity: number): Monkey;
  clampVelocity(monkey: Monkey, maxVelocity: number): Monkey;
  updatePosition(monkey: Monkey): Monkey;
  checkBoundaries(monkey: Monkey, canvasHeight: number): {
    monkey: Monkey;
    hitBottom: boolean;
  };
}

// Obstacle management
interface ObstacleManager {
  generateObstacle(
    canvasWidth: number,
    canvasHeight: number,
    gapHeight: number
  ): Obstacle;
  
  moveObstacles(
    obstacles: Obstacle[],
    speed: number
  ): Obstacle[];
  
  removeOffscreenObstacles(
    obstacles: Obstacle[],
    canvasWidth: number
  ): Obstacle[];
  
  shouldGenerateObstacle(
    frameCount: number,
    interval: number
  ): boolean;
}

// Collision detection
interface CollisionDetector {
  checkMonkeyObstacleCollision(
    monkey: Monkey,
    obstacles: Obstacle[],
    hitboxInset: number
  ): boolean;
  
  getMonkeyHitbox(monkey: Monkey, inset: number): BoundingBox;
  getObstacleHitboxes(obstacle: Obstacle, canvasHeight: number): {
    top: BoundingBox;
    bottom: BoundingBox;
  };
}

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Scoring system
interface ScoreManager {
  checkScoring(
    monkey: Monkey,
    obstacles: Obstacle[]
  ): {
    obstacles: Obstacle[];
    scoreIncrement: number;
  };
  
  updateBestScore(currentScore: number, bestScore: number): number;
}

// Rendering
interface Renderer {
  clearCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): void;
  renderBackground(ctx: CanvasRenderingContext2D, offset: number): void;
  renderMonkey(ctx: CanvasRenderingContext2D, monkey: Monkey): void;
  renderObstacles(ctx: CanvasRenderingContext2D, obstacles: Obstacle[], canvasHeight: number): void;
  renderHUD(ctx: CanvasRenderingContext2D, score: number, canvasWidth: number): void;
}
```

### React Component Interface

```typescript
interface GameComponentProps {
  // No props needed - self-contained game
}

interface GameComponentState {
  gameState: GameState;
  score: number;
  bestScore: number;
  monkey: Monkey;
  obstacles: Obstacle[];
  frameCount: number;
  backgroundOffset: number;
}

// Hook for game loop
function useGameLoop(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  gameState: GameState,
  updateGameState: (updater: (state: GameComponentState) => GameComponentState) => void
): void;

// Hook for input handling
function useInputHandler(
  gameState: GameState,
  onFlap: () => void,
  onStart: () => void,
  onRestart: () => void
): void;

// Hook for canvas resize
function useCanvasResize(
  canvasRef: React.RefObject<HTMLCanvasElement>
): { width: number; height: number };
```

---

## Data Models

### Monkey State Model

The monkey is represented as a simple entity with position and velocity:

```typescript
const initialMonkey: Monkey = {
  x: 100,              // Fixed horizontal position (left-center)
  y: canvasHeight / 2, // Vertically centered at start
  velocityY: 0,        // No initial velocity
  width: 40,           // Sprite dimensions
  height: 40
};
```

**State Transitions**:
- `velocityY` increases by `GRAVITY` each frame (0.5 px/frame²)
- `velocityY` set to `FLAP_VELOCITY` (-8 px/frame) on player input
- `velocityY` clamped to `MAX_FALL_VELOCITY` (12 px/frame) maximum
- `y` updated by `velocityY` each frame
- `y` clamped to `[0, canvasHeight]` boundaries

### Obstacle State Model

Each obstacle consists of two pipes (top and bottom) with a gap:

```typescript
interface Obstacle {
  x: number;           // Starts at canvasWidth, moves left
  gapY: number;        // Random between 20% and 80% of canvas height
  gapHeight: number;   // Fixed at 160 pixels
  width: number;       // Fixed at 60 pixels
  scored: boolean;     // Tracks if score has been awarded
}
```

**Generation Logic**:
- New obstacle created every 90 frames
- `gapY` randomly positioned: `canvasHeight * (0.2 + Math.random() * 0.6)`
- Initial `x` position: `canvasWidth`
- `scored` initialized to `false`

**Movement**:
- All obstacles move left at `HORIZONTAL_SPEED` (3 px/frame)
- Removed when `x + width < 0` (fully offscreen)

**Rendering Geometry**:
- Top pipe: from `y=0` to `y=gapY - gapHeight/2`
- Bottom pipe: from `y=gapY + gapHeight/2` to `y=canvasHeight`

### Game State Model

The overall game state machine:

```typescript
type GameState = 'start' | 'playing' | 'gameOver';

// State transitions:
// 'start' → 'playing': on first input (spacebar/click/tap)
// 'playing' → 'gameOver': on collision or bottom boundary hit
// 'gameOver' → 'playing': on restart input
```

**State-specific Behavior**:

**'start' state**:
- Display start screen overlay
- Game loop not running
- No obstacles rendered
- Monkey at initial position

**'playing' state**:
- Game loop active
- Physics updates applied
- Obstacles generated and moved
- Collision detection active
- Score updates enabled
- HUD visible

**'gameOver' state**:
- Game loop stopped
- Final score displayed
- Best score updated and displayed
- "Play Again" prompt shown
- All game entities frozen

### Score Model

```typescript
interface ScoreState {
  current: number;     // Current game score
  best: number;        // Best score this session
}
```

**Scoring Rules**:
- Score increments by 1 when monkey's `x` position passes obstacle's `x + width`
- Each obstacle can only contribute once (tracked by `scored` flag)
- Score resets to 0 on game restart
- Best score persists across games in the same session

### Collision Model

Collision detection uses axis-aligned bounding boxes (AABB):

```typescript
interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Monkey hitbox (with 4px inset for forgiving collision)
const monkeyHitbox: BoundingBox = {
  x: monkey.x + 4,
  y: monkey.y + 4,
  width: monkey.width - 8,
  height: monkey.height - 8
};

// Obstacle hitboxes (two per obstacle)
const topPipeHitbox: BoundingBox = {
  x: obstacle.x,
  y: 0,
  width: obstacle.width,
  height: obstacle.gapY - obstacle.gapHeight / 2
};

const bottomPipeHitbox: BoundingBox = {
  x: obstacle.x,
  y: obstacle.gapY + obstacle.gapHeight / 2,
  width: obstacle.width,
  height: canvasHeight - (obstacle.gapY + obstacle.gapHeight / 2)
};
```

**AABB Collision Check**:
```typescript
function checkAABBCollision(a: BoundingBox, b: BoundingBox): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: State Transition from Start to Playing

*For any* game in 'start' state, applying player input (spacebar, click, or tap) SHALL transition the game state to 'playing'.

**Validates: Requirements 1.2**

### Property 2: Monkey Initialization Position

*For any* canvas dimensions, initializing a new game SHALL position the monkey at a fixed horizontal position (100 pixels from left) and vertically centered (y = canvasHeight / 2).

**Validates: Requirements 1.3**

### Property 3: Gravity Application

*For any* monkey state, applying gravity for one frame SHALL increase the monkey's vertical velocity by exactly 0.5 pixels per frame.

**Validates: Requirements 2.1**

### Property 4: Flap Impulse

*For any* monkey state, applying a flap impulse SHALL set the monkey's vertical velocity to exactly -8 pixels per frame.

**Validates: Requirements 2.2**

### Property 5: Velocity Clamping

*For any* monkey state, after applying physics updates, the monkey's downward velocity SHALL never exceed 12 pixels per frame.

**Validates: Requirements 2.3**

### Property 6: Obstacle Movement

*For any* list of obstacles, moving them for one frame SHALL decrease each obstacle's x position by exactly 3 pixels.

**Validates: Requirements 2.4, 3.4**

### Property 7: Bottom Boundary Collision

*For any* monkey state where the monkey's y position exceeds the canvas height, the game SHALL trigger a game-over event.

**Validates: Requirements 2.5**

### Property 8: Top Boundary Clamping

*For any* monkey state where the monkey's y position is less than 0, applying boundary checks SHALL clamp the position to 0 and set vertical velocity to 0.

**Validates: Requirements 2.6**

### Property 9: Obstacle Generation Timing

*For any* frame count that is a multiple of 90, the game SHALL generate a new obstacle.

**Validates: Requirements 3.1**

### Property 10: Gap Position Bounds

*For any* generated obstacle with a given canvas height, the gap's vertical center position SHALL be within the range [0.2 × canvasHeight, 0.8 × canvasHeight].

**Validates: Requirements 3.2**

### Property 11: Gap Height Consistency

*For any* generated obstacle, the gap height SHALL be exactly 160 pixels.

**Validates: Requirements 3.3**

### Property 12: Offscreen Obstacle Removal

*For any* list of obstacles, removing offscreen obstacles SHALL eliminate all obstacles where x + width < 0.

**Validates: Requirements 3.5**

### Property 13: Collision Detection with Hitbox Inset

*For any* monkey and obstacle positions, collision detection SHALL use the monkey's bounding box inset by 4 pixels on all sides, and SHALL correctly detect when this inset hitbox overlaps with any obstacle pipe (top or bottom).

**Validates: Requirements 4.1, 4.3**

### Property 14: Scoring Exactly Once Per Obstacle

*For any* monkey and obstacle where the monkey's x position passes the obstacle's right edge (monkey.x > obstacle.x + obstacle.width), the score SHALL increment by exactly 1, and that obstacle SHALL be marked as scored to prevent duplicate scoring.

**Validates: Requirements 5.1, 5.4**

### Property 15: Score Initialization

*For any* new game session, the score SHALL be initialized to 0.

**Validates: Requirements 5.3**

### Property 16: Game State Reset

*For any* game state (regardless of current score, obstacles, or monkey position), resetting the game SHALL return all state to initial values: score = 0, obstacles = [], monkey at initial position with velocityY = 0.

**Validates: Requirements 6.5**

### Property 17: Best Score Tracking

*For any* sequence of game sessions with final scores, the best score SHALL always equal the maximum score achieved across all sessions.

**Validates: Requirements 6.6**

---

## Error Handling

### Canvas Context Errors

**Error**: Canvas context cannot be obtained
```typescript
const ctx = canvas.getContext('2d');
if (!ctx) {
  console.error('Failed to get 2D context from canvas');
  // Display error message to user
  return;
}
```

**Handling**: Display user-friendly error message indicating browser compatibility issue. Gracefully degrade or suggest browser update.

### Window Resize Handling

**Error**: Rapid resize events causing performance issues
```typescript
let resizeTimeout: NodeJS.Timeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    updateCanvasSize();
  }, 100); // Debounce resize events
});
```

**Handling**: Debounce resize events to prevent excessive re-renders. Maintain game state during resize.

### Game Loop Errors

**Error**: requestAnimationFrame not supported
```typescript
if (!window.requestAnimationFrame) {
  console.error('requestAnimationFrame not supported');
  // Fallback to setTimeout
  const fallbackGameLoop = () => {
    update();
    setTimeout(fallbackGameLoop, 1000 / 60);
  };
  fallbackGameLoop();
}
```

**Handling**: Provide fallback to `setTimeout` for older browsers, though performance may be degraded.

### State Corruption Prevention

**Error**: Invalid game state (e.g., negative score, NaN positions)
```typescript
function validateGameState(state: GameComponentState): boolean {
  if (state.score < 0 || !Number.isFinite(state.score)) {
    console.error('Invalid score:', state.score);
    return false;
  }
  if (!Number.isFinite(state.monkey.y) || !Number.isFinite(state.monkey.velocityY)) {
    console.error('Invalid monkey state:', state.monkey);
    return false;
  }
  return true;
}
```

**Handling**: Validate state after each update. If invalid state detected, reset to last known good state or restart game.

### Input Event Errors

**Error**: Multiple rapid inputs causing unexpected behavior
```typescript
let lastFlapTime = 0;
const FLAP_COOLDOWN = 100; // milliseconds

function handleFlap() {
  const now = Date.now();
  if (now - lastFlapTime < FLAP_COOLDOWN) {
    return; // Ignore rapid inputs
  }
  lastFlapTime = now;
  applyFlap();
}
```

**Handling**: Implement input cooldown to prevent spam. Ensure single input per frame maximum.

### Memory Leak Prevention

**Error**: Event listeners or animation frames not cleaned up
```typescript
useEffect(() => {
  let animationFrameId: number;
  const gameLoop = () => {
    update();
    animationFrameId = requestAnimationFrame(gameLoop);
  };
  
  gameLoop();
  
  return () => {
    // Cleanup on unmount
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('keydown', handleKeyDown);
    canvas.removeEventListener('click', handleClick);
  };
}, [gameState]);
```

**Handling**: Always clean up event listeners and cancel animation frames in React cleanup functions.

### Obstacle Array Growth

**Error**: Obstacle array growing unbounded if cleanup fails
```typescript
function updateObstacles(obstacles: Obstacle[]): Obstacle[] {
  const MAX_OBSTACLES = 10; // Safety limit
  let updated = moveObstacles(obstacles);
  updated = removeOffscreenObstacles(updated);
  
  if (updated.length > MAX_OBSTACLES) {
    console.warn('Obstacle array exceeded limit, forcing cleanup');
    updated = updated.slice(-MAX_OBSTACLES);
  }
  
  return updated;
}
```

**Handling**: Implement safety limit on obstacle array size. Force cleanup if limit exceeded.

---

## Testing Strategy

### Overview

The Flying Monkey game will use a dual testing approach combining property-based testing for core game logic and example-based testing for UI components and integration points.

### Property-Based Testing

**Library**: [fast-check](https://github.com/dubzzz/fast-check) for TypeScript/JavaScript

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with format: `Feature: flying-monkey-game, Property {number}: {property_text}`

**Test Organization**:
```
tests/
  properties/
    physics.property.test.ts       # Properties 3, 4, 5, 7, 8
    obstacles.property.test.ts     # Properties 6, 9, 10, 11, 12
    collision.property.test.ts     # Property 13
    scoring.property.test.ts       # Properties 14, 15
    state.property.test.ts         # Properties 1, 2, 16, 17
```

**Property Test Examples**:

```typescript
// Property 3: Gravity Application
test('Feature: flying-monkey-game, Property 3: Gravity increases velocity by 0.5', () => {
  fc.assert(
    fc.property(
      fc.record({
        x: fc.float(),
        y: fc.float(),
        velocityY: fc.float({ min: -20, max: 20 }),
        width: fc.constant(40),
        height: fc.constant(40)
      }),
      (monkey) => {
        const initialVelocity = monkey.velocityY;
        const updated = applyGravity(monkey, 0.5);
        expect(updated.velocityY).toBeCloseTo(initialVelocity + 0.5);
      }
    ),
    { numRuns: 100 }
  );
});

// Property 13: Collision Detection with Hitbox Inset
test('Feature: flying-monkey-game, Property 13: Collision detection with 4px inset', () => {
  fc.assert(
    fc.property(
      fc.record({
        monkey: fc.record({
          x: fc.float({ min: 0, max: 800 }),
          y: fc.float({ min: 0, max: 600 }),
          width: fc.constant(40),
          height: fc.constant(40),
          velocityY: fc.float()
        }),
        obstacle: fc.record({
          x: fc.float({ min: 0, max: 800 }),
          gapY: fc.float({ min: 100, max: 500 }),
          gapHeight: fc.constant(160),
          width: fc.constant(60),
          scored: fc.boolean()
        })
      }),
      ({ monkey, obstacle }) => {
        const collision = checkMonkeyObstacleCollision(monkey, [obstacle], 4);
        const monkeyHitbox = getMonkeyHitbox(monkey, 4);
        const obstacleHitboxes = getObstacleHitboxes(obstacle, 600);
        
        // Verify hitbox is inset by 4 pixels
        expect(monkeyHitbox.width).toBe(monkey.width - 8);
        expect(monkeyHitbox.height).toBe(monkey.height - 8);
        
        // Verify collision result matches manual AABB check
        const manualCollision = 
          checkAABBCollision(monkeyHitbox, obstacleHitboxes.top) ||
          checkAABBCollision(monkeyHitbox, obstacleHitboxes.bottom);
        expect(collision).toBe(manualCollision);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Testing

**Library**: Jest with React Testing Library

**Focus Areas**:
- Specific examples of game scenarios
- Edge cases (empty obstacle list, boundary conditions)
- UI component rendering (start screen, game over screen, HUD)
- React hooks behavior

**Test Organization**:
```
tests/
  unit/
    GameComponent.test.tsx         # Component rendering and state
    physics.test.ts                # Specific physics examples
    collision.test.ts              # Edge cases for collision
    scoring.test.ts                # Specific scoring scenarios
    rendering.test.ts              # Canvas rendering functions
```

**Unit Test Examples**:

```typescript
// Example: Start screen displays correctly
test('Start screen shows title and prompt', () => {
  render(<GameComponent />);
  expect(screen.getByText(/Flying Monkey/i)).toBeInTheDocument();
  expect(screen.getByText(/Press Space or Click to Start/i)).toBeInTheDocument();
});

// Example: Game over screen shows final score
test('Game over screen displays final score', () => {
  const { rerender } = render(<GameComponent />);
  // Simulate game over with score 5
  // ... trigger game over ...
  expect(screen.getByText(/Score: 5/i)).toBeInTheDocument();
  expect(screen.getByText(/Play Again/i)).toBeInTheDocument();
});

// Edge case: Empty obstacle list doesn't cause errors
test('Collision detection handles empty obstacle list', () => {
  const monkey = { x: 100, y: 300, velocityY: 0, width: 40, height: 40 };
  const collision = checkMonkeyObstacleCollision(monkey, [], 4);
  expect(collision).toBe(false);
});
```

### Integration Testing

**Library**: Playwright for end-to-end testing

**Focus Areas**:
- Full game flow (start → play → game over → restart)
- Canvas rendering in actual browser
- Input handling (keyboard, mouse, touch)
- Window resize behavior
- Performance (frame rate consistency)

**Test Organization**:
```
tests/
  integration/
    game-flow.spec.ts              # Complete game sessions
    input-handling.spec.ts         # Keyboard, mouse, touch events
    performance.spec.ts            # Frame rate and responsiveness
    responsive.spec.ts             # Canvas resize behavior
```

**Integration Test Examples**:

```typescript
// Full game flow
test('Complete game session', async ({ page }) => {
  await page.goto('/');
  
  // Start screen visible
  await expect(page.locator('text=Flying Monkey')).toBeVisible();
  
  // Start game
  await page.keyboard.press('Space');
  
  // HUD visible with score 0
  await expect(page.locator('text=Score: 0')).toBeVisible();
  
  // Play for a few seconds
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Space');
    await page.waitForTimeout(500);
  }
  
  // Eventually game over
  await expect(page.locator('text=Game Over')).toBeVisible({ timeout: 30000 });
  
  // Restart
  await page.keyboard.press('Space');
  await expect(page.locator('text=Score: 0')).toBeVisible();
});
```

### Test Coverage Goals

- **Property tests**: 100% coverage of core game logic (physics, collision, scoring, state management)
- **Unit tests**: 90%+ coverage of all functions and components
- **Integration tests**: All critical user flows covered
- **Performance tests**: Verify 60 FPS target under normal gameplay

### Continuous Integration

- Run all tests on every commit
- Property tests run with 100 iterations in CI
- Integration tests run in headless browser
- Performance tests run on dedicated hardware for consistency
- Coverage reports generated and tracked over time

---

## Implementation Notes

### Development Phases

**Phase 1: Core Game Loop**
- Set up Next.js project structure
- Implement canvas rendering system
- Create game loop with requestAnimationFrame
- Implement basic monkey rendering

**Phase 2: Physics System**
- Implement gravity and velocity calculations
- Implement flap mechanics
- Add boundary checking and clamping
- Write property tests for physics

**Phase 3: Obstacle System**
- Implement obstacle generation
- Implement obstacle movement and cleanup
- Add obstacle rendering
- Write property tests for obstacles

**Phase 4: Collision Detection**
- Implement AABB collision detection
- Add hitbox calculation with inset
- Integrate collision with game over
- Write property tests for collision

**Phase 5: Scoring System**
- Implement score tracking
- Add HUD rendering
- Implement best score persistence
- Write property tests for scoring

**Phase 6: Game States**
- Implement start screen
- Implement game over screen
- Add state transitions
- Implement restart functionality

**Phase 7: Polish and Testing**
- Add visual assets (monkey sprite, obstacle styling, background)
- Optimize rendering performance
- Complete integration tests
- Performance testing and optimization

### Performance Considerations

- Use `requestAnimationFrame` for optimal frame timing
- Minimize garbage collection by reusing objects where possible
- Batch canvas operations to reduce draw calls
- Use canvas layers if needed for static vs dynamic content
- Profile with Chrome DevTools to identify bottlenecks

### Accessibility Considerations

- Provide keyboard controls (spacebar) for non-mouse users
- Ensure sufficient color contrast for HUD elements
- Consider adding sound effects with mute option
- Provide clear visual feedback for all interactions

---

## Conclusion

This design provides a comprehensive blueprint for implementing the Flying Monkey game as a Next.js application. The architecture emphasizes:

1. **Separation of concerns**: Clear boundaries between game logic, rendering, and state management
2. **Testability**: Pure functions for core logic enable comprehensive property-based testing
3. **Performance**: Canvas-based rendering with optimized game loop for 60 FPS
4. **Maintainability**: TypeScript types and modular structure for easy extension
5. **User experience**: Responsive design, smooth animations, and intuitive controls

The property-based testing strategy ensures correctness of core game mechanics across a wide range of inputs, while unit and integration tests cover specific scenarios and user flows. This dual approach provides confidence in both the algorithmic correctness and the practical usability of the game.
