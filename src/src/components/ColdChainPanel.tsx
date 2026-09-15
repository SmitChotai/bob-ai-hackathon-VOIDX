import React, { useState } from 'react';
import { coldChainShipments } from '../data';
import { shipments } from '../data';
import { classifyExcursion } from '../engine/recommendations';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { Thermometer, AlertTriangle, CheckCircle } from 'lucide-react';

const ColdChainPanel: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('CC-001');

  const selected = coldChainShipments.find((cc) => cc.id === selectedId);
  const parentShipment = selected
    ? shipments.find((s) => s.id === selected.shipmentId)
    : null;
  const excursionAnalysis = selected ? classifyExcursion(selected) : null;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>
          Cold Chain Monitoring
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '13px' }}>
          Real-time IoT temperature sensor data with regulatory severity classification
        </p>
      </div>

      {/* Shipment selector tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {coldChainShipments.map((cc) => {
          const analysis = classifyExcursion(cc);
          const hasAlert = cc.currentExcursion;
          return (
            <button
              key={cc.id}
              onClick={() => setSelectedId(cc.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: `1px solid ${selectedId === cc.id ? 'var(--color-accent)' : 'var(--color-border)'}`,
                background: selectedId === cc.id ? 'rgba(79,142,247,0.12)' : 'var(--color-surface)',
                color: selectedId === cc.id ? 'var(--color-accent)' : 'var(--color-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: selectedId === cc.id ? 600 : 400,
              }}
            >
              {hasAlert ? (
                <AlertTriangle size={13} color="#ef4444" />
              ) : (
                <CheckCircle size={13} color="#22c55e" />
              )}
              {cc.shipmentId}
              {hasAlert && (
                <span style={{
                  fontSize: '10px',
                  background: analysis ? `${analysis.color}20` : 'rgba(239,68,68,0.15)',
                  color: analysis?.color ?? '#ef4444',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  fontWeight: 700,
                }}>
                  {analysis?.label?.split(' ')[0] ?? 'ALERT'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selected && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px' }}>
          {/* Left: chart + readings */}
          <div>
            {/* Excursion alert banner */}
            {selected.currentExcursion && excursionAnalysis && (
              <div
                style={{
                  background: `${excursionAnalysis.color}15`,
                  border: `1px solid ${excursionAnalysis.color}60`,
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                }}
              >
                <AlertTriangle size={20} color={excursionAnalysis.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: excursionAnalysis.color, marginBottom: '2px' }}>
                    ⚠ TEMPERATURE EXCURSION DETECTED — {excursionAnalysis.label.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text)', marginBottom: '4px' }}>
                    Shipment <strong>{selected.shipmentId}</strong> · Current: <strong style={{ color: excursionAnalysis.color }}>
                      {selected.readings[selected.readings.length - 1]?.temperatureC}°C
                    </strong> · Allowed: {selected.minTempC}°C–{selected.maxTempC}°C
                    · Delta: <strong>+{excursionAnalysis.excursionDeltaC}°C</strong>
                    · Duration: ~{excursionAnalysis.durationMinutes} min
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-muted)', lineHeight: 1.5 }}>
                    <strong style={{ color: 'var(--color-text)' }}>Action: </strong>
                    {excursionAnalysis.regulatoryAction}
                  </div>
                </div>
              </div>
            )}

            {!selected.currentExcursion && (
              <div
                style={{
                  background: 'rgba(34,197,94,0.08)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  marginBottom: '16px',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                }}
              >
                <CheckCircle size={16} color="#22c55e" />
                <span style={{ fontSize: '13px', color: '#22c55e', fontWeight: 600 }}>
                  All readings within allowed range — No excursion detected
                </span>
              </div>
            )}

            {/* Temperature chart */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '16px',
              }}
            >
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
                  Temperature History — {selected.shipmentId}
                </h2>
                <div style={{ display: 'flex', gap: '12px', fontSize: '11px' }}>
                  <span style={{ color: '#22c55e' }}>■ Min: {selected.minTempC}°C</span>
                  <span style={{ color: '#ef4444' }}>■ Max: {selected.maxTempC}°C</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={selected.readings.map((r, i) => ({
                  idx: i + 1,
                  time: new Date(r.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                  temp: r.temperatureC,
                  location: r.locationTag,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis
                    dataKey="time"
                    tick={{ fill: 'var(--color-muted)', fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fill: 'var(--color-muted)', fontSize: 10 }}
                    domain={[
                      Math.min(selected.minTempC - 2, Math.min(...selected.readings.map(r => r.temperatureC)) - 1),
                      Math.max(selected.maxTempC + 2, Math.max(...selected.readings.map(r => r.temperatureC)) + 1),
                    ]}
                    unit="°C"
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--color-surface-2)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: 'var(--color-text)',
                    }}
                    formatter={(value) => [`${String(value)}°C`, 'Temperature']}
                  />
                  <ReferenceLine y={selected.maxTempC} stroke="#ef4444" strokeDasharray="4 4" label={{ value: `Max ${selected.maxTempC}°C`, fill: '#ef4444', fontSize: 10 }} />
                  <ReferenceLine y={selected.minTempC} stroke="#22c55e" strokeDasharray="4 4" label={{ value: `Min ${selected.minTempC}°C`, fill: '#22c55e', fontSize: 10 }} />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="var(--color-accent)"
                    strokeWidth={2}
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      const isOut = payload.temp > selected.maxTempC || payload.temp < selected.minTempC;
                      return (
                        <circle
                          key={`dot-${cx}-${cy}`}
                          cx={cx}
                          cy={cy}
                          r={isOut ? 5 : 3}
                          fill={isOut ? '#ef4444' : 'var(--color-accent)'}
                          stroke={isOut ? '#ef4444' : 'var(--color-accent)'}
                        />
                      );
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Readings table */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
                <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
                  Sensor Readings
                </h2>
              </div>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {[...selected.readings].reverse().map((r, i) => {
                  const isOut = r.temperatureC > selected.maxTempC || r.temperatureC < selected.minTempC;
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '160px 80px 1fr',
                        padding: '8px 16px',
                        borderBottom: '1px solid var(--color-border)',
                        background: isOut ? 'rgba(239,68,68,0.05)' : 'transparent',
                        fontSize: '12px',
                      }}
                    >
                      <div style={{ color: 'var(--color-muted)' }}>
                        {new Date(r.timestamp).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                      </div>
                      <div style={{ fontWeight: 600, color: isOut ? '#ef4444' : '#22c55e' }}>
                        {r.temperatureC}°C
                        {isOut && ' ⚠'}
                      </div>
                      <div style={{ color: 'var(--color-muted)' }}>{r.locationTag}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: info panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Shipment info */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                padding: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Thermometer size={16} color="var(--color-accent)" />
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>
                  Shipment Details
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <InfoRow label="Shipment ID" value={selected.shipmentId} />
                <InfoRow label="Cargo" value={selected.cargoDescription} />
                <InfoRow label="Allowed Range" value={`${selected.minTempC}°C – ${selected.maxTempC}°C`} />
                {parentShipment && (
                  <>
                    <InfoRow label="Origin" value={parentShipment.origin} />
                    <InfoRow label="Destination" value={parentShipment.destination} />
                    <InfoRow label="Carrier" value={parentShipment.carrier} />
                    <InfoRow label="ETA" value={new Date(parentShipment.eta).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} />
                    <InfoRow label="Value" value={`₹${parentShipment.valueINR.toLocaleString('en-IN')}`} />
                  </>
                )}
              </div>
            </div>

            {/* Regulatory note */}
            <div
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                padding: '14px',
              }}
            >
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '8px' }}>
                Regulatory Classification
              </h3>
              {excursionAnalysis ? (
                <div>
                  <div style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: `${excursionAnalysis.color}15`,
                    border: `1px solid ${excursionAnalysis.color}40`,
                    marginBottom: '8px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: excursionAnalysis.color }}>
                      {excursionAnalysis.severity}
                    </div>
                    <div style={{ fontSize: '11px', color: excursionAnalysis.color }}>{excursionAnalysis.label}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '8px' }}>
                    <InfoRow label="Delta" value={`+${excursionAnalysis.excursionDeltaC}°C above limit`} />
                    <InfoRow label="Duration" value={`~${excursionAnalysis.durationMinutes} min`} />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 10px', background: 'rgba(34,197,94,0.1)', borderRadius: '5px' }}>
                  <CheckCircle size={13} color="#22c55e" />
                  <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 600 }}>COMPLIANT</span>
                </div>
              )}
              <div style={{ fontSize: '11px', color: 'var(--color-muted)', lineHeight: 1.5, marginTop: '8px' }}>
                {selected.regulatoryNote}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
    <span style={{ fontSize: '11px', color: 'var(--color-muted)', flexShrink: 0 }}>{label}</span>
    <span style={{ fontSize: '11px', color: 'var(--color-text)', textAlign: 'right' }}>{value}</span>
  </div>
);

export default ColdChainPanel;
