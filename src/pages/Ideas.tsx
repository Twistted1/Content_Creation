import React, { useState, useEffect } from 'react';
import { TopNav } from '@/components/dashboard/TopNav';
import { ideaService, IdeaData } from '@/services/ideaService';
import { aiService } from '@/services/aiService';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/utils/toast';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Item Component
function SortableIdea({ idea, onDelete, onEdit, onClick }: { idea: IdeaData; onDelete: (id: string) => void; onEdit: (idea: IdeaData) => void; onClick: (idea: IdeaData) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: idea.id! });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="p-3 bg-white dark:bg-gray-700/30 rounded-lg text-sm flex justify-between items-center group cursor-grab active:cursor-grabbing mb-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition border border-gray-200 dark:border-transparent shadow-sm dark:shadow-none"
    >
      <div className="flex-1 truncate pr-2" onClick={(e) => { e.stopPropagation(); onClick(idea); }}>
        <span className="font-medium text-gray-900 dark:text-gray-200">{idea.title}</span>
        <span className="ml-2 text-xs text-gray-500 dark:text-gray-500">({idea.platform})</span>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition" onPointerDown={(e) => e.stopPropagation()}>
        <button 
          onClick={() => onEdit(idea)}
          className="text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 transition"
          title="Edit"
        >
          <i className="fas fa-edit"></i>
        </button>
        <button 
          onClick={() => idea.id && onDelete(idea.id)}
          className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition"
          title="Delete"
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
}

export default function Ideas() {
  const navigate = useNavigate();
  const [niche, setNiche] = useState('tech');
  const [customNiche, setCustomNiche] = useState('');
  const [platform, setPlatform] = useState<'youtube' | 'tiktok' | 'instagram' | 'x'>('youtube');
  const [generatedIdeas, setGeneratedIdeas] = useState<IdeaData[]>([]);
  const [savedIdeas, setSavedIdeas] = useState<IdeaData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingIdea, setEditingIdea] = useState<IdeaData | null>(null);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadSavedIdeas();
  }, []);

  const loadSavedIdeas = async () => {
    try {
      const ideas = await ideaService.getIdeas();
      setSavedIdeas(ideas);
    } catch (error) {
      console.error("Failed to load ideas", error);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSavedIdeas((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      // Note: In a real app, you'd want to persist the new order to Firestore here
    }
  };

  const generateIdeas = async () => {
    setIsGenerating(true);
    try {
      const topicToUse = niche === 'custom' ? customNiche : niche;
      if (!topicToUse) {
         showToast('Please enter a topic', 'error');
         setIsGenerating(false);
         return;
      }

      const newIdeas = await aiService.generateIdeas(topicToUse, platform);
      const formattedIdeas = newIdeas.map((idea: any) => ({
        title: idea.title,
        difficulty: idea.difficulty || 'medium',
        potential: idea.potential || 80,
        platform,
        isSaved: false
      }));
      setGeneratedIdeas(formattedIdeas);
      showToast('Ideas generated successfully', 'success');
    } catch (error) {
      console.error(error);
      showToast('Failed to generate ideas. Check API Key.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleIdeaClick = (idea: IdeaData) => {
    navigate('/script', { state: { title: idea.title, platform: idea.platform } });
  };

  const saveIdea = async (idea: IdeaData) => {
    try {
      await ideaService.createIdea({ ...idea, isSaved: true });
      showToast('Idea saved to Firebase', 'success');
      loadSavedIdeas();
    } catch (error) {
      showToast('Failed to save idea', 'error');
    }
  };

  const deleteSavedIdea = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this idea?")) return;
    try {
      await ideaService.deleteIdea(id);
      showToast('Idea removed', 'success');
      loadSavedIdeas();
    } catch (error) {
      showToast('Failed to delete idea', 'error');
    }
  };

  const startEditing = (idea: IdeaData) => {
    setEditingIdea(idea);
  };

  const saveEdit = async () => {
    if (!editingIdea || !editingIdea.id) return;
    try {
      await ideaService.updateIdea(editingIdea.id, { title: editingIdea.title });
      showToast('Idea updated', 'success');
      setEditingIdea(null);
      loadSavedIdeas();
    } catch (error) {
      showToast('Failed to update idea', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans pb-8 transition-colors duration-200">
      <TopNav />
      
      <main className="max-w-[1600px] mx-auto px-4 pt-24 fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">💡 Idea Generation</h1>
          <p className="text-gray-600 dark:text-gray-400">Generate viral content ideas powered by AI</p>
        </div>

        {/* Edit Modal */}
        {editingIdea && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md border border-gray-200 dark:border-gray-700 shadow-2xl">
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Edit Idea</h3>
              <input 
                type="text" 
                value={editingIdea.title} 
                onChange={(e) => setEditingIdea({...editingIdea, title: e.target.value})}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 dark:text-white"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setEditingIdea(null)} className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">Cancel</button>
                <button onClick={saveEdit} className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20">Save</button>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none">
              <div className="flex flex-col gap-4 mb-4">
                {/* Custom Niche Input - Full Width */}
                {niche === 'custom' && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Custom Topic</label>
                    <textarea 
                      value={customNiche}
                      onChange={(e) => setCustomNiche(e.target.value)}
                      placeholder="Enter any topic, keyword, or rough idea here...&#10;E.g. 'How to start a vertical garden in a small apartment'"
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-purple-500/50 rounded-xl px-4 py-3 text-sm min-h-[100px] outline-none focus:ring-2 focus:ring-purple-500 resize-none text-gray-900 dark:text-white"
                      autoFocus
                    />
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                    <select 
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm flex-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                    >
                      <option value="tech">Tech & Gadgets</option>
                      <option value="lifestyle">Lifestyle</option>
                      <option value="gaming">Gaming</option>
                      <option value="education">Education</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="business">Business</option>
                      <option value="crypto">Crypto & Finance</option>
                      <option value="custom">✨ Custom Topic...</option>
                    </select>

                    <select 
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value as any)}
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm flex-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                    >
                      <option value="youtube">YouTube</option>
                      <option value="tiktok">TikTok</option>
                      <option value="instagram">Instagram</option>
                      <option value="x">X (Twitter)</option>
                      <option value="facebook">Facebook</option>
                      <option value="linkedin">LinkedIn</option>
                    </select>
                    
                    <button 
                      onClick={generateIdeas}
                      disabled={isGenerating}
                      className="gradient-bg px-6 py-2 rounded-lg font-medium hover:opacity-90 transition flex items-center gap-2 disabled:opacity-50 text-white shadow-lg shadow-purple-500/20"
                    >
                      {isGenerating ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <i className="fas fa-magic"></i>
                      )}
                      Generate
                    </button>
                </div>
              </div>

              <div className="space-y-3">
                {generatedIdeas.length > 0 ? (
                  generatedIdeas.map((idea, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center justify-between group hover:bg-gray-100 dark:hover:bg-gray-700 transition animate-in fade-in slide-in-from-bottom-2 border border-gray-200 dark:border-transparent">
                      <div className="flex-1 cursor-pointer group-hover:pl-2 transition-all duration-300" onClick={() => handleIdeaClick(idea)} title="Click to generate script">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-purple-600 dark:text-purple-300 group-hover:text-purple-700 dark:group-hover:text-white transition">{idea.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded ${idea.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300' : idea.difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300' : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300'}`}>
                            {idea.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Viral Prediction Score: <span className="text-green-600 dark:text-green-400 font-bold">{idea.potential}%</span></p>
                        <span className="text-xs bg-purple-100 dark:bg-purple-600/20 text-purple-700 dark:text-purple-400 px-2 py-1 rounded border border-purple-200 dark:border-purple-500/30">
                           Generate Script <i className="fas fa-arrow-right ml-1"></i>
                        </span>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button 
                          onClick={() => saveIdea(idea)}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white" 
                          title="Save"
                        >
                          <i className="fas fa-bookmark"></i>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-500">
                    <i className="fas fa-lightbulb text-4xl mb-4 opacity-50"></i>
                    <p>Select your niche and click Generate to get AI-powered ideas!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none">
              <h3 className="font-bold mb-4 text-gray-900 dark:text-white">📊 Trending Topics</h3>
              <div className="space-y-3">
                {/* ... existing trending topics code ... */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer transition border border-gray-100 dark:border-transparent">
                  <span className="text-lg font-bold text-gray-400 dark:text-gray-500">#1</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">AI Revolution</p>
                    <p className="text-xs text-green-600 dark:text-green-400">↑ 145% search vol</p>
                  </div>
                </div>
                {/* ... more topics ... */}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none">
              <h3 className="font-bold mb-4 text-gray-900 dark:text-white">💾 Saved Ideas (Drag to Reorder)</h3>
              {savedIdeas.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No saved ideas yet.</p>
              ) : (
                <DndContext 
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext 
                    items={savedIdeas.map(i => i.id!)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                      {savedIdeas.map((idea) => (
                        <SortableIdea 
                          key={idea.id} 
                          idea={idea} 
                          onDelete={deleteSavedIdea}
                          onEdit={startEditing}
                          onClick={handleIdeaClick}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
