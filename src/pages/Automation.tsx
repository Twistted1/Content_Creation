import React, { useState, useEffect } from 'react';
import { TopNav } from '@/components/dashboard/TopNav';
import { automationService, Workflow, WorkflowStep } from '@/services/automationService';
import { aiService } from '@/services/aiService';
import { publishService } from '@/services/publishService';
import { showToast } from '@/utils/toast';

export default function Automation() {
  const [stats, setStats] = useState({
    completed: 47,
    timeSavedHours: 24,
    timeSavedMinutes: 35,
    creditsUsed: 1234,
    creditsTotal: 5000
  });

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
    if (confirm('Are you sure you want to delete this workflow?')) {
      try {
        await automationService.deleteWorkflow(id);
        setWorkflows(prev => prev.filter(w => w.id !== id));
      } catch (error) {
        console.error("Failed to delete workflow", error);
      }
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">⚡ Workflow Automation</h1>
          <p className="text-gray-600 dark:text-gray-400">Create automated pipelines for your content creation</p>
        </div>

        {/* Active Workflows */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">🚀 Active Workflows</h3>
                <button 
                  onClick={() => {
                    const builder = document.getElementById('workflow-builder');
                    builder?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="gradient-bg px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
                >
                  <i className="fas fa-plus"></i> New Workflow
                </button>
              </div>
              
              <div className="space-y-4">
                {workflows.map(workflow => (
                  <div key={workflow.id} className={`p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition ${!workflow.isActive ? 'opacity-75' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${workflow.isActive ? 'bg-green-100 dark:bg-green-500/20' : 'bg-gray-200 dark:bg-gray-600/20'} rounded-lg flex items-center justify-center`}>
                          <i className={`fas fa-${workflow.isActive ? 'check' : 'pause'} ${workflow.isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}></i>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{workflow.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{workflow.schedule}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => workflow.id && runWorkflow(workflow.id)}
                          className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded hover:bg-blue-500/30 transition"
                          disabled={!workflow.isActive}
                        >
                          <i className="fas fa-play mr-1"></i> Run
                        </button>
                        <button 
                          onClick={() => workflow.id && deleteWorkflow(workflow.id)}
                          className="text-gray-400 hover:text-red-400 transition"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                        <div className="flex items-center gap-2 ml-2">
                          <span className={`text-xs ${workflow.isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            {workflow.isActive ? 'Active' : 'Paused'}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={workflow.isActive}
                              onChange={() => workflow.id && toggleWorkflow(workflow.id, workflow.isActive)} 
                            />
                            <div className="w-9 h-5 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                      {workflow.steps.map((step, idx) => (
                        <React.Fragment key={idx}>
                          <span className={`px-2 py-1 bg-${step.color}-100 dark:bg-${step.color}-500/20 text-${step.color}-600 dark:text-${step.color}-400 rounded`}>
                            {step.name}
                          </span>
                          {idx < workflow.steps.length - 1 && (
                            <i className="fas fa-arrow-right text-gray-400 dark:text-gray-600"></i>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}

                {workflows.length === 0 && !isLoading && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No active workflows. Create one below!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Automation Stats */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none">
              <h3 className="font-bold mb-4 text-gray-900 dark:text-white">📊 Automation Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Workflows Completed</span>
                    <span className="font-medium text-gray-900 dark:text-white">{stats.completed}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="h-2 bg-purple-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Time Saved</span>
                    <span className="font-medium text-gray-900 dark:text-white">{stats.timeSavedHours}h {stats.timeSavedMinutes}m</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Credits Used</span>
                    <span className="font-medium text-gray-900 dark:text-white">{stats.creditsUsed.toLocaleString()} / {stats.creditsTotal.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${(stats.creditsUsed / stats.creditsTotal) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none">
              <h3 className="font-bold mb-4 text-gray-900 dark:text-white">⏰ Triggers</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-transparent">
                  <i className="fas fa-clock text-purple-500 dark:text-purple-400"></i>
                  <span className="text-sm text-gray-700 dark:text-gray-200">Schedule-based</span>
                  <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">Active</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-transparent">
                  <i className="fas fa-bolt text-yellow-500 dark:text-yellow-400"></i>
                  <span className="text-sm text-gray-700 dark:text-gray-200">Webhook</span>
                  <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">Active</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-transparent">
                  <i className="fas fa-file text-blue-500 dark:text-blue-400"></i>
                  <span className="text-sm text-gray-700 dark:text-gray-200">File upload</span>
                  <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Builder */}
        <div id="workflow-builder" className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none">
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
