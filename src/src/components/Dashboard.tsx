import React, { useState } from 'react';
import type { Disruption } from '../types';
import type { ActiveView } from '../App';
import { disruptions } from '../data';
import { shipments } from '../data';
import { coldChainShipments } from '../data';
import { fleetAssets } from '../data';
import { getAffectedShipments } from '../engine/recommendations';
import KPICard from './KPICard';
import DisruptionCard from './DisruptionCard';
import ReroutingPanel from './ReroutingPanel';
import { AlertTriangle, Package, Truck, Thermometer, ArrowRight, ChevronDown } from 'lucide-react';

interface DashboardProps {
  onDisruptionSelect: (d: Disruption | null) => void;
  selectedDisruption: Disruption | null;
  onNavigate: (view: ActiveView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onDisruptionSelect, selectedDisruption, onNavigate }) => {
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);

  const activeDisruptions = disruptions.filter((d) => d.status === 'ACTIVE');
  const monitoringDisruptions = disruptions.filter((d) => d.status === 'MONITORING');
  const totalAffected = shipments.filter((s) => s.impactStatus === 'AFFECTED').length;
  const totalAtRisk = shipments.filter((s) => s.impactStatus === 'AT_RISK').length;
  const idleFleet = fleetAssets.filter((f) => f.status === 'IDLE').length;
  const activeExcursions = coldChainShipments.filter((cc) => cc.currentExcursion).length;
  const affectedForSelected = selectedDisruption
    ? getAffectedShipments(selectedDisruption, shipments)
    : [];

  const selectedShipment = selectedShipmentId
    ? shipments.find((s) => s.id === selectedShipmentId) ?? null
    : null;

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>
          Supply Chain Control Tower
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '13px' }}>
          Real-time disruption monitoring, impact analysis and fleet optimisation
        </p>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <KPICard
          label="Active Disruptions"
          value={activeDisruptions.length}
          subtext={`${monitoringDisruptions.length} monitoring`}
          color="var(--color-danger)"
          icon={<AlertTriangle size={20} />}
          onClick={() => {}}
        />
        <KPICard
          label="Affected Shipments"
          value={totalAffected}
          subtext={`${totalAtRisk} at risk`}
          color="var(--color-warning)"
          icon={<Package size={20} />}
          onClick={() => onNavigate('shipments')}
        />
        <KPICard
          label="Idle Fleet Assets"
          value={idleFleet}
          subtext="available for redeployment"
          color="var(--color-accent)"
          icon={<Truck size={20} />}
          onClick={() => onNavigate('fleet')}
        />
        <KPICard
          label="Cold Chain Alerts"
          value={activeExcursions}
          subtext="temperature excursions"
          color={activeExcursions > 0 ? 'var(--color-danger)' : 'var(--color-success)'}
          icon={<Thermometer size={20} />}
          onClick={() => onNavigate('coldchain')}
        />
      </div>

      {/* Two column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        {/* Disruption list */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            padding: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
              Active Disruptions
            </h2>
            <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>
              Click to see affected shipments
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {disruptions.map((d) => (
              <DisruptionCard
                key={d.id}
                disruption={d}
                isSelected={selectedDisruption?.id === d.id}
                affectedCount={getAffectedShipments(d, shipments).length}
                onClick={() =>
                  onDisruptionSelect(selectedDisruption?.id === d.id ? null : d)
                }
              />
            ))}
          </div>
        </div>

        {/* Affected shipments for selected disruption */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            padding: '16px',
          }}
        >
          {selectedDisruption ? (
            <>
              <div style={{ marginBottom: '14px' }}>
                <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
                  Affected Shipments
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '2px' }}>
                  {selectedDisruption.name} — {affectedForSelected.length} shipments impacted
                </p>
              </div>
              {affectedForSelected.length === 0 ? (
                <p style={{ color: 'var(--color-muted)', fontSize: '13px' }}>No shipments directly affected.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {affectedForSelected.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedShipmentId(selectedShipmentId === s.id ? null : s.id)}
                      style={{
                        background: selectedShipmentId === s.id
                          ? 'rgba(79,142,247,0.1)'
                          : 'var(--color-surface-2)',
                        border: `1px solid ${selectedShipmentId === s.id ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        borderRadius: '8px',
                        padding: '10px 12px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-text)' }}>
                              {s.id}
                            </span>
                            <span style={{
                              padding: '1px 6px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                              background: s.priority === 'HIGH' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                              color: s.priority === 'HIGH' ? 'var(--color-danger)' : 'var(--color-warning)',
                            }}>
                              {s.priority}
                            </span>
                            {s.isColdChain && (
                              <span style={{
                                padding: '1px 6px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                background: 'rgba(167,139,250,0.15)',
                                color: 'var(--color-purple)',
                              }}>
                                ❄ Cold
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '2px' }}>
                            {s.origin} <ArrowRight size={10} style={{ verticalAlign: 'middle' }} /> {s.destination} · {s.carrier}
                          </div>
                        </div>
                        <ChevronDown
                          size={14}
                          color="var(--color-muted)"
                          style={{ transform: selectedShipmentId === s.id ? 'rotate(180deg)' : 'none', transition: '0.2s' }}
                        />
                      </div>
                      <div style={{ marginTop: '4px' }}>
                        <span style={{
                          fontSize: '11px',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: 'rgba(239,68,68,0.15)',
                          color: 'var(--color-danger)',
                          fontWeight: 600,
                        }}>
                          AFFECTED
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--color-muted)', marginLeft: '8px' }}>
                          {s.status.replace('_', ' ')}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <button
                onClick={() => onNavigate('shipments')}
                style={{
                  marginTop: '12px',
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  padding: '8px 14px',
                  color: 'var(--color-accent)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  width: '100%',
                }}
              >
                View all shipments →
              </button>
            </>
          ) : (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-muted)',
                fontSize: '13px',
                minHeight: '200px',
                gap: '8px',
              }}
            >
              <AlertTriangle size={24} color="var(--color-muted)" />
              <div>Select a disruption to see affected shipments</div>
            </div>
          )}
        </div>
      </div>

      {/* Rerouting recommendation panel */}
      {selectedShipment && (
        <div style={{ marginTop: '8px' }}>
          <ReroutingPanel shipment={selectedShipment} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
