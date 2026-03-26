# My React TypeScript App

A modern React application with TypeScript, built using Vite for fast development and optimized builds.

## Features

- ⚡ **Fast Development**: Vite for instant HMR (Hot Module Replacement)
- 🔥 **React 18**: Latest React features with hooks
- 📝 **TypeScript**: Full type safety and IntelliSense support
- 🎨 **ESLint**: Code quality and consistency
- 📦 **pnpm**: Fast and disk space efficient package manager

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Install Dependencies

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

The app will start at `http://localhost:5173` (or similar port).

### Build for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

## Project Structure

```
.
├── src/                 # Source code
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   └── App.tsx        # Main App component
├── public/            # Static assets
├── .gitignore        # Git ignore rules
├── index.html         # HTML entry point
├── package.json       # Project dependencies
├── tsconfig.json      # TypeScript configuration
└── vite.config.ts     # Vite configuration
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking

## Technologies Used

- [Vite](https://vitejs.dev/) - Build tool and dev server
- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [ESLint](https://eslint.org/) - Linter for JavaScript/TypeScript
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) - React support for Vite

## Development Tips

1. **TypeScript**: Full type coverage ensures better code quality and fewer runtime errors
2. **Fast Refresh**: Changes appear instantly without losing component state
3. **HMR**: Works with all file types (JS, TS, JSX, TSX, CSS, etc.)

## License

MIT
