import React, { useState, useRef, useEffect } from 'react';
import { disruptions, shipments, fleetAssets, coldChainShipments } from '../data';
import { generateCopilotResponse, generateTopActions } from '../engine/recommendations';
import type { CopilotMessage } from '../types';
import { Bot, Send, User, Zap } from 'lucide-react';

const QUICK_QUESTIONS = [
  'What shipments are affected by the Mumbai port strike?',
  'Which trucks are available for redeployment?',
  'How should SH-002 be rerouted?',
  'Are there any cold chain risks?',
  'What should I do right now?',
  'Which shipment should we prioritize?',
];

const ctx = {
  disruptions,
  shipments,
  fleet: fleetAssets,
  coldChain: coldChainShipments,
};

const WELCOME_MESSAGE: CopilotMessage = {
  id: 'welcome',
  role: 'assistant',
  content: generateCopilotResponse('summary', ctx),
  timestamp: new Date().toISOString(),
};

const AICopilot: React.FC = () => {
  const [messages, setMessages] = useState<CopilotMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    const userMsg: CopilotMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate brief processing delay for realism
    setTimeout(() => {
      const response = generateCopilotResponse(text, ctx);
      const assistantMsg: CopilotMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) sendMessage(input.trim());
  };

  const topActions = generateTopActions(ctx);

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 48px)', gap: '16px' }}>
      {/* Chat area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        {/* Chat header */}
        <div
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              background: 'rgba(79,142,247,0.15)',
              borderRadius: '8px',
              padding: '6px',
              display: 'flex',
            }}
          >
            <Bot size={18} color="var(--color-accent)" />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
              SupplyGuard AI Copilot
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              Online · Rule-based engine · IBM Bob powered
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isTyping && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(79,142,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={14} color="var(--color-accent)" />
              </div>
              <div
                style={{
                  background: 'var(--color-surface-2)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  color: 'var(--color-muted)',
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center',
                }}
              >
                <span>Analyzing</span>
                <span style={{ letterSpacing: '2px' }}>...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick questions */}
        <div style={{ padding: '8px 16px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              style={{
                padding: '4px 10px',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                background: 'transparent',
                color: 'var(--color-muted)',
                cursor: 'pointer',
                fontSize: '11px',
                whiteSpace: 'nowrap',
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            gap: '8px',
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about shipments, disruptions, fleet, cold chain..."
            style={{
              flex: 1,
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: 'var(--color-text)',
              fontSize: '13px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            style={{
              background: 'var(--color-accent)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 14px',
              color: '#fff',
              cursor: input.trim() ? 'pointer' : 'not-allowed',
              opacity: input.trim() ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '13px',
            }}
          >
            <Send size={14} />
            Send
          </button>
        </form>
      </div>

      {/* Side panel: top actions */}
      <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            padding: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <Zap size={15} color="var(--color-warning)" />
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>
              Top Priority Actions
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {topActions.map((action, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  padding: '10px',
                }}
              >
                <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <span style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: i === 0 ? 'var(--color-danger)' : i === 1 ? 'var(--color-warning)' : 'var(--color-accent)',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '1px',
                  }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.4 }}>
                    {action.action}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)', lineHeight: 1.4, paddingLeft: '24px' }}>
                  {action.reason}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info card */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            padding: '14px',
          }}
        >
          <h3 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Engine Info
          </h3>
          <div style={{ fontSize: '11px', color: 'var(--color-muted)', lineHeight: 1.6 }}>
            <div>🔬 <strong style={{ color: 'var(--color-text)' }}>Rule-based engine</strong></div>
            <div style={{ marginBottom: '4px' }}>Transparent scoring, no black-box decisions</div>
            <div>🤖 <strong style={{ color: 'var(--color-text)' }}>IBM Bob AI</strong></div>
            <div style={{ marginBottom: '4px' }}>Built by Bob — IBM BoB Hackathon 2026</div>
            <div>📊 <strong style={{ color: 'var(--color-text)' }}>Data</strong></div>
            <div>Simulated realistic logistics data</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Format markdown-like bold text
function formatContent(text: string): React.ReactNode {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <React.Fragment key={i}>
        {parts.map((part, j) =>
          j % 2 === 1 ? (
            <strong key={j} style={{ color: 'var(--color-text)', fontWeight: 600 }}>
              {part}
            </strong>
          ) : (
            part
          )
        )}
        {i < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

const ChatMessage: React.FC<{ message: CopilotMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'flex-start',
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}
    >
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: isUser ? 'rgba(245,158,11,0.15)' : 'rgba(79,142,247,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {isUser ? (
          <User size={14} color="var(--color-warning)" />
        ) : (
          <Bot size={14} color="var(--color-accent)" />
        )}
      </div>
      <div
        style={{
          background: isUser ? 'rgba(245,158,11,0.08)' : 'var(--color-surface-2)',
          border: `1px solid ${isUser ? 'rgba(245,158,11,0.2)' : 'var(--color-border)'}`,
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '13px',
          color: 'var(--color-text)',
          lineHeight: 1.6,
          maxWidth: '85%',
          whiteSpace: 'pre-wrap',
        }}
      >
        {formatContent(message.content)}
        <div style={{ fontSize: '10px', color: 'var(--color-muted)', marginTop: '4px' }}>
          {new Date(message.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default AICopilot;
