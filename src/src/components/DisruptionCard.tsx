import React from 'react';
import type { Disruption } from '../types';
import { CloudRain, Globe, Zap, Ship } from 'lucide-react';

interface DisruptionCardProps {
  disruption: Disruption;
  isSelected: boolean;
  affectedCount: number;
  onClick: () => void;
}

const SEVERITY_COLORS: Record<string, string> = {
  LOW: '#22c55e',
  MEDIUM: '#f59e0b',
  HIGH: '#ef4444',
  CRITICAL: '#dc2626',
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: '#ef4444',
  MONITORING: '#f59e0b',
  RESOLVED: '#22c55e',
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  PORT_STRIKE: <Ship size={14} />,
  WEATHER: <CloudRain size={14} />,
  GEOPOLITICAL: <Globe size={14} />,
  INFRASTRUCTURE: <Zap size={14} />,
  CYBER: <Zap size={14} />,
};

const DisruptionCard: React.FC<DisruptionCardProps> = ({
  disruption: d,
  isSelected,
  affectedCount,
  onClick,
}) => {
  const sev = SEVERITY_COLORS[d.severity] ?? '#8b90a7';
  const statColor = STATUS_COLORS[d.status] ?? '#8b90a7';

  return (
    <button
      onClick={onClick}
      style={{
        background: isSelected ? 'rgba(79,142,247,0.08)' : 'var(--color-surface-2)',
        border: `1px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
        borderRadius: '8px',
        padding: '12px',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ color: sev }}>{TYPE_ICONS[d.type]}</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>
              {d.name}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginBottom: '6px' }}>
            {d.location}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-muted)', lineHeight: 1.4 }}>
            {d.description.slice(0, 120)}...
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', marginLeft: '12px', flexShrink: 0 }}>
          <span style={{
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 700,
            background: `${sev}20`,
            color: sev,
            letterSpacing: '0.5px',
          }}>
            {d.severity}
          </span>
          <span style={{
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 600,
            background: `${statColor}15`,
            color: statColor,
          }}>
            {d.status}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-muted)', marginTop: '2px' }}>
            {affectedCount} shipment{affectedCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--color-muted)' }}>
        Started: {new Date(d.startTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
        {d.estimatedEndTime && (
          <span> · Est. end: {new Date(d.estimatedEndTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
        )}
      </div>
    </button>
  );
};

export default DisruptionCard;
