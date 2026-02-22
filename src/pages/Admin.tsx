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

export default function Admin() {
  const [whiteLabel, setWhiteLabel] = useState(() => {
    const saved = localStorage.getItem('contentflow_whitelabel');
    return saved ? JSON.parse(saved) : {
      name: 'ContentFlow Pro',
      support: 'support@contentflow.example',
      primary: '#667eea',
      secondary: '#764ba2',
      domain: '',
      sso: false,
      idp: '',
      workspaces: [
        { name: 'Acme Media', seats: 5, plan: 'Studio', cap: 150, status: 'Active' },
        { name: 'Nova Creators', seats: 3, plan: 'Creator', cap: 60, status: 'Active' },
        { name: 'Client Sandbox', seats: 2, plan: 'Free', cap: 10, status: 'Trial' }
      ],
      audit: [
        { at: new Date(Date.now()-86400000).toISOString(), msg: 'Created workspace: Acme Media' },
        { at: new Date(Date.now()-3600000).toISOString(), msg: 'Updated branding colors' }
      ]
    };
  });

  // Local state for form inputs to avoid excessive re-renders/writes to LS on every keystroke
  const [formState, setFormState] = useState(whiteLabel);

  useEffect(() => {
    localStorage.setItem('contentflow_whitelabel', JSON.stringify(whiteLabel));
  }, [whiteLabel]);

  const handleSave = () => {
    setWhiteLabel(prev => ({
      ...prev,
      ...formState,
      audit: [{ at: new Date().toISOString(), msg: 'Saved branding settings' }, ...prev.audit].slice(0, 25)
    }));
    showToast('White-label settings saved', 'success');
  };

  const handleReset = () => {
    const defaultState = {
      name: 'ContentFlow Pro',
      support: 'support@contentflow.example',
      primary: '#667eea',
      secondary: '#764ba2',
      domain: '',
      sso: false,
      idp: '',
      workspaces: whiteLabel.workspaces,
      audit: [{ at: new Date().toISOString(), msg: 'Reset settings to default' }, ...whiteLabel.audit].slice(0, 25)
    };
    setWhiteLabel(defaultState);
    setFormState(defaultState);
    
    // Clear custom style
    const style = document.getElementById('wlStyle');
    if (style) style.remove();
    
    // Reset title
    const titleSpan = document.querySelector('nav span.text-xl');
    if (titleSpan) titleSpan.textContent = 'ContentFlow';
    
    showToast('Reset complete', 'info');
  };

  const handleApplyPreview = () => {
    const styleId = 'wlStyle';
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }
    // Correctly escape the template literal for CSS
    style.textContent = `.gradient-bg{background: linear-gradient(135deg, ${formState.primary} 0%, ${formState.secondary} 100%) !important;}`;
    
    // Update nav title if exists
    const titleSpan = document.querySelector('nav span.text-xl');
    if (titleSpan) titleSpan.textContent = formState.name;

    showToast('Branding preview applied', 'success');
  };

  const addWorkspace = () => {
    const name = 'Workspace ' + (whiteLabel.workspaces.length + 1);
    const newWorkspace = { name, seats: 2, plan: 'Creator', cap: 60, status: 'Trial' };
    setWhiteLabel(prev => ({
      ...prev,
      workspaces: [newWorkspace, ...prev.workspaces],
      audit: [{ at: new Date().toISOString(), msg: 'Created workspace: ' + name }, ...prev.audit].slice(0, 25)
    }));
    showToast('Workspace added', 'success');
  };

  const removeWorkspace = (index: number) => {
    const w = whiteLabel.workspaces[index];
    setWhiteLabel(prev => ({
      ...prev,
      workspaces: prev.workspaces.filter((_, i) => i !== index),
      audit: [{ at: new Date().toISOString(), msg: 'Removed workspace: ' + (w?.name || 'unknown') }, ...prev.audit].slice(0, 25)
    }));
    showToast('Workspace removed', 'info');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans pt-16 pb-8">
      <TopNav />
      
      <main className="max-w-7xl mx-auto px-4 fade-in">
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold mb-2">🧩 White‑label Admin Panel</h1>
            <p className="text-gray-400">Configure branding, domains, client workspaces, roles, quotas, and audit logs.</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSave}
              className="gradient-bg px-4 py-2 rounded-lg hover:opacity-90 transition text-sm font-medium flex items-center gap-2"
            >
              <i className="fas fa-save"></i> Save
            </button>
            <button 
              onClick={handleReset}
              className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm flex items-center gap-2"
            >
              <i className="fas fa-rotate-left"></i> Reset
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Brand kit</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Product name</label>
                  <input 
                    value={formState.name}
                    onChange={(e) => setFormState({...formState, name: e.target.value})}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    placeholder="Your product name" 
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Support email</label>
                  <input 
                    value={formState.support}
                    onChange={(e) => setFormState({...formState, support: e.target.value})}
                    className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    placeholder="support@yourdomain.com" 
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Primary color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      className="h-10 w-10 rounded bg-transparent cursor-pointer" 
                      value={formState.primary}
                      onChange={(e) => setFormState({...formState, primary: e.target.value})}
                    />
                    <input 
                      type="text" 
                      className="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-sm uppercase" 
                      value={formState.primary}
                      onChange={(e) => setFormState({...formState, primary: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Secondary color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      className="h-10 w-10 rounded bg-transparent cursor-pointer" 
                      value={formState.secondary}
                      onChange={(e) => setFormState({...formState, secondary: e.target.value})}
                    />
                    <input 
                      type="text" 
                      className="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-sm uppercase" 
                      value={formState.secondary}
                      onChange={(e) => setFormState({...formState, secondary: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-700/30 rounded-xl border border-gray-700 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">Live preview</p>
                  <p className="text-xs text-gray-400">Updates app accents & logo badge.</p>
                </div>
                <button 
                  onClick={handleApplyPreview}
                  className="px-4 py-2 rounded-lg hover:opacity-90 transition text-sm text-white"
                  style={{ background: `linear-gradient(135deg, ${formState.primary} 0%, ${formState.secondary} 100%)` }}
                >
                  Apply preview
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Domains & SSO (simulated)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-700">
                  <p className="font-medium">Custom domain</p>
                  <p className="text-xs text-gray-400">e.g., app.youragency.com</p>
                  <div className="flex gap-2 mt-3">
                    <input 
                      value={formState.domain}
                      onChange={(e) => setFormState({...formState, domain: e.target.value})}
                      className="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-sm" 
                      placeholder="app.example.com" 
                    />
                    <button onClick={() => showToast('Domain verified (simulated)', 'success')} className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm">Verify</button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">In production: DNS TXT verification + TLS provisioning.</p>
                </div>
                <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-700">
                  <p className="font-medium">SSO</p>
                  <p className="text-xs text-gray-400">SAML / OIDC for client teams</p>
                  <div className="mt-3 space-y-2">
                    <label className="flex items-center justify-between p-2 bg-gray-800/40 rounded-lg cursor-pointer">
                      <span className="text-sm">Enable SSO</span>
                      <input 
                        type="checkbox" 
                        checked={formState.sso}
                        onChange={(e) => setFormState({...formState, sso: e.target.checked})}
                        className="accent-purple-500 w-4 h-4" 
                      />
                    </label>
                    <input 
                      value={formState.idp}
                      onChange={(e) => setFormState({...formState, idp: e.target.value})}
                      className="w-full bg-gray-700 rounded-lg px-3 py-2 text-sm" 
                      placeholder="IdP Issuer URL (simulated)" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="font-bold">Clients / Workspaces</h3>
                <button onClick={addWorkspace} className="gradient-bg px-4 py-2 rounded-lg hover:opacity-90 transition text-sm font-medium flex items-center gap-2">
                  <i className="fas fa-plus"></i> Add workspace
                </button>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-700">
                      <th className="py-2 pr-4 font-medium">Workspace</th>
                      <th className="py-2 pr-4 font-medium">Seats</th>
                      <th className="py-2 pr-4 font-medium">Plan</th>
                      <th className="py-2 pr-4 font-medium">Monthly usage cap</th>
                      <th className="py-2 pr-4 font-medium">Status</th>
                      <th className="py-2 pr-4 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-200">
                    {whiteLabel.workspaces.map((w: any, idx: number) => (
                      <tr key={idx} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                        <td className="py-3 pr-4 font-medium">{w.name}</td>
                        <td className="py-3 pr-4">{w.seats}</td>
                        <td className="py-3 pr-4">
                          <span className={`px-2 py-0.5 rounded text-xs ${w.plan === 'Studio' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}`}>
                            {w.plan}
                          </span>
                        </td>
                        <td className="py-3 pr-4">${w.cap}</td>
                        <td className="py-3 pr-4">
                          <span className={`text-xs px-2 py-1 rounded ${w.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-300'}`}>
                            {w.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <button onClick={() => removeWorkspace(idx)} className="text-red-300 hover:text-red-200 text-sm">
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Role-based access (demo)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-xl">
                  <span><i className="fas fa-user-shield text-purple-300 mr-2"></i>Admin</span>
                  <span className="text-xs text-green-400">Full access</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-xl">
                  <span><i className="fas fa-user-gear text-blue-300 mr-2"></i>Manager</span>
                  <span className="text-xs text-gray-400">Approve + publish</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-xl">
                  <span><i className="fas fa-user text-gray-300 mr-2"></i>Member</span>
                  <span className="text-xs text-gray-400">Create drafts</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Audit log</h3>
                <button onClick={() => setWhiteLabel(prev => ({...prev, audit: [{at: new Date().toISOString(), msg: 'Manual audit entry'}, ...prev.audit]}))} className="text-sm text-purple-400 hover:underline">Add log</button>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                {whiteLabel.audit.length === 0 ? (
                  <p className="text-gray-500">No audit events.</p>
                ) : (
                  whiteLabel.audit.map((a: any, i: number) => (
                    <div key={i} className="flex gap-3">
                       <div className="w-1 bg-purple-500 rounded-full h-full min-h-[24px]"></div>
                       <div>
                         <p className="text-gray-300">{a.msg}</p>
                         <p className="text-xs text-gray-500">{new Date(a.at).toLocaleString()}</p>
                       </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
