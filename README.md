# SupplyGuard AI

> **IBM BoB AI Innovation Hackathon 2026 — L2: Supply Chain Disruption Assistant & Fleet Utilisation Optimizer**

---

## 👥 Team

| Name         | Role                                   |
|--------------|----------------------------------------|
| Smit Chotai  | Team Lead + Product/AI Integration Lead |
| Kush Makadia | Backend & AI/Logic Lead                |
| Kevin Varia  | Frontend & UI/UX Lead                  |
| Prem Maniar  | QA + Documentation + Demo Lead         |
---

## 📋 Problem Statement

Supply chain disruptions — weather events, port strikes, geopolitical crises — cascade across hundreds of active shipments in ways that are impossible to track manually. Fleet assets (trucks, containers, vessels) sit idle while other routes are overloaded. Cold chain shipments (vaccines, perishables) are especially vulnerable — a single temperature excursion across any leg can spoil a $500K+ cargo, but breaches are only discovered at delivery when it is too late.

---

## 💡 Solution: SupplyGuard AI

**SupplyGuard AI** is a web-based AI Supply Chain Control Tower that helps logistics managers understand the real-time impact of disruptions and decide what action to take — before it is too late.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🚨 Disruption Dashboard | Real-time view of active disruptions with severity, affected locations, and impacted shipment count |
| 📦 Shipment Impact Analysis | Automatically identifies which shipments are Affected / At Risk / Not Affected |
| 🗺️ AI Rerouting | Recommends alternative routes with estimated delay, cost, risk, and confidence score |
| 🚛 Fleet Utilisation | Identifies idle fleet assets and recommends redeployment to affected shipments |
| 🌡️ Cold Chain Monitoring | Monitors IoT temperature sensor data and detects excursions with regulatory severity classification |
| 🤖 AI Copilot | Conversational interface that answers logistics questions using live application data |

---

## 🛠️ Technology Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **AI Engine:** Local rule-based recommendation engine (no external API required)
- **AI Agent:** IBM Bob (used throughout development)

---

## 🚀 How to Run

```bash
cd src
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

See [`docs/setup-guide.md`](docs/setup-guide.md) for detailed instructions.

---

## 🎬 Demo Information

**Primary Demo Scenario:** Mumbai Port Strike

1. Open the Disruption Dashboard — observe the active Mumbai Port Strike alert
2. Click on the disruption to see affected shipments
3. Select SH-002 and view the AI rerouting recommendation
4. Open Fleet Utilisation to see idle assets and redeployment suggestion
5. Open Cold Chain Monitoring to observe MED-001 temperature excursion alert
6. Use the AI Copilot to ask: *"What should I do right now?"*

Demo video: see `demo/demo-video-link.txt`

---

## ⚠️ Known Limitations

- All data is simulated — no live logistics APIs are connected in the MVP
- The AI Copilot uses a local rule-based engine, not a live LLM (structured for LLM integration)
- No user authentication or multi-tenant support
- Mobile layout is functional but optimized for desktop

---

## 🏆 What We Are Most Proud Of

- **Explainable AI:** Every recommendation shows *why* it was made, not just what to do
- **Cold Chain Severity Classification:** Regulatory-grade temperature excursion classification
- **Zero-dependency demo:** Works completely offline with realistic simulated data
- **Genuine IBM Bob contribution:** Bob designed, implemented, reviewed, and fixed the entire application

---

## 📂 Repository Structure

```
├── submission.yaml          # Hackathon submission metadata
├── README.md                # This file
├── CONTRIBUTING.md          # Contribution guidelines
├── docs/                    # Documentation
│   ├── problem-statement.md
│   ├── solution-overview.md
│   ├── architecture.md
│   └── setup-guide.md
├── src/                     # Application source code (React + Vite)
├── demo/                    # Demo assets
└── presentation/            # Slide deck
```
