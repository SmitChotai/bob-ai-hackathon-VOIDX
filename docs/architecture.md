# Architecture

## SupplyGuard AI — System Architecture

---

## Overview

SupplyGuard AI is a single-page application (SPA) that runs entirely in the browser. There is no backend server. All data is loaded from local TypeScript modules that can be replaced with real API calls without changing the UI layer.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (SPA)                            │
│                                                                 │
│  ┌─────────┐    ┌──────────────────────────────────────────┐   │
│  │ Sidebar │    │              Main View Area               │   │
│  │  Nav    │    │                                          │   │
│  │         │    │  ┌──────────┐  ┌──────────┐             │   │
│  │Dashboard│───▶│  │Dashboard │  │Shipment  │             │   │
│  │Shipments│    │  │(Disruption  │Table     │             │   │
│  │Fleet    │    │  │ KPIs)    │  │(Impact)  │             │   │
│  │Cold     │    │  └──────────┘  └──────────┘             │   │
│  │ Chain   │    │  ┌──────────┐  ┌──────────┐             │   │
│  │Copilot  │    │  │Fleet     │  │Cold Chain│             │   │
│  └─────────┘    │  │Panel     │  │Panel     │             │   │
│                 │  └──────────┘  └──────────┘             │   │
│                 │  ┌─────────────────────────┐            │   │
│                 │  │    AI Copilot Chat       │            │   │
│                 │  └─────────────────────────┘            │   │
│                 └──────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               Recommendation Engine                      │  │
│  │  analyzeRerouting() · recommendFleetForShipment()        │  │
│  │  classifyExcursion() · generateCopilotResponse()         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Data Layer (Local TS)                   │  │
│  │  disruptions.ts · routes.ts · shipments.ts               │  │
│  │  fleet.ts · coldChain.ts                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

```mermaid
graph TD
    A[User Opens App] --> B[App.tsx loads all data modules]
    B --> C[Sidebar renders navigation]
    B --> D[Dashboard computes KPIs]

    D --> E{User selects disruption}
    E --> F[getAffectedShipments filters shipments]
    F --> G[Shipment list rendered]

    G --> H{User selects shipment}
    H --> I[analyzeRerouting scores alternatives]
    I --> J[ReroutingPanel shows recommendation]

    B --> K[Fleet panel]
    K --> L[recommendFleetForShipment scores idle assets]
    L --> M[Redeployment recommendations shown]

    B --> N[Cold chain panel]
    N --> O[classifyExcursion checks each reading]
    O --> P{Excursion detected?}
    P -->|Yes| Q[Severity classification + regulatory action]
    P -->|No| R[Green status shown]

    B --> S[AI Copilot]
    S --> T[User types query]
    T --> U[generateCopilotResponse intent detection]
    U --> V[Response using live app data]
```

---

## Component Architecture

```mermaid
graph LR
    App --> Sidebar
    App --> Dashboard
    App --> ShipmentTable
    App --> FleetPanel
    App --> ColdChainPanel
    App --> AICopilot

    Dashboard --> KPICard
    Dashboard --> DisruptionCard
    Dashboard --> ReroutingPanel

    ShipmentTable --> ReroutingPanel

    FleetPanel -.-> recommendations.ts
    ColdChainPanel -.-> recommendations.ts
    AICopilot -.-> recommendations.ts
    Dashboard -.-> recommendations.ts
    ReroutingPanel -.-> recommendations.ts

    recommendations.ts -.-> disruptions.ts
    recommendations.ts -.-> shipments.ts
    recommendations.ts -.-> fleet.ts
    recommendations.ts -.-> coldChain.ts
    recommendations.ts -.-> routes.ts
```

---

## Components

| Component | File | Responsibility |
|---|---|---|
| `App` | `App.tsx` | Root component, view routing, selected disruption state |
| `Sidebar` | `Sidebar.tsx` | Navigation, live disruption count indicator |
| `Dashboard` | `Dashboard.tsx` | KPI cards, disruption list, affected shipment list |
| `KPICard` | `KPICard.tsx` | Reusable metric display card |
| `DisruptionCard` | `DisruptionCard.tsx` | Single disruption with severity/status badges |
| `ShipmentTable` | `ShipmentTable.tsx` | Filterable shipment table with impact badges |
| `ReroutingPanel` | `ReroutingPanel.tsx` | AI rerouting recommendation with metrics |
| `FleetPanel` | `FleetPanel.tsx` | Fleet status table + redeployment recommendations |
| `ColdChainPanel` | `ColdChainPanel.tsx` | IoT chart + excursion alerts + regulatory classification |
| `AICopilot` | `AICopilot.tsx` | Chat interface, quick questions, top actions sidebar |

---

## Data Modules

| Module | Records | Description |
|---|---|---|
| `disruptions.ts` | 3 disruptions | Mumbai Port Strike (ACTIVE), Cyclone Vayu (MONITORING), NH-48 closure (ACTIVE) |
| `routes.ts` | 8 routes + 6 alternatives | Standard routes with affected disruption IDs, alternative routes with cost/delay/confidence |
| `shipments.ts` | 10 shipments | 4 AFFECTED, 2 AT_RISK, 4 NOT_AFFECTED; includes 2 cold-chain shipments |
| `fleet.ts` | 12 assets | Trucks, containers, vessels; mix of BUSY, IDLE, MAINTENANCE |
| `coldChain.ts` | 3 monitored shipments | MED-001 (SEVERE excursion), MED-002 (compliant), SH-003 (MINOR excursion) |

---

## Recommendation Engine

| Function | Input | Output |
|---|---|---|
| `getAffectedShipments()` | Disruption, all shipments | List of shipments with matching disruption ID |
| `analyzeRerouting()` | Shipment | Best alternative route + scoring breakdown + reasoning |
| `recommendFleetForShipment()` | Shipment, idle assets | Best matched fleet asset + score + reason |
| `classifyExcursion()` | ColdChainShipment | Severity, delta, duration, regulatory action |
| `generateCopilotResponse()` | Query string, full context | Natural language response using live data |
| `generateTopActions()` | Full context | Priority-ranked action list |

---

## Technologies

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| UI Framework | React | 19.x | Component-based UI |
| Language | TypeScript | 6.x | Type safety |
| Build Tool | Vite | 8.x | Fast dev server + production build |
| Styling | Tailwind CSS v4 | 4.x | Utility-first CSS |
| Charts | Recharts | 3.x | Temperature sensor chart |
| Icons | Lucide React | 1.x | UI icons |
| AI Agent | IBM Bob | — | Entire development lifecycle |

---

## Production Upgrade Path

To evolve from MVP to production:

1. **Data layer** — Replace `src/data/*.ts` imports with API calls to a logistics backend
2. **AI Copilot** — Replace `generateCopilotResponse()` body with IBM watsonx or OpenAI call, passing the same context object as the prompt
3. **Real-time** — Add WebSocket or SSE connection for live sensor data and disruption updates
4. **Auth** — Add IBM App ID or Auth0 for multi-user/multi-tenant support
5. **Database** — Store shipment/fleet data in Db2 or MongoDB; sensor readings in TimescaleDB
6. **Deployment** — Build with `npm run build` and deploy `dist/` to any static host or IBM Cloud Object Storage

No changes to the UI components or recommendation engine interface are required for steps 1–2.
