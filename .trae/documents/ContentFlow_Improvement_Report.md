# ContentFlow — UI/UX & Feature Improvement Report

**Prepared by:** Manus AI  
**Date:** February 21, 2026  
**Stack:** React + TypeScript + Firebase (Trae.ai)

---

## Executive Summary

ContentFlow is a well-conceived, dark-themed SaaS platform targeting content creators and agencies who want to AI-power their entire production pipeline — from ideation and scripting through to publishing and automation. The four screens reviewed (Publishing Hub, Workflow Automation, Script Editor, and Teleprompter) reveal a solid foundation with a consistent design language. This report identifies the most impactful improvements per screen, provides reasoning grounded in SaaS UX best practices, and delivers production-ready code snippets you can paste directly into Trae.ai.

---

## 1. Global / Cross-Screen Improvements

### 1.1 Navigation — Overflow & Discoverability

The top navigation bar contains too many items for a single row (Dashboard, Ideas, Script, Podcast, Teleprompter, Production, Publish, Analytics, Automation, More). The "More" dropdown is a sign that the nav is overloaded. This creates cognitive load and hides features from new users.

**Recommendation:** Migrate to a collapsible left sidebar with icon + label pairs. This is the dominant pattern in professional SaaS tools (Notion, Linear, Vercel) and scales gracefully as features grow. The top bar can be reserved for global actions (search, notifications, upgrade, profile).

```tsx
// components/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Lightbulb, FileText, Mic2, MonitorPlay,
  Clapperboard, Send, BarChart2, Zap, Settings
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/ideas',       icon: Lightbulb,        label: 'Ideas' },
  { to: '/script',      icon: FileText,          label: 'Script' },
  { to: '/podcast',     icon: Mic2,              label: 'Podcast' },
  { to: '/teleprompter',icon: MonitorPlay,        label: 'Teleprompter' },
  { to: '/production',  icon: Clapperboard,       label: 'Production' },
  { to: '/publish',     icon: Send,               label: 'Publish' },
  { to: '/analytics',   icon: BarChart2,          label: 'Analytics' },
  { to: '/automation',  icon: Zap,                label: 'Automation' },
];

export const Sidebar = ({ collapsed }: { collapsed: boolean }) => (
  <aside className={`h-screen bg-[#0f1117] border-r border-white/10 flex flex-col
    transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`}>
    <div className="flex items-center gap-3 p-4 border-b border-white/10">
      <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
        <Zap size={16} className="text-white" />
      </div>
      {!collapsed && <span className="font-bold text-white text-sm">ContentFlow</span>}
    </div>
    <nav className="flex-1 p-2 space-y-1">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
             ${isActive
               ? 'bg-purple-600/20 text-purple-400 font-medium'
               : 'text-gray-400 hover:bg-white/5 hover:text-white'}`
          }>
          <Icon size={18} />
          {!collapsed && <span>{label}</span>}
        </NavLink>
      ))}
    </nav>
    <div className="p-2 border-t border-white/10">
      <NavLink to="/settings"
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400
                   hover:bg-white/5 hover:text-white transition-colors">
        <Settings size={18} />
        {!collapsed && <span>Settings</span>}
      </NavLink>
    </div>
  </aside>
);
```

### 1.2 Global Command Palette (⌘K)

Power users — especially agency operators managing multiple clients — benefit enormously from a keyboard-driven command palette. This allows instant navigation, script creation, or workflow triggering without mouse interaction.

```tsx
// components/CommandPalette.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const commands = [
  { label: 'Go to Dashboard',    action: '/dashboard' },
  { label: 'New Script',         action: '/script?new=1' },
  { label: 'New Workflow',       action: '/automation?new=1' },
  { label: 'Schedule Post',      action: '/publish?schedule=1' },
  { label: 'Open Teleprompter',  action: '/teleprompter' },
  { label: 'View Analytics',     action: '/analytics' },
];

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!open) return null;

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60"
         onClick={() => setOpen(false)}>
      <div className="bg-[#1a1d2e] border border-white/10 rounded-xl shadow-2xl w-full max-w-lg"
           onClick={e => e.stopPropagation()}>
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Type a command or search..."
          className="w-full bg-transparent text-white px-4 py-3 text-sm outline-none
                     border-b border-white/10 placeholder:text-gray-500"
        />
        <ul className="max-h-64 overflow-y-auto p-2">
          {filtered.map(cmd => (
            <li key={cmd.label}>
              <button
                onClick={() => { navigate(cmd.action); setOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-300
                           hover:bg-purple-600/20 hover:text-white transition-colors">
                {cmd.label}
              </button>
            </li>
          ))}
        </ul>
        <p className="px-4 py-2 text-xs text-gray-600 border-t border-white/10">
          Press <kbd className="bg-white/10 px-1 rounded">Esc</kbd> to close
        </p>
      </div>
    </div>
  );
};
```

---

## 2. Publishing Hub

### 2.1 Calendar — Empty State & Content Indicators

The calendar is entirely blank, which is a missed opportunity. Even when no posts are scheduled, the calendar should show visual indicators for "best posting times" based on platform analytics, and the "Upcoming Summary" panel should offer a CTA to schedule the first post.

**Recommendation:** Render platform-specific colored dots on scheduled days, and add a "Best Time to Post" overlay toggle.

```tsx
// components/PublishCalendar.tsx
import { useState } from 'react';

type ScheduledPost = {
  id: string;
  date: string; // 'YYYY-MM-DD'
  platform: 'youtube' | 'instagram' | 'tiktok' | 'twitter';
  title: string;
  time: string;
};

const PLATFORM_COLORS: Record<ScheduledPost['platform'], string> = {
  youtube:   'bg-red-500',
  instagram: 'bg-pink-500',
  tiktok:    'bg-cyan-400',
  twitter:   'bg-sky-500',
};

const BEST_TIMES: Record<number, string> = {
  2: 'Best: Tue 6pm',
  4: 'Best: Thu 12pm',
  6: 'Best: Sat 10am',
};

export const CalendarDay = ({
  day, posts, showBestTimes
}: {
  day: number;
  posts: ScheduledPost[];
  showBestTimes: boolean;
}) => (
  <div className="min-h-[100px] bg-[#1a1d2e] border border-white/5 rounded-lg p-2
                  hover:border-purple-500/40 transition-colors cursor-pointer group">
    <span className="text-xs text-gray-400 group-hover:text-white">{day}</span>
    {showBestTimes && BEST_TIMES[day % 7] && (
      <p className="text-[10px] text-green-400 mt-1">{BEST_TIMES[day % 7]}</p>
    )}
    <div className="mt-1 flex flex-wrap gap-1">
      {posts.map(post => (
        <div key={post.id}
             title={`${post.title} — ${post.time}`}
             className={`w-2 h-2 rounded-full ${PLATFORM_COLORS[post.platform]}`} />
      ))}
    </div>
    {posts.length > 0 && (
      <p className="text-[10px] text-gray-500 mt-1">{posts.length} post{posts.length > 1 ? 's' : ''}</p>
    )}
  </div>
);
```

### 2.2 Multi-Platform Connection Panel

Currently only YouTube is shown as a connectable platform. The "Connect YouTube" button should be part of a broader "Connected Platforms" panel that shows the status of all integrations.

```tsx
// components/PlatformConnections.tsx
import { Youtube, Instagram, Twitter, Music } from 'lucide-react';

type Platform = {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  connected: boolean;
};

const platforms: Platform[] = [
  { id: 'youtube',   name: 'YouTube',   icon: Youtube,   color: 'text-red-500',  connected: false },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500', connected: false },
  { id: 'twitter',   name: 'X / Twitter', icon: Twitter, color: 'text-sky-400',  connected: false },
  { id: 'tiktok',    name: 'TikTok',    icon: Music,     color: 'text-cyan-400', connected: false },
];

export const PlatformConnections = ({
  onConnect
}: {
  onConnect: (platformId: string) => void;
}) => (
  <div className="bg-[#1a1d2e] border border-white/10 rounded-xl p-4">
    <h3 className="text-sm font-semibold text-white mb-3">Connected Platforms</h3>
    <div className="space-y-2">
      {platforms.map(p => (
        <div key={p.id} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p.icon size={16} className={p.color} />
            <span className="text-sm text-gray-300">{p.name}</span>
          </div>
          {p.connected ? (
            <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
              Connected
            </span>
          ) : (
            <button
              onClick={() => onConnect(p.id)}
              className="text-xs text-purple-400 border border-purple-500/30 px-2 py-0.5
                         rounded-full hover:bg-purple-500/10 transition-colors">
              Connect
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
);
```

---

## 3. Workflow Automation

### 3.1 Visual Node-Based Workflow Builder

The current "Workflow Builder" is a flat list of clickable step buttons. This is limiting — it does not show the relationship between steps, does not support branching logic (e.g., "if script is approved, publish; else, send for review"), and is not visually engaging. A node-based canvas is the industry standard for workflow builders (Zapier, Make, n8n).

**Recommendation:** Integrate `reactflow` to create a proper drag-and-drop node canvas.

```bash
# Install in your Trae.ai project terminal
npm install reactflow
```

```tsx
// components/WorkflowCanvas.tsx
import { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge, Background, Controls, MiniMap,
  useNodesState, useEdgesState,
  type Connection, type Edge, type Node
} from 'reactflow';
import 'reactflow/dist/style.css';

const nodeStyle = {
  background: '#1a1d2e',
  border: '1px solid rgba(139, 92, 246, 0.4)',
  borderRadius: '10px',
  color: '#e2e8f0',
  fontSize: '13px',
  padding: '10px 16px',
};

const initialNodes: Node[] = [
  { id: '1', position: { x: 100, y: 100 }, data: { label: '💡 Idea Generator' }, style: nodeStyle },
  { id: '2', position: { x: 100, y: 220 }, data: { label: '✍️ Script Writer' },  style: nodeStyle },
  { id: '3', position: { x: 100, y: 340 }, data: { label: '🎙️ Voice Over' },     style: nodeStyle },
  { id: '4', position: { x: 100, y: 460 }, data: { label: '🚀 Publisher' },       style: nodeStyle },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#8b5cf6' } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#8b5cf6' } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#8b5cf6' } },
];

export const WorkflowCanvas = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges(eds => addEdge({ ...params, animated: true, style: { stroke: '#8b5cf6' } }, eds)),
    [setEdges]
  );

  return (
    <div style={{ height: 500 }} className="rounded-xl overflow-hidden border border-white/10">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background color="#ffffff08" gap={20} />
        <Controls className="!bg-[#1a1d2e] !border-white/10" />
        <MiniMap nodeColor="#8b5cf6" className="!bg-[#0f1117]" />
      </ReactFlow>
    </div>
  );
};
```

### 3.2 Workflow Templates Library

```tsx
// components/WorkflowTemplates.tsx
const templates = [
  {
    id: 'yt-full',
    title: 'YouTube Full Pipeline',
    description: 'Idea → Script → Voice Over → Thumbnail → Publish',
    steps: 5,
    icon: '🎬',
  },
  {
    id: 'repurpose',
    title: 'Repurpose Long-form',
    description: 'Long video → Shorts → Reels → Tweets',
    steps: 4,
    icon: '♻️',
  },
  {
    id: 'podcast',
    title: 'Podcast to Blog',
    description: 'Audio upload → Transcribe → Edit → Publish blog',
    steps: 4,
    icon: '🎙️',
  },
  {
    id: 'social-burst',
    title: 'Social Media Burst',
    description: 'One idea → 7 platform-specific posts',
    steps: 3,
    icon: '📣',
  },
];

export const WorkflowTemplates = ({
  onUse
}: {
  onUse: (templateId: string) => void;
}) => (
  <div className="grid grid-cols-2 gap-3">
    {templates.map(t => (
      <div key={t.id}
           className="bg-[#1a1d2e] border border-white/10 rounded-xl p-4
                      hover:border-purple-500/40 transition-colors cursor-pointer group">
        <div className="text-2xl mb-2">{t.icon}</div>
        <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
          {t.title}
        </h4>
        <p className="text-xs text-gray-500 mt-1">{t.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-600">{t.steps} steps</span>
          <button
            onClick={() => onUse(t.id)}
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
            Use template →
          </button>
        </div>
      </div>
    ))}
  </div>
);
```

---

## 4. Script Editor

### 4.1 Rich Text Editor with AI Inline Suggestions

The current script editor is a plain `<textarea>`. Replacing it with a rich text editor (Tiptap) enables formatting, word count per section, and inline AI suggestions triggered by a `/` command — similar to Notion's block system.

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
```

```tsx
// components/ScriptEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useState, useCallback } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const ScriptEditor = ({
  scriptId,
  userId,
  initialContent = ''
}: {
  scriptId: string;
  userId: string;
  initialContent?: string;
}) => {
  const [wordCount, setWordCount] = useState(0);
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your script here, or press / to use AI commands...',
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      setWordCount(words);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[400px] focus:outline-none text-gray-200 text-sm leading-relaxed',
      },
    },
  });

  const saveToFirebase = useCallback(async () => {
    if (!editor) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'users', userId, 'scripts', scriptId), {
        content: editor.getHTML(),
        updatedAt: new Date().toISOString(),
        wordCount,
      }, { merge: true });
    } finally {
      setSaving(false);
    }
  }, [editor, scriptId, userId, wordCount]);

  const estimatedMinutes = Math.round(wordCount / 150);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 bg-[#1a1d2e] rounded-xl border border-white/10 p-4 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
      <div className="flex items-center justify-between mt-2 px-1">
        <span className="text-xs text-gray-500">
          {wordCount} words · ~{estimatedMinutes} min read · 150 wpm
        </span>
        <button
          onClick={saveToFirebase}
          disabled={saving}
          className="text-xs text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : '☁ Save to Cloud'}
        </button>
      </div>
    </div>
  );
};
```

### 4.2 AI Generate with Streaming Response

The "AI Generate" button should stream the response token-by-token for a more engaging and responsive experience, rather than waiting for the full response.

```tsx
// hooks/useAIScriptGeneration.ts
import { useState } from 'react';

export const useAIScriptGeneration = () => {
  const [streaming, setStreaming] = useState(false);
  const [output, setOutput] = useState('');

  const generate = async (title: string, duration: string) => {
    setStreaming(true);
    setOutput('');

    const response = await fetch('/api/generate-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, duration }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      setOutput(prev => prev + chunk);
    }

    setStreaming(false);
  };

  return { generate, streaming, output };
};
```

### 4.3 Script Version History (Firebase)

```tsx
// hooks/useScriptVersions.ts
import { collection, addDoc, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const saveVersion = async (userId: string, scriptId: string, content: string) => {
  await addDoc(
    collection(db, 'users', userId, 'scripts', scriptId, 'versions'),
    {
      content,
      savedAt: new Date().toISOString(),
      label: `Version — ${new Date().toLocaleString()}`,
    }
  );
};

export const getVersions = async (userId: string, scriptId: string) => {
  const q = query(
    collection(db, 'users', userId, 'scripts', scriptId, 'versions'),
    orderBy('savedAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
```

---

## 5. Teleprompter

### 5.1 Voice-Activated Auto-Scroll

The current teleprompter requires manual speed control. Adding voice-activated scrolling — where the script advances in sync with what the user is actually saying — is the single highest-impact improvement for this screen.

```tsx
// hooks/useVoiceScroll.ts
import { useRef, useState, useCallback } from 'react';

export const useVoiceScroll = (
  scriptWords: string[],
  onWordMatch: (matchedIndex: number) => void
) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [active, setActive] = useState(false);
  const wordIndexRef = useRef(0);

  const start = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice mode requires Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const spoken = event.results[i][0].transcript.toLowerCase().trim().split(/\s+/);
        spoken.forEach(word => {
          const target = scriptWords[wordIndexRef.current]?.toLowerCase().replace(/[^a-z]/g, '');
          if (target && word.replace(/[^a-z]/g, '') === target) {
            wordIndexRef.current += 1;
            onWordMatch(wordIndexRef.current);
          }
        });
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setActive(true);
  }, [scriptWords, onWordMatch]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setActive(false);
  }, []);

  return { start, stop, active };
};
```

### 5.2 Eye-Line Indicator & Focus Zone

```tsx
// components/TeleprompterDisplay.tsx
import { useRef, useEffect } from 'react';

export const TeleprompterDisplay = ({
  text,
  fontSize,
  opacity,
  mirrored,
  currentWordIndex,
}: {
  text: string;
  fontSize: number;
  opacity: number;
  mirrored: boolean;
  currentWordIndex: number;
}) => {
  const words = text.split(/\s+/);
  const activeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [currentWordIndex]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Eye-line indicator */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none z-10">
        <div className="h-[2px] bg-red-500/40 w-full" />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500" />
      </div>

      <div
        className="h-full overflow-y-auto px-16 py-[40vh] text-center leading-relaxed"
        style={{
          fontSize: `${fontSize}px`,
          opacity: opacity / 100,
          transform: mirrored ? 'scaleX(-1)' : 'none',
        }}
      >
        {words.map((word, i) => (
          <span
            key={i}
            ref={i === currentWordIndex ? activeRef : undefined}
            className={`transition-colors duration-150 ${
              i === currentWordIndex
                ? 'text-white font-bold'
                : i < currentWordIndex
                ? 'text-gray-600'
                : 'text-gray-300'
            }`}
          >
            {word}{' '}
          </span>
        ))}
      </div>
    </div>
  );
};
```

### 5.3 Remote Control via QR Code (Firebase Realtime)

Allow a second device (phone) to control scroll speed and play/pause via a shared Firebase Realtime Database session.

```tsx
// hooks/useRemoteControl.ts
import { ref, onValue, set } from 'firebase/database';
import { rtdb } from '../firebase';
import { useEffect, useState } from 'react';

export const useRemoteControl = (sessionId: string) => {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Listen for remote commands
  useEffect(() => {
    const sessionRef = ref(rtdb, `teleprompter/${sessionId}`);
    const unsub = onValue(sessionRef, snap => {
      const data = snap.val();
      if (data) {
        setPlaying(data.playing ?? false);
        setSpeed(data.speed ?? 1);
      }
    });
    return unsub;
  }, [sessionId]);

  // Send command from remote device
  const sendCommand = (playing: boolean, speed: number) =>
    set(ref(rtdb, `teleprompter/${sessionId}`), { playing, speed });

  return { playing, speed, sendCommand };
};
```

---

## 6. Firebase Security Rules

Ensure your Firestore rules protect user data properly:

```
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 7. Improvement Priority Matrix

The following table summarizes all recommended improvements by impact and implementation effort, allowing you to prioritize development sprints effectively.

| # | Improvement | Screen | Impact | Effort | Priority |
|---|-------------|--------|--------|--------|----------|
| 1 | Voice-activated teleprompter scroll | Teleprompter | High | Low | **P0** |
| 2 | Node-based workflow canvas (ReactFlow) | Automation | High | Medium | **P0** |
| 3 | Rich text script editor (Tiptap) | Script | High | Medium | **P0** |
| 4 | Calendar post indicators + drag-to-schedule | Publish | High | Medium | **P1** |
| 5 | Workflow templates library | Automation | High | Low | **P1** |
| 6 | AI streaming script generation | Script | Medium | Low | **P1** |
| 7 | Multi-platform connection panel | Publish | Medium | Low | **P1** |
| 8 | Script version history (Firebase) | Script | Medium | Low | **P2** |
| 9 | Left sidebar navigation | Global | Medium | Medium | **P2** |
| 10 | ⌘K command palette | Global | Medium | Low | **P2** |
| 11 | Eye-line indicator in teleprompter | Teleprompter | Medium | Low | **P2** |
| 12 | Remote control via QR (Firebase RTDB) | Teleprompter | Medium | Medium | **P3** |

---

## 8. Recommended npm Packages

| Package | Purpose | Install |
|---------|---------|---------|
| `reactflow` | Node-based workflow builder | `npm i reactflow` |
| `@tiptap/react` + `@tiptap/starter-kit` | Rich text script editor | `npm i @tiptap/react @tiptap/starter-kit` |
| `@tiptap/extension-placeholder` | Placeholder text in editor | `npm i @tiptap/extension-placeholder` |
| `lucide-react` | Consistent icon set | `npm i lucide-react` |
| `date-fns` | Calendar date manipulation | `npm i date-fns` |
| `qrcode.react` | QR code for remote control | `npm i qrcode.react` |

---

## References

[1] [6 steps to design thoughtful dashboards for B2B SaaS](https://uxdesign.cc/design-thoughtful-dashboards-for-b2b-saas-ff484385960d)  
[2] [10 Essential Dashboard Design Best Practices for SaaS](https://www.brand.dev/blog/dashboard-design-best-practices)  
[3] [Best Practices for Drag-and-Drop Workflow UI](https://latenode.com/blog/implementation-guides-tutorials/setup-configuration-guides/best-practices-for-drag-and-drop-workflow-ui)  
[4] [9 Ways A Teleprompter App Can Level Up Your Content Creation](https://guide.teleprompterpro.com/blog/9-ways-a-teleprompter-app-can-level-up-your-content-creation-in-2025/)  
[5] [Calendar UI Examples: 33 Inspiring Designs + UX Tips](https://www.eleken.co/blog-posts/calendar-ui)  
[6] [Getting Started with Drag-and-Drop AI Workflow Builders](https://www.mindstudio.ai/blog/getting-started-drag-and-drop-ai-workflow-builders)  
[7] [SaaS UX Best Practices 2025 Guide](https://www.linkedin.com/pulse/saas-ux-best-practices-2025-guide-how-design-better-azj5f)
