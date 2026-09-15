# Problem Statement

<<<<<<< HEAD
## Background

[Describe the broader context. What domain or industry does this problem belong to? What situation creates the problem?]

## The Problem

[State the problem clearly and specifically. Avoid vague statements like "things are slow" — instead say "Operations teams spend an average of 45 minutes per incident diagnosing pipeline failures because logs are scattered across 6 different tools."]

## Who is Affected

[Describe the specific user or persona experiencing this problem. Be concrete — not "developers" but "backend engineers managing CI/CD pipelines in enterprises with 50+ microservices."]

## Why It Matters

[What is the cost of this problem? Lost time? Revenue? Safety risk? Frustration? Quantify if possible.]

## Why Existing Solutions Fall Short

[Briefly explain what people currently do and why it doesn't fully solve the problem. This sets up why your solution is needed.]
=======
## L2 — Supply Chain Disruption Assistant & Fleet Utilisation Optimizer

---

## Who Has This Problem

Logistics managers, supply chain operations teams, and freight coordinators at mid-to-large enterprises that manage hundreds or thousands of active shipments simultaneously. This includes:

- **3PL (Third-Party Logistics) operators** managing multi-carrier, multi-mode shipments
- **Pharmaceutical distributors** responsible for temperature-sensitive cold chain cargo
- **Port and terminal operators** dealing with strike and weather disruptions
- **Fleet managers** responsible for trucks, containers, and vessels across distributed locations

---

## What the Problem Is

Modern supply chains are complex, interconnected networks. A single disruption — a port strike, a cyclone, a geopolitical crisis, a bridge closure — does not affect just one shipment. It cascades across dozens or hundreds of active consignments simultaneously.

The problem has four interconnected dimensions:

### 1. Disruption Visibility
When a disruption occurs (e.g., a port strike), logistics managers have no single view of which shipments are affected, at what level of severity, and what should be done first. Information comes in through scattered emails, phone calls, and manual port authority notifications.

### 2. Route Paralysis
When a primary route is blocked, identifying a viable alternative — one that accounts for carrier availability, cost, delay, and cargo-specific constraints (e.g., cold chain requirements) — requires hours of manual research across spreadsheets, carrier portals, and route maps.

### 3. Fleet Waste
Fleet assets are tracked in siloed systems. Trucks waiting idle at one depot while the system fails to connect them with a stranded shipment 50 km away is a daily occurrence. This represents real financial waste: an idle 10-tonne truck costs approximately ₹8,000–₹15,000 per day in fixed costs even when not moving.

### 4. Cold Chain Blind Spots
Temperature-sensitive cargo (vaccines, insulin, blood products, perishable food) requires continuous monitoring between 2°C and 8°C. Today, most cold chain monitoring is batch-based: sensors record data, but excursions are only discovered when a shipment arrives and the data logger is downloaded — by which time, a $500,000+ cargo may already be compromised. The regulatory consequences (CDSCO non-compliance, disposal mandates) are severe and time-sensitive.

---

## Why Disruptions Are Difficult to Manage Manually

- **Scale:** A single port disruption can affect 200+ active shipments simultaneously
- **Speed:** Decisions must be made within hours, not days
- **Interdependence:** Rerouting one shipment may consume fleet assets needed by another
- **Heterogeneity:** Shipments have different priorities, cargo types, constraints, and value
- **Data fragmentation:** Shipment data, fleet data, sensor data, and disruption data live in separate systems
- **Cognitive overload:** A human cannot simultaneously evaluate 50 possible rerouting combinations and rank them by cost, delay, risk, and confidence

---

## Why Manual Tracking Is Insufficient

Manual processes fail in three ways:

1. **Latency:** By the time a logistics manager identifies all affected shipments, calls carriers for alternatives, and makes a decision, the optimal rerouting window may have closed
2. **Completeness:** Humans naturally prioritise the most visible or loudest-complaining customers; low-priority shipments with systemic problems may be missed entirely
3. **Consistency:** Two different managers facing the same disruption will apply different heuristics, producing inconsistent and non-auditable decisions

---

## Why Cold Chain Monitoring Matters

Cold chain failures are uniquely expensive and legally consequential:

- **Human cost:** Compromised vaccines or insulin can harm patients if administered
- **Financial cost:** A single spoiled pharmaceutical shipment can represent ₹5–50 crore in cargo value, plus destruction costs, regulatory fines, and reputational damage
- **Regulatory exposure:** CDSCO (India's drug regulator) and WHO PQS standards require documented excursion management; undiscovered excursions create audit liability
- **Time sensitivity:** The window between detecting an excursion and preventing harm is measured in hours. Post-delivery discovery is always too late.

The fundamental problem is that temperature monitoring produces data, but without intelligent analysis, that data does not produce timely, actionable alerts classified by severity and regulatory consequence.
>>>>>>> master
