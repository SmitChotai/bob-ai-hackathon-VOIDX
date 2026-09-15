import React, { useState } from 'react';
import { fleetAssets } from '../data';
import { shipments } from '../data';
import { recommendFleetForShipment } from '../engine/recommendations';
import { Truck, Package, Zap } from 'lucide-react';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  BUSY: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b' },
  IDLE: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e' },
  MAINTENANCE: { bg: 'rgba(139,144,167,0.15)', text: '#8b90a7' },
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  TRUCK: <Truck size={14} />,
  CONTAINER: <Package size={14} />,
  VESSEL: <Zap size={14} />,
};

const FleetPanel: React.FC = () => {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  const idle = fleetAssets.filter((f) => f.status === 'IDLE');
  const busy = fleetAssets.filter((f) => f.status === 'BUSY');
  const maintenance = fleetAssets.filter((f) => f.status === 'MAINTENANCE');

  // Get affected shipments needing redeployment
  const affectedShipments = shipments.filter(
    (s) => (s.impactStatus === 'AFFECTED' || s.impactStatus === 'AT_RISK') && s.status !== 'DELIVERED'
  );

  // For each affected shipment, compute fleet recommendation
  const recommendations = affectedShipments
    .map((s) => ({
      shipment: s,
      rec: recommendFleetForShipment(s, idle),
    }))
    .filter((r) => r.rec !== null);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>
          Fleet Utilisation
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '13px' }}>
          Asset status tracking and intelligent redeployment recommendations
        </p>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'Busy', count: busy.length, color: '#f59e0b' },
          { label: 'Idle', count: idle.length, color: '#22c55e' },
          { label: 'Maintenance', count: maintenance.length, color: '#8b90a7' },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '14px 16px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '28px', fontWeight: 700, color: item.color }}>{item.count}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '4px' }}>{item.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Fleet table */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--color-border)' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
              All Fleet Assets ({fleetAssets.length})
            </h2>
          </div>

          {/* Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 80px 120px 1fr 80px',
              padding: '8px 16px',
              borderBottom: '1px solid var(--color-border)',
              fontSize: '11px',
              color: 'var(--color-muted)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            <div>ID</div>
            <div>Type</div>
            <div>Location</div>
            <div>Operator</div>
            <div style={{ textAlign: 'right' }}>Status</div>
          </div>

          {fleetAssets.map((asset) => {
            const sc = STATUS_COLORS[asset.status];
            const isSelected = selectedAssetId === asset.id;
            return (
              <button
                key={asset.id}
                onClick={() => setSelectedAssetId(isSelected ? null : asset.id)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 80px 120px 1fr 80px',
                  padding: '10px 16px',
                  background: isSelected ? 'rgba(79,142,247,0.06)' : 'transparent',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  borderBottom: '1px solid var(--color-border)',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '12px', color: 'var(--color-text)' }}>
                  {asset.id}
                  {asset.isColdCapable && <span style={{ marginLeft: '4px', color: 'var(--color-purple)', fontSize: '10px' }}>❄</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-muted)', fontSize: '12px' }}>
                  {TYPE_ICONS[asset.type]}
                  <span>{asset.type.charAt(0) + asset.type.slice(1).toLowerCase()}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>{asset.location}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {asset.operator}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    padding: '2px 7px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    background: sc?.bg,
                    color: sc?.text,
                  }}>
                    {asset.status}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Recommendations */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--color-border)' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
              Redeployment Recommendations
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '2px' }}>
              {recommendations.length} idle assets matched to affected shipments
            </p>
          </div>

          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recommendations.slice(0, 5).map(({ shipment: s, rec }) => (
              <div
                key={s.id}
                style={{
                  background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-accent)' }}>
                      {rec!.asset.id}
                    </span>
                    <span style={{ color: 'var(--color-muted)', fontSize: '12px' }}>→</span>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-text)' }}>
                      {s.id}
                    </span>
                  </div>
                  <span style={{
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    background: s.priority === 'HIGH' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                    color: s.priority === 'HIGH' ? '#ef4444' : '#f59e0b',
                    fontWeight: 600,
                  }}>
                    {s.priority}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)', marginBottom: '6px' }}>
                  {rec!.asset.location} → {s.origin} · {rec!.asset.capacityKg.toLocaleString()} kg capacity
                  {rec!.asset.isColdCapable && ' · ❄ Cold capable'}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: 'var(--color-muted)',
                  background: 'rgba(79,142,247,0.05)',
                  border: '1px solid rgba(79,142,247,0.15)',
                  borderRadius: '4px',
                  padding: '6px 8px',
                }}>
                  {rec!.reason}
                </div>
                <div style={{ marginTop: '6px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>Match score:</span>
                  <div style={{ flex: 1, background: 'var(--color-border)', borderRadius: '2px', height: '4px' }}>
                    <div style={{ width: `${Math.min(rec!.score, 100)}%`, background: 'var(--color-success)', borderRadius: '2px', height: '4px' }} />
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--color-success)' }}>{Math.round(rec!.score)}%</span>
                </div>
              </div>
            ))}

            {recommendations.length === 0 && (
              <div style={{ color: 'var(--color-muted)', fontSize: '13px', padding: '16px', textAlign: 'center' }}>
                No redeployment recommendations at this time.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetPanel;
