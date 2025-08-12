# CLAUDE.md — Lucien's Crystal Forge

> **AI-Powered React Component Generator** — Where code becomes magic through the power of crystals and local AI models.

---

## 1. Project Overview

Lucien's Crystal Forge is a **desktop application** for AI-assisted React component generation.  
It uses specialized crystal agents and local AI models (Ollama) to generate, preview, and manage React components with TypeScript and Tailwind CSS.

**Core Features:**
- **AI Component Generation** — Natural language to production-ready React components
- **Live Preview System** — Sandboxed iframe with real-time component rendering
- **Component Library** — Persistent storage and organization of generated components
- **Crystal Agent System** — Specialized AI agents for different development tasks
- **Local AI Integration** — Ollama-powered generation for privacy and speed

---

## 2. Architecture & Tech Stack

**Frontend**
- React 19 + TypeScript
- TailwindCSS v3 (utility-first styling)
- Zustand (state management)
- Framer Motion (animations)
- Sandboxed iframe for live preview
- Lucide React (icons)

**Backend**
- Tauri v2 (Rust-based desktop framework)
- Tauri Plugin FS (file system operations)
- Component storage in AppData directory

**AI Integration**
- Ollama API (`localhost:11434`)
- CodeLlama 13B Instruct (default model)
- Custom Amethyst agent for code generation

**Development Tools**
- Vite (build system)
- TypeScript (type safety)
- ESLint + Prettier (code quality)
- Testing Library (component testing)

---

## 3. Current Crystal Agent System

**Phase 2.5 MVP Implementation:**

| Crystal   | Status      | Role                           | Model                    |
|-----------|-------------|--------------------------------|--------------------------|
| Amethyst  | ✅ Active   | React component generation     | codellama:13b-instruct   |
| Quartz    | 🔮 Planned  | Reasoning & model routing      | TBD                      |
| Obsidian  | 🔮 Planned  | Security & dependency review   | TBD                      |
| Emerald   | 🔮 Planned  | UI scaffolding & styling       | TBD                      |
| Sapphire  | 🔮 Planned  | Documentation generation       | TBD                      |
| Ruby      | 🔮 Planned  | Test generation                | TBD                      |

---

## 4. Setup Instructions

### Prerequisites
- Node.js 18+
- Rust (latest stable)
- npm or pnpm
- [Ollama](https://ollama.ai) with CodeLlama model

### Installation
```bash
# Clone and install
git clone <repository>
cd agentforge
npm install

# Install Ollama model
ollama pull codellama:13b-instruct

# Start Ollama server
ollama serve
```

### Running the Application
```bash
# Web development (fast iteration)
npm run dev

# Desktop application (full features)
npm run dev:tauri

# Production build
npm run build:tauri
```

### Required Directory Structure
Crystal Forge uses **Tauri AppData** for component storage:
```
%APPDATA%/crystal-forge-components/     # Windows
~/.local/share/crystal-forge-components/  # Linux  
~/Library/Application Support/crystal-forge-components/  # macOS

Structure:
  components-manifest.json              # Component metadata
  ComponentName.tsx                    # Generated components
  AnotherComponent.tsx
  ...
```

---

## 5. Phase 2.5 MVP Features

### ✅ **Live Component Preview**
- Sandboxed iframe rendering
- Real-time preview of generated components  
- Tailwind CSS properly loaded
- Error handling for broken components
- Fullscreen and refresh controls

### ✅ **Model Selector Dropdown**
- Switch between available Ollama models
- CodeLlama (active), Claude (coming soon), Test Mode
- Provider indicators and status
- Graceful fallback handling

### ✅ **Split View Interface**
- Toggle between Preview/Code Only modes
- Side-by-side code and preview panels
- Responsive layout adjustments
- Smooth animations between states

### ✅ **Component Library Management**
- Save generated components to filesystem
- Search and filter by name, description, tags
- Auto-tagging based on code patterns
- Copy to clipboard functionality
- Delete and organize components

### ✅ **Crystal Memory System**
- Store last 10 component generations
- Performance metrics tracking
- Generation history with timestamps
- Copy previous generations

---

## 6. Amethyst Agent Capabilities

**Code Generation Rules:**
- TypeScript with explicit prop interfaces
- Semantic HTML with accessibility attributes
- Tailwind utility classes only (no custom CSS)
- Functional components with React hooks
- Props validation and default values
- No placeholder/lorem ipsum content

**Supported Component Types:**
- Buttons (variants, sizes, states)
- Cards (layouts, content organization)
- Hero sections (landing page headers)
- Forms (inputs, validation, submission)
- Modals (dialogs, overlays, popups)
- Navigation (menus, breadcrumbs)
- Lists (grids, galleries, data display)
- Alerts (notifications, messages)
- Badges (tags, labels, status indicators)

---

## 7. Component Generation Workflow

### Basic Usage:
1. **Launch Application**
   ```bash
   npm run dev:tauri
   ```

2. **Ensure Ollama Connection**
   - Check crystal status indicator (should show "Crystal Resonating")
   - Verify Ollama is running on `localhost:11434`

3. **Cast a Spell** (Generate Component)
   ```
   Input: "Create a responsive hero section with animated gradient background"
   Shortcut: Ctrl+Enter to cast
   ```

4. **Review Results**
   - Live preview renders automatically
   - Code appears in split-view panel
   - Copy code to clipboard when satisfied

5. **Save to Library**
   - Click "Save Last Generation" 
   - Enter component name
   - Component saved to AppData directory

### Advanced Usage:
```bash
# Example prompts for different component types:
"Create a pricing card with purple gradient and hover effects"
"Build a modal dialog with backdrop blur and close button"
"Design a navigation header with logo and menu items"
"Generate a form with validation states and submit button"
```

---

## 8. File Structure

```
agentforge/
├── src/
│   ├── components/
│   │   ├── dashboard/           # Main UI and spell casting
│   │   ├── preview/            # Live preview system
│   │   ├── ui/                 # Reusable UI components
│   │   ├── ComponentLibrary.tsx # Component management
│   │   └── ModelSelector.tsx   # Model switching UI
│   ├── services/
│   │   ├── amethyst.ts         # Component generation logic
│   │   ├── ollama.ts           # Ollama API integration  
│   │   └── componentManager.ts # File persistence
│   ├── stores/
│   │   └── crystalStore.ts     # Application state
│   ├── types/
│   │   └── crystal.ts          # TypeScript definitions
│   └── lib/
│       └── crystals.ts         # Crystal configuration
├── src-tauri/
│   ├── src/
│   │   ├── hardware/           # System detection
│   │   ├── llm/               # AI integrations
│   │   └── lib.rs             # Main Tauri application
│   ├── capabilities/
│   │   └── default.json       # Tauri permissions
│   └── tauri.conf.json       # Tauri configuration
└── package.json              # Dependencies and scripts
```

---

## 9. Development Commands

### Primary Commands:
```bash
npm run dev              # Vite dev server (web only)
npm run dev:tauri        # Full Tauri app (recommended)
npm run build            # Build web version
npm run build:tauri      # Build desktop app
npm run type-check       # TypeScript validation
npm run lint             # ESLint code quality
npm run format           # Prettier formatting
```

### In-Application Shortcuts:
- `Ctrl+Enter` — Cast spell (generate component)
- `Toggle Preview` — Switch between code/preview modes
- `Fullscreen Preview` — Expand preview panel
- `Refresh Preview` — Reload component render

---

## 10. Troubleshooting

### Common Issues:

**🔴 "Crystal Dormant" - Ollama Not Connected**
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama if needed
ollama serve

# Pull required model
ollama pull codellama:13b-instruct
```

**🔴 Component Preview Shows Error**
- Check browser console for JavaScript errors
- Verify component syntax is valid
- Ensure Tailwind classes are properly formatted
- Use "Refresh Preview" button

**🔴 Components Not Saving**
- Tauri filesystem permissions issue
- Check if AppData directory is writable
- Verify Tauri Plugin FS is properly installed

**🔴 TypeScript Errors**
```bash
# Clean type check
npm run type-check

# Fix formatting
npm run format
```

**🔴 Tauri Build Fails**
```bash
# Update Rust toolchain
rustup update

# Clean build
cd src-tauri
cargo clean
cd ..
npm run build:tauri
```

---

## 11. Known Limitations (Phase 2.5)

- **No Props Playground** — Cannot edit component props interactively
- **Static Preview State** — No state persistence between refreshes  
- **Basic Icon Mocking** — Lucide icons shown as emojis in preview
- **Limited Error Details** — Basic error messages in preview
- **Single Crystal** — Only Amethyst agent implemented
- **No Live Editing** — Cannot edit generated code inline

---

## 12. Phase 3 Roadmap

### Quick Wins (1-2 hours each):
- **Props Editor** — JSON input for component props
- **Preview Themes** — Light/dark mode toggle
- **Better Icons** — Proper Lucide icon rendering
- **Export to CodeSandbox** — One-click playground export

### Major Features (4-8 hours each):
- **Monaco Editor** — Replace textarea with full code editor
- **Live Component Editing** — Edit code, see changes instantly
- **Component Variations** — Generate multiple versions
- **Additional Crystals** — Ruby (testing), Sapphire (docs), Emerald (optimization)
- **Performance Profiling** — Bundle size analysis, render metrics

---

## 13. Memory Patterns for Claude Code

### Essential Commands:
```bash
# Quick start
cd agentforge && npm run dev:tauri

# Fix TypeScript
npm run type-check

# Component development
# 1. Generate with Amethyst
# 2. Preview in split view  
# 3. Save to library
# 4. Copy to project
```

### File Locations:
- **Config**: `src/lib/crystals.ts`
- **Components**: `%APPDATA%/crystal-forge-components/`
- **Main Logic**: `src/services/amethyst.ts`
- **State**: `src/stores/crystalStore.ts`

### Testing Workflow:
1. Generate test component: "Create a simple button with click handler"
2. Verify preview renders correctly
3. Check TypeScript compilation passes
4. Test save/load functionality
5. Confirm component library search works

---

**This document represents the current Phase 2.5 MVP implementation of Lucien's Crystal Forge. The crystal agent system will expand in future phases to include the full mystical development platform.**