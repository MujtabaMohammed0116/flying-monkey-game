# Flying Monkey Game

A browser-based arcade game built with Next.js 14+, inspired by Flappy Bird. Control a monkey character that automatically moves forward while gravity pulls it downward. Tap or click to make the monkey flap upward and navigate through obstacles.

## Technology Stack

- **Next.js 14+**: React framework with App Router
- **React 18+**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **HTML5 Canvas**: 2D game rendering

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main game page
│   └── globals.css         # Global styles with Tailwind
├── components/
│   └── GameComponent.tsx   # Main game component with canvas
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Game Features (In Development)

- ✅ Next.js project structure with TypeScript
- ✅ Tailwind CSS configuration
- ✅ Canvas element with viewport resize handling
- ⏳ Physics system (gravity, flap mechanics)
- ⏳ Obstacle generation and movement
- ⏳ Collision detection
- ⏳ Scoring system
- ⏳ Game states (start, playing, game over)
- ⏳ Visual assets and polish

## License

MIT
