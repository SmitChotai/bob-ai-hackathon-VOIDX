import React from 'react';
import type { ActiveView } from '../App';
import {
  LayoutDashboard,
  Package,
  Truck,
  Thermometer,
  Bot,
  Shield,
  Activity,
} from 'lucide-react';

interface SidebarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
}

const NAV_ITEMS: { id: ActiveView; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'shipments', label: 'Shipments', icon: <Package size={18} /> },
  { id: 'fleet', label: 'Fleet', icon: <Truck size={18} /> },
  { id: 'coldchain', label: 'Cold Chain', icon: <Thermometer size={18} /> },
  { id: 'copilot', label: 'AI Copilot', icon: <Bot size={18} /> },
];

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  return (
    <aside
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '220px',
        background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
      }}
    >
      {/* Logo / Brand */}
      <div
        style={{
          padding: '20px 16px 16px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            background: 'var(--color-accent)',
            borderRadius: '8px',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Shield size={18} color="#fff" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-text)' }}>
            SupplyGuard
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}>AI Control Tower</div>
        </div>
      </div>

      {/* Status indicator */}
      <div
        style={{
          margin: '12px 12px 4px',
          padding: '8px 10px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <Activity size={12} color="var(--color-danger)" />
        <span style={{ fontSize: '11px', color: 'var(--color-danger)', fontWeight: 600 }}>
          2 Active Disruptions
        </span>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '8px' }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '6px',
                border: 'none',
                background: isActive ? 'rgba(79, 142, 247, 0.15)' : 'transparent',
                color: isActive ? 'var(--color-accent)' : 'var(--color-muted)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 400,
                textAlign: 'left',
                marginBottom: '2px',
                transition: 'all 0.15s',
                borderLeft: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
              }}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--color-border)',
          fontSize: '11px',
          color: 'var(--color-muted)',
        }}
      >
        <div>Powered by IBM Bob AI</div>
        <div style={{ color: 'rgba(139,144,167,0.6)', marginTop: '2px' }}>
          IBM BoB Hackathon 2026
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
