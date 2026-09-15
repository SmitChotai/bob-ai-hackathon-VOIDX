<<<<<<< HEAD
# Source Code

Place all your project's source code in this folder.

## Structure Guidelines

Organize your code logically. Here are common patterns — use whatever fits
your project:

### Web Application
```
src/
  backend/        ← API server code
  frontend/       ← UI code
  shared/         ← Shared utilities/types
```

### Data / AI Project
```
src/
  data/           ← Data ingestion / preprocessing
  models/         ← ML model code
  api/            ← Serving layer
  notebooks/      ← Jupyter notebooks (exploration)
```

### CLI / Script-based Tool
```
src/
  cli/            ← CLI entry points
  lib/            ← Core logic
  utils/          ← Helpers
```

## Important Files to Include

- `requirements.txt` or `package.json` — dependency manifest
- `.env.example` — template for environment variables (NEVER commit `.env`)
- Any database migration files
- Configuration files

## What NOT to Include in src/

- `.env` files with real secrets
- Large binary files (use Git LFS or link externally)
- `node_modules/` or `venv/` (these are in `.gitignore`)
- Build artifacts (`dist/`, `build/`, `__pycache__/`)
=======
# SupplyGuard AI — Application Source

This directory contains the full React + TypeScript application.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run typecheck` | TypeScript type check only |
| `npm run preview` | Preview production build locally |

## Source Structure

```
src/
├── components/        # React UI components
│   ├── Sidebar.tsx        — Navigation sidebar
│   ├── Dashboard.tsx      — Main disruption dashboard
│   ├── KPICard.tsx        — KPI metric cards
│   ├── DisruptionCard.tsx — Individual disruption card
│   ├── ShipmentTable.tsx  — Shipment impact table
│   ├── ReroutingPanel.tsx — AI rerouting recommendation
│   ├── FleetPanel.tsx     — Fleet utilisation + redeployment
│   ├── ColdChainPanel.tsx — Cold chain IoT monitoring
│   └── AICopilot.tsx      — Conversational AI interface
├── data/              # Simulated logistics data
│   ├── disruptions.ts     — Active disruptions
│   ├── routes.ts          — Routes + alternative routes
│   ├── shipments.ts       — Shipment records
│   ├── fleet.ts           — Fleet assets
│   └── coldChain.ts       — IoT temperature sensor readings
├── engine/            # AI recommendation engine
│   └── recommendations.ts — Rule-based analysis + scoring
├── types/             # TypeScript type definitions
│   └── index.ts
├── App.tsx            — Root app + view routing
├── main.tsx           — React entry point
└── index.css          — Global styles
```

## Environment Variables

See `.env.example`. No external APIs required for the MVP — all data is simulated locally.
>>>>>>> master
