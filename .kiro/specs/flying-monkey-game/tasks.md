# Implementation Plan: Flying Monkey Game

## Overview

This implementation plan breaks down the Flying Monkey game into discrete coding tasks. The game will be built as a Next.js 14+ application with TypeScript, using HTML5 Canvas for rendering and React hooks for state management. Each task builds incrementally on previous work, with property-based tests integrated throughout to validate core game mechanics.

## Tasks

- [x] 1. Set up Next.js project structure and core game component
  - Initialize Next.js 14+ project with TypeScript and App Router
  - Configure Tailwind CSS for UI styling
  - Create main game page at `app/page.tsx`
  - Create `GameComponent` as a client component with canvas element
  - Set up canvas ref and basic rendering context
  - Implement canvas resize handling to fill viewport
  - _Requirements: 1.1, 1.4, 8.1, 8.2, 8.3_

- [ ] 2. Implement core data structures and game state management
  - [x] 2.1 Define TypeScript interfaces and types
    - Create `GameState` type ('start' | 'playing' | 'gameOver')
    - Create `Monkey` interface with position, velocity, and dimensions
    - Create `Obstacle` interface with position, gap properties, and scored flag
    - Create `GameConfig` constants (gravity, flap velocity, speeds, etc.)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3_
  
  - [x] 2.2 Set up React state management
    - Initialize game state with useState hooks
    - Create state for: gameState, score, bestScore, monkey, obstacles, frameCount
    - Implement initial monkey position (x=100, y=canvasHeight/2)
    - _Requirements: 1.3, 5.3_

- [ ] 3. Implement physics system
  - [x] 3.1 Create physics utility functions
    - Implement `applyGravity` function (adds 0.5 to velocityY)
    - Implement `applyFlap` function (sets velocityY to -8)
    - Implement `clampVelocity` function (max downward velocity 12)
    - Implement `updatePosition` function (updates y based on velocityY)
    - Implement `checkBoundaries` function (handles top/bottom boundaries)
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6_
  
  - [ ]* 3.2 Write property test for gravity application
    - **Property 3: Gravity Application**
    - **Validates: Requirements 2.1**
  
  - [ ]* 3.3 Write property test for flap impulse
    - **Property 4: Flap Impulse**
    - **Validates: Requirements 2.2**
  
  - [ ]* 3.4 Write property test for velocity clamping
    - **Property 5: Velocity Clamping**
    - **Validates: Requirements 2.3**
  
  - [ ]* 3.5 Write property test for bottom boundary collision
    - **Property 7: Bottom Boundary Collision**
    - **Validates: Requirements 2.5**
  
  - [ ]* 3.6 Write property test for top boundary clamping
    - **Property 8: Top Boundary Clamping**
    - **Validates: Requirements 2.6**

- [ ] 4. Implement obstacle generation and management
  - [x] 4.1 Create obstacle utility functions
    - Implement `generateObstacle` function (random gap position between 20%-80% canvas height)
    - Implement `moveObstacles` function (moves all obstacles left by 3 pixels)
    - Implement `removeOffscreenObstacles` function (removes obstacles with x + width < 0)
    - Implement `shouldGenerateObstacle` function (checks if frameCount % 90 === 0)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [ ]* 4.2 Write property test for obstacle movement
    - **Property 6: Obstacle Movement**
    - **Validates: Requirements 2.4, 3.4**
  
  - [ ]* 4.3 Write property test for obstacle generation timing
    - **Property 9: Obstacle Generation Timing**
    - **Validates: Requirements 3.1**
  
  - [ ]* 4.4 Write property test for gap position bounds
    - **Property 10: Gap Position Bounds**
    - **Validates: Requirements 3.2**
  
  - [ ]* 4.5 Write property test for gap height consistency
    - **Property 11: Gap Height Consistency**
    - **Validates: Requirements 3.3**
  
  - [ ]* 4.6 Write property test for offscreen obstacle removal
    - **Property 12: Offscreen Obstacle Removal**
    - **Validates: Requirements 3.5**

- [ ] 5. Implement collision detection system
  - [x] 5.1 Create collision detection functions
    - Implement `getMonkeyHitbox` function (returns bounding box with 4px inset)
    - Implement `getObstacleHitboxes` function (returns top and bottom pipe hitboxes)
    - Implement `checkAABBCollision` function (axis-aligned bounding box collision)
    - Implement `checkMonkeyObstacleCollision` function (checks monkey against all obstacles)
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [ ]* 5.2 Write property test for collision detection with hitbox inset
    - **Property 13: Collision Detection with Hitbox Inset**
    - **Validates: Requirements 4.1, 4.3**

- [ ] 6. Implement scoring system
  - [x] 6.1 Create scoring functions
    - Implement `checkScoring` function (increments score when monkey passes obstacle)
    - Ensure each obstacle scores exactly once using `scored` flag
    - Implement `updateBestScore` function (tracks highest score)
    - _Requirements: 5.1, 5.2, 5.4, 6.6_
  
  - [ ]* 6.2 Write property test for scoring exactly once per obstacle
    - **Property 14: Scoring Exactly Once Per Obstacle**
    - **Validates: Requirements 5.1, 5.4**
  
  - [ ]* 6.3 Write property test for score initialization
    - **Property 15: Score Initialization**
    - **Validates: Requirements 5.3**

- [x] 7. Checkpoint - Ensure all core game logic tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement game loop with requestAnimationFrame
  - [x] 8.1 Create main game loop function
    - Set up requestAnimationFrame loop in useEffect
    - Integrate physics updates (gravity, velocity, position)
    - Integrate obstacle generation and movement
    - Integrate collision detection (trigger game over on collision)
    - Integrate scoring logic
    - Increment frameCount each frame
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.4, 4.1, 5.1, 8.4_
  
  - [x] 8.2 Implement game loop cleanup
    - Cancel requestAnimationFrame on component unmount
    - Remove event listeners on cleanup
    - _Requirements: 8.5_

- [ ] 9. Implement input handling system
  - [x] 9.1 Create input event handlers
    - Implement keyboard event listener (spacebar)
    - Implement mouse click event listener
    - Implement touch event listener
    - Handle flap action during 'playing' state
    - Handle start transition from 'start' to 'playing' state
    - Handle restart transition from 'gameOver' to 'playing' state
    - _Requirements: 1.2, 2.2, 6.5_
  
  - [ ]* 9.2 Write property test for state transition from start to playing
    - **Property 1: State Transition from Start to Playing**
    - **Validates: Requirements 1.2**
  
  - [ ]* 9.3 Write property test for monkey initialization position
    - **Property 2: Monkey Initialization Position**
    - **Validates: Requirements 1.3**

- [ ] 10. Implement rendering system
  - [x] 10.1 Create rendering utility functions
    - Implement `clearCanvas` function
    - Implement `renderBackground` function (scrolling background)
    - Implement `renderMonkey` function (monkey sprite or emoji)
    - Implement `renderObstacles` function (top and bottom pipes with gap)
    - Implement `renderHUD` function (score display in top-right corner)
    - _Requirements: 5.2, 7.1, 7.2, 7.3, 7.5_
  
  - [x] 10.2 Integrate rendering into game loop
    - Call rendering functions each frame
    - Ensure 60 FPS target with requestAnimationFrame
    - Update background offset for scrolling effect
    - _Requirements: 7.4_

- [ ] 11. Implement game state screens
  - [x] 11.1 Create start screen UI
    - Display game title "Flying Monkey"
    - Display "Press Space or Click to Start" prompt
    - Style with Tailwind CSS
    - _Requirements: 1.1_
  
  - [x] 11.2 Create game over screen UI
    - Display "Game Over" message
    - Display final score
    - Display best score
    - Display "Play Again" button/prompt
    - Style with Tailwind CSS
    - _Requirements: 6.2, 6.3, 6.4, 6.6_
  
  - [x] 11.3 Implement game state reset logic
    - Reset score to 0
    - Clear obstacles array
    - Reset monkey to initial position with velocityY = 0
    - Reset frameCount to 0
    - Transition gameState to 'playing'
    - _Requirements: 6.5_
  
  - [ ]* 11.4 Write property test for game state reset
    - **Property 16: Game State Reset**
    - **Validates: Requirements 6.5**
  
  - [ ]* 11.5 Write property test for best score tracking
    - **Property 17: Best Score Tracking**
    - **Validates: Requirements 6.6**

- [ ] 12. Add visual polish and assets
  - [x] 12.1 Enhance visual rendering
    - Add monkey sprite or styled emoji rendering
    - Style obstacles as pipes or trees with colors
    - Add scrolling background with sky/clouds theme
    - Ensure HUD has sufficient contrast and legibility
    - _Requirements: 7.1, 7.2, 7.3, 7.5_
  
  - [ ]* 12.2 Write unit tests for rendering functions
    - Test canvas context handling
    - Test rendering with various canvas dimensions
    - Test HUD score display formatting

- [x] 13. Final checkpoint - Complete testing and validation
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Integration and final wiring
  - [x] 14.1 Verify complete game flow
    - Test start → playing → game over → restart cycle
    - Verify all requirements are met
    - Test responsive canvas behavior
    - Verify 60 FPS performance
    - _Requirements: All_
  
  - [ ]* 14.2 Write integration tests
    - Test complete game session flow
    - Test input handling across all game states
    - Test canvas resize behavior
    - Test performance and frame rate consistency

- [x] 15. Enhancement: Improve monkey visual appearance
  - Replace brown box with monkey emoji (🐵) or canvas-drawn monkey features
  - Add eyes, ears, and facial features to make monkey recognizable
  - Ensure monkey rendering maintains 60 FPS performance
  - _Requirements: 7.1_

- [x] 16. Enhancement: Add game intro message
  - Create new game state 'intro' between 'start' and 'playing'
  - Display message: "Hi I'm a naughty monkey and i like to jump and fly!"
  - Auto-dismiss after 3 seconds or on user input
  - Only show on initial start, not on restart after game over
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 17. Enhancement: Add bonus collectibles system
  - [x] 17.1 Create collectible data structure and utility functions
    - Define `Collectible` interface with position and dimensions
    - Implement `generateCollectible` function (random vertical position)
    - Implement `moveCollectibles` function (moves left at 3 px/frame)
    - Implement `removeOffscreenCollectibles` function
    - Implement `shouldGenerateCollectible` function (every 180 frames)
    - _Requirements: 9.1, 9.2, 9.3, 9.7, 9.8_
  
  - [x] 17.2 Implement collectible collision detection
    - Implement `checkMonkeyCollectibleCollision` function
    - Award +5 points when monkey collects a milk bottle
    - Remove collected items from active list
    - _Requirements: 9.4, 9.5_
  
  - [x] 17.3 Integrate collectibles into game loop
    - Add collectibles state management
    - Generate collectibles during gameplay
    - Check for collection each frame
    - Render milk bottle emoji (🍼) or icon
    - _Requirements: 9.6_

- [x] 18. Enhancement: Add sound effects
  - Create sound utility using Web Audio API
  - Play beep sound when passing obstacles
  - Play collection sound when collecting milk bottles
  - Play game over sound on collision
  - Ensure graceful degradation if Web Audio API not supported
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- Integration tests validate end-to-end user flows
- The game uses TypeScript throughout for type safety
- All game logic is encapsulated in a single React client component for simplicity
- Canvas rendering provides 60 FPS performance with requestAnimationFrame
up