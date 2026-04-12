# Flying Monkey Game - Setup Instructions

## PowerShell Execution Policy Fix

Your system's PowerShell execution policy is currently blocking npm/npx commands. Here's how to fix it:

### Option 1: Temporary Fix (Recommended for Testing)
Run this command in PowerShell **as Administrator**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
```
This will allow scripts to run for the current PowerShell session only.

### Option 2: Permanent Fix (User Level)
Run this command in PowerShell **as Administrator**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
This will permanently allow scripts for your user account.

### Option 3: Bypass for Single Command
You can bypass the policy for individual commands:
```powershell
powershell -ExecutionPolicy Bypass -Command "npm install"
```

## Installation Steps

After fixing the execution policy, follow these steps:

### 1. Install Dependencies
```bash
npm install
```

This will install all required packages including:
- Next.js 14+
- React 18+
- TypeScript
- Tailwind CSS
- Testing dependencies (if configured)

### 2. Run the Development Server
```bash
npm run dev
```

The game will be available at: http://localhost:3000

### 3. Run Tests (Optional)

**Note:** Jest is not currently configured. To set up testing:

#### Install Jest and Testing Dependencies
```bash
npm install --save-dev jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

#### Create Jest Configuration
Create a file named `jest.config.js` in the root directory:
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

#### Create Jest Setup File
Create a file named `jest.setup.js` in the root directory:
```javascript
import '@testing-library/jest-dom'
```

#### Run Tests
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
npm start
```

## Game Controls

- **Spacebar** or **Click/Tap**: Make the monkey flap upward
- **Spacebar** or **Click/Tap** on start screen: Start the game
- **Spacebar** or **Click/Tap** on game over: Restart the game

## Verification Checklist

✅ All TypeScript files compile without errors
✅ Game logic is properly implemented:
  - Physics system (gravity, flap, velocity clamping)
  - Collision detection (AABB with hitbox inset)
  - Obstacle generation and movement
  - Scoring system
✅ React component structure is correct
✅ Test files are written and ready to run

## Troubleshooting

### If npm commands still don't work:
1. Close and reopen PowerShell/Terminal after changing execution policy
2. Make sure you're running PowerShell as Administrator
3. Try using Command Prompt (cmd.exe) instead of PowerShell

### If the game doesn't render:
1. Check browser console for errors (F12)
2. Ensure all dependencies are installed
3. Try clearing browser cache and reloading

### If tests fail:
1. Make sure Jest is properly configured (see step 3 above)
2. Check that all test dependencies are installed
3. Verify the test files are in the correct location

## Next Steps

Once dependencies are installed and the dev server is running:
1. Open http://localhost:3000 in your browser
2. Test the game controls
3. Verify all game mechanics work correctly
4. Run the test suite to validate all functionality
