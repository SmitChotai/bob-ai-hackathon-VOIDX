import React, { useState } from 'react';
import type { Disruption, Shipment } from '../types';
import { shipments } from '../data';
import ReroutingPanel from './ReroutingPanel';
import { ArrowRight, ChevronDown, ChevronUp, Filter } from 'lucide-react';

interface ShipmentTableProps {
  selectedDisruption: Disruption | null;
}

type ImpactFilter = 'ALL' | 'AFFECTED' | 'AT_RISK' | 'NOT_AFFECTED';

const IMPACT_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  AFFECTED: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444', label: 'AFFECTED' },
  AT_RISK: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', label: 'AT RISK' },
  NOT_AFFECTED: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e', label: 'OK' },
};

const STATUS_LABELS: Record<string, string> = {
  IN_TRANSIT: 'In Transit',
  WAITING: 'Waiting',
  DELAYED: 'Delayed',
  DELIVERED: 'Delivered',
  AT_RISK: 'At Risk',
};

const ShipmentTable: React.FC<ShipmentTableProps> = ({ selectedDisruption }) => {
  const [filter, setFilter] = useState<ImpactFilter>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = shipments.filter((s) => {
    if (selectedDisruption) {
      if (!s.disruptionIds.includes(selectedDisruption.id) && s.impactStatus !== 'AT_RISK')
        return false;
    }
    if (filter !== 'ALL' && s.impactStatus !== filter) return false;
    return true;
  });

  const displayShipments = selectedDisruption ? filtered : shipments.filter((s) =>
    filter === 'ALL' || s.impactStatus === filter
  );

  const counts = {
    AFFECTED: shipments.filter((s) => s.impactStatus === 'AFFECTED').length,
    AT_RISK: shipments.filter((s) => s.impactStatus === 'AT_RISK').length,
    NOT_AFFECTED: shipments.filter((s) => s.impactStatus === 'NOT_AFFECTED').length,
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>
          Shipment Impact Analysis
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '13px' }}>
          {selectedDisruption
            ? `Showing shipments affected by: ${selectedDisruption.name}`
            : 'All active shipments with disruption impact status'}
        </p>
      </div>

      {/* Filter row */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
        <Filter size={14} color="var(--color-muted)" />
        {(['ALL', 'AFFECTED', 'AT_RISK', 'NOT_AFFECTED'] as ImpactFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              border: `1px solid ${filter === f ? 'var(--color-accent)' : 'var(--color-border)'}`,
              background: filter === f ? 'rgba(79,142,247,0.15)' : 'transparent',
              color: filter === f ? 'var(--color-accent)' : 'var(--color-muted)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: filter === f ? 600 : 400,
            }}
          >
            {f === 'ALL' ? `All (${shipments.length})` : f === 'AFFECTED' ? `Affected (${counts.AFFECTED})` : f === 'AT_RISK' ? `At Risk (${counts.AT_RISK})` : `OK (${counts.NOT_AFFECTED})`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '90px 1fr 1fr 150px 90px 80px 80px 80px',
            padding: '10px 16px',
            borderBottom: '1px solid var(--color-border)',
            fontSize: '11px',
            color: 'var(--color-muted)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          <div>ID</div>
          <div>Route</div>
          <div>Carrier</div>
          <div>Status</div>
          <div>Priority</div>
          <div>Type</div>
          <div style={{ textAlign: 'right' }}>ETA</div>
          <div style={{ textAlign: 'right' }}>Impact</div>
        </div>

        {/* Rows */}
        {displayShipments.map((s) => (
          <ShipmentRow
            key={s.id}
            shipment={s}
            isExpanded={expandedId === s.id}
            onToggle={() => setExpandedId(expandedId === s.id ? null : s.id)}
          />
        ))}

        {displayShipments.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-muted)', fontSize: '13px' }}>
            No shipments match the current filter.
          </div>
        )}
      </div>
    </div>
  );
};

const ShipmentRow: React.FC<{
  shipment: Shipment;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ shipment: s, isExpanded, onToggle }) => {
  const impact = IMPACT_COLORS[s.impactStatus ?? 'NOT_AFFECTED'];
  const hasAlternatives = (s.alternativeRoutes ?? []).length > 0;

  return (
    <>
      <button
        onClick={onToggle}
        style={{
          display: 'grid',
          gridTemplateColumns: '90px 1fr 1fr 150px 90px 80px 80px 80px',
          padding: '12px 16px',
          background: isExpanded ? 'rgba(79,142,247,0.04)' : 'transparent',
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left',
          border: 'none',
          borderBottom: '1px solid var(--color-border)',
          alignItems: 'center',
        }}
      >
        <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {s.id}
          {isExpanded ? <ChevronUp size={12} color="var(--color-accent)" /> : <ChevronDown size={12} color="var(--color-muted)" />}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {s.origin} <ArrowRight size={10} color="var(--color-muted)" /> {s.destination}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>{s.carrier}</div>
        <div>
          <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>
            {STATUS_LABELS[s.status] ?? s.status}
          </span>
        </div>
        <div>
          <span style={{
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 600,
            background: s.priority === 'HIGH' ? 'rgba(239,68,68,0.15)' : s.priority === 'NORMAL' ? 'rgba(245,158,11,0.15)' : 'rgba(139,144,167,0.15)',
            color: s.priority === 'HIGH' ? 'var(--color-danger)' : s.priority === 'NORMAL' ? 'var(--color-warning)' : 'var(--color-muted)',
          }}>
            {s.priority}
          </span>
        </div>
        <div>
          {s.isColdChain ? (
            <span style={{ fontSize: '11px', color: 'var(--color-purple)' }}>❄ Cold</span>
          ) : (
            <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>Standard</span>
          )}
        </div>
        <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--color-muted)' }}>
          {new Date(s.eta).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 700,
            background: impact?.bg,
            color: impact?.text,
          }}>
            {impact?.label ?? 'UNKNOWN'}
          </span>
        </div>
      </button>

      {/* Expanded: show rerouting recommendation */}
      {isExpanded && hasAlternatives && (
        <div style={{ padding: '0 16px 16px', borderBottom: '1px solid var(--color-border)' }}>
          <ReroutingPanel shipment={s} />
        </div>
      )}
      {isExpanded && !hasAlternatives && (
        <div style={{ padding: '12px 16px 16px', borderBottom: '1px solid var(--color-border)', color: 'var(--color-muted)', fontSize: '12px' }}>
          {s.impactStatus === 'NOT_AFFECTED'
            ? 'This shipment is not affected by any active disruption.'
            : 'No alternative routes pre-computed. Contact carrier directly.'}
          <div style={{ marginTop: '6px' }}>
            <strong style={{ color: 'var(--color-text)' }}>Cargo:</strong> {s.cargo} ·{' '}
            <strong style={{ color: 'var(--color-text)' }}>Value:</strong> ₹{s.valueINR.toLocaleString('en-IN')} ·{' '}
            <strong style={{ color: 'var(--color-text)' }}>Weight:</strong> {s.weightKg.toLocaleString()} kg
          </div>
        </div>
      )}
    </>
  );
};

export default ShipmentTable;
