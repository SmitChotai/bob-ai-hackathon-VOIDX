// ─── Core Domain Types ───────────────────────────────────────────────────────

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ShipmentStatus = 'IN_TRANSIT' | 'WAITING' | 'DELAYED' | 'DELIVERED' | 'AT_RISK';
export type FleetStatus = 'BUSY' | 'IDLE' | 'MAINTENANCE';
export type FleetType = 'TRUCK' | 'CONTAINER' | 'VESSEL';
export type DisruptionType = 'PORT_STRIKE' | 'WEATHER' | 'GEOPOLITICAL' | 'INFRASTRUCTURE' | 'CYBER';
export type ImpactStatus = 'AFFECTED' | 'AT_RISK' | 'NOT_AFFECTED';
export type TempSeverity = 'NORMAL' | 'MINOR' | 'MODERATE' | 'SEVERE' | 'CRITICAL';

// ─── Disruption ──────────────────────────────────────────────────────────────

export interface Disruption {
  id: string;
  name: string;
  type: DisruptionType;
  location: string;
  severity: Severity;
  status: 'ACTIVE' | 'RESOLVED' | 'MONITORING';
  startTime: string;          // ISO date string
  estimatedEndTime?: string;
  affectedPorts: string[];
  affectedRoutes: string[];
  description: string;
}

// ─── Route ───────────────────────────────────────────────────────────────────

export interface RouteSegment {
  from: string;
  to: string;
  mode: 'ROAD' | 'SEA' | 'AIR' | 'RAIL';
  distanceKm: number;
  estimatedHours: number;
}

export interface Route {
  id: string;
  origin: string;
  destination: string;
  segments: RouteSegment[];
  totalDistanceKm: number;
  totalHours: number;
  carriers: string[];
  affectedByDisruptionIds: string[];
}

export interface AlternativeRoute {
  routeId: string;
  via: string[];
  additionalCostINR: number;
  additionalDelayHours: number;
  risk: Severity;
  carrier: string;
  reason: string;
  confidenceScore: number; // 0–100
}

// ─── Shipment ─────────────────────────────────────────────────────────────────

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  carrier: string;
  status: ShipmentStatus;
  priority: 'HIGH' | 'NORMAL' | 'LOW';
  eta: string;               // ISO date string
  cargo: string;
  weightKg: number;
  valueINR: number;
  routeId: string;
  isColdChain: boolean;
  coldChainId?: string;      // links to ColdChainShipment
  impactStatus?: ImpactStatus;
  disruptionIds: string[];   // which disruptions affect this shipment
  alternativeRoutes?: AlternativeRoute[];
}

// ─── Fleet ────────────────────────────────────────────────────────────────────

export interface FleetAsset {
  id: string;
  type: FleetType;
  status: FleetStatus;
  location: string;
  assignedShipmentId?: string;
  capacityKg: number;
  isColdCapable: boolean;
  operator: string;
  lastUpdated: string;
}

// ─── Cold Chain ───────────────────────────────────────────────────────────────

export interface TempReading {
  timestamp: string;        // ISO date string
  temperatureC: number;
  locationTag: string;
}

export interface ColdChainShipment {
  id: string;
  shipmentId: string;
  cargoDescription: string;
  minTempC: number;
  maxTempC: number;
  readings: TempReading[];
  currentExcursion: boolean;
  excursionSeverity: TempSeverity;
  excursionStartTime?: string;
  regulatoryNote: string;
}

// ─── AI Copilot ───────────────────────────────────────────────────────────────

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ActionItem {
  priority: number;
  action: string;
  shipmentId?: string;
  reason: string;
}
