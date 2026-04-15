import React, { useState, useEffect } from 'react';
import { TopNav } from '@/components/dashboard/TopNav';
import { Footer } from '@/components/Footer';
import { ideaService, IdeaData } from '@/services/ideaService';
import { aiService } from '@/services/aiService';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/utils/toast';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

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
      className="p-3 bg-[#1A1D24] rounded-lg text-sm flex justify-between items-center group cursor-grab active:cursor-grabbing mb-2 hover:bg-[#2A2E36] transition border border-[#1F232B] shadow-sm"
    >
      <div className="flex-1 truncate pr-2" onClick={(e) => { e.stopPropagation(); onClick(idea); }}>
        <span className="font-medium text-white">{idea.title}</span>
        <span className="ml-2 text-xs text-gray-500">({idea.platform})</span>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition" onPointerDown={(e) => e.stopPropagation()}>
        <button 
          onClick={() => onEdit(idea)}
          className="text-gray-400 hover:text-blue-500 transition"
          title="Edit"
        >
          <i className="fas fa-edit"></i>
        </button>
        <button 
          onClick={() => idea.id && onDelete(idea.id)}
          className="text-gray-400 hover:text-red-500 transition"
          title="Delete"
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
}

const platforms = [
  { id: 'youtube', name: 'YouTube', icon: 'fa-youtube', color: 'bg-red-500' },
  { id: 'instagram', name: 'Instagram', icon: 'fa-instagram' },
  { id: 'facebook', name: 'Facebook', icon: 'fa-facebook' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'fa-linkedin' },
  { id: 'tiktok', name: 'TikTok', icon: 'fa-tiktok' },
  { id: 'twitter', name: 'Twitter', icon: 'fa-twitter' },
  { id: 'rumble', name: 'Rumble', icon: 'fa-play' },
  { id: 'blog', name: 'Blog', icon: 'fa-file-alt' },
];

export default function Ideas() {
  const navigate = useNavigate();
  const [niche, setNiche] = useState('Tech & Gadgets');
  const [customNiche, setCustomNiche] = useState('');
  const [platform, setPlatform] = useState<'youtube' | 'tiktok' | 'instagram' | 'x' | 'facebook' | 'linkedin' | 'rumble' | 'blog'>('youtube');
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
    <div className="min-h-screen bg-[#0A0C10] text-white font-sans flex flex-col">
      <TopNav />
      <div className="flex-1 flex justify-center pt-24 pb-12 px-6">
        <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6">

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                    <i className="fas fa-lightbulb"></i>
                  </div>
                  <h1 className="text-2xl font-bold">Idea Generation</h1>
                </div>
                <p className="text-sm text-gray-400">Generate viral content ideas powered by AI</p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-lg bg-[#1F232B] hover:bg-[#2A2E36] border border-[#2A2E36] text-sm text-gray-300 font-medium transition-colors flex items-center gap-2">
                  <i className="fas fa-history"></i> History
                </button>
                <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-medium transition-colors flex items-center gap-2 text-white">
                  <i className="fas fa-plus"></i> Custom Prompt
                </button>
              </div>
            </div>

            {/* Input Form Card */}
            <div className="bg-[#12151A] rounded-xl p-6 border border-[#1F232B] relative overflow-hidden">
              <div className="absolute top-1/2 right-10 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex flex-col md:flex-row gap-6 relative z-10">
                {/* Niche Input */}
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Niche</label>
                  <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="w-full bg-[#1A1D24] border border-[#2A2E36] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                {/* Platform Selection */}
                <div className="flex-[1.5]">
                  <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Platform</label>
                  <div className="grid grid-cols-4 gap-2 bg-[#1A1D24] p-2 rounded-xl border border-[#2A2E36]">
                    {platforms.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPlatform(p.id as any)}
                        className={cn(
                          "flex flex-col items-center justify-center py-3 rounded-lg gap-1 transition-all",
                          platform === p.id
                            ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                            : "text-gray-400 hover:text-white hover:bg-[#2A2E36]"
                        )}
                      >
                        <i className={cn("fab", p.icon, "text-lg")}></i>
                        <span className="text-[11px] font-medium">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateIdeas}
                disabled={isGenerating}
                className="w-full mt-6 bg-gradient-to-r from-[#6B38FB] to-[#8B5CF6] hover:from-[#7C4DFF] hover:to-[#9D71F8] text-white rounded-xl py-4 font-bold text-lg shadow-[0_0_30px_rgba(107,56,251,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isGenerating ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <i className="fas fa-bolt"></i>
                )}
                Generate Viral Ideas
              </button>
            </div>

            {/* Generated Ideas / Empty State */}
            {generatedIdeas.length > 0 ? (
              <div className="space-y-3">
                {generatedIdeas.map((idea, index) => (
                  <div key={index} className="p-4 bg-[#12151A] rounded-xl flex items-center justify-between group hover:bg-[#1A1D24] transition animate-in fade-in slide-in-from-bottom-2 border border-[#1F232B]">
                    <div className="flex-1 cursor-pointer group-hover:pl-2 transition-all duration-300" onClick={() => handleIdeaClick(idea)} title="Click to generate script">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-purple-400 group-hover:text-purple-300 transition">{idea.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded ${idea.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' : idea.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                          {idea.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">Viral Prediction Score: <span className="text-green-400 font-bold">{idea.potential}%</span></p>
                      <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded border border-purple-500/30">
                         Generate Script <i className="fas fa-arrow-right ml-1"></i>
                      </span>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => saveIdea(idea)}
                        className="p-2 hover:bg-[#2A2E36] rounded-lg text-gray-400 hover:text-white transition-colors"
                        title="Save"
                      >
                        <i className="fas fa-bookmark"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 border-2 border-dashed border-[#1F232B] rounded-xl flex flex-col items-center justify-center p-12 min-h-[300px] text-center">
                <div className="w-16 h-16 rounded-full bg-[#1A1D24] flex items-center justify-center mb-4">
                  <i className="fas fa-search text-2xl text-[#2A2E36]"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-400 mb-1">Select your niche and platform</h3>
                <p className="text-sm text-gray-600">Our AI will find the most trending topics for you</p>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-[380px] flex flex-col gap-6">

            {/* Trending Topics */}
            <div className="bg-[#12151A] rounded-xl p-6 border border-[#1F232B]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <i className="fas fa-chart-line text-green-500"></i>
                  <h3 className="font-bold text-white">Trending Topics</h3>
                </div>
                <span className="text-[10px] font-bold bg-[#1A1D24] text-blue-400 px-2 py-1 rounded">LIVE</span>
              </div>

              <div className="space-y-4 mb-6">
                {[
                  { rank: '#1', title: 'AI Revolution', searches: '2.5M monthly searches', growth: '+145%' },
                  { rank: '#2', title: 'Web3 Gaming', searches: '800K monthly searches', growth: '+82%' },
                  { rank: '#3', title: 'Remote Work 2.0', searches: '1.2M monthly searches', growth: '+45%' },
                ].map((topic, i) => (
                  <div key={i} className="flex items-center gap-4 bg-[#1A1D24] p-4 rounded-xl border border-[#1F232B]">
                    <span className="text-2xl font-black italic text-[#2A2E36] w-8">{topic.rank}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-white">{topic.title}</h4>
                      <p className="text-[11px] text-gray-500">{topic.searches}</p>
                    </div>
                    <div className="text-right">
                      <i className="fas fa-arrow-trend-up text-green-500 text-xs mb-1"></i>
                      <p className="text-green-500 text-xs font-bold">{topic.growth}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors">
                View Full Market Report <i className="fas fa-chevron-right text-[10px] ml-1"></i>
              </button>
            </div>

            {/* Saved Ideas */}
            <div className="bg-[#12151A] rounded-xl p-6 border border-[#1F232B] flex-1 flex flex-col min-h-[300px]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-white">
                  <i className="fas fa-save text-blue-500"></i>
                  <h3 className="font-bold">Saved Ideas</h3>
                </div>
                <div className="w-6 h-6 rounded-full bg-[#1A1D24] flex items-center justify-center text-xs text-blue-500 font-medium">
                  {savedIdeas.length}
                </div>
              </div>

              {savedIdeas.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                  <i className="fas fa-save text-4xl text-[#2A2E36] mb-3"></i>
                  <p className="text-sm text-gray-500">No saved ideas yet</p>
                </div>
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
      </div>

      {/* Edit Modal */}
      {editingIdea && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#12151A] p-6 rounded-xl w-full max-w-md border border-[#1F232B] shadow-2xl">
            <h3 className="text-lg font-bold mb-4 text-white">Edit Idea</h3>
            <input
              type="text"
              value={editingIdea.title}
              onChange={(e) => setEditingIdea({...editingIdea, title: e.target.value})}
              className="w-full bg-[#1A1D24] border border-[#2A2E36] rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-purple-500 outline-none text-white"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingIdea(null)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={saveEdit} className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20">Save</button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
