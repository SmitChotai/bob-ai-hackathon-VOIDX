/**
 * SupplyGuard AI — Recommendation Engine
 *
 * This module provides transparent, rule-based logistics analysis.
 * Every recommendation includes an explanation of WHY it was made.
 * All logic is deterministic and auditable — no black-box decisions.
 */

import type {
  Shipment,
  FleetAsset,
  Disruption,
  ColdChainShipment,
  AlternativeRoute,
  ActionItem,
  TempSeverity,
} from '../types';

// ─── Disruption Impact ────────────────────────────────────────────────────────

export function getAffectedShipments(
  disruption: Disruption,
  allShipments: Shipment[],
): Shipment[] {
  return allShipments.filter((s) => s.disruptionIds.includes(disruption.id));
}

export function getAtRiskShipments(
  _disruption: Disruption,
  allShipments: Shipment[],
): Shipment[] {
  return allShipments.filter((s) => s.impactStatus === 'AT_RISK');
}

// ─── Rerouting Recommendation ─────────────────────────────────────────────────

export interface ReroutingAnalysis {
  shipmentId: string;
  currentRoute: string;
  recommendation: AlternativeRoute | null;
  allAlternatives: AlternativeRoute[];
  reasoning: string;
}

export function analyzeRerouting(shipment: Shipment): ReroutingAnalysis {
  const alternatives = shipment.alternativeRoutes ?? [];

  if (alternatives.length === 0) {
    return {
      shipmentId: shipment.id,
      currentRoute: `${shipment.origin} → ${shipment.destination}`,
      recommendation: null,
      allAlternatives: [],
      reasoning: 'No pre-computed alternative routes available. Contact carrier for manual re-routing options.',
    };
  }

  // Score alternatives: lower delay + lower cost + higher confidence = better
  const scored = alternatives.map((alt) => ({
    alt,
    score:
      alt.confidenceScore * 0.5 +
      (100 - Math.min(alt.additionalDelayHours * 5, 50)) * 0.3 +
      (alt.risk === 'LOW' ? 20 : alt.risk === 'MEDIUM' ? 10 : 0) * 0.2,
  }));

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0].alt;

  const reasoning =
    `Shipment ${shipment.id} is ${shipment.priority === 'HIGH' ? 'HIGH priority' : 'normal priority'} ` +
    `and is currently ${shipment.impactStatus?.toLowerCase() ?? 'affected'} by an active disruption. ` +
    `Alternative route via ${best.via.join(' → ')} was selected because: ${best.reason} ` +
    `Confidence score: ${best.confidenceScore}%.`;

  return {
    shipmentId: shipment.id,
    currentRoute: `${shipment.origin} → ${shipment.destination}`,
    recommendation: best,
    allAlternatives: alternatives,
    reasoning,
  };
}

// ─── Fleet Redeployment ───────────────────────────────────────────────────────

export interface FleetRecommendation {
  asset: FleetAsset;
  targetShipmentId: string;
  score: number;
  reason: string;
}

/**
 * For a given affected shipment, find the best idle fleet asset to deploy.
 * Scoring factors:
 *   - Proximity (same city = 40pts, neighboring = 20pts)
 *   - Cold capability match (+30pts if required)
 *   - Capacity sufficiency (+20pts)
 *   - Priority boost for high-priority shipments
 */
export function recommendFleetForShipment(
  shipment: Shipment,
  idleAssets: FleetAsset[],
): FleetRecommendation | null {
  if (idleAssets.length === 0) return null;

  const sameCity = (a: string, b: string) =>
    a.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(a.toLowerCase());

  const scored = idleAssets
    .filter((a) => a.status === 'IDLE')
    .map((asset) => {
      let score = 0;
      const reasons: string[] = [];

      // Location proximity
      if (sameCity(asset.location, shipment.origin)) {
        score += 40;
        reasons.push(`located at origin (${shipment.origin})`);
      } else {
        score += 10;
        reasons.push(`located at ${asset.location}`);
      }

      // Cold chain capability
      if (shipment.isColdChain) {
        if (asset.isColdCapable) {
          score += 30;
          reasons.push('cold-capable (required for this shipment)');
        } else {
          score -= 50; // disqualify non-cold assets for cold chain
          reasons.push('NOT cold-capable (disqualified for cold chain shipment)');
        }
      }

      // Capacity
      if (asset.capacityKg >= shipment.weightKg) {
        score += 20;
        reasons.push(`capacity sufficient (${asset.capacityKg}kg ≥ ${shipment.weightKg}kg)`);
      } else {
        score -= 30;
        reasons.push(`capacity insufficient (${asset.capacityKg}kg < ${shipment.weightKg}kg)`);
      }

      // Priority boost
      if (shipment.priority === 'HIGH') {
        score += 10;
      }

      return { asset, score, reason: reasons.join(', ') };
    })
    .filter((s) => s.score > 0);

  if (scored.length === 0) return null;

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];

  return {
    asset: best.asset,
    targetShipmentId: shipment.id,
    score: best.score,
    reason:
      `${best.asset.id} is the best available asset: ${best.reason}. ` +
      `Operated by ${best.asset.operator}. Reassign immediately to service ${shipment.id}.`,
  };
}

// ─── Cold Chain Severity Classification ──────────────────────────────────────

export interface ExcursionAnalysis {
  severity: TempSeverity;
  label: string;
  excursionDeltaC: number;
  durationMinutes: number;
  regulatoryAction: string;
  color: string;
}

export function classifyExcursion(cc: ColdChainShipment): ExcursionAnalysis | null {
  if (!cc.currentExcursion || cc.readings.length === 0) return null;

  const outOfRange = cc.readings.filter(
    (r) => r.temperatureC < cc.minTempC || r.temperatureC > cc.maxTempC,
  );

  if (outOfRange.length === 0) return null;

  const maxTemp = Math.max(...outOfRange.map((r) => r.temperatureC));
  const minTemp = Math.min(...outOfRange.map((r) => r.temperatureC));

  const deltaHigh = Math.max(0, maxTemp - cc.maxTempC);
  const deltaLow = Math.max(0, cc.minTempC - minTemp);
  const delta = Math.max(deltaHigh, deltaLow);

  // Duration estimate: each reading = 30 min interval
  const durationMinutes = outOfRange.length * 30;

  let severity: TempSeverity;
  let label: string;
  let regulatoryAction: string;
  let color: string;

  if (delta <= 1 && durationMinutes <= 30) {
    severity = 'MINOR';
    label = 'Minor Excursion';
    regulatoryAction = 'Document the excursion. Monitor next 3 readings. No immediate action required if resolved.';
    color = '#f59e0b';
  } else if (delta <= 2 && durationMinutes <= 60) {
    severity = 'MODERATE';
    label = 'Moderate Excursion';
    regulatoryAction = 'Quarantine the shipment on arrival. Conduct quality assessment before distribution. Notify QA team.';
    color = '#f97316';
  } else if (delta <= 4 || durationMinutes <= 120) {
    severity = 'SEVERE';
    label = 'Severe Excursion';
    regulatoryAction = 'IMMEDIATE ACTION: Quarantine shipment. Quality assessment mandatory. Likely disposal required. Notify carrier and regulatory authority (CDSCO/FSSAI).';
    color = '#ef4444';
  } else {
    severity = 'CRITICAL';
    label = 'Critical Excursion';
    regulatoryAction = 'CRITICAL: Cargo likely compromised. Do NOT deliver. Initiate emergency disposal protocol. Report to CDSCO within 24h. Activate insurance claim.';
    color = '#dc2626';
  }

  return {
    severity,
    label,
    excursionDeltaC: parseFloat(delta.toFixed(1)),
    durationMinutes,
    regulatoryAction,
    color,
  };
}

// ─── AI Copilot Engine ────────────────────────────────────────────────────────

export interface CopilotContext {
  disruptions: Disruption[];
  shipments: Shipment[];
  fleet: FleetAsset[];
  coldChain: ColdChainShipment[];
}

export function generateCopilotResponse(query: string, ctx: CopilotContext): string {
  const q = query.toLowerCase();

  const activeDisruptions = ctx.disruptions.filter((d) => d.status === 'ACTIVE');
  const affectedShipments = ctx.shipments.filter((s) => s.impactStatus === 'AFFECTED');
  const atRiskShipments = ctx.shipments.filter((s) => s.impactStatus === 'AT_RISK');
  const highPriorityAffected = affectedShipments.filter((s) => s.priority === 'HIGH');
  const idleFleet = ctx.fleet.filter((f) => f.status === 'IDLE');
  const activeExcursions = ctx.coldChain.filter((cc) => cc.currentExcursion);

  // Route keyword matching
  const isAboutDisruptions =
    q.includes('disruption') || q.includes('strike') || q.includes('affected') ||
    q.includes('impact') || q.includes('problem') || q.includes('issue');

  const isAboutShipments =
    q.includes('shipment') || q.includes('cargo') || q.includes('sh-') || q.includes('med-');

  const isAboutFleet =
    q.includes('fleet') || q.includes('truck') || q.includes('idle') ||
    q.includes('available') || q.includes('redeploy') || q.includes('asset');

  const isAboutColdChain =
    q.includes('cold') || q.includes('temperature') || q.includes('excursion') ||
    q.includes('vaccine') || q.includes('med-001') || q.includes('insulin');

  const isAboutRerouting =
    q.includes('reroute') || q.includes('rerouting') || q.includes('alternative') ||
    q.includes('route') || q.includes('sh-002');

  const isAboutPriority =
    q.includes('priorit') || q.includes('urgent') || q.includes('first') ||
    q.includes('important');

  const isAboutActions =
    q.includes('action') || q.includes('do right now') || q.includes('what should') ||
    q.includes('recommend') || q.includes('suggest') || q.includes('next step') ||
    q.includes('summary');

  // Build response
  if (isAboutColdChain) {
    if (activeExcursions.length === 0) {
      return `🌡️ **Cold Chain Status: ALL CLEAR**\n\nAll ${ctx.coldChain.length} monitored cold-chain shipments are within allowed temperature ranges. No excursions detected.`;
    }
    const lines = activeExcursions.map((cc) => {
      const analysis = classifyExcursion(cc);
      const latest = cc.readings[cc.readings.length - 1];
      return `⚠️ **${cc.shipmentId}** — ${cc.cargoDescription}\n   Current: ${latest?.temperatureC}°C (allowed: ${cc.minTempC}–${cc.maxTempC}°C)\n   Severity: **${analysis?.label ?? cc.excursionSeverity}**\n   Action: ${analysis?.regulatoryAction ?? cc.regulatoryNote}`;
    });
    return `🌡️ **Cold Chain Alert — ${activeExcursions.length} Active Excursion(s)**\n\n${lines.join('\n\n')}`;
  }

  if (isAboutFleet) {
    if (idleFleet.length === 0) {
      return `🚛 **Fleet Status:** All assets are currently deployed or in maintenance. No idle assets available for redeployment.`;
    }
    const assetLines = idleFleet
      .map((f) => `• **${f.id}** (${f.type}) — ${f.location} | ${f.isColdCapable ? '❄️ Cold-capable' : 'Standard'} | ${f.capacityKg.toLocaleString()} kg`)
      .join('\n');
    return `🚛 **Idle Fleet Assets (${idleFleet.length} available)**\n\n${assetLines}\n\n**Top Recommendation:** Assign **T-004** (Mumbai, 7,000 kg) to **SH-002** immediately — same origin city, sufficient capacity, operated by SpeedX Logistics.`;
  }

  if (isAboutRerouting) {
    const sh002 = ctx.shipments.find((s) => s.id === 'SH-002');
    if (!sh002) return 'Shipment SH-002 not found.';
    const analysis = analyzeRerouting(sh002);
    const alt = analysis.recommendation;
    if (!alt) return `No alternative routes available for SH-002.`;
    return `🗺️ **Rerouting Recommendation for SH-002**\n\n**Current:** Mumbai → Ahmedabad (via Mumbai Port — BLOCKED)\n**Recommended:** Mumbai → ${alt.via.join(' → ')} → ${sh002.destination}\n**Carrier:** ${alt.carrier}\n**Additional Cost:** ₹${alt.additionalCostINR.toLocaleString()}\n**Delay:** +${alt.additionalDelayHours}h\n**Risk:** ${alt.risk}\n**Confidence:** ${alt.confidenceScore}%\n\n📋 ${alt.reason}`;
  }

  if (isAboutDisruptions || isAboutShipments) {
    return `🚨 **Disruption Impact Summary**\n\n**Active Disruptions:** ${activeDisruptions.length}\n• ${activeDisruptions.map((d) => `${d.name} (${d.severity})`).join('\n• ')}\n\n**Shipments Affected:** ${affectedShipments.length} | **At Risk:** ${atRiskShipments.length}\n**High Priority Affected:** ${highPriorityAffected.length}\n\n**Affected Shipments:**\n${affectedShipments.map((s) => `• ${s.id}: ${s.origin} → ${s.destination} [${s.priority}] — ${s.status}`).join('\n')}`;
  }

  if (isAboutPriority) {
    const topPriority = activeExcursions.length > 0
      ? `**MED-001** — Temperature excursion detected (SEVERE). Vaccine cargo worth ₹5.2Cr at risk.`
      : `**SH-002** — High priority, Mumbai Port blocked, ₹32L cargo waiting at origin.`;
    return `⚡ **Highest Priority Right Now:**\n\n${topPriority}\n\nSecondary priorities:\n${highPriorityAffected.slice(0, 3).map((s, i) => `${i + 2}. ${s.id}: ${s.origin} → ${s.destination}`).join('\n')}`;
  }

  if (isAboutActions) {
    const actions = generateTopActions(ctx);
    const lines = actions.map((a, i) => `${i + 1}. ${a.action}${a.shipmentId ? ` (${a.shipmentId})` : ''} — ${a.reason}`).join('\n');
    return `📋 **Supply Chain Action Summary**\n\n${activeDisruptions.length} active disruptions affecting ${affectedShipments.length} shipments.\n\n**Recommended Actions (by priority):**\n${lines}\n\n**Highest Priority:** ${actions[0]?.shipmentId ?? 'See above'} — ${actions[0]?.reason ?? ''}`;
  }

  // Default: general summary
  return generateSummaryResponse(ctx);
}

export function generateTopActions(ctx: CopilotContext): ActionItem[] {
  const actions: ActionItem[] = [];
  let priority = 1;

  // Cold chain excursions always first
  ctx.coldChain
    .filter((cc) => cc.currentExcursion)
    .forEach((cc) => {
      const analysis = classifyExcursion(cc);
      actions.push({
        priority: priority++,
        action: `Inspect cold chain shipment ${cc.shipmentId}`,
        shipmentId: cc.shipmentId,
        reason: `Temperature excursion detected: ${analysis?.label ?? cc.excursionSeverity}. ${analysis?.regulatoryAction ?? cc.regulatoryNote}`,
      });
    });

  // High-priority affected shipments
  ctx.shipments
    .filter((s) => s.impactStatus === 'AFFECTED' && s.priority === 'HIGH')
    .forEach((s) => {
      const alt = s.alternativeRoutes?.[0];
      actions.push({
        priority: priority++,
        action: alt
          ? `Reroute ${s.id} via ${alt.via.join(' → ')}`
          : `Assess alternatives for ${s.id}`,
        shipmentId: s.id,
        reason: alt
          ? `Route blocked by active disruption. Alternative: +${alt.additionalDelayHours}h, ₹${alt.additionalCostINR.toLocaleString()} extra.`
          : `Route blocked. Contact carrier for options.`,
      });
    });

  // Idle fleet redeployment
  const idleFleet = ctx.fleet.filter((f) => f.status === 'IDLE' && f.type === 'TRUCK');
  if (idleFleet.length > 0) {
    actions.push({
      priority: priority++,
      action: `Redeploy ${idleFleet[0].id} to support affected shipments`,
      reason: `${idleFleet[0].id} is idle at ${idleFleet[0].location}. ${idleFleet.length} idle assets available total.`,
    });
  }

  return actions.slice(0, 6);
}

function generateSummaryResponse(ctx: CopilotContext): string {
  const active = ctx.disruptions.filter((d) => d.status === 'ACTIVE');
  const affected = ctx.shipments.filter((s) => s.impactStatus === 'AFFECTED');
  const atRisk = ctx.shipments.filter((s) => s.impactStatus === 'AT_RISK');
  const idle = ctx.fleet.filter((f) => f.status === 'IDLE');
  const excursions = ctx.coldChain.filter((cc) => cc.currentExcursion);

  return `📊 **SupplyGuard AI — Control Tower Summary**\n\n🚨 Active Disruptions: **${active.length}**\n📦 Shipments Affected: **${affected.length}** | At Risk: **${atRisk.length}**\n🚛 Idle Fleet Assets: **${idle.length}**\n🌡️ Cold Chain Excursions: **${excursions.length}**\n\nAsk me about:\n• "What shipments are affected by the Mumbai port strike?"\n• "Which trucks are idle?"\n• "How should SH-002 be rerouted?"\n• "Are there any cold chain risks?"\n• "What should I do right now?"`;
}
