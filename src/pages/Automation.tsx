import React, { useState, useEffect } from 'react';
import { TopNav } from '@/components/dashboard/TopNav';
import { automationService, Workflow, WorkflowStep } from '@/services/automationService';
import { aiService } from '@/services/aiService';
import { publishService } from '@/services/publishService';
import { showToast } from '@/utils/toast';

export default function Automation() {
  const [stats, setStats] = useState({
    completed: 0,
    timeSavedHours: 0,
    timeSavedMinutes: 0,
    creditsUsed: 0,
    creditsTotal: 5000
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [runningWorkflowId, setRunningWorkflowId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);

  // Load workflows from Firebase
  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      const data = await automationService.getWorkflows();
      setWorkflows(data);
      // Derive stats from real data
      const completed = data.filter(w => w.lastRun && w.lastRun !== 'Never').length;
      setStats(prev => ({
        ...prev,
        completed,
        timeSavedHours: Math.floor(completed * 0.5),
        timeSavedMinutes: (completed * 30) % 60,
        creditsUsed: completed * 50
      }));
    } catch (error) {
      console.error("Failed to load workflows", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Builder State
  const [builderSteps, setBuilderSteps] = useState<WorkflowStep[]>([]);
  
  const [newWorkflowName, setNewWorkflowName] = useState('New Workflow');

  const availableSteps: WorkflowStep[] = [
    { id: 'idea', name: 'Idea Generator', icon: 'fas fa-lightbulb', color: 'purple', description: 'AI-powered ideas' },
    { id: 'script', name: 'Script Writer', icon: 'fas fa-pen', color: 'blue', description: 'Auto-script generation' },
    { id: 'voice', name: 'Voice Over', icon: 'fas fa-microphone', color: 'green', description: 'Text-to-speech' },
    { id: 'publish', name: 'Publisher', icon: 'fas fa-paper-plane', color: 'cyan', description: 'Auto-distribution' }
  ];

  const toggleWorkflow = async (id: string, currentStatus: boolean) => {
    // Optimistic update
    setWorkflows(prev => prev.map(w => 
      w.id === id ? { ...w, isActive: !currentStatus } : w
    ));
    
    try {
      await automationService.updateWorkflow(id, { isActive: !currentStatus });
    } catch (error) {
      console.error("Failed to toggle workflow", error);
      // Revert if failed
      setWorkflows(prev => prev.map(w => 
        w.id === id ? { ...w, isActive: currentStatus } : w
      ));
    }
  };

  const deleteWorkflow = async (id: string) => {
    if (confirmDeleteId === id) {
      try {
        await automationService.deleteWorkflow(id);
        setWorkflows(prev => prev.filter(w => w.id !== id));
        showToast('Workflow deleted', 'success');
      } catch (error) {
        console.error("Failed to delete workflow", error);
        showToast('Failed to delete workflow', 'error');
      } finally {
        setConfirmDeleteId(null);
      }
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 3000);
    }
  };

  const addToBuilder = (step: WorkflowStep) => {
    setBuilderSteps([...builderSteps, { ...step, id: `${step.id}-${Date.now()}` }]);
  };

  const removeFromBuilder = (index: number) => {
    setBuilderSteps(builderSteps.filter((_, i) => i !== index));
  };

  const saveWorkflow = async () => {
    const newWorkflow: Omit<Workflow, 'id'> = {
      name: newWorkflowName,
      schedule: 'Runs on demand',
      isActive: true,
      steps: builderSteps,
      lastRun: 'Never'
    };
    
    try {
      await automationService.createWorkflow(newWorkflow);
      await loadWorkflows(); // Reload to get the new ID
      setBuilderSteps([]); 
      setNewWorkflowName('New Workflow');
      showToast('Workflow saved successfully!', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Failed to save workflow", error);
      showToast('Failed to save workflow', 'error');
    }
  };

  const runWorkflow = async (id: string) => {
    const workflow = workflows.find(w => w.id === id);
    if (!workflow || runningWorkflowId) return;

    setRunningWorkflowId(id);
    setCurrentStepIndex(-1);
    
    // Execution Context
    const context: any = {
      idea: null,
      script: null,
      voice: null,
      post: null
    };

    try {
      for (let i = 0; i < workflow.steps.length; i++) {
        setCurrentStepIndex(i);
        const step = workflow.steps[i];
        
        // --- STEP LOGIC ---
        if (step.id.startsWith('idea')) {
          // Generate Idea
          const ideas = await aiService.generateIdeas('tech', 'youtube'); // Default niche/platform
          if (ideas && ideas.length > 0) {
            context.idea = ideas[0]; // Pick best idea
            console.log('Generated Idea:', context.idea.title);
          } else {
             throw new Error("Failed to generate ideas");
          }
        } 
        else if (step.id.startsWith('script')) {
           // Generate Script
           if (!context.idea) throw new Error("No idea found for script generation");
           const script = await aiService.generateScript(context.idea.title, 'medium');
           context.script = script;
           console.log('Generated Script length:', script.length);
        }
        else if (step.id.startsWith('voice')) {
           // Generate Voice
           if (!context.script) throw new Error("No script found for voiceover");
           
           const audioUrl = await aiService.generateVoiceover(context.script.substring(0, 1000));
           
           if (audioUrl) {
             context.voice = audioUrl;
             console.log('Voiceover URL:', audioUrl);
           } else {
             context.voice = "Audio generated (browser only)";
           }
        }
        else if (step.id.startsWith('publish')) {
           // Schedule Post
           if (!context.idea) throw new Error("No content to publish");
           
           const newPost: any = {
             platform: 'youtube',
             title: context.idea.title,
             date: new Date().toISOString().split('T')[0],
             time: '12:00',
             status: 'scheduled',
             type: 'video',
             // If we have a voiceover URL, we could save it in the post data
             audioUrl: context.voice
           };
           
           await publishService.createPost(newPost);
           context.post = "Scheduled";
        }
        
        // Simulate a small delay for visual feedback if the step was too fast
        await new Promise(r => setTimeout(r, 1000));
      }

      // Success
      setStats(prev => ({
        ...prev,
        completed: prev.completed + 1,
        timeSavedMinutes: prev.timeSavedMinutes + 15,
        creditsUsed: prev.creditsUsed + 50
      }));
      
      // Update last run time
      await automationService.updateWorkflow(id, { lastRun: 'Just now' });
      await loadWorkflows();

      showToast(`Workflow "${workflow.name}" completed!`, 'success');

    } catch (error) {
      console.error("Workflow failed", error);
      showToast(`Workflow failed: ${(error as Error).message || 'Unknown error'}`, 'error');
    } finally {
      setRunningWorkflowId(null);
      setCurrentStepIndex(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans pb-8 transition-colors duration-200">
      <TopNav />
      
      <main className="max-w-[1600px] mx-auto px-4 pt-24 fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                <i className="fas fa-bolt text-purple-400"></i>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                Automation Engine
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30">
                  2 Active
                </span>
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Build intelligent workflows that run your content empire on autopilot</p>
          </div>
          <button className="gradient-bg px-6 py-2.5 rounded-lg font-medium text-white hover:opacity-90 transition shadow-lg flex items-center gap-2">
            <i className="fas fa-plus"></i> New Workflow
          </button>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-[#11131f] rounded-xl p-5 border border-gray-200 dark:border-green-500/20 relative overflow-hidden group shadow-sm dark:shadow-none">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Workflows</span>
              <i className="fas fa-wave-square text-green-500 dark:text-green-400"></i>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">2</div>
          </div>
          <div className="bg-white dark:bg-[#11131f] rounded-xl p-5 border border-gray-200 dark:border-purple-500/20 relative overflow-hidden group shadow-sm dark:shadow-none">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Executions</span>
              <i className="fas fa-rocket text-purple-500 dark:text-purple-400"></i>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">70</div>
          </div>
          <div className="bg-white dark:bg-[#11131f] rounded-xl p-5 border border-gray-200 dark:border-yellow-500/20 relative overflow-hidden group shadow-sm dark:shadow-none">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Success Rate</span>
              <i className="fas fa-bullseye text-yellow-500 dark:text-yellow-400"></i>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">95%</div>
          </div>
          <div className="bg-white dark:bg-[#11131f] rounded-xl p-5 border border-gray-200 dark:border-cyan-500/20 relative overflow-hidden group shadow-sm dark:shadow-none">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Time Saved</span>
              <i className="fas fa-stopwatch text-cyan-500 dark:text-cyan-400"></i>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">37h 25m</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-8 border-b border-gray-200 dark:border-gray-800 mb-8 overflow-x-auto no-scrollbar">
          <button className="text-gray-900 dark:text-white pb-3 border-b-2 border-purple-500 font-medium flex items-center gap-2 whitespace-nowrap">
            <i className="fas fa-layer-group"></i> My Workflows
          </button>
          <button className="text-gray-500 dark:text-gray-400 pb-3 font-medium hover:text-gray-900 dark:hover:text-white transition flex items-center gap-2 whitespace-nowrap">
            <i className="fas fa-wrench"></i> Workflow Builder
          </button>
          <button className="text-gray-500 dark:text-gray-400 pb-3 font-medium hover:text-gray-900 dark:hover:text-white transition flex items-center gap-2 whitespace-nowrap">
            <i className="fas fa-clock-rotate-left"></i> Execution History
          </button>
          <button className="text-gray-500 dark:text-gray-400 pb-3 font-medium hover:text-gray-900 dark:hover:text-white transition flex items-center gap-2 whitespace-nowrap">
            <i className="fas fa-book-open"></i> Templates
          </button>
        </div>

        {/* Main Layout Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 flex flex-col gap-4">
              
              {/* Workflow Card 1 */}
              <div className="bg-white dark:bg-[#11131f] border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300 shadow-sm dark:shadow-none relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-[#1a1c28] flex items-center justify-center text-2xl border border-gray-200 dark:border-gray-800">
                      📝
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">Daily Tech News Digest</h4>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                          Active
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Scrapes top tech blogs, writes summaries, and schedules tweets</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-50 dark:bg-[#1a1c28] rounded-lg p-1 border border-gray-200 dark:border-gray-800">
                    <button className="p-2 text-gray-400 hover:text-green-500 transition rounded-md hover:bg-white dark:hover:bg-gray-800" title="Run Now">
                      <i className="fas fa-play"></i>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-yellow-500 transition rounded-md hover:bg-white dark:hover:bg-gray-800" title="Pause">
                      <i className="fas fa-pause"></i>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-purple-500 transition rounded-md hover:bg-white dark:hover:bg-gray-800" title="Duplicate">
                      <i className="fas fa-copy"></i>
                    </button>
                    <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1"></div>
                    <button className="p-2 text-gray-400 hover:text-red-500 transition rounded-md hover:bg-white dark:hover:bg-gray-800" title="Delete">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                {/* Pipeline Visualizer */}
                <div className="bg-gray-50 dark:bg-[#0a0b10] rounded-xl p-5 border border-gray-200 dark:border-gray-800/50 mb-4 overflow-x-auto">
                  <div className="flex items-center min-w-max">
                    {/* Node 1 */}
                    <div className="flex flex-col items-center relative z-10">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)] mb-2 relative">
                        <i className="fas fa-rss text-sm"></i>
                      </div>
                      <span className="text-xs font-medium text-gray-900 dark:text-gray-300">RSS Fetch</span>
                    </div>
                    {/* Connector */}
                    <div className="w-16 h-0.5 bg-green-500 relative -top-3 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>

                    {/* Node 2 */}
                    <div className="flex flex-col items-center relative z-10">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] mb-2 relative">
                        <i className="fas fa-brain text-sm"></i>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full border-2 border-[#0a0b10] animate-ping"></span>
                      </div>
                      <span className="text-xs font-medium text-gray-900 dark:text-gray-300">AI Writer</span>
                    </div>
                    {/* Connector */}
                    <div className="w-16 h-0.5 bg-gray-200 dark:bg-gray-700 relative -top-3">
                      <div className="h-full bg-purple-500 w-1/2 animate-pulse"></div>
                    </div>

                    {/* Node 3 */}
                    <div className="flex flex-col items-center relative z-10">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 mb-2">
                        <i className="fas fa-image text-sm"></i>
                      </div>
                      <span className="text-xs font-medium text-gray-500">Image Gen</span>
                    </div>
                    {/* Connector */}
                    <div className="w-16 h-0.5 bg-gray-200 dark:bg-gray-700 relative -top-3"></div>

                    {/* Node 4 */}
                    <div className="flex flex-col items-center relative z-10">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 mb-2">
                        <i className="fab fa-twitter text-sm"></i>
                      </div>
                      <span className="text-xs font-medium text-gray-500">Post</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><i className="fas fa-clock text-gray-400"></i> Every 24h</span>
                    <span className="flex items-center gap-1.5"><i className="fas fa-bolt text-yellow-500"></i> 45 runs</span>
                  </div>
                  <span className="flex items-center gap-1.5">Next run: <span className="text-gray-900 dark:text-gray-300 font-medium">in 2 hours</span></span>
                </div>
              </div>

              {/* Workflow Card 2 */}
              <div className="bg-white dark:bg-[#11131f] border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300 shadow-sm dark:shadow-none relative overflow-hidden group opacity-75 hover:opacity-100">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-[#1a1c28] flex items-center justify-center text-2xl border border-gray-200 dark:border-gray-800">
                      🎥
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">YouTube to Shorts</h4>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border border-yellow-500/20">
                          Paused
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Downloads new videos, clips highlights, and posts to TikTok</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-50 dark:bg-[#1a1c28] rounded-lg p-1 border border-gray-200 dark:border-gray-800">
                    <button className="p-2 text-gray-400 hover:text-green-500 transition rounded-md hover:bg-white dark:hover:bg-gray-800" title="Resume">
                      <i className="fas fa-play"></i>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-purple-500 transition rounded-md hover:bg-white dark:hover:bg-gray-800" title="Duplicate">
                      <i className="fas fa-copy"></i>
                    </button>
                    <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1"></div>
                    <button className="p-2 text-gray-400 hover:text-red-500 transition rounded-md hover:bg-white dark:hover:bg-gray-800" title="Delete">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                {/* Pipeline Visualizer */}
                <div className="bg-gray-50 dark:bg-[#0a0b10] rounded-xl p-5 border border-gray-200 dark:border-gray-800/50 mb-4 overflow-x-auto grayscale">
                  <div className="flex items-center min-w-max">
                    {/* Node 1 */}
                    <div className="flex flex-col items-center relative z-10">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 mb-2">
                        <i className="fab fa-youtube text-sm"></i>
                      </div>
                      <span className="text-xs font-medium text-gray-500">Trigger</span>
                    </div>
                    {/* Connector */}
                    <div className="w-16 h-0.5 bg-gray-200 dark:bg-gray-700 relative -top-3"></div>

                    {/* Node 2 */}
                    <div className="flex flex-col items-center relative z-10">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 mb-2">
                        <i className="fas fa-video text-sm"></i>
                      </div>
                      <span className="text-xs font-medium text-gray-500">Clipper</span>
                    </div>
                    {/* Connector */}
                    <div className="w-16 h-0.5 bg-gray-200 dark:bg-gray-700 relative -top-3"></div>

                    {/* Node 3 */}
                    <div className="flex flex-col items-center relative z-10">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 mb-2">
                        <i className="fab fa-tiktok text-sm"></i>
                      </div>
                      <span className="text-xs font-medium text-gray-500">Post</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><i className="fas fa-bolt text-gray-400"></i> Webhook</span>
                    <span className="flex items-center gap-1.5"><i className="fas fa-check-circle text-gray-400"></i> 12 runs</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-500">Paused by user</span>
                </div>
              </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">

            {/* Quick Actions */}
            <div className="bg-white dark:bg-[#11131f] rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <i className="fas fa-bolt text-yellow-500"></i> Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1a1c28] border border-gray-200 dark:border-gray-800 hover:border-purple-500/50 transition group flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <i className="fas fa-rss text-orange-500"></i>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-300">New RSS Trigger</span>
                  </div>
                  <i className="fas fa-plus text-gray-400 group-hover:text-purple-500 transition"></i>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1a1c28] border border-gray-200 dark:border-gray-800 hover:border-purple-500/50 transition group flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <i className="fas fa-webhook text-blue-500"></i>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-300">Setup Webhook</span>
                  </div>
                  <i className="fas fa-plus text-gray-400 group-hover:text-purple-500 transition"></i>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1a1c28] border border-gray-200 dark:border-gray-800 hover:border-purple-500/50 transition group flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <i className="fas fa-file-import text-green-500"></i>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-300">Import Template</span>
                  </div>
                  <i className="fas fa-arrow-right text-gray-400 group-hover:text-purple-500 transition"></i>
                </button>
              </div>
            </div>

            {/* Active Triggers */}
            <div className="bg-white dark:bg-[#11131f] rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <i className="fas fa-clock text-blue-500"></i> Upcoming Triggers
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-300">Daily Tech Digest</p>
                    <p className="text-xs text-gray-500 mt-0.5">Scheduled in 2 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-300">Newsletter Sync</p>
                    <p className="text-xs text-gray-500 mt-0.5">Waiting for webhook event</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-6 border border-purple-500/20">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <i className="fas fa-sparkles text-purple-500"></i> AI Insights
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Your "Daily Tech News" workflow has a 95% success rate. We recommend adding an auto-retweet node to increase engagement by 24%.
              </p>
              <button className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-purple-500/25">
                Apply Optimization
              </button>
            </div>

            {/* Usage Stats */}
            <div className="bg-white dark:bg-[#11131f] rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Resource Usage</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600 dark:text-gray-400">AI Credits</span>
                    <span className="font-medium text-gray-900 dark:text-white">8,450 / 10,000</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" style={{ width: '84.5%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600 dark:text-gray-400">Storage</span>
                    <span className="font-medium text-gray-900 dark:text-white">2.4 / 10 GB</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-cyan-500 h-2 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600 dark:text-gray-400">API Calls</span>
                    <span className="font-medium text-gray-900 dark:text-white">12k / 50k</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Workflow Builder Section (Hidden for now, anchor point) */}
        <div id="workflow-builder" className="bg-white dark:bg-[#11131f] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">🔧 Workflow Builder</h3>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={newWorkflowName}
                onChange={(e) => setNewWorkflowName(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:border-purple-500 text-gray-900 dark:text-white"
                placeholder="Workflow Name"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Available Steps (Click to add):</p>
            <div className="flex flex-wrap gap-2">
              {availableSteps.map(step => (
                <button
                  key={step.id}
                  onClick={() => addToBuilder(step)}
                  className={`px-3 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-sm border border-${step.color}-200 dark:border-${step.color}-500/30 flex items-center gap-2 transition text-gray-700 dark:text-gray-200`}
                >
                  <i className={`${step.icon} text-${step.color}-500 dark:text-${step.color}-400`}></i>
                  {step.name}
                </button>
              ))}
            </div>
          </div>

          <div className="relative overflow-x-auto pb-4">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -z-0"></div>
            <div className="flex items-center gap-4 min-w-max px-2 relative z-10">
              {builderSteps.map((step, index) => (
                <React.Fragment key={index}>
                  <div className={`flex-shrink-0 w-48 p-4 bg-white dark:bg-gray-700 rounded-xl border-2 border-${step.color}-500 relative group shadow-sm`}>
                    <button 
                      onClick={() => removeFromBuilder(index)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                    <div className={`text-${step.color}-500 dark:text-${step.color}-400 text-2xl mb-2`}><i className={step.icon}></i></div>
                    <p className="font-medium text-gray-900 dark:text-white">{step.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
                  </div>
                  {index < builderSteps.length - 1 && (
                    <div className="flex-shrink-0 text-gray-400 dark:text-gray-500"><i className="fas fa-arrow-right"></i></div>
                  )}
                </React.Fragment>
              ))}
              
              {builderSteps.length === 0 && (
                <div className="w-full text-center py-8 text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/20 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                  Start adding steps from above to build your workflow
                </div>
              )}
            </div>
          </div>
          
          <button 
            onClick={saveWorkflow}
            disabled={builderSteps.length === 0}
            className={`mt-6 gradient-bg px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 ${builderSteps.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
          >
            <i className="fas fa-save"></i> Save Workflow
          </button>
        </div>
      </main>
    </div>
  );
}
