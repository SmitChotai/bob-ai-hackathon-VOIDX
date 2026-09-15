import React, { useState } from 'react';
import type { Shipment } from '../types';
import { analyzeRerouting } from '../engine/recommendations';
import { MapPin, Clock, IndianRupee, TrendingUp, ChevronRight, CheckCircle } from 'lucide-react';

interface ReroutingPanelProps {
  shipment: Shipment;
}

const RISK_COLORS: Record<string, string> = {
  LOW: '#22c55e',
  MEDIUM: '#f59e0b',
  HIGH: '#ef4444',
  CRITICAL: '#dc2626',
};

const ReroutingPanel: React.FC<ReroutingPanelProps> = ({ shipment }) => {
  const analysis = analyzeRerouting(shipment);
  const [selectedAlt, setSelectedAlt] = useState(0);

  const displayedAlt =
    analysis.allAlternatives.length > 0 ? analysis.allAlternatives[selectedAlt] : null;

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '10px',
        padding: '16px',
      }}
    >
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <MapPin size={16} color="var(--color-accent)" />
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
            AI Rerouting Recommendation — {shipment.id}
          </h2>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
          {shipment.origin} → {shipment.destination} · {shipment.carrier} · Priority: {shipment.priority}
          {shipment.isColdChain && ' · ❄ Cold Chain'}
        </p>
      </div>

      {displayedAlt ? (
        <>
          {/* Tab selector if multiple alternatives */}
          {analysis.allAlternatives.length > 1 && (
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              {analysis.allAlternatives.map((alt, i) => (
                <button
                  key={alt.routeId}
                  onClick={() => setSelectedAlt(i)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: `1px solid ${selectedAlt === i ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    background: selectedAlt === i ? 'rgba(79,142,247,0.15)' : 'transparent',
                    color: selectedAlt === i ? 'var(--color-accent)' : 'var(--color-muted)',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  Option {i + 1}
                </button>
              ))}
            </div>
          )}

          {/* Route visual */}
          <div
            style={{
              background: 'var(--color-surface-2)',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ color: 'var(--color-muted)', fontSize: '12px', fontWeight: 600 }}>
              {shipment.origin}
            </span>
            {displayedAlt.via.map((stop, i) => (
              <React.Fragment key={i}>
                <ChevronRight size={14} color="var(--color-accent)" />
                <span style={{ color: 'var(--color-accent)', fontSize: '12px', fontWeight: 600 }}>
                  {stop}
                </span>
              </React.Fragment>
            ))}
            <ChevronRight size={14} color="var(--color-accent)" />
            <span style={{ color: 'var(--color-success)', fontSize: '12px', fontWeight: 600 }}>
              {shipment.destination}
            </span>
          </div>

          {/* Metrics row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '12px' }}>
            <MetricBox
              icon={<Clock size={14} />}
              label="Extra Delay"
              value={`+${displayedAlt.additionalDelayHours}h`}
              color="var(--color-warning)"
            />
            <MetricBox
              icon={<IndianRupee size={14} />}
              label="Extra Cost"
              value={`₹${displayedAlt.additionalCostINR.toLocaleString('en-IN')}`}
              color="var(--color-warning)"
            />
            <MetricBox
              icon={<TrendingUp size={14} />}
              label="Risk"
              value={displayedAlt.risk}
              color={RISK_COLORS[displayedAlt.risk]}
            />
            <MetricBox
              icon={<CheckCircle size={14} />}
              label="Confidence"
              value={`${displayedAlt.confidenceScore}%`}
              color="var(--color-success)"
            />
          </div>

          {/* Carrier */}
          <div style={{ marginBottom: '10px', fontSize: '13px', color: 'var(--color-text)' }}>
            <span style={{ color: 'var(--color-muted)' }}>Recommended carrier: </span>
            <strong>{displayedAlt.carrier}</strong>
          </div>

          {/* Reasoning */}
          <div
            style={{
              background: 'rgba(79,142,247,0.06)',
              border: '1px solid rgba(79,142,247,0.2)',
              borderRadius: '6px',
              padding: '10px 12px',
              fontSize: '12px',
              color: 'var(--color-muted)',
              lineHeight: 1.6,
            }}
          >
            <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Why this route? </span>
            {displayedAlt.reason}
          </div>
        </>
      ) : (
        <div style={{ color: 'var(--color-muted)', fontSize: '13px', padding: '12px 0' }}>
          {analysis.reasoning}
        </div>
      )}
    </div>
  );
};

const MetricBox: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}> = ({ icon, label, value, color }) => (
  <div
    style={{
      background: 'var(--color-surface-2)',
      borderRadius: '6px',
      padding: '8px 10px',
      textAlign: 'center',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color, marginBottom: '2px' }}>
      {icon}
      <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>{label}</span>
    </div>
    <div style={{ fontSize: '14px', fontWeight: 700, color }}>{value}</div>
  </div>
);

export default ReroutingPanel;
