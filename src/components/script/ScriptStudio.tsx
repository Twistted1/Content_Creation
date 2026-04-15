import React, { useState, useMemo } from 'react';
import ScriptToolbar from './modules/ScriptToolbar';
import ScriptLeftSidebar from './modules/ScriptLeftSidebar';
import ScriptMainEditor from './modules/ScriptMainEditor';
import ScriptRightSidebar from './modules/ScriptRightSidebar';
import ScriptBottomBar from './modules/ScriptBottomBar';
import { Platform, Tone, INITIAL_SECTIONS, SectionData } from './types';
export default function ScriptStudio() {
  const [sections, setSections] = useState<SectionData[]>(INITIAL_SECTIONS);
  const [activeSectionId, setActiveSectionId] = useState<string>('main');
  const [activePlatform, setActivePlatform] = useState<Platform>('YouTube');
  const [activeTone, setActiveTone] = useState<Tone>('Conversational');
  const [scriptTitle, setScriptTitle] = useState<string>('');

  const activeSection = sections.find(s => s.id === activeSectionId) || sections[0];

  const totalWords = sections.reduce((acc, section) => acc + section.wordCount, 0);
  const totalDuration = sections.reduce((acc, section) => acc + section.duration, 0); // seconds
  const completedSections = sections.filter(s => s.status === 'completed').length;

  const handleContentChange = (content: string) => {
    const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
    const duration = Math.ceil((words / 150) * 60);

    setSections(prevSections =>
      prevSections.map(section =>
        section.id === activeSectionId
          ? { ...section, content, wordCount: words, duration }
          : section
      )
    );
  };

  const handleStatusChange = (id: string) => {
      setSections(prevSections =>
          prevSections.map(section => {
              if (section.id === id) {
                  const newStatus = section.status === 'completed' ? 'pending' : 'completed';
                  return { ...section, status: newStatus };
              }
              return section;
          })
      );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] bg-gray-950 text-white font-sans overflow-hidden">
      <ScriptToolbar
        activePlatform={activePlatform}
        setActivePlatform={setActivePlatform}
        totalWords={totalWords}
        totalDuration={totalDuration}
        scriptTitle={scriptTitle}
        setScriptTitle={setScriptTitle}
        completedSections={completedSections}
        totalSections={sections.length}
      />

      <div className="flex flex-1 overflow-hidden">
        <ScriptLeftSidebar
          sections={sections}
          activeSectionId={activeSectionId}
          setActiveSectionId={setActiveSectionId}
          handleStatusChange={handleStatusChange}
        />

        <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a]">
           <ScriptMainEditor
              activeSection={activeSection}
              activeTone={activeTone}
              setActiveTone={setActiveTone}
              onContentChange={handleContentChange}
           />
           <ScriptBottomBar
              activeSection={activeSection}
              completedSections={completedSections}
              totalSections={sections.length}
           />
        </div>

        <ScriptRightSidebar
          sections={sections}
          activeSectionId={activeSectionId}
          setActiveSectionId={setActiveSectionId}
        />
      </div>
    </div>
  );
}
