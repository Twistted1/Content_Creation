import React, { useState, useEffect } from 'react';
import { TopNav } from '@/components/dashboard/TopNav';

// Helper to check key existence
const checkKey = (keyName: string, envName: string) => {
    const keys = localStorage.getItem('api_keys');
    const local = keys ? JSON.parse(keys)[keyName] : null;
    const env = import.meta.env[envName];
    return {
        present: !!(local || env),
        source: local ? 'LocalStorage' : env ? '.env' : 'Missing',
        value: local || env || ''
    };
};

export default function ServiceStatus() {
    const [status, setStatus] = useState<any[]>([]);

    useEffect(() => {
        // Check if Local AI is enabled
        const keys = localStorage.getItem('api_keys');
        const localConfig = keys ? JSON.parse(keys) : {};
        const useLocalAI = localConfig.useLocalAI;

        const services = [
            { name: 'OpenAI (DALL-E 3)', key: 'openaiApiKey', env: 'VITE_OPENAI_API_KEY', desc: 'Image Generation', skipped: useLocalAI },
            { name: 'Google Gemini', key: 'googleApiKey', env: 'VITE_GOOGLE_API_KEY', desc: 'Ideas, Scripts, Translation', skipped: useLocalAI },
            { name: 'ElevenLabs', key: 'elevenLabsApiKey', env: 'VITE_ELEVENLABS_API_KEY', desc: 'Voice Synthesis' },
            { name: 'Local AI (Ollama)', key: 'ollamaUrl', env: 'NONE', desc: 'Local Text Generation', local: true, active: useLocalAI },
            { name: 'Local AI (Stable Diffusion)', key: 'stableDiffusionUrl', env: 'NONE', desc: 'Local Image Generation', local: true, active: useLocalAI },
            { name: 'Firebase', key: 'firebase', env: 'VITE_FIREBASE_API_KEY', desc: 'Auth, DB, Storage' },
            { name: 'YouTube API', key: 'youtubeClientId', env: 'VITE_YOUTUBE_CLIENT_ID', desc: 'Video Uploads' },
            { name: 'Stripe', key: 'stripePublishableKey', env: 'VITE_STRIPE_KEY', desc: 'Payments' },
        ];

        const results = services.map(s => {
            if (s.local) {
                return {
                    ...s,
                    status: s.active ? 'active' : 'inactive',
                    source: s.active ? 'Settings (Local)' : 'Disabled'
                };
            }
            
            const check = checkKey(s.key, s.env);
            return {
                ...s,
                status: s.skipped ? 'skipped' : (check.present ? 'active' : 'inactive'),
                source: s.skipped ? 'Overridden by Local AI' : check.source
            };
        });

        setStatus(results);
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans pt-16 pb-8">
            <TopNav />
            <main className="max-w-4xl mx-auto px-4 fade-in">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">🚦 System Status</h1>
                    <p className="text-gray-400">Real-time health check of external API connections</p>
                </div>

                <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 text-gray-400 text-sm uppercase">
                            <tr>
                                <th className="p-4">Service</th>
                                <th className="p-4">Functionality</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Source</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {status.map((s) => (
                                <tr key={s.name} className="hover:bg-gray-700/30 transition">
                                    <td className="p-4 font-medium flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${s.status === 'active' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
                                        {s.name}
                                    </td>
                                    <td className="p-4 text-gray-400 text-sm">{s.desc}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                            s.status === 'active' ? 'bg-green-500/20 text-green-400' : 
                                            s.status === 'skipped' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/20 text-red-400'
                                        }`}>
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-xs font-mono text-gray-500">
                                        {s.source}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-start gap-3">
                    <i className="fas fa-info-circle text-blue-400 mt-1"></i>
                    <div className="text-sm text-blue-300">
                        <p className="font-bold mb-1">Configuration Tip</p>
                        <p>Services marked as <span className="text-red-400">INACTIVE</span> will use mock data or fallbacks (e.g., Unsplash for images, Browser Speech for voice). To enable them, add keys in <strong>Settings</strong> or your <code>.env</code> file.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
