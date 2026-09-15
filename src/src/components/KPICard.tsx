import React from 'react';

interface KPICardProps {
  label: string;
  value: number | string;
  subtext: string;
  color: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const KPICard: React.FC<KPICardProps> = ({ label, value, subtext, color, icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '10px',
        padding: '16px',
        textAlign: 'left',
        cursor: 'pointer',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: color,
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontWeight: 500, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {label}
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: color, lineHeight: 1 }}>
            {value}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-muted)', marginTop: '4px' }}>
            {subtext}
          </div>
        </div>
        <div style={{ color: color, opacity: 0.7 }}>
          {icon}
        </div>
      </div>
    </button>
  );
};

export default KPICard;
