import React, { useState, useEffect } from 'react';
import { TopNav } from '@/components/dashboard/TopNav';

// Toast helper (simulated)
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
  
  // Animate in
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-10', 'opacity-0');
  });

  // Remove after 3s
  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => toast.remove(), 500);
  }, 3000);
};

export default function Affiliate() {
  const [affiliateState, setAffiliateState] = useState(() => {
    const saved = localStorage.getItem('contentflow_affiliate');
    return saved ? JSON.parse(saved) : {
      id: 'aff_7F3K2',
      rate: 0.20,
      clicks: 1284,
      signups: 94,
      paid: 31,
      earnings: 642.80,
      conversions: [
        { date: '2025-12-18', user: 'u_18KQ', plan: 'Creator', amount: 29, commission: 5.8, status: 'Approved' },
        { date: '2025-12-17', user: 'u_9J2P', plan: 'Studio', amount: 99, commission: 19.8, status: 'Pending' },
        { date: '2025-12-16', user: 'u_4L1N', plan: 'Creator', amount: 29, commission: 5.8, status: 'Approved' },
        { date: '2025-12-14', user: 'u_2A7B', plan: 'Creator', amount: 29, commission: 5.8, status: 'Paid' }
      ]
    };
  });

  const [utmSource, setUtmSource] = useState('youtube');
  const [utmCampaign, setUtmCampaign] = useState('launch');

  useEffect(() => {
    localStorage.setItem('contentflow_affiliate', JSON.stringify(affiliateState));
  }, [affiliateState]);

  const simulateAffiliateEvent = () => {
    const newClicks = Math.floor(20 + Math.random() * 120);
    const newSignups = Math.floor(1 + Math.random() * 7);
    const isPaid = Math.random() > 0.55;
    
    let newPaid = 0;
    let newEarnings = 0;
    let newConversion = null;

    if (isPaid) {
      newPaid = 1;
      const plan = Math.random() > 0.75 ? 'Studio' : 'Creator';
      const amount = plan === 'Studio' ? 99 : 29;
      const commission = amount * affiliateState.rate;
      newEarnings = commission;
      
      newConversion = {
        date: new Date().toISOString().slice(0, 10),
        user: 'u_' + Math.random().toString(36).slice(2, 6).toUpperCase(),
        plan,
        amount,
        commission,
        status: 'Pending'
      };
    }

    setAffiliateState(prev => ({
      ...prev,
      clicks: prev.clicks + newClicks,
      signups: prev.signups + newSignups,
      paid: prev.paid + newPaid,
      earnings: prev.earnings + newEarnings,
      conversions: newConversion ? [newConversion, ...prev.conversions] : prev.conversions
    }));

    showToast('Affiliate event simulated', 'success');
  };

  const getAffiliateLink = () => {
    return `${window.location.origin}/?ref=${affiliateState.id}&utm_source=${encodeURIComponent(utmSource)}&utm_campaign=${encodeURIComponent(utmCampaign)}`;
  };

  const copyLink = () => {
    navigator.clipboard.writeText(getAffiliateLink());
    showToast('Affiliate link copied!', 'success');
  };

  const exportCSV = () => {
    const rows = [
      ['date','user','plan','amount','commission','status'],
      ...affiliateState.conversions.map((r: any) => [r.date, r.user, r.plan, r.amount, r.commission, r.status])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'affiliate_conversions.csv';
    a.click();
    showToast('CSV Exported', 'success');
  };

  const creatives = [
    { name: 'Product banner (728×90)', type: 'Image', copy: 'Automate content from idea to publishing.' },
    { name: 'Short CTA script', type: 'Text', copy: 'Stop editing for hours. Generate, narrate, and schedule in minutes.' },
    { name: 'Email swipe', type: 'Text', copy: 'I’m using ContentFlow to ship 7x more content with automation.' }
  ];

  const conversionRate = affiliateState.clicks ? ((affiliateState.paid / affiliateState.clicks) * 100).toFixed(2) : '0';

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans pt-16 pb-8">
      <TopNav />
      
      <main className="max-w-7xl mx-auto px-4 fade-in">
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold mb-2">🤝 Affiliate Dashboard</h1>
            <p className="text-gray-400">Track referrals, conversions, payouts, creatives, and link performance.</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={copyLink}
              className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm flex items-center gap-2"
            >
              <i className="fas fa-copy"></i> Copy Referral Link
            </button>
            <button 
              onClick={simulateAffiliateEvent}
              className="gradient-bg px-4 py-2 rounded-lg hover:opacity-90 transition text-sm font-medium flex items-center gap-2"
            >
              <i className="fas fa-wand-magic-sparkles"></i> Simulate Referral
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-2xl p-6 h-fit">
            <h3 className="font-bold mb-4">Overview</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-700/30 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Affiliate ID</span>
                  <span className="font-medium font-mono text-sm bg-gray-700 px-2 py-0.5 rounded">{affiliateState.id}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-400">Commission</span>
                  <span className="font-medium">{Math.round(affiliateState.rate * 100)}%</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-400">Cookie window</span>
                  <span className="font-medium">30 days</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-gray-700/30 rounded-xl text-center">
                  <p className="text-2xl font-bold">{affiliateState.clicks.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Clicks</p>
                </div>
                <div className="p-4 bg-gray-700/30 rounded-xl text-center">
                  <p className="text-2xl font-bold">{affiliateState.signups.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Signups</p>
                </div>
                <div className="p-4 bg-gray-700/30 rounded-xl text-center">
                  <p className="text-2xl font-bold">{affiliateState.paid.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Paid conversions</p>
                </div>
                <div className="p-4 bg-gray-700/30 rounded-xl text-center">
                  <p className="text-2xl font-bold text-green-400">${affiliateState.earnings.toFixed(2)}</p>
                  <p className="text-xs text-gray-400">Earnings</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Conversion rate</p>
                <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: `${Math.min(100, parseFloat(conversionRate) * 8)}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2"><span>{conversionRate}%</span> click → paid</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="font-bold">Referral link & UTM builder</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="bg-gray-700 px-1.5 py-0.5 rounded border border-gray-600">Tip</span> Add UTMs for attribution
                </div>
              </div>
              <div className="mt-4 grid md:grid-cols-3 gap-3">
                <input 
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                  className="bg-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  placeholder="utm_source" 
                />
                <input 
                  value={utmCampaign}
                  onChange={(e) => setUtmCampaign(e.target.value)}
                  className="bg-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  placeholder="utm_campaign" 
                />
                <button className="gradient-bg px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition opacity-50 cursor-not-allowed">Auto-built below</button>
              </div>
              <div className="mt-3 p-3 bg-gray-900/40 border border-gray-700 rounded-xl flex items-center gap-3">
                <i className="fas fa-link text-purple-300"></i>
                <input className="flex-1 bg-transparent text-sm text-gray-200 font-mono outline-none" readOnly value={getAffiliateLink()} />
                <button 
                  onClick={copyLink}
                  className="px-3 py-1.5 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-sm"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="font-bold">Recent conversions</h3>
                <button onClick={exportCSV} className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition text-sm flex items-center gap-2">
                  <i className="fas fa-file-csv"></i> Export CSV
                </button>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-700">
                      <th className="py-2 pr-4 font-medium">Date</th>
                      <th className="py-2 pr-4 font-medium">User</th>
                      <th className="py-2 pr-4 font-medium">Plan</th>
                      <th className="py-2 pr-4 font-medium">Amount</th>
                      <th className="py-2 pr-4 font-medium">Commission</th>
                      <th className="py-2 pr-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-200">
                    {affiliateState.conversions.slice(0, 12).map((r: any, i: number) => (
                      <tr key={i} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                        <td className="py-3 pr-4 text-gray-400">{r.date}</td>
                        <td className="py-3 pr-4 font-mono text-xs text-gray-500">{r.user}</td>
                        <td className="py-3 pr-4">{r.plan}</td>
                        <td className="py-3 pr-4">${r.amount.toFixed(2)}</td>
                        <td className="py-3 pr-4 text-green-400">${r.commission.toFixed(2)}</td>
                        <td className="py-3 pr-4">
                          <span className={`text-xs px-2 py-1 rounded ${
                            r.status === 'Approved' ? 'bg-green-500/20 text-green-300' : 
                            r.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' : 
                            'bg-blue-500/20 text-blue-300'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Creatives</h3>
              <div className="space-y-4">
                {creatives.map((it, i) => (
                  <div key={i} className="p-4 bg-gray-700/30 rounded-xl border border-gray-700">
                    <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{it.name}</p>
                        <span className="text-xs text-gray-400">{it.type}</span>
                    </div>
                    <p className="text-xs text-gray-300 mt-2">{it.copy}</p>
                    <div className="mt-3 flex gap-2">
                        <button onClick={() => { navigator.clipboard.writeText(it.copy); showToast('Copied to clipboard', 'success'); }} className="flex-1 bg-gray-800 py-2 rounded-lg hover:bg-gray-700 transition text-sm">Copy</button>
                        <button onClick={() => showToast('Downloaded (simulated)', 'success')} className="flex-1 bg-gray-700 py-2 rounded-lg hover:bg-gray-600 transition text-sm">Download</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
