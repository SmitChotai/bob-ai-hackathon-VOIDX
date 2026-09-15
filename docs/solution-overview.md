# Solution Overview

<<<<<<< HEAD
## What We Built

[Describe your solution in plain language. Avoid jargon — write as if explaining to a smart colleague unfamiliar with your tech stack.]

## How It Works

[Explain the core mechanism step by step. A numbered list or simple flow works well here.]

1. [Step 1: e.g., "User connects their GitHub repository via OAuth"]
2. [Step 2: e.g., "The system ingests pipeline logs and feeds them to watsonx.ai"]
3. [Step 3: e.g., "An anomaly score is computed and displayed on the dashboard"]
4. [Step 4: e.g., "Alerts are sent to Slack when the score exceeds a threshold"]

## Architecture Diagram

> See [`architecture.md`](architecture.md) for the detailed diagram.

[Optionally include a simple ASCII or Mermaid diagram here for quick reference.]

```
[User] → [Frontend: React] → [API: FastAPI] → [watsonx.ai] → [Dashboard]
                                    ↓
                             [PostgreSQL DB]
```

## Key Design Decisions

| Decision | Rationale |
|---|---|
| [e.g., Used watsonx.ai for anomaly detection] | [e.g., Pre-trained models reduced time-to-value vs. building from scratch] |
| [Decision 2] | [Rationale 2] |
| [Decision 3] | [Rationale 3] |

## IBM Technologies Used

[Explain specifically HOW you used each IBM technology — not just that you used it.]

- **[IBM Tech 1, e.g., watsonx.ai]:** [How it was used — e.g., "Used the `ibm/granite-13b-instruct-v2` model via the Python SDK to classify anomaly types from log text."]
- **[IBM Tech 2]:** [How it was used]
=======
## SupplyGuard AI — Supply Chain Control Tower

---

## What SupplyGuard AI Does

SupplyGuard AI is a web-based AI Supply Chain Control Tower that gives a logistics manager a single, unified view of all active disruptions, their shipment impact, available alternatives, idle fleet assets, and cold chain sensor status — in real time. Every piece of information comes with an AI-generated recommendation and an explanation of why that recommendation was made.

The system is designed around one principle: **the right action, at the right time, with an understandable reason.**

---

## How It Analyses Disruptions

SupplyGuard AI maintains a structured disruption registry. Each disruption record captures:

- **Type** (port strike, weather event, infrastructure failure, geopolitical crisis)
- **Location and affected routes/ports**
- **Severity** (LOW / MEDIUM / HIGH / CRITICAL)
- **Status** (ACTIVE / MONITORING / RESOLVED)
- **Start time and estimated end time**

When a disruption becomes ACTIVE, the system immediately cross-references it against all active shipments by comparing each shipment's `routeId` and `disruptionIds`. Shipments are classified as:

| Classification | Meaning |
|---|---|
| **AFFECTED** | Shipment's primary route passes through the disrupted area |
| **AT RISK** | Shipment's route is near the disruption or uses shared infrastructure |
| **NOT AFFECTED** | Shipment is on a route with no exposure |

This classification is computed at the data layer and is immediately available to all views.

---

## How It Recommends Actions

The recommendation engine (`src/engine/recommendations.ts`) is a transparent, rule-based scoring system. It does not use a black-box model — every factor in every score is auditable.

### Rerouting Recommendations

For each affected shipment, the engine:

1. Retrieves pre-computed alternative routes for the shipment's `routeId`
2. Scores each alternative using a weighted formula:
   - **50% weight** — confidence score (based on route reliability and carrier history)
   - **30% weight** — time penalty (higher delay = lower score)
   - **20% weight** — risk level (LOW = full points, HIGH = zero)
3. Selects the highest-scoring alternative as the primary recommendation
4. Presents all alternatives so the manager can choose manually

The output for every recommendation includes: via-stops, additional cost (₹), additional delay (hours), risk level, recommended carrier, and a plain-English explanation.

### Fleet Redeployment Recommendations

For each affected shipment, the engine scores all idle fleet assets:

| Factor | Points |
|---|---|
| Same city as shipment origin | +40 |
| Cold-capable (when required) | +30 |
| Sufficient cargo capacity | +20 |
| High-priority shipment | +10 |
| Insufficient capacity | −30 |
| Not cold-capable for cold chain | −50 |

Assets with negative scores are excluded. The highest-scoring idle asset is recommended for redeployment, with a natural-language explanation of why it was selected.

---

## How Fleet Utilisation Works

The Fleet Utilisation dashboard provides:

1. **Real-time asset status** — All fleet assets (trucks, containers, vessels) with BUSY / IDLE / MAINTENANCE status
2. **Location tracking** — Current location of each asset
3. **KPI summary** — Total busy, idle, and maintenance counts
4. **Redeployment recommendations** — Auto-matched idle assets to affected shipments, with match score and reason

The system recognises that idle assets represent real daily cost. Every idle truck visible on the dashboard is a missed opportunity to service an affected shipment.

---

## How Cold Chain Monitoring Works

The Cold Chain panel monitors IoT temperature sensor data for all cold-sensitive shipments.

### Data Ingestion
In the MVP, sensor readings are simulated as realistic time-series data with configurable excursion injection. In a production deployment, readings would be ingested from IoT devices via MQTT or HTTP polling.

### Excursion Detection
Every reading is checked against the shipment's `minTempC` and `maxTempC` bounds. When any reading falls outside this range, an excursion is flagged.

### Severity Classification
The engine classifies excursions using two factors: temperature delta (how far outside the range) and duration (how long the excursion has lasted):

| Severity | Criteria | Regulatory Action |
|---|---|---|
| **MINOR** | ≤1°C over limit, ≤30 minutes | Document only. Monitor next readings. |
| **MODERATE** | ≤2°C over limit, ≤60 minutes | Quarantine on arrival. Quality assessment required. |
| **SEVERE** | ≤4°C over limit, ≤2 hours | Immediate quarantine. Likely disposal. Notify QA and CDSCO. |
| **CRITICAL** | >4°C over limit or >2 hours | Do NOT deliver. Emergency disposal. File CDSCO report within 24h. |

Every classification is explained in plain English with the specific regulatory obligation.

### Temperature Chart
The chart displays:
- Full reading history with timestamps
- Colour-coded data points (green = in-range, red = excursion)
- Reference lines at min and max temperature bounds
- Location tags (Origin Warehouse / Transit / Near Destination)

---

## How the AI Copilot Works

The AI Copilot is a conversational interface that answers logistics questions using live application data.

### Architecture
The copilot receives a user query and a `CopilotContext` object containing all disruptions, shipments, fleet assets, and cold chain data. It uses keyword-based intent detection to route the query to the appropriate analytical function and returns a structured, data-driven response.

### Intent Detection
The engine detects intents by checking for keywords in the query:

| Intent | Example query | Data used |
|---|---|---|
| Cold chain | "cold chain risks", "temperature", "MED-001" | `coldChainShipments`, `classifyExcursion()` |
| Fleet | "idle trucks", "redeploy", "available assets" | `fleetAssets` |
| Rerouting | "reroute SH-002", "alternative route" | `shipments`, `analyzeRerouting()` |
| Disruptions | "Mumbai strike", "affected shipments" | `disruptions`, `shipments` |
| Actions | "what should I do", "right now", "summary" | All data, `generateTopActions()` |

### Top Priority Actions
A side panel always shows the current top-priority actions, automatically ranked:
1. Cold chain excursions (always highest priority — time-sensitive, regulatory consequences)
2. High-priority affected shipments with rerouting options
3. Idle fleet redeployment opportunities

### Engine Type
The copilot uses a **local rule-based engine** — no external API call required. This ensures:
- Zero latency
- Works completely offline
- 100% reliable in a demo
- Fully auditable and explainable

The architecture is structured so that the `generateCopilotResponse()` function can be replaced with an LLM call (IBM watsonx, OpenAI) while keeping the same interface and context object.
>>>>>>> master
