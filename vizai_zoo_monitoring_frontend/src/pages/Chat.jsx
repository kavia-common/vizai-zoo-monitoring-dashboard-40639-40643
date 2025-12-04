import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { APP_ROUTES } from '../utils/constants';
import VideoModal from '../components/VideoModal';

/**
 * PUBLIC_INTERFACE
 * Chat: AI assistant chat persisted in AppContext/localStorage.
 * - Renders conversation history across navigation/tabs
 * - Suggested Questions that auto-fill and send
 * - Assistant messages can include action buttons:
 *   • View Timeline (applies filters and navigates)
 *   • Show Video (opens VideoModal at timestamp)
 *   • Generate Report (navigates to Reports with prefilled selections via context)
 */
export default function Chat() {
  const { state, actions } = useApp();
  const navigate = useNavigate();

  const [input, setInput] = React.useState('');
  const scrollAnchorRef = React.useRef(null);

  // Persist scroll to keep continuity like chat apps
  React.useEffect(() => {
    requestAnimationFrame(() => {
      scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  }, [state.chat.history.length]);

  // Suggested questions spec
  const suggestions = [
    'Show curiosity events around peak hours',
    'Summarize anomalies this week',
    'Find long calm periods',
    'Create a weekly activity report',
  ];

  const sendUserMessage = (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed) return;
    const msg = {
      id: `m_${Date.now()}`,
      role: 'user',
      content: trimmed,
      ts: Date.now(),
    };
    actions.addChatMessage(msg);
    // After user message, simulate assistant response with actionable buttons
    window.setTimeout(() => {
      const assistant = buildAssistantResponse(trimmed, state.dateRange);
      actions.addChatMessage(assistant);
    }, 250);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    sendUserMessage(input);
    setInput('');
  };

  // Build assistant mock response with actions derived from prompt intent
  function buildAssistantResponse(prompt, dateRange) {
    // naive intent detection
    const p = prompt.toLowerCase();
    const actionsList = [];

    if (p.includes('timeline') || p.includes('curiosity') || p.includes('calm') || p.includes('caution') || p.includes('explore') || p.includes('events')) {
      // Add View Timeline action with an inferred behavior filter
      let behavior;
      if (p.includes('curiosity')) behavior = 'curiosity';
      else if (p.includes('calm')) behavior = 'calm';
      else if (p.includes('caution')) behavior = 'caution';
      else if (p.includes('explore')) behavior = 'explore';
      actionsList.push({
        type: 'view_timeline',
        label: 'View Timeline',
        payload: { behavior },
      });
    }

    if (p.includes('video') || p.includes('show') || p.includes('play')) {
      actionsList.push({
        type: 'show_video',
        label: 'Show Video',
        payload: {
          timestamp: '2025-05-15 11:21',
          behavior: 'explore',
          duration: 33,
          timeOfDay: 'noon',
          hour: 11,
          thumb: 'https://placehold.co/160x90?text=Explore',
          src: 'https://www.w3schools.com/html/mov_bbb.mp4',
          notes: 'Roamed the western habitat perimeter.',
        }
      });
    }

    if (p.includes('report') || p.includes('summarize') || p.includes('summary')) {
      actionsList.push({
        type: 'generate_report',
        label: 'Generate Report',
        payload: {
          title: 'AI Suggested Activity Summary',
          layout: 'summary',
          sections: { overview: true, behaviorTrends: true, anomalies: true, heatmap: false },
          format: 'pdf',
          notes: `Requested via Chat • Range: ${dateRange?.preset || 'Last 24h'}`
        }
      });
    }

    if (actionsList.length === 0) {
      // Provide all if unknown, to make it actionable
      actionsList.push(
        { type: 'view_timeline', label: 'View Timeline', payload: {} },
        {
          type: 'show_video',
          label: 'Show Video',
          payload: {
            timestamp: '2025-05-15 10:03',
            behavior: 'curiosity',
            duration: 14,
            timeOfDay: 'morning',
            hour: 10,
            thumb: 'https://placehold.co/160x90?text=Curiosity',
            src: 'https://www.w3schools.com/html/mov_bbb.mp4',
            notes: 'Anteater investigated a new enrichment log.',
          }
        },
        {
          type: 'generate_report',
          label: 'Generate Report',
          payload: {
            title: 'Quick Summary',
            layout: 'summary',
            sections: { overview: true, behaviorTrends: true, anomalies: true, heatmap: false },
            format: 'pdf',
            notes: `Requested via Chat • Range: ${dateRange?.preset || 'Last 24h'}`
          }
        }
      );
    }

    return {
      id: `ai_${Date.now()}`,
      role: 'assistant',
      content: 'Here is what I can do based on your request:',
      ts: Date.now(),
      meta: { actions: actionsList }
    };
  }

  // Handle assistant action buttons
  const onAssistantAction = (action) => {
    if (!action) return;
    const { type, payload } = action;

    if (type === 'view_timeline') {
      if (payload && (payload.behavior || payload.hour || payload.timeOfDay)) {
        actions.setFilters({
          behavior: payload.behavior,
          hour: payload.hour,
          timeOfDay: payload.timeOfDay,
        });
      }
      navigate(APP_ROUTES.timeline);
    }

    if (type === 'show_video') {
      const ev = payload || {};
      actions.openModal({
        title: `Event • ${ev.behavior || 'unknown'} • ${ev.timestamp || ''}`,
        content: <VideoModal src={ev.src} poster={ev.thumb} details={ev} />
      });
    }

    if (type === 'generate_report') {
      // Store hints for Reports page via chat message (persisted) so user sees prefilled intent
      actions.addChatMessage({
        id: `note_${Date.now()}`,
        role: 'system',
        content: 'Report parameters have been suggested via Chat.',
        ts: Date.now(),
        meta: { reportPrefill: payload }
      });
      navigate(APP_ROUTES.reports);
    }
  };

  const suggestedClick = (q) => {
    setInput(q);
    // auto-send per spec
    window.setTimeout(() => {
      sendUserMessage(q);
      setInput('');
    }, 0);
  };

  return (
    <div className="page">
      <h1>Giant Anteater Chat</h1>
      <p className="page-desc">
        Context preserves date range: {state.dateRange.preset}
        {state.dateRange.from ? ` • ${state.dateRange.from}` : ''}
        {state.dateRange.to ? ` → ${state.dateRange.to}` : ''}
      </p>

      {/* Tabs */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn-secondary" style={{ height: 36, padding: '0 10px' }} onClick={() => navigate(APP_ROUTES.dashboard)}>Dashboard</button>
          <button className="btn-secondary" style={{ height: 36, padding: '0 10px' }} onClick={() => navigate(APP_ROUTES.timeline)}>Timeline</button>
          <button className="btn-secondary" style={{ height: 36, padding: '0 10px' }} onClick={() => navigate(APP_ROUTES.reports)}>Reports</button>
          <button className="btn-secondary" style={{ height: 36, padding: '0 10px' }} aria-current="page">Chat</button>
          <span style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }}>
            Chat persists across navigation and tabs.
          </span>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Suggested questions</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {suggestions.map((q) => (
            <button key={q} className="btn-secondary" style={{ height: 36, padding: '0 12px' }} onClick={() => suggestedClick(q)}>
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation */}
      <div className="card" style={{ display: 'grid', gap: 10 }}>
        <div style={{ display: 'grid', gap: 10, maxHeight: '50vh', overflow: 'auto', paddingRight: 4 }}>
          {state.chat.history.length === 0 ? (
            <div className="card" style={{ background: 'transparent', borderStyle: 'dashed' }}>
              Ask anything about behavior patterns or anomalies in the selected range.
            </div>
          ) : null}

          {state.chat.history.map((m) => (
            <ChatMessage key={m.id} message={m} onAction={onAssistantAction} />
          ))}
          <div ref={scrollAnchorRef} />
        </div>

        {/* Composer */}
        <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8 }}>
          <input
            aria-label="Type your question"
            placeholder="Ask about behaviors, anomalies, or trends..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ flex: 1, height: 40, borderRadius: 10, border: '1px solid var(--color-border)', background: 'var(--color-surface-2)', color: 'var(--color-text)', padding: '0 12px' }}
          />
          <button type="submit" className="btn-primary" style={{ height: 40, padding: '0 14px' }}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * ChatMessage: renders a single message with assistant action buttons if available.
 */
function ChatMessage({ message, onAction }) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const isSystem = message.role === 'system';

  return (
    <div
      className="btn-secondary"
      style={{
        borderRadius: 12,
        padding: 10,
        textAlign: 'left',
        background: isUser ? 'var(--color-surface-2)' : undefined,
        borderColor: isUser ? 'var(--color-border)' : undefined,
      }}
    >
      <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
        <span style={{ fontWeight: 800 }}>
          {isUser ? 'You' : isAssistant ? 'Assistant' : 'System'}
        </span>
        <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
          {new Date(message.ts || Date.now()).toLocaleTimeString()}
        </span>
      </div>
      <div style={{ marginTop: 4 }}>{message.content}</div>

      {isAssistant && message.meta?.actions?.length ? (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          {message.meta.actions.map((a, idx) => (
            <button
              key={`${message.id}_${idx}`}
              className="btn-primary"
              style={{ height: 36, padding: '0 12px' }}
              onClick={() => onAction(a)}
            >
              {a.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
