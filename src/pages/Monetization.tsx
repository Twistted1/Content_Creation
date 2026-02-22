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

// Plan Catalog
const planCatalog: any = {
  free: {
    name: 'Free',
    price: 0,
    features: { translation: false, voice: false, clone: false, images: false, video: false, automation: false }
  },
  creator: {
    name: 'Creator',
    price: 29,
    features: { translation: true, voice: true, clone: false, images: true, video: false, automation: true }
  },
  studio: {
    name: 'Studio',
    price: 99,
    features: { translation: true, voice: true, clone: true, images: true, video: true, automation: true }
  }
};

export default function Monetization() {
  const [billingPlan, setBillingPlan] = useState(() => localStorage.getItem('contentflow_plan') || 'free');
  
  // Usage Assumptions State
  const [usage, setUsage] = useState({
    tokM: 2.0,
    ttsK: 50,
    img: 50,
    vid: 10
  });

  // Unit Costs State
  const [costs, setCosts] = useState({
    llm: 2.00,
    tts: 0.023,
    img: 0.04,
    vid: 0.60
  });

  // KPI State
  const [churn, setChurn] = useState(8);
  const [kpis, setKpis] = useState({
    cogs: 0,
    addon: 0,
    arpu: 0,
    margin: 0,
    ltv: 0
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'details' | 'checkout'>('details');
  const [checkoutPlan, setCheckoutPlan] = useState('creator');

  useEffect(() => {
    localStorage.setItem('contentflow_plan', billingPlan);
    recalcKPIs();
  }, [billingPlan, usage, costs, churn]);

  const recalcKPIs = () => {
    const cogsValue = (usage.tokM * costs.llm) + (usage.ttsK * costs.tts) + (usage.img * costs.img) + (usage.vid * costs.vid);
    const addonValue = cogsValue * 4;

    const plan = planCatalog[billingPlan] || planCatalog.free;
    const arpuValue = plan.price; // Simplified ARPU = Plan Price
    const marginValue = arpuValue > 0 ? Math.max(0, (arpuValue - cogsValue) / arpuValue) : 0;
    const ltvValue = churn > 0 ? (arpuValue * marginValue) / (churn / 100) : 0;

    setKpis({
      cogs: cogsValue,
      addon: addonValue,
      arpu: arpuValue,
      margin: marginValue,
      ltv: ltvValue
    });
  };

  const handlePlanSelect = (planKey: string) => {
    setCheckoutPlan(planKey);
    setModalType('checkout');
    setShowModal(true);
  };

  const confirmPlanChange = (planKey: string) => {
    setBillingPlan(planKey);
    setShowModal(false);
    showToast(`Plan upgraded to ${planCatalog[planKey].name}`, 'success');
  };

  const exportSummary = () => {
    const summary = {
      plan: planCatalog[billingPlan].name,
      usageAssumptions: usage,
      unitCosts: costs,
      kpis: {
        ...kpis,
        margin: (kpis.margin * 100).toFixed(1) + '%'
      }
    };
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'business_summary.json';
    a.click();
    showToast('Business summary exported', 'success');
  };

  const currentPlan = planCatalog[billingPlan];

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans pt-16 pb-8">
      <TopNav />
      
      <main className="max-w-7xl mx-auto px-4 fade-in">
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold mb-2">💳 Monetization & Commercialization</h1>
            <p className="text-gray-400">Turn ContentFlow Pro into a sustainable SaaS: pricing, paywalls, usage-based billing, and cost controls.</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { setModalType('details'); setShowModal(true); }}
              className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm flex items-center gap-2"
            >
              <i className="fas fa-receipt"></i> Plan Details
            </button>
            <button 
              onClick={() => handlePlanSelect('studio')}
              className="gradient-bg px-4 py-2 rounded-lg hover:opacity-90 transition text-sm font-medium flex items-center gap-2"
            >
              <i className="fas fa-credit-card"></i> Simulate Upgrade
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Pricing cards */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Pricing that matches creator value</h2>
                <div className="text-sm text-gray-400">Current plan: <span className="text-white font-medium">{currentPlan.name}</span></div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Free Plan */}
                <div className={`p-5 rounded-2xl border transition-all ${billingPlan === 'free' ? 'bg-gray-700/60 border-purple-500 ring-1 ring-purple-500' : 'bg-gray-700/40 border-gray-700'}`}>
                  <div className="flex items-center justify-between">
                    <p className="font-bold">Free</p>
                    <span className="text-xs bg-gray-600/60 px-2 py-1 rounded">Starter</span>
                  </div>
                  <p className="text-3xl font-extrabold mt-2">$0</p>
                  <p className="text-xs text-gray-400">Great for trying the workflow.</p>
                  <ul className="mt-4 space-y-2 text-sm text-gray-300">
                    <li><i className="fas fa-check text-green-400 mr-2"></i>Idea + Script</li>
                    <li><i className="fas fa-check text-green-400 mr-2"></i>Basic Analytics</li>
                    <li><i className="fas fa-minus text-gray-500 mr-2"></i>Limited AI credits</li>
                  </ul>
                  <button 
                    onClick={() => billingPlan === 'free' ? null : handlePlanSelect('free')}
                    className={`mt-4 w-full py-2 rounded-lg transition text-sm ${billingPlan === 'free' ? 'bg-green-600 cursor-default' : 'bg-gray-700 hover:bg-gray-600'}`}
                  >
                    {billingPlan === 'free' ? 'Active' : 'Select'}
                  </button>
                </div>

                {/* Creator Plan */}
                <div className={`p-5 rounded-2xl border relative transition-all ${billingPlan === 'creator' ? 'bg-purple-900/30 border-purple-500 ring-1 ring-purple-500' : 'bg-gradient-to-b from-purple-500/20 to-blue-500/10 border-purple-500/40'}`}>
                  {billingPlan !== 'creator' && <div className="absolute -top-3 right-4 text-xs bg-purple-600 px-2 py-1 rounded-full">Most Popular</div>}
                  <div className="flex items-center justify-between">
                    <p className="font-bold">Creator</p>
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">Pro</span>
                  </div>
                  <p className="text-3xl font-extrabold mt-2">$29<span className="text-base text-gray-300 font-medium">/mo</span></p>
                  <p className="text-xs text-gray-400">For consistent publishing.</p>
                  <ul className="mt-4 space-y-2 text-sm text-gray-200">
                    <li><i className="fas fa-check text-green-400 mr-2"></i>Everything in Free</li>
                    <li><i className="fas fa-check text-green-400 mr-2"></i>Voiceover</li>
                    <li><i className="fas fa-check text-green-400 mr-2"></i>Scheduling</li>
                    <li><i className="fas fa-check text-green-400 mr-2"></i>Higher AI credits</li>
                  </ul>
                  <button 
                    onClick={() => billingPlan === 'creator' ? null : handlePlanSelect('creator')}
                    className={`mt-4 w-full py-2 rounded-lg transition text-sm font-medium ${billingPlan === 'creator' ? 'bg-green-600 cursor-default' : 'gradient-bg hover:opacity-90'}`}
                  >
                    {billingPlan === 'creator' ? 'Active' : 'Select'}
                  </button>
                </div>

                {/* Studio Plan */}
                <div className={`p-5 rounded-2xl border transition-all ${billingPlan === 'studio' ? 'bg-blue-900/20 border-blue-500 ring-1 ring-blue-500' : 'bg-gray-700/40 border-gray-700'}`}>
                  <div className="flex items-center justify-between">
                    <p className="font-bold">Studio</p>
                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">Teams</span>
                  </div>
                  <p className="text-3xl font-extrabold mt-2">$99<span className="text-base text-gray-300 font-medium">/mo</span></p>
                  <p className="text-xs text-gray-400">For agencies & multi-channels.</p>
                  <ul className="mt-4 space-y-2 text-sm text-gray-200">
                    <li><i className="fas fa-check text-green-400 mr-2"></i>Everything in Creator</li>
                    <li><i className="fas fa-check text-green-400 mr-2"></i>Voice cloning</li>
                    <li><i className="fas fa-check text-green-400 mr-2"></i>Automation</li>
                    <li><i className="fas fa-check text-green-400 mr-2"></i>Reporting + exports</li>
                  </ul>
                  <button 
                    onClick={() => billingPlan === 'studio' ? null : handlePlanSelect('studio')}
                    className={`mt-4 w-full py-2 rounded-lg transition text-sm ${billingPlan === 'studio' ? 'bg-green-600 cursor-default' : 'bg-gray-700 hover:bg-gray-600'}`}
                  >
                    {billingPlan === 'studio' ? 'Active' : 'Select'}
                  </button>
                </div>
              </div>

              <div className="mt-5 text-xs text-gray-400">
                Pricing note: keep margins by blending <span className="text-gray-200">subscription + usage</span>. Subscription covers app value (workflow, templates, scheduling, analytics). Usage covers variable AI compute.
              </div>
            </div>

            {/* Usage-based billing & COGS */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Usage-based billing (protect margins)</h2>
                <button 
                  onClick={recalcKPIs}
                  className="text-sm text-purple-400 hover:underline flex items-center gap-1"
                >
                  <i className="fas fa-calculator"></i> Recalculate
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-700/30 rounded-xl">
                  <p className="font-medium mb-3">Monthly usage assumptions</p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-gray-400 mb-1"><span>LLM tokens (millions)</span><span>{usage.tokM}M</span></div>
                      <input type="range" min="0" max="20" step="0.5" value={usage.tokM} onChange={(e) => setUsage({...usage, tokM: parseFloat(e.target.value)})} className="w-full accent-purple-500" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-400 mb-1"><span>TTS characters (thousands)</span><span>{usage.ttsK}k</span></div>
                      <input type="range" min="0" max="500" step="10" value={usage.ttsK} onChange={(e) => setUsage({...usage, ttsK: parseFloat(e.target.value)})} className="w-full accent-purple-500" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Images generated</span><span>{usage.img}</span></div>
                      <input type="range" min="0" max="1000" step="10" value={usage.img} onChange={(e) => setUsage({...usage, img: parseFloat(e.target.value)})} className="w-full accent-purple-500" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Video minutes rendered</span><span>{usage.vid}</span></div>
                      <input type="range" min="0" max="500" step="5" value={usage.vid} onChange={(e) => setUsage({...usage, vid: parseFloat(e.target.value)})} className="w-full accent-purple-500" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-700/30 rounded-xl">
                  <p className="font-medium mb-3">Unit costs (edit to match your providers)</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-gray-400">LLM $/1M tokens</span>
                      <input type="number" value={costs.llm} onChange={(e) => setCosts({...costs, llm: parseFloat(e.target.value)})} step="0.10" className="w-28 bg-gray-700 rounded-lg px-3 py-1.5 text-right" />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-gray-400">TTS $/1k chars</span>
                      <input type="number" value={costs.tts} onChange={(e) => setCosts({...costs, tts: parseFloat(e.target.value)})} step="0.001" className="w-28 bg-gray-700 rounded-lg px-3 py-1.5 text-right" />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-gray-400">Image $/img</span>
                      <input type="number" value={costs.img} onChange={(e) => setCosts({...costs, img: parseFloat(e.target.value)})} step="0.01" className="w-28 bg-gray-700 rounded-lg px-3 py-1.5 text-right" />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-gray-400">Video $/min</span>
                      <input type="number" value={costs.vid} onChange={(e) => setCosts({...costs, vid: parseFloat(e.target.value)})} step="0.05" className="w-28 bg-gray-700 rounded-lg px-3 py-1.5 text-right" />
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gray-800/60 rounded-xl border border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Estimated monthly COGS</span>
                      <span className="text-xl font-bold">${kpis.cogs.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-400">Suggested usage add-on price</span>
                      <span className="text-xl font-bold text-green-400">${kpis.addon.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Rule of thumb: price usage at 3–6× unit cost to cover infra, support, fraud, and margin.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Go-to-market checklist */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Go-to-market (practical path)</h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-gray-700/30 rounded-xl">
                  <p className="font-medium mb-2">Phase 1: MVP that sells</p>
                  <ul className="space-y-2 text-gray-300">
                    <li><i className="fas fa-bullseye text-purple-400 mr-2"></i>One niche + one platform (e.g., YouTube Shorts)</li>
                    <li><i className="fas fa-bullseye text-purple-400 mr-2"></i>Single “Generate & Schedule” button</li>
                    <li><i className="fas fa-bullseye text-purple-400 mr-2"></i>Templates + reusable brand kit</li>
                    <li><i className="fas fa-bullseye text-purple-400 mr-2"></i>Stripe checkout + credit packs</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-700/30 rounded-xl">
                  <p className="font-medium mb-2">Phase 2: Retention & expansion</p>
                  <ul className="space-y-2 text-gray-300">
                    <li><i className="fas fa-chart-line text-green-400 mr-2"></i>Analytics that ties to money (RPM, CPA, CTR)</li>
                    <li><i className="fas fa-chart-line text-green-400 mr-2"></i>Team collaboration & approvals</li>
                    <li><i className="fas fa-chart-line text-green-400 mr-2"></i>Workflow automation + webhooks</li>
                    <li><i className="fas fa-chart-line text-green-400 mr-2"></i>API + integrations (Drive, Notion, Zapier)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: gating + business KPIs */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Plan gating (what to lock)</h3>
              <div className="space-y-3 text-sm">
                {[
                  { id: 'translation', label: 'Translation', icon: 'language', color: 'purple-400' },
                  { id: 'voice', label: 'Voice Over', icon: 'wave-square', color: 'green-400' },
                  { id: 'clone', label: 'Voice Clone', icon: 'clone', color: 'blue-400' },
                  { id: 'images', label: 'Image Gen', icon: 'image', color: 'orange-400' },
                  { id: 'video', label: 'Video Gen', icon: 'video', color: 'red-400' },
                  { id: 'automation', label: 'Automation', icon: 'bolt', color: 'yellow-400' },
                ].map((feat) => {
                   const isUnlocked = currentPlan.features[feat.id];
                   return (
                    <div key={feat.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-xl">
                      <span className="text-gray-300"><i className={`fas fa-${feat.icon} text-${feat.color} mr-2`}></i>{feat.label}</span>
                      <span className={`text-xs px-2 py-1 rounded ${isUnlocked ? 'bg-green-500/20 text-green-300' : 'bg-gray-700 text-gray-200'}`}>
                        {isUnlocked ? 'Included' : 'Locked'}
                      </span>
                    </div>
                   );
                })}
                <button 
                  onClick={() => handlePlanSelect('studio')}
                  className="w-full mt-2 gradient-bg py-2 rounded-lg font-medium hover:opacity-90 transition"
                >
                  Unlock Features
                </button>
                <p className="text-xs text-gray-500">Lock the variable-cost features first (video, voice, images). Keep low-cost features as acquisition hooks.</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Business KPI sandbox</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">ARPU (monthly)</span>
                  <span className="font-medium">${kpis.arpu.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Gross margin estimate</span>
                  <span className="font-medium">{(kpis.margin * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Suggested CAC payback</span>
                  <span className="font-medium">{kpis.ltv > 0 ? `Max CAC ~$${kpis.ltv.toFixed(0)}` : '—'}</span>
                </div>
                <div className="mt-3 p-3 bg-gray-700/30 rounded-xl">
                  <p className="text-xs text-gray-400 mb-2">Set expected churn to see payback.</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gray-400 text-xs">Monthly churn</span>
                    <input type="number" value={churn} onChange={(e) => setChurn(parseFloat(e.target.value))} step="1" className="w-20 bg-gray-700 rounded-lg px-3 py-1.5 text-right" />
                    <span className="text-gray-500 text-xs">%</span>
                  </div>
                </div>
                <button 
                  onClick={exportSummary}
                  className="w-full bg-gray-700 py-2 rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2"
                >
                  <i className="fas fa-download"></i> Export Summary
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-xl font-bold mb-4">{modalType === 'details' ? 'Plan Details' : 'Checkout Simulator'}</h3>
              
              {modalType === 'details' ? (
                 <div className="space-y-4">
                     <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-700">
                         <p className="text-sm text-gray-400">Current plan</p>
                         <p className="text-2xl font-bold">{currentPlan.name}</p>
                         <p className="text-sm text-gray-300 mt-1">${currentPlan.price}/mo + usage add-ons as needed</p>
                     </div>
                     <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-700">
                         <p className="font-medium mb-2">Included features</p>
                         <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                             {Object.entries(currentPlan.features).map(([k,v]) => (
                                 <div key={k} className="flex items-center gap-2 p-2 bg-gray-800/40 rounded-lg">
                                     <i className={`fas ${v ? 'fa-check text-green-400' : 'fa-lock text-gray-400'}`}></i>
                                     <span className="capitalize">{k}</span>
                                 </div>
                             ))}
                         </div>
                     </div>
                     <div className="flex gap-3">
                         <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-700 py-2 rounded-lg hover:bg-gray-600 transition">Close</button>
                     </div>
                 </div>
              ) : (
                <div className="space-y-4">
                    <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-700">
                        <p className="text-sm text-gray-400 mb-2">Choose plan</p>
                        <div className="grid grid-cols-3 gap-2">
                            {['free', 'creator', 'studio'].map(k => (
                              <button 
                                key={k}
                                onClick={() => setCheckoutPlan(k)} 
                                className={`py-2 rounded-lg transition text-sm ${checkoutPlan === k ? 'bg-purple-600 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
                              >
                                {planCatalog[k].name}
                              </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-3">Billing period is controlled in Pricing section (Monthly/Annual).</p>
                    </div>

                    <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-700">
                        <p className="text-sm text-gray-400">Selected</p>
                        <p className="text-xl font-bold">{planCatalog[checkoutPlan].name}</p>
                        <p className="text-sm text-gray-300">${planCatalog[checkoutPlan].price}/mo (simulated)</p>
                        <p className="text-xs text-gray-500 mt-2">In production: Stripe Checkout + Customer Portal + proration.</p>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-700 py-2 rounded-lg hover:bg-gray-600 transition">Cancel</button>
                        <button onClick={() => confirmPlanChange(checkoutPlan)} className="flex-1 gradient-bg py-2 rounded-lg font-medium hover:opacity-90 transition">Pay</button>
                    </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
