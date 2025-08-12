# 🔮 Lucien's Crystal Forge

> **AI-Powered React Component Generator** — Where code becomes magic through the power of crystals and local AI models.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tauri](https://img.shields.io/badge/Tauri-FFC131?style=for-the-badge&logo=Tauri&logoColor=white)](https://tauri.app/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## ✨ Overview

Crystal Forge is a desktop application that harnesses the mystical power of AI to generate production-ready React components from natural language descriptions. Built with privacy-first local AI models, it features live preview, component management, and a magical crystal-themed interface.

### 🎯 **Key Features**

- **🤖 AI Component Generation** — Transform natural language into TypeScript React components
- **👁️ Live Preview System** — Real-time sandboxed component rendering with Tailwind CSS
- **📚 Component Library** — Persistent storage and organization with search capabilities
- **🔮 Crystal Agent System** — Specialized AI agents for different development tasks
- **🏠 Local AI Integration** — Privacy-focused Ollama integration (no cloud required)
- **⚡ Lightning Fast** — Optimized for rapid component prototyping and iteration

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **Rust** (latest stable)
- **Ollama** with CodeLlama model

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/crystal-forge.git
cd crystal-forge

# 2. Install dependencies
npm install

# 3. Setup Ollama (if not already installed)
# Download from: https://ollama.ai
ollama pull codellama:13b-instruct

# 4. Start Ollama server
ollama serve
```

### Development

```bash
# Web development (fast iteration)
npm run dev

# Desktop application (full features)
npm run dev:tauri

# Production build
npm run build:tauri
```

### First Component Generation

1. Launch the application: `npm run dev:tauri`
2. Verify "Crystal Resonating" status (green indicator)
3. Enter a component description: `"Create a purple gradient button with hover effects"`
4. Press `Ctrl+Enter` to cast your spell
5. Watch the magic happen in the live preview!

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 19 + TypeScript | Component-based UI with type safety |
| **Styling** | Tailwind CSS v3 | Utility-first responsive design |
| **State** | Zustand + Devtools | Lightweight state management |
| **Animation** | Framer Motion | Smooth UI transitions |
| **Desktop** | Tauri v2 (Rust) | Cross-platform native performance |
| **AI** | Ollama + CodeLlama | Local privacy-focused inference |
| **Build** | Vite + TypeScript | Fast development and production builds |

### Project Structure

```
crystal-forge/
├── src/                          # Frontend application
│   ├── components/
│   │   ├── dashboard/           # Main UI and spell casting interface
│   │   ├── preview/             # Live preview system components
│   │   ├── ui/                  # Reusable UI components
│   │   └── ComponentLibrary.tsx # Component management interface
│   ├── services/
│   │   ├── amethyst.ts         # AI component generation logic
│   │   ├── ollama.ts           # Ollama API integration
│   │   └── componentManager.ts # File persistence service
│   ├── stores/
│   │   └── crystalStore.ts     # Application state management
│   └── types/
│       └── crystal.ts          # TypeScript type definitions
├── src-tauri/                   # Rust backend
│   ├── src/
│   │   ├── hardware/           # System detection
│   │   ├── llm/               # AI model integrations
│   │   └── lib.rs             # Main Tauri application
│   └── capabilities/
│       └── default.json       # Security permissions
├── CLAUDE.md                   # Project documentation
└── .claude/
    └── memory                  # Development quick reference
```

---

## 🔮 Crystal Agent System

Currently in **Phase 2.5 MVP** with Amethyst as the primary agent:

| Crystal | Status | Role | Model |
|---------|--------|------|-------|
| **Amethyst** | ✅ Active | React component generation | CodeLlama 13B |
| **Quartz** | 🔮 Planned | Reasoning & model routing | TBD |
| **Obsidian** | 🔮 Planned | Security & dependency review | TBD |
| **Emerald** | 🔮 Planned | UI scaffolding & styling | TBD |
| **Sapphire** | 🔮 Planned | Documentation generation | TBD |
| **Ruby** | 🔮 Planned | Test generation | TBD |

### Amethyst Agent Capabilities

- **TypeScript Generation** with explicit prop interfaces
- **Accessibility-First** semantic HTML structure
- **Tailwind-Only Styling** (no custom CSS)
- **Component Variants** (sizes, states, themes)
- **Best Practices** following React and TypeScript conventions

---

## 🎨 Usage Examples

### Component Generation Prompts

```bash
# Buttons & Interactive Elements
"Create a gradient button with loading state and ripple effect"
"Build a toggle switch with smooth animation"

# Layout Components  
"Design a responsive hero section with animated background"
"Generate a pricing card with purple theme and hover effects"

# Forms & Inputs
"Create a login form with validation states and icons"
"Build a search input with dropdown suggestions"

# Navigation
"Design a sidebar navigation with collapsible sections"
"Create a breadcrumb navigation with home icon"

# Data Display
"Generate a user profile card with avatar and stats"
"Build a progress bar with percentage display"
```

### Keyboard Shortcuts

- `Ctrl+Enter` — Cast spell (generate component)
- `Ctrl+S` — Save current generation to library
- `F11` — Toggle preview fullscreen
- `Ctrl+R` — Refresh preview
- `Ctrl+C` — Copy generated code

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Vite dev server (web only)
npm run dev:tauri        # Full Tauri app (recommended)

# Building
npm run build            # Build web version  
npm run build:tauri      # Build desktop application

# Code Quality
npm run type-check       # TypeScript validation
npm run lint             # ESLint code analysis
npm run format           # Prettier code formatting

# Testing
npm run test             # Run test suite
npm run test:coverage    # Generate coverage report
```

### Code Quality Standards

- **TypeScript Strict Mode** — Full type safety enforcement
- **ESLint + Prettier** — Consistent code style and quality
- **Conventional Commits** — Semantic commit message format
- **Component Testing** — React Testing Library integration
- **Performance Monitoring** — Built-in generation metrics

### Contributing Guidelines

1. **Fork & Clone** the repository
2. **Create Feature Branch** — `git checkout -b feature/amazing-crystal`
3. **Follow Conventions** — Use TypeScript, Prettier, and conventional commits
4. **Test Thoroughly** — Ensure all features work with Ollama integration
5. **Submit PR** — Include clear description and testing instructions

---

## 🔧 Configuration

### Ollama Setup

```bash
# Install required model
ollama pull codellama:13b-instruct

# Alternative models (experimental)
ollama pull qwen:7b-instruct     # Faster, smaller model
ollama pull mistral:7b-instruct  # Balanced performance
```

### Component Storage

Components are automatically saved to:
- **Windows:** `%APPDATA%/crystal-forge-components/`
- **macOS:** `~/Library/Application Support/crystal-forge-components/`
- **Linux:** `~/.local/share/crystal-forge-components/`

### Environment Variables

```bash
# Optional: Custom Ollama endpoint
OLLAMA_BASE_URL=http://localhost:11434

# Optional: Default model override
DEFAULT_MODEL=codellama:13b-instruct
```

---

## 🐛 Troubleshooting

### Common Issues

<details>
<summary><strong>🔴 "Crystal Dormant" - Ollama Connection Failed</strong></summary>

**Symptoms:** Red crystal status indicator, generation fails

**Solutions:**
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama service
ollama serve

# Verify model is installed
ollama list
ollama pull codellama:13b-instruct
```
</details>

<details>
<summary><strong>🔴 Component Preview Shows Error</strong></summary>

**Symptoms:** Preview pane displays error message

**Solutions:**
- Click "Refresh Preview" button
- Check for TypeScript errors in generated code
- Verify Tailwind classes are valid
- Look for missing imports or syntax issues
</details>

<details>
<summary><strong>🔴 Components Not Saving to Library</strong></summary>

**Symptoms:** Save button doesn't work, components disappear

**Solutions:**
- Verify Tauri filesystem permissions in `src-tauri/capabilities/default.json`
- Check if AppData directory is writable
- Restart application as administrator (Windows)
- Check browser console for permission errors
</details>

<details>
<summary><strong>🔴 TypeScript Compilation Errors</strong></summary>

**Symptoms:** Build fails, red squiggly lines in editor

**Solutions:**
```bash
# Run type checking
npm run type-check

# Common fixes needed:
# - Remove unused imports (React 19 doesn't need React import)
# - Add proper type annotations
# - Fix implicit 'any' types
```
</details>

---

## 📊 Performance & Metrics

### Generation Performance

| Metric | Typical Range | Optimization Tips |
|--------|---------------|-------------------|
| **Tokens/Second** | 15-50 tok/s | Use smaller models for speed |
| **Response Time** | 2-8 seconds | Shorter prompts generate faster |
| **Success Rate** | >95% | Follow component patterns |
| **Memory Usage** | <500MB | Clear crystal memory periodically |

### System Requirements

- **RAM:** 8GB minimum, 16GB recommended
- **Storage:** 2GB free space (models + components)
- **CPU:** Modern multi-core processor
- **GPU:** Optional (can accelerate Ollama inference)

---

## 🗺️ Roadmap

### Phase 3.0 — Enhanced Experience (Q1 2025)

- [ ] **Monaco Editor Integration** — Full-featured code editing
- [ ] **Props Playground** — Interactive component prop editing  
- [ ] **Component Variations** — Generate multiple design options
- [ ] **Export Integration** — Direct export to CodeSandbox/StackBlitz

### Phase 3.5 — Advanced Crystals (Q2 2025)

- [ ] **Ruby Crystal** — Automated test generation
- [ ] **Sapphire Crystal** — Documentation generation
- [ ] **Emerald Crystal** — Performance optimization
- [ ] **Obsidian Crystal** — Security analysis

### Phase 4.0 — Collaboration (Q3 2025)

- [ ] **Team Libraries** — Shared component collections
- [ ] **Cloud Sync** — Cross-device component sync
- [ ] **Git Integration** — Version control for components
- [ ] **Plugin System** — Custom crystal development

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Ollama](https://ollama.ai)** — Local AI model hosting
- **[Tauri](https://tauri.app)** — Rust-based desktop framework
- **[CodeLlama](https://github.com/facebookresearch/codellama)** — Meta's code-specialized LLM
- **[Tailwind CSS](https://tailwindcss.com)** — Utility-first CSS framework
- **[React](https://react.dev)** — Component-based UI library

---

<div align="center">

**✨ Built with magic, powered by crystals ✨**

[Report Bug](https://github.com/yourusername/crystal-forge/issues) · [Request Feature](https://github.com/yourusername/crystal-forge/issues) · [Documentation](./CLAUDE.md)

</div>