# BetterNotes

A minimalist note-taking app built with Tauri and React.

## Features

- Clean, distraction-free interface
- Auto-saving notes locally
- Dark theme for a modern look
- Lightweight and fast

## Setup Instructions

### Prerequisites

1. Install [Node.js](https://nodejs.org/) (v16 or later)
2. Install [Rust](https://www.rust-lang.org/tools/install)
3. Install Tauri CLI:
   ```
   npm install -g @tauri-apps/cli
   ```

### Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run tauri dev
   ```

### Building for Production

To build the app for production:

```
npm run tauri build
```

This will create an executable in the `src-tauri/target/release` directory.

## Project Structure

- `src/` - React frontend code
  - `components/` - React components
  - `types.ts` - TypeScript type definitions
- `src-tauri/` - Rust backend code
  - `src/` - Rust source files
  - `Cargo.toml` - Rust dependencies

## Technologies Used

- Tauri - For the native app shell
- React - For the UI
- Slate.js - For the rich text editor
- Styled Components - For styling
- TypeScript - For type safety
