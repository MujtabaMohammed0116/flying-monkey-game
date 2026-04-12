# Requirements Document

## Introduction

Flying Monkey is a browser-based arcade game built as a Next.js application, inspired by Flappy Bird. The player controls a monkey that automatically moves forward through a series of obstacles. Gravity continuously pulls the monkey downward, and the player taps or clicks to make the monkey flap upward. The goal is to navigate through as many obstacles as possible without colliding. A live score is displayed during play, and a game-over screen shows the final score with a restart option.

## Technology Stack

### Core Framework
- **Next.js 14+**: React framework with App Router for server-side rendering and routing
- **React 18+**: UI library for component-based architecture
- **TypeScript**: Type-safe JavaScript for improved developer experience and code quality

### Rendering
- **HTML5 Canvas API**: Native browser canvas for 2D game rendering
- **requestAnimationFrame**: Browser API for smooth 60 FPS game loop

### Styling
- **Tailwind CSS**: Utility-first CSS framework for UI components (start screen, game-over screen, HUD)
- **CSS Modules**: Scoped styling for component-specific styles

### State Management
- **React Hooks**: useState, useEffect, useRef for local component state and lifecycle management

### Development Tools
- **ESLint**: Code linting and quality enforcement
- **Prettier**: Code formatting

### Deployment
- **Vercel**: Recommended hosting platform for Next.js applications

---

## Glossary

- **Game**: The Flying Monkey Next.js application.
- **Monkey**: The player-controlled character that moves horizontally and is affected by gravity.
- **Obstacle**: A pair of vertical pipes (top and bottom) with a gap between them through which the Monkey must pass.
- **Gap**: The vertical opening between the top and bottom sections of an Obstacle through which the Monkey can safely pass.
- **Score**: An integer counter that increments each time the Monkey successfully passes through an Obstacle.
- **Game_Loop**: The continuous update cycle that drives physics, rendering, and collision detection.
- **Canvas**: The HTML5 canvas element used to render all game visuals.
- **Gravity**: A constant downward acceleration applied to the Monkey each game tick.
- **Flap**: An upward velocity impulse applied to the Monkey in response to player input.
- **Game_Over_Screen**: The UI overlay displayed when the game ends, showing the final Score and a restart option.
- **HUD**: The heads-up display showing the live Score in the top-right corner during gameplay.
- **Collectible**: A bonus item (baby milk bottle) that appears randomly between obstacles and awards bonus points when collected.
- **Intro_Message**: A welcome message displayed to the player before gameplay begins, introducing the monkey character.

---

## Requirements

### Requirement 1: Game Initialization

**User Story:** As a player, I want the game to load and be ready to play immediately, so that I can start playing without any setup.

#### Acceptance Criteria

1. THE Game SHALL render a start screen with the game title and a prompt to begin on initial page load.
2. WHEN the player presses the spacebar or clicks/taps the Canvas, THE Game SHALL transition from the start screen to active gameplay.
3. THE Game SHALL initialize the Monkey at a fixed horizontal position (left-center of the Canvas) and vertically centered position at the start of each game session.
4. THE Canvas SHALL fill the full viewport width and height and be responsive to window resize events.

---

### Requirement 2: Monkey Physics

**User Story:** As a player, I want the monkey to fall due to gravity and fly upward when I interact, so that the game feels physically engaging.

#### Acceptance Criteria

1. WHILE the Game_Loop is running, THE Game SHALL apply a constant Gravity acceleration of 0.5 pixels per frame squared to the Monkey's vertical velocity each tick.
2. WHEN the player presses the spacebar or clicks/taps the Canvas during active gameplay, THE Game SHALL apply a Flap impulse of -8 pixels per frame to the Monkey's vertical velocity.
3. THE Game SHALL clamp the Monkey's maximum downward velocity to 12 pixels per frame to prevent uncontrollably fast falling.
4. THE Monkey SHALL move horizontally at a constant speed of 3 pixels per frame automatically, without player input.
5. IF the Monkey's vertical position exceeds the bottom boundary of the Canvas, THEN THE Game SHALL trigger a game-over event.
6. IF the Monkey's vertical position goes above the top boundary of the Canvas, THEN THE Game SHALL clamp the Monkey's vertical position to 0 and set its vertical velocity to 0.

---

### Requirement 3: Obstacle Generation

**User Story:** As a player, I want obstacles to appear at regular intervals with varying gap positions, so that the game is challenging and unpredictable.

#### Acceptance Criteria

1. THE Game SHALL generate a new Obstacle pair every 90 frames during active gameplay.
2. WHEN an Obstacle is generated, THE Game SHALL assign the Gap a random vertical center position between 20% and 80% of the Canvas height.
3. THE Gap SHALL have a fixed height of 160 pixels for each Obstacle.
4. THE Game SHALL move all active Obstacles horizontally toward the Monkey at 3 pixels per frame.
5. WHEN an Obstacle moves beyond the left boundary of the Canvas, THE Game SHALL remove it from the active Obstacle list.
6. THE Game SHALL render at least 3 Obstacles visible on the Canvas simultaneously during active gameplay to ensure continuous challenge.

---

### Requirement 4: Collision Detection

**User Story:** As a player, I want the game to accurately detect when the monkey hits an obstacle, so that the game ends fairly.

#### Acceptance Criteria

1. WHEN the Monkey's bounding box overlaps with the bounding box of any Obstacle section (top or bottom pipe), THE Game SHALL trigger a game-over event.
2. THE Game SHALL use axis-aligned bounding box (AABB) collision detection for all Monkey-to-Obstacle collision checks.
3. THE Monkey's bounding box SHALL be inset by 4 pixels on all sides relative to its sprite dimensions to allow visually close passes without triggering a collision.

---

### Requirement 5: Scoring

**User Story:** As a player, I want to see my score increase as I pass obstacles, so that I have a sense of progress and achievement.

#### Acceptance Criteria

1. WHEN the Monkey's horizontal position passes the right edge of an Obstacle's Gap, THE Game SHALL increment the Score by 1.
2. THE HUD SHALL display the current Score as an integer in the top-right corner of the Canvas at all times during active gameplay.
3. THE Score SHALL be initialized to 0 at the start of each game session.
4. THE Game SHALL ensure each Obstacle contributes to the Score at most once per game session.

---

### Requirement 6: Game Over

**User Story:** As a player, I want to see my final score and be able to restart when the game ends, so that I can try to beat my previous performance.

#### Acceptance Criteria

1. WHEN a game-over event is triggered, THE Game SHALL stop the Game_Loop immediately.
2. WHEN a game-over event is triggered, THE Game SHALL display the Game_Over_Screen overlaid on the Canvas.
3. THE Game_Over_Screen SHALL display the player's final Score prominently.
4. THE Game_Over_Screen SHALL display a "Play Again" button or prompt.
5. WHEN the player activates the "Play Again" option (click, tap, or spacebar), THE Game SHALL reset all game state and restart the Game_Loop from the initial configuration.
6. THE Game SHALL preserve the highest Score achieved across sessions within the same browser tab and display it on the Game_Over_Screen as "Best Score".

---

### Requirement 7: Rendering and Visuals

**User Story:** As a player, I want the game to look visually appealing with a monkey character and themed obstacles, so that the experience is fun and immersive.

#### Acceptance Criteria

1. THE Game SHALL render the Monkey as a recognizable monkey character with visible features (eyes, ears, mouth) using emoji or canvas drawing on the Canvas.
2. THE Game SHALL render Obstacles as styled vertical bars (pipes or trees) with distinct top and bottom sections.
3. THE Game SHALL render a scrolling background to reinforce the sense of forward movement.
4. THE Canvas SHALL maintain a consistent frame rate targeting 60 frames per second using `requestAnimationFrame`.
5. THE HUD Score display SHALL use a legible font with sufficient contrast against the background to remain readable at all times.

---

### Requirement 8: Game Intro Message

**User Story:** As a player, I want to see a welcoming intro message that introduces the monkey character, so that the game feels more engaging and personable.

#### Acceptance Criteria

1. WHEN the player starts the game from the start screen, THE Game SHALL display an intro message overlay before gameplay begins.
2. THE intro message SHALL display the text: "Hi I'm a naughty monkey and i like to jump and fly!"
3. THE intro message SHALL be displayed for 3 seconds OR until the player presses spacebar/clicks/taps.
4. AFTER the intro message is dismissed, THE Game SHALL immediately transition to active gameplay.
5. THE intro message SHALL NOT appear on game restart after game over, only on the initial game start.

---

### Requirement 9: Bonus Collectibles

**User Story:** As a player, I want to collect bonus items during gameplay to earn extra points, so that the game is more rewarding and exciting.

#### Acceptance Criteria

1. THE Game SHALL generate baby milk bottle collectibles randomly between obstacles during active gameplay.
2. WHEN a Collectible is generated, THE Game SHALL position it at a random vertical position within the safe flying zone and horizontally between obstacles.
3. THE Game SHALL generate a new Collectible every 270 frames (three times the obstacle interval) to maintain balanced gameplay.
4. WHEN the Monkey's bounding box overlaps with a Collectible's bounding box, THE Game SHALL award +5 points to the Score.
5. WHEN a Collectible is collected, THE Game SHALL remove it from the active Collectible list immediately and play a collection sound effect.
6. THE Game SHALL render Collectibles as baby milk bottle emoji (🍼) or styled icon on the Canvas.
7. WHEN a Collectible moves beyond the left boundary of the Canvas, THE Game SHALL remove it from the active Collectible list.
8. THE Game SHALL move all active Collectibles horizontally at the same speed as Obstacles (3 pixels per frame).

---

### Requirement 11: Sound Effects

**User Story:** As a player, I want to hear sound effects during gameplay, so that the game feels more engaging and provides audio feedback for my actions.

#### Acceptance Criteria

1. WHEN the Monkey successfully passes through an Obstacle, THE Game SHALL play a pleasant beep sound effect.
2. WHEN the Monkey collects a bonus Collectible, THE Game SHALL play a distinct collection sound effect.
3. WHEN the game ends (collision or boundary hit), THE Game SHALL play a game over sound effect.
4. THE Game SHALL use the Web Audio API to generate sounds without requiring external audio files.
5. THE Game SHALL set sound volumes at appropriate levels to avoid being jarring or too loud.
6. IF the Web Audio API is not supported, THE Game SHALL gracefully degrade without crashing.

---

### Requirement 12: Next.js Project Structure

**User Story:** As a developer, I want the game built as a proper Next.js application, so that it can be easily deployed and extended.

#### Acceptance Criteria

1. THE Game SHALL be implemented as a Next.js application using the App Router (`app/` directory).
2. THE Game SHALL use a single dedicated page route (`/`) that renders the game Canvas.
3. THE Game SHALL encapsulate all game logic within a React client component using the `"use client"` directive.
4. THE Game SHALL use a `useEffect` hook to initialize and clean up the Game_Loop, preventing memory leaks on component unmount.
5. IF the Game component unmounts, THEN THE Game SHALL cancel any active `requestAnimationFrame` loop and remove all event listeners.



### Requirement 12: Next.js Project Structure

**User Story:** As a developer, I want the game built as a proper Next.js application, so that it can be easily deployed and extended.

#### Acceptance Criteria

1. THE Game SHALL be implemented as a Next.js application using the App Router (`app/` directory).
2. THE Game SHALL use a single dedicated page route (`/`) that renders the game Canvas.
3. THE Game SHALL encapsulate all game logic within a React client component using the `"use client"` directive.
4. THE Game SHALL use a `useEffect` hook to initialize and clean up the Game_Loop, preventing memory leaks on component unmount.
5. IF the Game component unmounts, THEN THE Game SHALL cancel any active `requestAnimationFrame` loop and remove all event listeners.
