# 🚀 SupplyGuard AI

> **IBM BoB AI Innovation Hackathon 2026 · Track: AI · Problem L2: Supply Chain Disruption Assistant & Fleet Utilisation Optimizer**

---

## 👥 Team

| Field | Value |
|---|---|
| **Team Name** | VOIDX |
| **Track** | AI |
| **Team Lead** | Team Lead — team@supplyguard.ai |
| **Members** | Team Member 1, Team Member 2, Team Member 3 |

---

## 🎯 Problem Statement

Supply chain disruptions — port strikes, weather events, geopolitical crises — cascade across hundreds of active shipments in ways that are impossible to track manually. Fleet assets sit idle while other routes are overloaded. Cold chain shipments (vaccines, perishables) are especially vulnerable: a temperature excursion across any leg can spoil a ₹5Cr+ cargo, but breaches are only discovered at delivery when it is already too late.

---

## 💡 Solution

SupplyGuard AI is a web-based AI Supply Chain Control Tower that gives a logistics manager a single unified view of all active disruptions, their shipment impact, AI-scored rerouting alternatives, idle fleet redeployment recommendations, and real-time cold-chain IoT sensor monitoring — all with explainable, action-oriented recommendations. Built entirely with IBM Bob as the AI development partner.

---

## ✨ Key Features

- **Disruption Dashboard:** Real-time view of active disruptions with type, severity, affected location, and impacted shipment count
- **Shipment Impact Analysis:** Automatic AFFECTED / AT RISK / NOT AFFECTED classification for every active shipment
- **AI Rerouting Recommendation:** Scored alternative routes with estimated cost, delay, risk level, carrier, and confidence score — with plain-English reasoning
- **Fleet Utilisation Optimizer:** Idle fleet asset detection and intelligent redeployment scoring matched to affected shipments
- **Cold Chain IoT Monitoring:** Temperature sensor chart, excursion detection, and MINOR/MODERATE/SEVERE/CRITICAL regulatory severity classification
- **AI Copilot:** Conversational interface answering logistics questions using live application data

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Languages** | TypeScript |
| **Frameworks** | React 18, Vite, Tailwind CSS v4, Recharts |
| **IBM Technologies** | IBM Bob AI |
| **Databases** | None (simulated local data — replaceable with real APIs) |
| **Other** | Lucide React, GitHub Actions |

---

## 📁 Repository Structure

```
├── src/                  # All source code (React + Vite app)
├── docs/                 # Written documentation
│   ├── problem-statement.md
│   ├── solution-overview.md
│   ├── architecture.md
│   └── setup-guide.md
├── demo/                 # Demo artifacts
│   ├── screenshots/      # App screenshots
│   └── demo-video-link.txt
├── presentation/         # Slide deck
└── submission.yaml       # Structured submission metadata
```

---

## ⚡ How to Run

```bash
# 1. Navigate to the application source
cd src

# 2. Install dependencies
npm install

# 3. Configure environment (no keys required for MVP)
cp .env.example .env

# 4. Run the development server
npm run dev
```

Open **http://localhost:5173** in your browser.

See [`docs/setup-guide.md`](docs/setup-guide.md) for full instructions and demo walkthrough.

---

## 🖥️ Demo

| Artifact | Link |
|---|---|
| 📹 Demo Video | [See demo/demo-video-link.txt](demo/demo-video-link.txt) |
| 🌐 Live Demo | [See demo/live-demo-url.txt](demo/live-demo-url.txt) |
| 🖼️ Screenshots | [See demo/screenshots/](demo/screenshots/) |
| 📊 Presentation | [See presentation/](presentation/) |

### Demo Scenario: Mumbai Port Strike

1. Open **Disruption Dashboard** → observe Mumbai Port Strike (HIGH / ACTIVE)
2. Click the disruption → see 5 affected shipments
3. Click **SH-002** → view AI rerouting: Mumbai → Surat → Ahmedabad, +₹4,500, +3h, 92% confidence
4. Open **Fleet** → see T-004 (idle, Mumbai) recommended for SH-002
5. Open **Cold Chain** → see MED-001 SEVERE excursion alert (vaccine at 10.8°C, limit 8°C)
6. Open **AI Copilot** → ask *"What should I do right now?"*

---

## ⚠️ Known Limitations

- All logistics data is simulated — no live external APIs connected in the MVP
- AI Copilot uses a local rule-based engine (not a live LLM); architecture is structured for IBM watsonx integration
- No user authentication or multi-tenant support
- Mobile layout is functional but optimized for desktop

---

## 🏅 What We're Most Proud Of

The **fully explainable AI recommendation engine**: every rerouting suggestion, fleet redeployment match, and cold-chain severity classification shows exactly *why* it was made — with transparent scoring factors and natural-language reasoning. The entire application runs offline with zero external API dependencies, making the demo completely reliable. IBM Bob designed, implemented, reviewed, and fixed the entire codebase from scratch.

---
