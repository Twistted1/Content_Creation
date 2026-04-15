import React, { useState, useEffect } from 'react';
import { TopNav } from '@/components/dashboard/TopNav';

// Toast helper
const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-xl shadow-2xl transform transition-all duration-500 translate-y-10 opacity-0 z-50 ${
    type === 'success' ? 'bg-green-500/90 text-white' : 
    type === 'error' ? 'bg-red-500/90 text-white' : 
    'bg-blue-500/90 text-white'
  }`;
  toast.innerHTML = `<div class="flex items-center gap-2"><i class="fas fa-${
    type === 'success' ? 'check-circle' : 
    type === 'error' ? 'exclamation-circle' : 
    'info-circle'
  }"></i> ${message}</div>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.remove('translate-y-10', 'opacity-0'));
  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => toast.remove(), 500);
  }, 3000);
};

export default function ApiDocs() {
  const [apiDocState, setApiDocState] = useState(() => {
    const saved = localStorage.getItem('contentflow_api');
    return saved ? JSON.parse(saved) : {
      key: 'cf_live_9b7c...demo',
      panel: 'auth'
    };
  });

  const [activeSection, setActiveSection] = useState(apiDocState.panel || 'auth');
  const [tryResponse, setTryResponse] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('contentflow_api', JSON.stringify({ ...apiDocState, panel: activeSection }));
    setTryResponse(null); // Clear previous response when switching sections
  }, [apiDocState, activeSection]);

  const rotateApiKey = () => {
    const newKey = 'cf_live_' + Math.random().toString(16).slice(2, 10) + '...demo';
    setApiDocState(prev => ({ ...prev, key: newKey }));
    showToast('API key rotated (simulated)', 'success');
  };

  const getSampleRequest = (section: string) => {
    const key = apiDocState.key;
    const samples: any = {
      auth: `curl "https://api.contentflow.example/v1/ideas" \\
  -H "Authorization: Bearer ${key}"`,
      ideas: `POST /ideas/generate
Authorization: Bearer ${key}

{
  "niche": "tech",
  "platform": "youtube",
  "count": 3
}`,
      scripts: `POST /scripts
Authorization: Bearer ${key}

{
  "title": "My Script",
  "type": "short",
  "content": "..."
}`,
      render: `POST /renders/voice
Authorization: Bearer ${key}

{
  "voice": "bella",
  "text": "Hello world"
}`,
      publish: `POST /publish/schedule
Authorization: Bearer ${key}

{
  "platform": "youtube",
  "publish_at": "2025-12-30T15:00:00Z"
}`,
      webhooks: `POST /webhooks
Authorization: Bearer ${key}

{
  "url": "https://yourapp.com/webhooks/contentflow"
}`,
      usage: `GET /usage?range=7d
Authorization: Bearer ${key}`
    };
    return samples[section] || samples.auth;
  };

  const runApiTryIt = () => {
    const panel = activeSection;
    let res: any = { ok: true, request_id: 'req_' + Math.random().toString(36).slice(2, 8) };
    
    if (panel === 'ideas') res.data = ['Top 10 AI Tools', 'How to Code in 2025', 'Productivity Hacks'];
    if (panel === 'scripts') res.data = { id: 'scr_' + Math.random().toString(36).slice(2, 7), status: 'draft' };
    if (panel === 'render') res.data = { job_id: 'job_' + Math.random().toString(36).slice(2, 7), status: 'queued' };
    if (panel === 'publish') res.data = { schedule_id: 'sch_' + Math.random().toString(36).slice(2, 7), status: 'scheduled' };
    if (panel === 'usage') res.data = { total_cost: 12.50, currency: 'USD' };
    if (panel === 'webhooks') res.data = { id: 'wh_' + Math.random().toString(36).slice(2, 7), status: 'enabled' };
    if (panel === 'auth') res.data = { message: "Authenticated successfully" };

    setTryResponse(res);
    showToast('Request sent (simulated)', 'success');
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'auth':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="font-bold text-xl">Authentication</h3>
            <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-700">
               <p className="text-sm text-gray-300">Use a bearer token. Prefer per-workspace API keys. Add <span className="font-mono bg-gray-800 px-1 rounded">Idempotency-Key</span> for create endpoints.</p> 
               <pre className="font-mono text-xs bg-gray-900/40 border border-gray-700 rounded-xl p-4 mt-4 overflow-auto text-green-400">
{`curl "https://api.contentflow.example/v1/ideas" \\
  -H "Authorization: Bearer ${apiDocState.key}"`}
               </pre>
            </div>
            <div className="mt-4 grid md:grid-cols-2 gap-4"> 
                 <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-700"> 
                     <p className="font-medium">Rate limits</p> 
                     <p className="text-xs text-gray-400 mt-1">Example: 60 req/min per key + burst 10.</p> 
                 </div> 
                 <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-700"> 
                     <p className="font-medium">Scopes</p> 
                     <p className="text-xs text-gray-400 mt-1">ideas:read, scripts:write, renders:write, publish:write, usage:read</p> 
                 </div> 
            </div> 
          </div>
        );
      case 'ideas':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="flex items-center justify-between gap-3 flex-wrap"> 
                <h3 className="text-xl font-bold">Ideas API</h3> 
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded"><i className="fas fa-circle-info mr-1"></i>REST + async jobs</span> 
             </div> 
             <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-700"> 
                 <p className="font-medium">POST /ideas/generate</p> 
                 <p className="text-xs text-gray-400">Generate ideas for a niche/platform.</p> 
                 <pre className="font-mono text-xs bg-gray-900/40 border border-gray-700 rounded-xl p-4 mt-3 overflow-auto text-gray-300">
{`{ 
  "niche": "tech", 
  "platform": "youtube", 
  "count": 5 
}`}
                 </pre> 
             </div> 
             <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-700"> 
                 <p className="font-medium">GET /ideas</p> 
                 <p className="text-xs text-gray-400">List saved ideas (paginated).</p> 
             </div> 
          </div>
        );
      case 'scripts':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="flex items-center justify-between gap-3 flex-wrap"> 
                <h3 className="text-xl font-bold">Scripts API</h3> 
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded"><i className="fas fa-circle-info mr-1"></i>REST + async jobs</span> 
             </div> 
             <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-700"> 
                 <p className="font-medium">POST /scripts</p> 
                 <p className="text-xs text-gray-400">Create a script draft.</p> 
                 <pre className="font-mono text-xs bg-gray-900/40 border border-gray-700 rounded-xl p-4 mt-3 overflow-auto text-gray-300">
{`{ 
  "title": "10 Hidden iOS Features", 
  "type": "short", 
  "content": "..." 
}`}
                 </pre> 
             </div> 
             <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-700"> 
                 <p className="font-medium">POST /scripts/translate</p> 
                 <p className="text-xs text-gray-400">Translate content (billable LLM usage).</p> 
             </div> 
          </div>
        );
      case 'render':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="flex items-center justify-between gap-3 flex-wrap"> 
                <h3 className="text-xl font-bold">Renders API</h3> 
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded"><i className="fas fa-circle-info mr-1"></i>REST + async jobs</span> 
             </div> 
             <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-700"> 
                 <p className="font-medium">POST /renders/voice</p> 
                 <p className="text-xs text-gray-400">TTS voiceover render job.</p> 
             </div> 
             <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-700"> 
                 <p className="font-medium">POST /renders/image</p> 
                 <p className="text-xs text-gray-400">Text-to-image render.</p> 
             </div> 
             <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-700"> 
                 <p className="font-medium">POST /renders/video</p> 
                 <p className="text-xs text-gray-400">Video generation (highest compute). Recommend async jobs + webhook completion.</p> 
             </div> 
          </div>
        );
      case 'publish':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="flex items-center justify-between gap-3 flex-wrap"> 
                <h3 className="text-xl font-bold">Publishing API</h3> 
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded"><i className="fas fa-circle-info mr-1"></i>REST + async jobs</span> 
             </div> 
             <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-700"> 
                 <p className="font-medium">POST /publish/schedule</p> 
                 <p className="text-xs text-gray-400">Schedule a post to a connected platform.</p> 
             </div> 
             <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-700"> 
                 <p className="font-medium">POST /connections/oauth</p> 
                 <p className="text-xs text-gray-400">OAuth connect YouTube/TikTok/Instagram.</p> 
             </div> 
          </div>
        );
      case 'webhooks':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="flex items-center justify-between gap-3 flex-wrap"> 
                <h3 className="text-xl font-bold">Webhooks</h3> 
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded"><i className="fas fa-circle-info mr-1"></i>REST + async jobs</span> 
             </div> 
             <p className="text-sm text-gray-300">Receive events for async jobs and publishing.</p> 
             <div className="mt-4 space-y-3"> 
                 <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-700"> 
                     <p className="font-medium">Events</p> 
                     <p className="text-xs text-gray-400 mt-1"><span className="font-mono bg-gray-800 px-1 rounded">render.completed</span>, <span className="font-mono bg-gray-800 px-1 rounded">publish.scheduled</span>, <span className="font-mono bg-gray-800 px-1 rounded">usage.threshold</span></p> 
                 </div> 
                 <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-700"> 
                     <p className="font-medium">Signature</p> 
                     <p className="text-xs text-gray-400 mt-1">Use HMAC with a signing secret. Reject old timestamps.</p> 
                 </div> 
             </div> 
          </div>
        );
      case 'usage':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="flex items-center justify-between gap-3 flex-wrap"> 
                <h3 className="text-xl font-bold">Usage API</h3> 
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded"><i className="fas fa-circle-info mr-1"></i>REST + async jobs</span> 
             </div> 
             <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-700"> 
                 <p className="font-medium">GET /usage</p> 
                 <p className="text-xs text-gray-400">Aggregate usage by metric + time range.</p> 
             </div> 
             <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-700"> 
                 <p className="font-medium">POST /usage/events</p> 
                 <p className="text-xs text-gray-400">Ingest metering events (idempotent).</p> 
             </div> 
          </div>
        );
      default:
        return <div className="text-gray-400">Select a section to view documentation.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans pt-16 pb-8">
      <TopNav />
      
      <main className="max-w-7xl mx-auto px-4 fade-in">
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold mb-2">🧾 API Documentation</h1>
            <p className="text-gray-400">REST API docs: authentication, endpoints, webhooks, SDK snippets, and live “try it” examples.</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={rotateApiKey}
              className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm flex items-center gap-2"
            >
              <i className="fas fa-key"></i> Rotate API Key
            </button>
            <button 
              onClick={() => { navigator.clipboard.writeText(apiDocState.key); showToast('API key copied', 'success'); }}
              className="gradient-bg px-4 py-2 rounded-lg hover:opacity-90 transition text-sm font-medium flex items-center gap-2"
            >
              <i className="fas fa-copy"></i> Copy Key
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-2xl p-6 h-fit">
            <h3 className="font-bold mb-4">Quickstart</h3>
            <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-700">
              <p className="text-xs text-gray-400">Base URL</p>
              <p className="font-mono text-sm mt-1">https://api.contentflow.example/v1</p>
              <p className="text-xs text-gray-400 mt-3">API Key</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-sm text-purple-400 break-all">{apiDocState.key}</span>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              {[
                { id: 'auth', label: '🔐 Authentication' },
                { id: 'ideas', label: '💡 Ideas' },
                { id: 'scripts', label: '📝 Scripts' },
                { id: 'render', label: '🎬 Renders (voice/image/video)' },
                { id: 'publish', label: '📤 Publishing' },
                { id: 'webhooks', label: '🪝 Webhooks' },
                { id: 'usage', label: '📈 Usage' },
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left p-3 rounded-xl transition ${activeSection === item.id ? 'bg-gray-700 text-white' : 'bg-gray-700/30 hover:bg-gray-700/50 text-gray-300'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 rounded-2xl p-6 min-h-[300px]">
              {renderContent()}
            </div>

            <div className="bg-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="font-bold">Try it (simulated)</h3>
                <button 
                  onClick={runApiTryIt}
                  className="gradient-bg px-4 py-2 rounded-lg hover:opacity-90 transition text-sm font-medium flex items-center gap-2"
                >
                  <i className="fas fa-play"></i> Send Request
                </button>
              </div>
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Request</label>
                  <pre className="font-mono text-xs bg-gray-900/40 border border-gray-700 rounded-xl p-4 overflow-auto h-40 text-gray-300 whitespace-pre-wrap">
                    {getSampleRequest(activeSection)}
                  </pre>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Response</label>
                  <pre className="font-mono text-xs bg-gray-900/40 border border-gray-700 rounded-xl p-4 overflow-auto h-40 text-green-400">
                    {tryResponse ? JSON.stringify(tryResponse, null, 2) : '// Click Send Request to see response...'}
                  </pre>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">In production: implement real requests, auth, rate limits, idempotency keys, and audit logging.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
