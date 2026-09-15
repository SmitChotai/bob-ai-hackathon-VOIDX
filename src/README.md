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
