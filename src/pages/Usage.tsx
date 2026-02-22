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

export default function Usage() {
  const [usageEvents, setUsageEvents] = useState(() => {
    const saved = localStorage.getItem('contentflow_usage');
    return saved ? JSON.parse(saved) : [];
  });
  const [metric, setMetric] = useState('llm');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('contentflow_usage', JSON.stringify(usageEvents));
  }, [usageEvents]);

  const usageFeatureLabel = (type: string) => {
    return ({ llm: 'Ideas/Script/Translate', slm: 'SLM', tts: 'Voice Over', img: 'Image Gen', vid: 'Video Gen' } as any)[type] || 'Unknown';
  };

  const usageUnitCost = (type: string) => {
    // Simplified cost model
    if (type === 'llm') return 2 / 1_000_000; // per token
    if (type === 'slm') return 0.5 / 1_000_000; // per token (cheaper)
    if (type === 'tts') return 0.023 / 1000; // per char
    if (type === 'img') return 0.04; // per image
    if (type === 'vid') return 0.60; // per minute
    return 0;
  };

  const seedUsage = () => {
    const now = Date.now();
    const types = ['llm','slm','tts','img','vid']; 
    const newEvents = [];
    for (let d = 6; d >= 0; d--) { 
      for (let i = 0; i < 3; i++) { 
        const type = types[Math.floor(Math.random()*types.length)]; 
        const t = new Date(now - d*86400000 - Math.random()*3600000).toISOString(); 
        const units = type==='llm' || type==='slm' ? Math.floor(50000 + Math.random()*250000) 
            : type==='tts' ? Math.floor(2000 + Math.random()*15000) 
            : type==='img' ? Math.floor(1 + Math.random()*8) 
            : Math.floor(1 + Math.random()*6); 
        newEvents.push({ at: t, type, units, feature: usageFeatureLabel(type) }); 
      } 
    } 
    newEvents.sort((a,b)=> new Date(b.at).getTime() - new Date(a.at).getTime());
    setUsageEvents(newEvents);
    showToast('Sample usage data added', 'success');
  };

  const addUsageEvent = () => {
    const types = ['llm','slm','tts','img','vid']; 
    const type = types[Math.floor(Math.random()*types.length)]; 
    const units = type==='llm' || type==='slm' ? Math.floor(20000 + Math.random()*180000) 
        : type==='tts' ? Math.floor(1000 + Math.random()*12000) 
        : type==='img' ? Math.floor(1 + Math.random()*6) 
        : Math.floor(1 + Math.random()*8); 
    const newEvent = { at: new Date().toISOString(), type, units, feature: usageFeatureLabel(type) };
    setUsageEvents([newEvent, ...usageEvents]);
    showToast('Usage event added', 'success');
  };

  const exportUsage = () => {
    const json = JSON.stringify(usageEvents, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usage_events.json';
    a.click();
    showToast('Usage exported', 'success');
  };

  // Calculate Chart Data
  const getChartData = () => {
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const totals: any = { Mon:0, Tue:0, Wed:0, Thu:0, Fri:0, Sat:0, Sun:0 };
    const today = new Date();
    const start = new Date(today);
    start.setHours(0,0,0,0);
    start.setDate(start.getDate() - 6);

    usageEvents.filter((e: any) => e.type === metric).forEach((e: any) => {
      const dt = new Date(e.at);
      if (dt < start) return;
      const name = days[(dt.getDay()+6)%7];
      totals[name] += e.units;
    });

    const arr = days.map(d => totals[d]);
    const max = Math.max(1, ...arr);
    return { days, arr, max };
  };

  const { days, arr, max } = getChartData();

  // Calculate Costs
  const calculateCosts = () => {
    const totals = { llm:0, slm:0, tts:0, img:0, vid:0 };
    usageEvents.forEach((e: any) => { totals[e.type as keyof typeof totals] += e.units; });
    
    const costs = {
      llm: totals.llm * usageUnitCost('llm'),
      slm: totals.slm * usageUnitCost('slm'),
      tts: totals.tts * usageUnitCost('tts'),
      img: totals.img * usageUnitCost('img'),
      vid: totals.vid * usageUnitCost('vid')
    };
    
    return { totals, costs, total: Object.values(costs).reduce((a, b) => a + b, 0) };
  };

  const stats = calculateCosts();

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans pt-16 pb-8">
      <TopNav />
      
      <main className="max-w-7xl mx-auto px-4 fade-in">
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold mb-2">📈 Usage Analytics</h1>
            <p className="text-gray-400">Track variable-cost usage (LLM, TTS, images, video) with caps, alerts, and cost estimates.</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={seedUsage}
              className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm flex items-center gap-2"
            >
              <i className="fas fa-database"></i> Seed sample data
            </button>
            <button 
              onClick={exportUsage}
              className="gradient-bg px-4 py-2 rounded-lg hover:opacity-90 transition text-sm font-medium flex items-center gap-2"
            >
              <i className="fas fa-download"></i> Export usage
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="font-bold">Usage over last 7 days</h3>
                <div className="flex items-center gap-2 text-sm">
                  <select 
                    value={metric}
                    onChange={(e) => setMetric(e.target.value)}
                    className="bg-gray-700 rounded-lg px-3 py-2"
                  >
                    <option value="llm">LLM tokens</option>
                    <option value="slm">SLM tokens</option>
                    <option value="tts">TTS characters</option>
                    <option value="img">Images</option>
                    <option value="vid">Video minutes</option>
                  </select>
                  <button onClick={() => setUsageEvents([...usageEvents])} className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition">Refresh</button>
                </div>
              </div>
              <div className="mt-4 h-64 flex items-end justify-around gap-2 px-2 pb-2">
                {arr.map((val, i) => (
                  <div key={i} className="w-full flex flex-col items-center gap-2 group">
                    <div 
                      className="w-full bg-gradient-to-t from-purple-500 to-blue-500 rounded-t-sm hover:opacity-90 transition-all relative" 
                      style={{ height: `${Math.max(4, (val / max) * 100)}%` }}
                    >
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap border border-gray-700 z-10">
                          {metric === 'llm' || metric === 'slm' || metric === 'tts' ? Math.round(val/1000)+'K' : val}
                       </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-around mt-4 text-sm text-gray-400">
                {days.map(d => <span key={d}>{d}</span>)}
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="font-bold">Cost estimate</h3>
                <button onClick={() => showToast('Synced to cost model', 'success')} className="text-sm text-purple-400 hover:underline flex items-center gap-1">
                  <i className="fas fa-link"></i> Sync to cost model
                </button>
              </div>
              <div className="mt-4 grid md:grid-cols-5 gap-4">
                <div className="p-4 bg-gray-700/30 rounded-xl">
                  <p className="text-xs text-gray-400">LLM</p>
                  <p className="text-xl font-bold">${stats.costs.llm.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{stats.totals.llm.toLocaleString()} tokens</p>
                </div>
                <div className="p-4 bg-gray-700/30 rounded-xl">
                  <p className="text-xs text-gray-400">SLM</p>
                  <p className="text-xl font-bold">${stats.costs.slm.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{stats.totals.slm.toLocaleString()} tokens</p>
                </div>
                <div className="p-4 bg-gray-700/30 rounded-xl">
                  <p className="text-xs text-gray-400">TTS</p>
                  <p className="text-xl font-bold">${stats.costs.tts.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{stats.totals.tts.toLocaleString()} chars</p>
                </div>
                <div className="p-4 bg-gray-700/30 rounded-xl">
                  <p className="text-xs text-gray-400">Images</p>
                  <p className="text-xl font-bold">${stats.costs.img.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{stats.totals.img.toLocaleString()} images</p>
                </div>
                <div className="p-4 bg-gray-700/30 rounded-xl">
                  <p className="text-xs text-gray-400">Video</p>
                  <p className="text-xl font-bold">${stats.costs.vid.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{stats.totals.vid.toLocaleString()} mins</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-700/30 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total estimated variable cost</span>
                  <span className="text-2xl font-bold">${stats.total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Tie this to plan limits + auto top-ups to prevent surprise bills.</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="font-bold">Events</h3>
                <div className="flex items-center gap-2">
                  <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-gray-700 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="all">All</option>
                    <option value="llm">LLM</option>
                    <option value="tts">TTS</option>
                    <option value="img">Images</option>
                    <option value="vid">Video</option>
                  </select>
                  <button onClick={addUsageEvent} className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition text-sm flex items-center gap-2">
                    <i className="fas fa-plus"></i> Add event
                  </button>
                </div>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-700">
                      <th className="py-2 pr-4 font-medium">Time</th>
                      <th className="py-2 pr-4 font-medium">Type</th>
                      <th className="py-2 pr-4 font-medium">Units</th>
                      <th className="py-2 pr-4 font-medium">Est. cost</th>
                      <th className="py-2 pr-4 font-medium">Feature</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-200">
                    {usageEvents.length === 0 ? (
                      <tr><td className="py-3 text-gray-500" colSpan={5}>No events yet. Seed sample data to preview.</td></tr>
                    ) : (
                      usageEvents
                        .filter((e: any) => filter === 'all' ? true : e.type === filter)
                        .slice(0, 25)
                        .map((e: any, i: number) => {
                          const cost = e.units * usageUnitCost(e.type);
                          const badge = {
                            llm: 'bg-purple-500/20 text-purple-300',
                            tts: 'bg-green-500/20 text-green-300',
                            img: 'bg-orange-500/20 text-orange-300',
                            vid: 'bg-red-500/20 text-red-300'
                          }[e.type as string] || 'bg-gray-600/30 text-gray-300';
                          
                          return (
                            <tr key={i} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                              <td className="py-3 pr-4 text-gray-400">{new Date(e.at).toLocaleString()}</td>
                              <td className="py-3 pr-4"><span className={`text-xs px-2 py-1 rounded ${badge}`}>{e.type.toUpperCase()}</span></td>
                              <td className="py-3 pr-4">{e.units.toLocaleString()}</td>
                              <td className="py-3 pr-4">${cost.toFixed(4)}</td>
                              <td className="py-3 pr-4 text-gray-300">{e.feature || usageFeatureLabel(e.type)}</td>
                            </tr>
                          );
                        })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Caps & alerts</h3>
              <div className="space-y-3 text-sm">
                <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Monthly variable-cost cap</span>
                    <span className="font-medium">$50</span>
                  </div>
                  <input type="range" min="0" max="500" step="10" defaultValue="50" className="w-full mt-3 accent-purple-500" />
                  <p className="text-xs text-gray-500 mt-2">In production: block generation, require top-up, or downgrade quality when cap is hit.</p>
                </div>

                <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-700">
                  <p className="font-medium mb-2">Auto top-up (simulated)</p>
                  <label className="flex items-center justify-between p-2 bg-gray-800/40 rounded-lg cursor-pointer">
                    <span>Enable auto top-up</span>
                    <input type="checkbox" className="accent-purple-500 w-4 h-4" />
                  </label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <input type="number" className="bg-gray-700 rounded-lg px-3 py-2 text-sm" defaultValue="25" />
                    <input type="number" className="bg-gray-700 rounded-lg px-3 py-2 text-sm" defaultValue="80" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Top-up <span className="font-mono bg-gray-800 px-1 rounded">$amount</span> when usage reaches <span className="font-mono bg-gray-800 px-1 rounded">% threshold</span>.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Provider unit costs</h3>
              <p className="text-sm text-gray-400 mb-3">Uses the same inputs as Monetization → Unit costs.</p>
              <button onClick={() => window.location.href='/monetization'} className="w-full bg-gray-700 py-2 rounded-lg hover:bg-gray-600 transition">Open cost model</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
