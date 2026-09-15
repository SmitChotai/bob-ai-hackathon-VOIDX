<<<<<<< HEAD
# 🚀 [Your Project Title Here]

> ⚠️ **Replace everything in `[ ]` brackets with your actual content before submission.**
=======
# 🚀 SupplyGuard AI

> **IBM BoB AI Innovation Hackathon 2026 · Track: AI · Problem L2: Supply Chain Disruption Assistant & Fleet Utilisation Optimizer**
>>>>>>> master

---

## 👥 Team

| Field | Value |
|---|---|
<<<<<<< HEAD
| **Team Name** | [Your Team Name] |
| **Track** | [AI / DevOps / Sustainability / Open] |
| **Team Lead** | [Name] — [email@ibm.com] |
| **Members** | [Name 1], [Name 2], [Name 3] |
=======
| **Team Name** | VOIDX |
| **Track** | AI |
| **Team Lead** | Team Lead — team@supplyguard.ai |
| **Members** | Team Member 1, Team Member 2, Team Member 3 |
>>>>>>> master

---

## 🎯 Problem Statement

<<<<<<< HEAD
> In 2–3 sentences: What problem does your project solve? Who experiences this problem?

[Describe the real-world problem your project addresses. Be specific about who the user is and what pain point they face.]
=======
Supply chain disruptions — port strikes, weather events, geopolitical crises — cascade across hundreds of active shipments in ways that are impossible to track manually. Fleet assets sit idle while other routes are overloaded. Cold chain shipments (vaccines, perishables) are especially vulnerable: a temperature excursion across any leg can spoil a ₹5Cr+ cargo, but breaches are only discovered at delivery when it is already too late.
>>>>>>> master

---

## 💡 Solution

<<<<<<< HEAD
> In 2–3 sentences: What did you build? How does it solve the problem above?

[Describe your solution clearly. Explain the core mechanism — what makes it work.]
=======
SupplyGuard AI is a web-based AI Supply Chain Control Tower that gives a logistics manager a single unified view of all active disruptions, their shipment impact, AI-scored rerouting alternatives, idle fleet redeployment recommendations, and real-time cold-chain IoT sensor monitoring — all with explainable, action-oriented recommendations. Built entirely with IBM Bob as the AI development partner.
>>>>>>> master

---

## ✨ Key Features

<<<<<<< HEAD
- **Feature 1:** [Brief description — e.g., "Real-time anomaly detection using watsonx.ai"]
- **Feature 2:** [Brief description]
- **Feature 3:** [Brief description]
- **Feature 4:** [Optional]
- **Feature 5:** [Optional]
=======
- **Disruption Dashboard:** Real-time view of active disruptions with type, severity, affected location, and impacted shipment count
- **Shipment Impact Analysis:** Automatic AFFECTED / AT RISK / NOT AFFECTED classification for every active shipment
- **AI Rerouting Recommendation:** Scored alternative routes with estimated cost, delay, risk level, carrier, and confidence score — with plain-English reasoning
- **Fleet Utilisation Optimizer:** Idle fleet asset detection and intelligent redeployment scoring matched to affected shipments
- **Cold Chain IoT Monitoring:** Temperature sensor chart, excursion detection, and MINOR/MODERATE/SEVERE/CRITICAL regulatory severity classification
- **AI Copilot:** Conversational interface answering logistics questions using live application data
>>>>>>> master

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
<<<<<<< HEAD
| **Languages** | [e.g., Python, TypeScript] |
| **Frameworks** | [e.g., FastAPI, React] |
| **IBM Technologies** | [e.g., watsonx.ai, IBM Bob, IBM Cloud] |
| **Databases** | [e.g., PostgreSQL, Redis] |
| **Other** | [e.g., Docker, GitHub Actions] |
=======
| **Languages** | TypeScript |
| **Frameworks** | React 18, Vite, Tailwind CSS v4, Recharts |
| **IBM Technologies** | IBM Bob AI |
| **Databases** | None (simulated local data — replaceable with real APIs) |
| **Other** | Lucide React, GitHub Actions |
>>>>>>> master

---

## 📁 Repository Structure

```
<<<<<<< HEAD
├── src/                  # All source code
=======
├── src/                  # All source code (React + Vite app)
>>>>>>> master
├── docs/                 # Written documentation
│   ├── problem-statement.md
│   ├── solution-overview.md
│   ├── architecture.md
│   └── setup-guide.md
├── demo/                 # Demo artifacts
│   ├── screenshots/      # App screenshots
<<<<<<< HEAD
│   └── demo-video-link.txt  # Link to demo video
=======
│   └── demo-video-link.txt
>>>>>>> master
├── presentation/         # Slide deck
└── submission.yaml       # Structured submission metadata
```

---

## ⚡ How to Run

<<<<<<< HEAD
> **Copy these exact steps from your [`docs/setup-guide.md`](docs/setup-guide.md)**

```bash
# 1. Clone the repo
git clone https://github.com/[your-repo].git
cd [your-repo]

# 2. Install dependencies
[your install command here]

# 3. Configure environment
cp .env.example .env
# Edit .env with your values

# 4. Run the project
[your run command here]
```

=======
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

>>>>>>> master
---

## 🖥️ Demo

| Artifact | Link |
|---|---|
| 📹 Demo Video | [See demo/demo-video-link.txt](demo/demo-video-link.txt) |
| 🌐 Live Demo | [See demo/live-demo-url.txt](demo/live-demo-url.txt) |
| 🖼️ Screenshots | [See demo/screenshots/](demo/screenshots/) |
<<<<<<< HEAD
| 📊 Presentation | [See presentation/slides.pdf](presentation/) |
=======
| 📊 Presentation | [See presentation/](presentation/) |

### Demo Scenario: Mumbai Port Strike

1. Open **Disruption Dashboard** → observe Mumbai Port Strike (HIGH / ACTIVE)
2. Click the disruption → see 5 affected shipments
3. Click **SH-002** → view AI rerouting: Mumbai → Surat → Ahmedabad, +₹4,500, +3h, 92% confidence
4. Open **Fleet** → see T-004 (idle, Mumbai) recommended for SH-002
5. Open **Cold Chain** → see MED-001 SEVERE excursion alert (vaccine at 10.8°C, limit 8°C)
6. Open **AI Copilot** → ask *"What should I do right now?"*
>>>>>>> master

---

## ⚠️ Known Limitations

<<<<<<< HEAD
> Be honest — judges appreciate transparency over overclaiming.

- [Limitation 1: e.g., "Authentication is mocked — not production-ready"]
- [Limitation 2: e.g., "Only tested on Chrome"]
- [Limitation 3: e.g., "Feature X is scaffolded but not fully implemented"]
=======
- All logistics data is simulated — no live external APIs connected in the MVP
- AI Copilot uses a local rule-based engine (not a live LLM); architecture is structured for IBM watsonx integration
- No user authentication or multi-tenant support
- Mobile layout is functional but optimized for desktop
>>>>>>> master

---

## 🏅 What We're Most Proud Of

<<<<<<< HEAD
[Tell the judges what part of your submission is strongest and worth paying close attention to.]
=======
The **fully explainable AI recommendation engine**: every rerouting suggestion, fleet redeployment match, and cold-chain severity classification shows exactly *why* it was made — with transparent scoring factors and natural-language reasoning. The entire application runs offline with zero external API dependencies, making the demo completely reliable. IBM Bob designed, implemented, reviewed, and fixed the entire codebase from scratch.
>>>>>>> master

---
