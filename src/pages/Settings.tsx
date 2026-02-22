import React, { useState, useEffect } from 'react';
import { TopNav } from '@/components/dashboard/TopNav';
import { showToast } from '@/utils/toast';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

interface CustomKey {
  id: string;
  name: string;
  value: string;
}

export default function Settings() {
  const [keys, setKeys] = useState({
    stripePublishableKey: '',
    stripeSecretKey: '',
    youtubeClientId: '',
    youtubeClientSecret: '',
    googleApiKey: '',
    openaiApiKey: '',
    elevenLabsApiKey: '',
    dIdApiKey: '',
    // Social & Analytics
    linkedinClientId: '',
    linkedinClientSecret: '',
    twitterApiKey: '',
    twitterApiSecret: '',
    googleAnalyticsId: '',
    contentflowApiKey: '',
    useLocalAI: false,
    ollamaUrl: 'http://localhost:11434',
    stableDiffusionUrl: 'http://127.0.0.1:7860'
  });

  const [customKeys, setCustomKeys] = useState<CustomKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  
  // Team Members
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid, 'settings', 'api_keys');
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setKeys(prev => ({ ...prev, ...data }));
            setCustomKeys(data.customKeys || []);
            setTeamMembers(data.teamMembers || []);
            localStorage.setItem('api_keys', JSON.stringify(data));
          }
        } catch (error) {
          console.error("Error loading settings:", error);
        }
      } else {
        const savedKeys = localStorage.getItem('api_keys');
        if (savedKeys) {
          const parsed = JSON.parse(savedKeys);
          setKeys(prev => ({ ...prev, ...parsed }));
          setCustomKeys(parsed.customKeys || []);
          setTeamMembers(parsed.teamMembers || []);
        }
      }
    };
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setKeys({ ...keys, [e.target.name]: value });
  };

  const handleAddCustomKey = () => {
    if (!newKeyName || !newKeyValue) return;
    const newKey = { id: Date.now().toString(), name: newKeyName, value: newKeyValue };
    setCustomKeys([...customKeys, newKey]);
    setNewKeyName('');
    setNewKeyValue('');
  };

  const handleRemoveCustomKey = (id: string) => {
    setCustomKeys(customKeys.filter(k => k.id !== id));
  };

  const handleAddMember = () => {
    if (!newMemberEmail || !newMemberEmail.includes('@')) return showToast('Invalid email', 'error');
    if (teamMembers.includes(newMemberEmail)) return showToast('Member already added', 'error');
    setTeamMembers([...teamMembers, newMemberEmail]);
    setNewMemberEmail('');
    showToast('Member invited (simulated)', 'success');
  };

  const handleRemoveMember = (email: string) => {
    setTeamMembers(teamMembers.filter(m => m !== email));
  };

  const handleSave = async () => {
    const dataToSave = { ...keys, customKeys, teamMembers };
    localStorage.setItem('api_keys', JSON.stringify(dataToSave));

    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'settings', 'api_keys'), dataToSave, { merge: true });
        showToast('Settings saved!', 'success');
      } catch (error) {
        showToast('Saved locally, cloud sync failed.', 'error');
      }
    } else {
      showToast('Settings saved locally', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans pt-24 pb-12 transition-colors duration-200">
      <TopNav />
      
      <main className="max-w-[1600px] mx-auto px-6 fade-in">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">⚙️ Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage integrations, keys, and team members</p>
          </div>
          <button 
            onClick={handleSave}
            className="gradient-bg px-8 py-3 rounded-xl font-bold text-white hover:opacity-90 transition shadow-lg flex items-center gap-2"
          >
            <i className="fas fa-save"></i> Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column: Integrations */}
          <div className="space-y-6">
            
            {/* Payment & Commerce */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-lg">
                <i className="fab fa-stripe text-purple-500 dark:text-purple-400"></i> Payment Gateways
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <input 
                  type="text" 
                  name="stripePublishableKey"
                  value={keys.stripePublishableKey}
                  onChange={handleChange}
                  className="bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none transition-colors"
                  placeholder="Stripe Publishable Key (pk_...)"
                />
                <input 
                  type="password" 
                  name="stripeSecretKey"
                  value={keys.stripeSecretKey}
                  onChange={handleChange}
                  className="bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none transition-colors"
                  placeholder="Stripe Secret Key (sk_...)"
                />
              </div>
            </div>

            {/* Social Platforms */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-lg">
                <i className="fas fa-share-alt text-pink-500"></i> Social Platforms
              </h3>
              <div className="space-y-4">
                {/* YouTube */}
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block flex items-center gap-1"><i className="fab fa-youtube text-red-500"></i> YouTube API</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      name="youtubeClientId"
                      value={keys.youtubeClientId}
                      onChange={handleChange}
                      className="bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-500 transition-colors"
                      placeholder="Client ID"
                    />
                    <input 
                      type="password" 
                      name="youtubeClientSecret"
                      value={keys.youtubeClientSecret}
                      onChange={handleChange}
                      className="bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-500 transition-colors"
                      placeholder="Client Secret"
                    />
                  </div>
                </div>

                {/* LinkedIn */}
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block flex items-center gap-1"><i className="fab fa-linkedin text-blue-500"></i> LinkedIn API</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      name="linkedinClientId"
                      value={keys.linkedinClientId}
                      onChange={handleChange}
                      className="bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors"
                      placeholder="Client ID"
                    />
                    <input 
                      type="password" 
                      name="linkedinClientSecret"
                      value={keys.linkedinClientSecret}
                      onChange={handleChange}
                      className="bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors"
                      placeholder="Client Secret"
                    />
                  </div>
                </div>

                {/* X / Twitter */}
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block flex items-center gap-1"><i className="fab fa-twitter text-gray-900 dark:text-white"></i> X (Twitter) API</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      name="twitterApiKey"
                      value={keys.twitterApiKey}
                      onChange={handleChange}
                      className="bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors"
                      placeholder="API Key"
                    />
                    <input 
                      type="password" 
                      name="twitterApiSecret"
                      value={keys.twitterApiSecret}
                      onChange={handleChange}
                      className="bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 transition-colors"
                      placeholder="API Secret"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Keys */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-lg">
                <i className="fas fa-cloud text-blue-400"></i> Cloud Storage
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-transparent">
                  <div className="flex items-center gap-3">
                    <i className="fab fa-google-drive text-green-400 text-xl"></i>
                    <div>
                      <p className="text-sm font-medium">Google Drive</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Not connected</p>
                    </div>
                  </div>
                  <button className="text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1.5 rounded transition text-gray-700 dark:text-gray-300">Connect</button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-transparent">
                  <div className="flex items-center gap-3">
                    <i className="fab fa-microsoft text-blue-400 text-xl"></i>
                    <div>
                      <p className="text-sm font-medium">OneDrive</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Not connected</p>
                    </div>
                  </div>
                  <button className="text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1.5 rounded transition text-gray-700 dark:text-gray-300">Connect</button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-transparent">
                  <div className="flex items-center gap-3">
                    <i className="fab fa-dropbox text-blue-500 text-xl"></i>
                    <div>
                      <p className="text-sm font-medium">Dropbox</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Not connected</p>
                    </div>
                  </div>
                  <button className="text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1.5 rounded transition text-gray-700 dark:text-gray-300">Connect</button>
                </div>
              </div>
            </div>

            {/* Custom Keys */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-lg">
                <i className="fas fa-key text-yellow-500 dark:text-yellow-400"></i> Custom API Keys
              </h3>
              <div className="space-y-2 mb-3">
                {customKeys.map(key => (
                  <div key={key.id} className="flex gap-2">
                    <div className="flex-1 bg-gray-50 dark:bg-gray-700/30 rounded px-3 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-transparent">{key.name}</div>
                    <div className="flex-[2] bg-gray-50 dark:bg-gray-700/30 rounded px-3 py-2 text-sm font-mono text-gray-500 dark:text-gray-400 truncate border border-gray-200 dark:border-transparent">••••••••</div>
                    <button onClick={() => handleRemoveCustomKey(key.id)} className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 px-2"><i className="fas fa-trash"></i></button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Key Name (e.g. FACEBOOK_APP_ID)"
                  className="flex-1 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-500 transition-colors"
                />
                <input 
                  type="text" 
                  value={newKeyValue}
                  onChange={(e) => setNewKeyValue(e.target.value)}
                  placeholder="Value"
                  className="flex-[2] bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-500 transition-colors"
                />
                <button onClick={handleAddCustomKey} className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-3 rounded-lg hover:bg-yellow-500/30"><i className="fas fa-plus"></i></button>
              </div>
            </div>

          </div>

          {/* Right Column: AI & Team */}
          <div className="space-y-6">
            
            {/* AI Services */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2 text-lg">
                  <i className="fas fa-robot text-blue-400"></i> AI Models
                </h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Use Local AI</span>
                  <input 
                    type="checkbox" 
                    name="useLocalAI"
                    checked={keys.useLocalAI} 
                    onChange={handleChange}
                    className="accent-green-500" 
                  />
                </label>
              </div>

              {keys.useLocalAI ? (
                <div className="space-y-3 animate-in fade-in">
                  <div className="relative">
                    <i className="fas fa-server absolute left-3 top-2.5 text-gray-400 dark:text-gray-500"></i>
                    <input type="text" name="ollamaUrl" value={keys.ollamaUrl} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-green-500 font-mono transition-colors" placeholder="Ollama URL" />
                  </div>
                  <div className="relative">
                    <i className="fas fa-image absolute left-3 top-2.5 text-gray-400 dark:text-gray-500"></i>
                    <input type="text" name="stableDiffusionUrl" value={keys.stableDiffusionUrl} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-green-500 font-mono transition-colors" placeholder="Stable Diffusion URL" />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in">
                  <div className="relative">
                    <i className="fab fa-google absolute left-3 top-2.5 text-gray-400 dark:text-gray-500"></i>
                    <input type="password" name="googleApiKey" value={keys.googleApiKey} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-purple-500 transition-colors" placeholder="Google Gemini API Key" />
                  </div>
                  <div className="relative">
                    <i className="fas fa-microchip absolute left-3 top-2.5 text-gray-400 dark:text-gray-500"></i>
                    <input type="password" name="openaiApiKey" value={keys.openaiApiKey} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-green-500 transition-colors" placeholder="OpenAI API Key" />
                  </div>
                  <div className="relative">
                    <i className="fas fa-microphone-alt absolute left-3 top-2.5 text-gray-400 dark:text-gray-500"></i>
                    <input type="password" name="elevenLabsApiKey" value={keys.elevenLabsApiKey} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors" placeholder="ElevenLabs API Key" />
                  </div>
                  <div className="relative">
                    <i className="fas fa-video absolute left-3 top-2.5 text-gray-400 dark:text-gray-500"></i>
                    <input type="password" name="dIdApiKey" value={keys.dIdApiKey} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-orange-500 transition-colors" placeholder="D-ID API Key" />
                  </div>
                </div>
              )}
            </div>

            {/* Team Management */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-lg">
                <i className="fas fa-users text-indigo-400"></i> Team Members
              </h3>
              <div className="mb-4 space-y-2 max-h-40 overflow-y-auto">
                {teamMembers.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No team members added yet.</p>
                ) : (
                  teamMembers.map(email => (
                    <div key={email} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/30 px-3 py-2 rounded-lg border border-gray-100 dark:border-transparent">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-indigo-500/20 rounded-full flex items-center justify-center text-xs text-indigo-500 dark:text-indigo-400">
                          {email[0].toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{email}</span>
                      </div>
                      <button onClick={() => handleRemoveMember(email)} className="text-gray-400 hover:text-red-500 transition-colors"><i className="fas fa-times"></i></button>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="Invite by email..."
                  className="flex-1 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 transition-colors"
                />
                <button onClick={handleAddMember} className="bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-4 rounded-lg hover:bg-indigo-500/30 text-sm font-medium">Invite</button>
              </div>
            </div>

            {/* Analytics */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-lg">
                <i className="fas fa-chart-pie text-green-500"></i> Analytics
              </h3>
              <div className="relative">
                <i className="fab fa-google absolute left-3 top-2.5 text-gray-400 dark:text-gray-500"></i>
                <input type="text" name="googleAnalyticsId" value={keys.googleAnalyticsId} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-green-500 transition-colors" placeholder="Google Analytics ID (G-...)" />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
