# Setup Guide

## SupplyGuard AI — Local Development Setup

---

## Prerequisites

| Requirement | Version | How to check |
|---|---|---|
| Node.js | ≥ 18.x (20.x recommended) | `node --version` |
| npm | ≥ 9.x | `npm --version` |
| Git | Any | `git --version` |

No external services, databases, or API keys are required.

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd supplyguard-ai
```

### 2. Navigate to the application source

```bash
cd src
```

### 3. Install dependencies

```bash
npm install
```

This installs all dependencies listed in `package.json` including React, Vite, Tailwind CSS, Recharts, and Lucide React.

---

## Environment Variables

The MVP requires **no environment variables** to run. All data is simulated locally.

If you want to review the optional variables (e.g., for connecting a real LLM), copy the example file:

```bash
cp .env.example .env
```

Do not commit `.env` to version control.

---

## Running the Application

### Development server

```bash
npm run dev
```

The application will start at: **http://localhost:5173**

Vite provides instant hot module replacement (HMR) — changes to source files are reflected immediately in the browser.

### Production build

```bash
npm run build
```

The production bundle is output to `src/dist/`. To preview it locally:

```bash
npm run preview
```

---

## Verifying the Application

Open http://localhost:5173 in your browser. You should see:

1. **Sidebar** on the left with navigation items (Dashboard, Shipments, Fleet, Cold Chain, AI Copilot)
2. **Dashboard** with 4 KPI cards showing:
   - Active Disruptions: **2**
   - Affected Shipments: **4**
   - Idle Fleet Assets: **6**
   - Cold Chain Alerts: **2**
3. **Disruption list** showing Mumbai Port Strike (HIGH / ACTIVE), Cyclone Vayu (MEDIUM / MONITORING), and NH-48 closure (LOW / ACTIVE)

### Demo Scenario Walkthrough

Follow this sequence to verify all features work:

**Step 1 — Disruption Dashboard**
- On the Dashboard, click **"Mumbai Port Strike"**
- The right panel should populate with 4 affected shipments: SH-001, SH-002, SH-004, MED-001, SH-008

**Step 2 — Shipment Impact & Rerouting**
- Click on **SH-002** in the affected shipments panel
- A rerouting recommendation panel should appear below with:
  - Route: Mumbai → Surat → Ahmedabad
  - Cost: +₹4,500
  - Delay: +3h
  - Risk: LOW
  - Confidence: 92%

**Step 3 — Shipment Table**
- Click **Shipments** in the sidebar
- Verify the table shows 10 shipments with AFFECTED / AT RISK / OK badges
- Use the filter buttons to isolate AFFECTED shipments
- Click on any AFFECTED shipment row to expand and see its rerouting recommendation

**Step 4 — Fleet Utilisation**
- Click **Fleet** in the sidebar
- Verify the table shows 12 assets with BUSY / IDLE / MAINTENANCE status
- The redeployment panel should show idle trucks recommended for affected shipments (e.g., T-004 → SH-002)

**Step 5 — Cold Chain Monitoring**
- Click **Cold Chain** in the sidebar
- MED-001 tab should show a red **"SEVERE"** badge
- Click MED-001 — verify the alert banner, temperature chart, and regulatory action text appear
- Click MED-002 — verify it shows green "All readings within range"

**Step 6 — AI Copilot**
- Click **AI Copilot** in the sidebar
- The welcome message should display a supply chain summary
- Click the quick question: **"What should I do right now?"**
- Verify a response appears with prioritised action items

---

## Troubleshooting

### Port 5173 is already in use

```bash
npm run dev -- --port 3000
```

### `npm install` fails with permission errors (Windows)

Run the terminal as Administrator, or use:

```bash
npm install --legacy-peer-deps
```

### TypeScript errors after editing

```bash
npm run typecheck
```

### Build fails

```bash
npm run typecheck
# Fix any errors shown, then:
npm run build
```

### Blank page in browser

- Check the browser console for errors (F12 → Console)
- Ensure you are opening http://localhost:5173 (not file://)
- Try clearing the Vite cache: `npx vite --force`

### Recharts type warnings

The `@types/recharts` package is for Recharts v1; Recharts v3 ships its own types. Minor type warnings from this package can be ignored — they do not affect runtime behaviour.

---

## Project Structure Reference

```
IBM L2/
├── submission.yaml          # Hackathon submission metadata
├── README.md                # Project overview
├── CONTRIBUTING.md          # Development guidelines
├── docs/                    # Documentation
│   ├── problem-statement.md
│   ├── solution-overview.md
│   ├── architecture.md
│   └── setup-guide.md       ← This file
├── src/                     # Application (React + Vite)
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── data/            # Simulated logistics data
│   │   ├── engine/          # AI recommendation engine
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
├── demo/
│   ├── demo-video-link.txt
│   ├── live-demo-url.txt
│   └── screenshots/
└── presentation/
    └── README.md
```
