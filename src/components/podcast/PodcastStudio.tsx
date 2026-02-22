import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { usePodcastSession } from './hooks/usePodcastSession';
import { useRecording } from './hooks/useRecording';
import { podcastService } from '@/services/podcastService';
import { authService } from '@/services/authService';
import {
  FaMicrophone, FaWaveSquare, FaBolt, FaCoffee, FaRedo, FaPhone,
  FaVideo, FaDesktop, FaSlidersH, FaCog, FaPlus,
  FaMinus, FaSearch, FaFolder, FaMusic, FaDownload, FaFile, FaTh,
  FaPlay, FaStop, FaBackward, FaForward, FaMicrophoneAlt, FaShareAlt,
  FaUndo, FaPaperPlane, FaCircle, FaBell, FaAngleDown, FaAngleRight,
  FaSignOutAlt, FaUser, FaCheckCircle, FaExclamationCircle, FaSave, FaTrash
} from 'react-icons/fa';

interface PodcastStudioProps {
  onRecordingToggle?: (isRecording: boolean) => void;
  isLive?: boolean;
}

const PodcastStudio: React.FC<PodcastStudioProps> = ({ onRecordingToggle, isLive = false }) => {
  const navigate = useNavigate();
  const { 
    segments, 
    teleprompterText, 
    updateSegments, 
    updateTeleprompter,
    isSaving 
  } = usePodcastSession();
  
  // Recording State
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [episodeTitle, setEpisodeTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const { 
    isRecording: recording, 
    toggleRecording, 
    duration: recordingDuration,
    formatDuration 
  } = useRecording({
    onStart: () => {
      if (onRecordingToggle) onRecordingToggle(true);
    },
    onStop: (duration, blob) => {
      if (onRecordingToggle) onRecordingToggle(false);
      if (blob) {
        setRecordedBlob(blob);
        setShowSaveModal(true);
        // Default title
        setEpisodeTitle(`Episode ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`);
      }
    }
  });

  const handleSaveRecording = async () => {
    if (!recordedBlob || !episodeTitle) return;
    
    setIsUploading(true);
    try {
      // 1. Upload Audio
      const audioUrl = await podcastService.uploadEpisode(recordedBlob, episodeTitle);
      
      // 2. Create Podcast Record
      await podcastService.createPodcast({
        title: episodeTitle,
        topic: 'General', // Could be a field
        hosts: ['Me'], // Could be dynamic
        guests: [],
        duration: formatDuration(recordingDuration),
        status: 'published',
        audioUrl,
        script: teleprompterText
      });

      // 3. Reset
      setShowSaveModal(false);
      setRecordedBlob(null);
      setEpisodeTitle('');
      alert("Episode published successfully!");
    } catch (error) {
      console.error("Failed to save episode", error);
      alert("Failed to save episode. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const [gain, setGain] = useState(100);
  const [selectedPreset, setSelectedPreset] = useState('STUDIO');
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const [isReading, setIsReading] = useState(false);
  const teleprompterRef = useRef<HTMLDivElement>(null);
  const [activeSegment, setActiveSegment] = useState('');
  
  // Top Bar State
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const notifications = [
    { id: 1, title: 'Video Export Complete', desc: 'Your video is ready', time: '2m ago', read: false, type: 'success' },
    { id: 2, title: 'Script Generated', desc: 'AI finished writing', time: '1h ago', read: false, type: 'info' },
  ];

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [channelLevels, setChannelLevels] = useState([-20, -15, -10, -12, -8, -5]);
  const [meters, setMeters] = useState([0.3, 0.4, 0.5, 0.6, 0.7, 0.8]);

  // Simulate meter activity
  useEffect(() => {
    const interval = setInterval(() => {
      setMeters(prev => prev.map(val => {
        const change = (Math.random() - 0.5) * 0.2;
        return Math.max(0.1, Math.min(0.9, val + change));
      }));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Teleprompter Auto-Scroll
  useEffect(() => {
    let scrollInterval: any;
    if (isReading && teleprompterRef.current) {
      scrollInterval = setInterval(() => {
        if (teleprompterRef.current) {
          teleprompterRef.current.scrollTop += scrollSpeed;
        }
      }, 50);
    }
    return () => clearInterval(scrollInterval);
  }, [isReading, scrollSpeed]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') updateTeleprompter(text);
      };
      reader.readAsText(file);
    }
  };

  const addSegment = () => {
    if (!activeSegment.trim()) return;
    updateSegments([...segments, { id: Date.now(), title: activeSegment }]);
    setActiveSegment('');
  };

  const presets = [
    { id: 'STUDIO', name: 'Balanced & Clear', icon: FaMicrophone },
    { id: 'RADIO', name: 'Deep & Bass Heavy', icon: FaWaveSquare },
    { id: 'CRISP', name: 'High Clarity', icon: FaBolt },
    { id: 'WARM', name: 'Soft & Rich', icon: FaCoffee },
    { id: 'ECHO', name: 'Reverb Effect', icon: FaRedo },
    { id: 'PHONE', name: 'Lo-fi Filter', icon: FaPhone },
  ];

  const jingles = ['Jingle 1', 'Jingle 2', 'Effect 3', 'Effect 4', 'Effect 5', 'Effect 6'];
  const mediaLibraryItems = [
    { icon: FaFolder, label: 'Unidos', color: '#9C27B0' },
    { icon: FaFile, label: 'Segment', color: '#2196F3' },
    { icon: FaFile, label: 'Nicks', color: '#FF9800' },
    { icon: FaTh, label: 'Standard', color: '#4CAF50' },
    { icon: FaFile, label: 'Write', color: '#E91E63' },
    { icon: FaVideo, label: 'Vision', color: '#00BCD4' },
    { icon: FaFile, label: 'Regiveal', color: '#8BC34A' },
    { icon: FaFile, label: 'Loaded', color: '#795548' },
    { icon: FaMusic, label: 'Music', color: '#F44336' },
    { icon: FaDownload, label: 'Download', color: '#FFEB3B' },
    { icon: FaFolder, label: 'Outros', color: '#607D8B' },
    { icon: FaPlus, label: 'More', color: '#9E9E9E' },
  ];

  return (
    <StudioContainer>
      {/* Studio Header / Controls */}
      <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
         <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${isLive ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
              {isLive ? 'ON AIR' : 'OFFLINE'}
            </div>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
            <Timer>{recording ? formatDuration(recordingDuration) : '00:00:00'}</Timer>
         </div>

         <div className="flex items-center gap-3">
            <button 
              onClick={toggleRecording}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-white transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 ${
                recording 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/20' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-purple-500/20'
              }`}
            >
              {recording ? (
                <><FaStop /> STOP RECORDING</>
              ) : (
                <><FaCircle className="text-[10px]" /> START RECORDING</>
              )}
            </button>
         </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <h3 style={{ margin: 0 }}>Save Recording</h3>
              <IconButton $small onClick={() => setShowSaveModal(false)}><FaMinus /></IconButton>
            </ModalHeader>
            
            <div style={{ marginBottom: '20px' }}>
              <Label>Episode Title</Label>
              <SegmentInput 
                value={episodeTitle} 
                onChange={(e) => setEpisodeTitle(e.target.value)} 
                placeholder="Enter episode title..."
                autoFocus
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <Label>Duration</Label>
              <div style={{ color: '#fff', fontSize: '18px', fontFamily: 'monospace' }}>
                {formatDuration(recordingDuration)}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <Button onClick={() => setShowSaveModal(false)} style={{ background: '#3d3d4d' }}>
                <FaTrash /> Discard
              </Button>
              <Button onClick={handleSaveRecording} disabled={isUploading}>
                {isUploading ? (
                  <>Saving...</>
                ) : (
                  <><FaSave /> Save & Publish</>
                )}
              </Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Main Layout */}
      <MainLayout>
        {/* Left Sidebar */}
        <SidebarLeft>
          <Panel>
            <PanelHeader>
              <PanelTitle>SIGNAL CHAIN</PanelTitle>
              <LiveDot $live={isLive} />
            </PanelHeader>
            
            <ControlGroup>
              <Label>INPUT GAIN</Label>
              <SliderWrapper>
                <Slider
                  type="range"
                  min="0"
                  max="200"
                  value={gain}
                  onChange={(e) => setGain(parseInt(e.target.value))}
                />
                <Value>{gain}%</Value>
              </SliderWrapper>
            </ControlGroup>

            <PanelTitle style={{ marginTop: '24px' }}>DSP PRESETS</PanelTitle>
            {presets.map(preset => (
              <PresetButton
                key={preset.id}
                selected={selectedPreset === preset.id}
                onClick={() => setSelectedPreset(preset.id)}
              >
                <preset.icon style={{ marginRight: '12px' }} />
                <PresetInfo>
                  <PresetName>{preset.id}</PresetName>
                  <PresetDescription>{preset.name}</PresetDescription>
                </PresetInfo>
              </PresetButton>
            ))}
          </Panel>
        </SidebarLeft>

        {/* Center Panel */}
        <CenterPanel>
          {/* Live Video Panel */}
          <Panel>
            <PanelHeader>
              <PanelTitle>LIVE VIDEO</PanelTitle>
              <PanelControls>
                <IconButton $small><FaMinus /></IconButton>
                <IconButton $small><FaDesktop /></IconButton>
                <IconButton $small><FaCog /></IconButton>
              </PanelControls>
            </PanelHeader>
            
            <VideoFeed>
              <HostImage 
                src="https://picsum.photos/seed/host/1280/720" 
                alt="Live Host"
              />
              <OverlayGradient />
            </VideoFeed>
            
            <ButtonGroup>
              <VideoControlButton>
                <FaVideo style={{ marginRight: '8px' }} /> CAMERA
              </VideoControlButton>
              <VideoControlButton primary>
                <FaDesktop style={{ marginRight: '8px' }} /> SCREEN SHARE
              </VideoControlButton>
            </ButtonGroup>
          </Panel>

          {/* Audio Mixer */}
          <Panel style={{ flex: 1 }}>
            <PanelHeader>
              <PanelTitle>PROFESSIONAL AUDIO MIXER</PanelTitle>
              <PanelControls>
                <IconButton $small><FaSlidersH /></IconButton>
                <IconButton $small><FaSlidersH /></IconButton>
                <IconButton $small><FaCog /></IconButton>
              </PanelControls>
            </PanelHeader>
            
            <MixerGrid>
              {[1, 2, 3, 4, 5, 6].map(ch => (
                <Channel key={ch}>
                  <ChannelLabel>Channel {ch}</ChannelLabel>
                  <ChannelSelect>
                    <option>Voxus</option>
                    <option>Rods</option>
                    <option>Bics</option>
                  </ChannelSelect>
                  <MeterBar level={meters[ch-1]}>
                    <MeterFill level={meters[ch-1]} />
                  </MeterBar>
                  <FaderWrapper>
                    <Fader
                      type="range"
                      min="-40"
                      max="10"
                      value={channelLevels[ch-1]}
                      onChange={(e) => {
                        const newLevels = [...channelLevels];
                        newLevels[ch-1] = parseInt(e.target.value);
                        setChannelLevels(newLevels);
                      }}
                    />
                    <FaderValue>{channelLevels[ch-1]} dB</FaderValue>
                  </FaderWrapper>
                  <ChannelControls>
                    <SmallButton>M</SmallButton>
                    <SmallButton>S</SmallButton>
                  </ChannelControls>
                </Channel>
              ))}
              
              <MasterChannel>
                <ChannelLabel>Effects</ChannelLabel>
                <ChannelSelect>
                  <option>Of Goa</option>
                </ChannelSelect>
                <MeterBar level={meters[5]}>
                  <MeterFill level={meters[5]} />
                </MeterBar>
                <FaderWrapper>
                  <Fader
                    type="range"
                    min="-40"
                    max="10"
                    value={channelLevels[5]}
                    onChange={(e) => {
                      const newLevels = [...channelLevels];
                      newLevels[5] = parseInt(e.target.value);
                      setChannelLevels(newLevels);
                    }}
                  />
                  <FaderValue>{channelLevels[5]} dB</FaderValue>
                </FaderWrapper>
                <ChannelControls>
                  <SmallButton>M</SmallButton>
                  <SmallButton>S</SmallButton>
                </ChannelControls>
              </MasterChannel>
              
              <MasterMeter>
                <ChannelLabel>Master</ChannelLabel>
                <VUMeter>
                  <VULeft level={meters[0]} />
                  <VURight level={meters[1]} />
                </VUMeter>
                <MeterScale>
                  <span>10</span>
                  <span>0</span>
                  <span>-10</span>
                  <span>-20</span>
                  <span>-30</span>
                  <span>-40</span>
                </MeterScale>
              </MasterMeter>
            </MixerGrid>
          </Panel>
        </CenterPanel>

        {/* Right Sidebar */}
        <SidebarRight>
          {/* Soundboard */}
          <Panel>
            <PanelHeader>
              <PanelTitle>SOUNDBOARD</PanelTitle>
              <PanelControls>
                <IconButton $small><FaPlus /></IconButton>
                <IconButton $small><FaCog /></IconButton>
              </PanelControls>
            </PanelHeader>
            <JingleGrid>
              {jingles.slice(0, 6).map((jingle, i) => (
                <JingleButton key={i} $colorIndex={i}>
                  {jingle}
                </JingleButton>
              ))}
            </JingleGrid>
            <SubTitle>EFFECTS</SubTitle>
            <JingleGrid>
              {jingles.map((jingle, i) => (
                <JingleButton key={`effect-${i}`} $colorIndex={i + 2}>
                  {jingle}
                </JingleButton>
              ))}
              <JingleButton $more>More</JingleButton>
            </JingleGrid>
          </Panel>

          {/* Teleprompter */}
          <Panel>
            <PanelHeader>
              <PanelTitle>TELEPROMPTER</PanelTitle>
              <PanelControls>
                <IconButton $small onClick={() => setIsReading(true)} title="Start Reading Mode"><FaDesktop /></IconButton>
                <IconButton $small title="Upload Script">
                  <label style={{ cursor: 'pointer' }}>
                    <FaPlus />
                    <input type="file" accept=".txt,.md" style={{ display: 'none' }} onChange={handleFileUpload} />
                  </label>
                </IconButton>
              </PanelControls>
            </PanelHeader>
            
            <SelectWrapper>
              <Select>
                <option>Load Script...</option>
                <option>My Latest Episode</option>
                <option>Interview with John Doe</option>
              </Select>
              <FaAngleDown style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </SelectWrapper>
            
            <ControlGroup>
              <Label>SCROLL SPEED</Label>
              <SliderWrapper>
                <Slider
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={scrollSpeed}
                  onChange={(e) => setScrollSpeed(parseFloat(e.target.value))}
                />
                <Value>{scrollSpeed}x</Value>
              </SliderWrapper>
            </ControlGroup>
            
            <ScriptArea
              placeholder="Paste script here or select from library..."
              value={teleprompterText}
              onChange={(e) => updateTeleprompter(e.target.value)}
            />
          </Panel>

          {/* Media Library */}
          <Panel>
            <PanelHeader>
              <PanelTitle>MEDIA LIBRARY</PanelTitle>
              <IconButton $small><FaCog /></IconButton>
            </PanelHeader>
            
            <SearchWrapper>
              <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
              <SearchInput placeholder="Search..." />
            </SearchWrapper>
            
            <ButtonGroup style={{ marginBottom: '16px' }}>
              <LibraryButton $active>All</LibraryButton>
              <LibraryButton><FaMusic style={{ marginRight: '6px' }} /> Music</LibraryButton>
              <LibraryButton><FaDownload style={{ marginRight: '6px' }} /> Download</LibraryButton>
            </ButtonGroup>
            
            <MediaGrid>
              {mediaLibraryItems.map((item, i) => (
                <MediaItem key={i} $color={item.color}>
                  <item.icon style={{ fontSize: '20px', marginBottom: '8px' }} />
                  <ItemLabel>{item.label}</ItemLabel>
                </MediaItem>
              ))}
            </MediaGrid>
          </Panel>

          {/* Segment Planner */}
          <Panel style={{ flex: 1 }}>
            <PanelHeader>
              <PanelTitle>SHOW NOTES / SEGMENT PLANNER {isSaving && <span style={{fontSize: '10px', color: '#888', marginLeft: '10px'}}>(Saving...)</span>}</PanelTitle>
              <PanelControls>
                <IconButton $small><FaPlus /></IconButton>
                <IconButton $small><FaCog /></IconButton>
              </PanelControls>
            </PanelHeader>
            
            <SegmentInputWrapper>
              <SegmentInput
                placeholder="Type a segment..."
                value={activeSegment}
                onChange={(e) => setActiveSegment(e.target.value)}
              />
              <SendButton onClick={addSegment}>
                <FaPaperPlane />
              </SendButton>
            </SegmentInputWrapper>
            
            <SegmentList>
              {segments.map(seg => (
                <SegmentItem key={seg.id}>
                  <DragHandle>☰</DragHandle>
                  <SegmentText>{seg.title}</SegmentText>
                </SegmentItem>
              ))}
            </SegmentList>
          </Panel>
        </SidebarRight>
      </MainLayout>

      {/* Bottom Bar */}
      <BottomBar>
        <AdvancedRecording>
          <Label>ADVANCED RECORDING</Label>
          <LiveStatus $live={isLive}>
            <LiveDot $live={isLive} /> {isLive ? 'LIVE' : 'OFFLINE'}
          </LiveStatus>
        </AdvancedRecording>
        
        <TransportControls>
          <TransportButton><FaBackward /></TransportButton>
          <TransportButton><FaStop /></TransportButton>
          <RecordButtonBig onClick={toggleRecording} $recording={recording}>
            <FaMicrophoneAlt />
          </RecordButtonBig>
          <TransportButton><FaPlay /></TransportButton>
          <TransportButton><FaForward /></TransportButton>
          <TransportButton><FaUndo /></TransportButton>
          <TransportButton><FaRedo /></TransportButton>
        </TransportControls>
        
        <UtilityButtons>
          <UtilityButton><FaCog /></UtilityButton>
          <UtilityButton><FaShareAlt /></UtilityButton>
        </UtilityButtons>
      </BottomBar>
    </StudioContainer>
  );
};

export default PodcastStudio;

// ==================== STYLED COMPONENTS ====================

interface LiveStatusProps {
  $live?: boolean;
}

interface RecordButtonBigProps {
  $recording?: boolean;
}

interface MediaItemProps {
  $color: string;
}

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const SegmentInputWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const SegmentList = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;

const StudioContainer = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  height: calc(100vh - 160px);
  min-height: 600px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Timer = styled.div`
  background: rgba(0,0,0,0.2);
  padding: 4px 12px;
  border-radius: 6px;
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  font-weight: 500;
  color: #10b981; /* green-500 */
  border: 1px solid rgba(0,0,0,0.1);
  
  .dark & {
    background: rgba(255,255,255,0.1);
    color: #34d399; /* green-400 */
    border: 1px solid rgba(255,255,255,0.1);
  }
`;

const MainLayout = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr 320px 300px;
  flex: 1;
  background: transparent;
  align-items: stretch;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 1400px) {
    grid-template-columns: 240px 1fr 300px 280px;
  }
`;

const SidebarLeft = styled.div`
  background: #f9fafb;
  padding: 16px;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;

  .dark & {
    background: #111827;
    border-right-color: #374151;
  }
`;

const CenterPanel = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
  overflow-y: auto;
  min-width: 0;
`;

const SidebarRight = styled.div`
  background: #f9fafb;
  padding: 16px;
  border-left: 1px solid #e5e7eb;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  .dark & {
    background: #111827;
    border-left-color: #374151;
  }
`;

const Panel = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;

  .dark & {
    background: #1f2937; /* gray-800 */
    border-color: #374151; /* gray-700 */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #374151; /* gray-700 */
  text-transform: uppercase;
  letter-spacing: 0.5px;

  .dark & {
    color: #e5e7eb; /* gray-200 */
  }
`;

const PanelControls = styled.div`
  display: flex;
  gap: 8px;
`;

interface LiveDotProps {
  $live?: boolean;
}

const LiveDot = styled.div<LiveDotProps>`
  width: 8px;
  height: 8px;
  background: ${({ $live }) => $live ? '#10b981' : '#ef4444'};
  border-radius: 50%;
  animation: ${({ $live }) => $live ? 'pulse 1s infinite' : 'none'};
`;

const ControlGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 11px;
  color: #6b7280; /* gray-500 */
  margin-bottom: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  .dark & {
    color: #9ca3af; /* gray-400 */
  }
`;

const SliderWrapper = styled.div`
  position: relative;
`;

const Slider = styled.input`
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  outline: none;
  appearance: none;
  
  .dark & {
    background: #4b5563;
  }
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #9333ea; /* purple-600 */
    cursor: pointer;
    border: 2px solid #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    transition: all 0.2s;
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 0 0 4px rgba(147, 51, 234, 0.2);
    }
  }
`;

const Value = styled.span`
  position: absolute;
  right: 0;
  top: -24px;
  font-size: 12px;
  color: #9333ea; /* purple-600 */
  font-weight: 600;
  font-family: 'Roboto Mono', monospace;
  
  .dark & {
    color: #a855f7; /* purple-500 */
  }
`;

interface PresetButtonProps {
  selected?: boolean;
}

const PresetButton = styled.button<PresetButtonProps>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 8px;
  background: ${({ selected }) => selected ? '#9333ea' : '#f3f4f6'};
  border: 1px solid ${({ selected }) => selected ? '#9333ea' : '#e5e7eb'};
  border-radius: 8px;
  color: ${({ selected }) => selected ? '#fff' : '#4b5563'};
  cursor: pointer;
  transition: all 0.2s;
  
  .dark & {
    background: ${({ selected }) => selected ? '#9333ea' : '#374151'};
    border-color: ${({ selected }) => selected ? '#9333ea' : '#4b5563'};
    color: ${({ selected }) => selected ? '#fff' : '#d1d5db'};
  }
  
  &:hover {
    background: ${({ selected }) => selected ? '#7e22ce' : '#e5e7eb'};
    .dark & {
      background: ${({ selected }) => selected ? '#7e22ce' : '#4b5563'};
    }
    transform: translateX(2px);
  }
`;

const PresetInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const PresetName = styled.span`
  font-weight: 600;
  font-size: 13px;
`;

const PresetDescription = styled.span`
  font-size: 11px;
  opacity: 0.8;
  margin-top: 2px;
`;

const VideoFeed = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  margin-bottom: 16px;
  background: #000;
`;

const HostImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const OverlayGradient = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

interface VideoControlButtonProps {
  primary?: boolean;
}

const VideoControlButton = styled.button<VideoControlButtonProps>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: ${({ primary }) => primary ? '#10b981' : '#f3f4f6'};
  border: 1px solid ${({ primary }) => primary ? '#10b981' : '#e5e7eb'};
  border-radius: 8px;
  color: ${({ primary }) => primary ? '#fff' : '#4b5563'};
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  
  .dark & {
    background: ${({ primary }) => primary ? '#10b981' : '#374151'};
    border-color: ${({ primary }) => primary ? '#10b981' : '#4b5563'};
    color: ${({ primary }) => primary ? '#fff' : '#d1d5db'};
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const MixerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr) 70px 40px;
  gap: 6px;
  height: auto;
`;

const Channel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MasterChannel = styled(Channel)`
  grid-column: 8;
`;

const MasterMeter = styled.div`
  grid-column: 9;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ChannelLabel = styled.div`
  font-size: 10px;
  color: #6b7280;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  .dark & {
    color: #9ca3af;
  }
`;

const ChannelSelect = styled.select`
  width: 100%;
  padding: 4px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  color: #1f2937;
  font-size: 10px;
  margin-bottom: 8px;
  cursor: pointer;
  
  .dark & {
    background: #374151;
    border-color: #4b5563;
    color: #f3f4f6;
  }
  
  &:focus {
    outline: none;
    border-color: #7c3aed;
  }
`;

interface MeterBarProps {
  level: number;
}

const MeterBar = styled.div<MeterBarProps>`
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
  position: relative;
  
  .dark & {
    background: #4b5563;
  }
`;

const MeterFill = styled.div<MeterBarProps>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: ${({ level }) => level * 100}%;
  background: linear-gradient(to top, #10b981, #f59e0b, #ef4444);
  transition: height 0.1s;
`;

const FaderWrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 0;
`;

const Fader = styled.input`
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 3px;
  outline: none;
  appearance: none;
  cursor: pointer;

  .dark & {
    background: #4b5563;
  }

  &::-webkit-slider-thumb {
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #9333ea;
    cursor: pointer;
    border: 2px solid #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
`;

const FaderValue = styled.span`
  font-size: 10px;
  color: #9333ea;
  font-weight: 600;
  margin-top: 8px;
  font-family: 'Roboto Mono', monospace;
  
  .dark & {
    color: #a855f7;
  }
`;

const ChannelControls = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 8px;
`;

const SmallButton = styled.button`
  width: 20px;
  height: 20px;
  background: #e5e7eb;
  border: none;
  border-radius: 4px;
  color: #4b5563;
  font-size: 9px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  
  .dark & {
    background: #374151;
    color: #d1d5db;
  }
  
  &:hover {
    background: #d1d5db;
    .dark & {
      background: #4b5563;
    }
  }
  
  &:first-child {
    background: #d1fae5;
    color: #059669;
    
    .dark & {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
    }
    
    &:hover {
      background: #a7f3d0;
      .dark & {
        background: rgba(16, 185, 129, 0.3);
      }
    }
  }
`;

interface VUProps {
  level: number;
}

const VUMeter = styled.div`
  width: 16px;
  height: 120px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  margin-top: 8px;
  
  .dark & {
    background: #374151;
  }
`;

const VULeft = styled.div<VUProps>`
  position: absolute;
  left: 1px;
  bottom: 0;
  width: 6px;
  height: ${({ level }) => level * 100}%;
  background: linear-gradient(to top, #10b981, #f59e0b);
  transition: height 0.1s;
`;

const VURight = styled.div<VUProps>`
  position: absolute;
  right: 1px;
  bottom: 0;
  width: 6px;
  height: ${({ level }) => level * 80}%;
  background: linear-gradient(to top, #10b981, #f59e0b);
  transition: height 0.1s;
`;

const MeterScale = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 8px;
  color: #9ca3af;
  margin-top: 4px;
  height: 120px;
  justify-content: space-between;
  padding: 8px 0;
`;

const JingleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
`;

interface JingleButtonProps {
  $colorIndex?: number;
  $more?: boolean;
}

const JingleButton = styled.button<JingleButtonProps>`
  padding: 10px;
  background: ${({ $more, $colorIndex }) => {
    if ($more) return '#e5e7eb';
    // Using Tailwind-like palette
    const colors = ['#9333ea', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];
    return colors[$colorIndex! % colors.length];
  }};
  border: none;
  border-radius: 8px;
  color: ${({ $more }) => $more ? '#4b5563' : '#fff'};
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  .dark & {
    background: ${({ $more, $colorIndex }) => {
      if ($more) return '#374151';
      // Same colors for dark mode, they pop well
      const colors = ['#9333ea', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];
      return colors[$colorIndex! % colors.length];
    }};
    color: ${({ $more }) => $more ? '#d1d5db' : '#fff'};
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const SubTitle = styled(PanelTitle)`
  font-size: 12px;
  margin-bottom: 12px;
  opacity: 0.8;
`;

const SelectWrapper = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 32px 10px 12px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #1f2937;
  font-size: 13px;
  cursor: pointer;
  appearance: none;
  
  .dark & {
    background: #374151;
    border-color: #4b5563;
    color: #f3f4f6;
  }
  
  &:focus {
    outline: none;
    border-color: #7c3aed;
  }
`;

const ScriptArea = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 12px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #1f2937;
  font-size: 14px;
  resize: none;
  font-family: 'Inter', sans-serif;
  
  .dark & {
    background: #374151;
    border-color: #4b5563;
    color: #f3f4f6;
  }
  
  &:focus {
    outline: none;
    border-color: #10b981;
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 10px 10px 36px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #1f2937;
  font-size: 13px;
  
  .dark & {
    background: #374151;
    border-color: #4b5563;
    color: #f3f4f6;
  }
  
  &:focus {
    outline: none;
    border-color: #7c3aed;
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

interface LibraryButtonProps {
  $active?: boolean;
}

const LibraryButton = styled.button<LibraryButtonProps>`
  flex: 1;
  padding: 8px;
  background: ${({ $active }) => $active ? '#7c3aed' : '#f3f4f6'};
  border: none;
  border-radius: 6px;
  color: ${({ $active }) => $active ? '#fff' : '#4b5563'};
  font-size: 12px;
  font-weight: ${({ $active }) => $active ? '600' : '400'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  .dark & {
    background: ${({ $active }) => $active ? '#7c3aed' : '#374151'};
    color: ${({ $active }) => $active ? '#fff' : '#d1d5db'};
  }
  
  &:hover {
    background: ${({ $active }) => $active ? '#6d28d9' : '#e5e7eb'};
    .dark & {
      background: ${({ $active }) => $active ? '#6d28d9' : '#4b5563'};
    }
  }
`;

const MediaItem = styled.button<MediaItemProps>`
  padding: 12px 8px;
  background: ${({ $color }) => $color};
  border: none;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const ItemLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  margin-top: 4px;
`;

const SegmentInput = styled.input`
  flex: 1;
  padding: 10px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #1f2937;
  font-size: 13px;
  
  .dark & {
    background: #374151;
    border-color: #4b5563;
    color: #f3f4f6;
  }
  
  &:focus {
    outline: none;
    border-color: #10b981;
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const SendButton = styled.button`
  padding: 10px 16px;
  background: #7c3aed;
  border: none;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #6d28d9;
    transform: translateY(-1px);
  }
`;

const SegmentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: #f3f4f6;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: grab;
  transition: all 0.2s;
  
  .dark & {
    background: #374151;
  }
  
  &:hover {
    background: #e5e7eb;
    .dark & {
      background: #4b5563;
    }
    transform: translateX(4px);
  }
`;

const DragHandle = styled.span`
  color: #9ca3af;
  font-size: 14px;
  cursor: grab;
`;

const SegmentText = styled.span`
  flex: 1;
  font-size: 13px;
  color: #1f2937;
  
  .dark & {
    color: #f3f4f6;
  }
`;

const BottomBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  
  .dark & {
    background: #111827;
    border-top-color: #374151;
  }
`;

const AdvancedRecording = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const LiveStatus = styled.div<LiveStatusProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ $live }) => $live ? '#10b981' : '#ef4444'};
`;

const TransportControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const TransportButton = styled.button`
  width: 36px;
  height: 36px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #4b5563;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s;
  
  .dark & {
    background: #374151;
    border-color: #4b5563;
    color: #d1d5db;
  }
  
  &:hover {
    background: #e5e7eb;
    .dark & {
      background: #4b5563;
    }
    transform: translateY(-2px);
  }
`;

const RecordButtonBig = styled.button<RecordButtonBigProps>`
  width: 50px;
  height: 50px;
  background: ${({ $recording }) => $recording ? 'linear-gradient(135deg, #ef4444, #b91c1c)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)'};
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.2s;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 10px 15px rgba(0,0,0,0.2);
  }
  
  animation: ${({ $recording }) => $recording ? 'pulse 1s infinite' : 'none'};
`;

const UtilityButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const UtilityButton = styled(TransportButton)`
  width: 36px;
  height: 36px;
`;

const Button = styled.button<{ fullWidth?: boolean }>`
  background: #7c3aed;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  gap: 8px;
  transition: all 0.2s;
  
  &:hover {
    background: #6d28d9;
    transform: translateY(-1px);
  }
`;

const TeleprompterOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: black;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

const TeleprompterContent = styled.div`
  flex: 1;
  padding: 0 10%;
  overflow-y: scroll;
  scroll-behavior: smooth;
  
  /* Hide scrollbar */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const TeleprompterText = styled.div`
  color: white;
  text-align: center;
  font-family: sans-serif;
  padding-top: 45vh; /* Start text in middle */
  transform: scaleX(-1); /* Mirror effect option could go here, but standard is normal */
  transform: none; 
`;

const TeleprompterControls = styled.div`
  height: 80px;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  border-top: 1px solid #333;
`;

const ReadingGuide = styled.div`
  position: absolute;
  top: 45%;
  left: 5%;
  right: 5%;
  height: 10%;
  border-top: 2px solid rgba(255, 0, 0, 0.5);
  border-bottom: 2px solid rgba(255, 0, 0, 0.5);
  background: rgba(255, 255, 255, 0.05);
  pointer-events: none;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  width: 400px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  .dark & {
    background: #1f2937;
    border-color: #374151;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  color: #111827;
  
  .dark & {
    color: #f3f4f6;
  }
`;

const IconButton = styled.button<{ $small?: boolean }>`
  background: transparent;
  color: #6b7280;
  border: none;
  padding: ${({ $small }) => $small ? '6px' : '8px'};
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  .dark & {
    color: #9ca3af;
  }
  
  &:hover {
    background: rgba(0,0,0,0.05);
    color: #111827;
    
    .dark & {
      background: rgba(255,255,255,0.1);
      color: #f3f4f6;
    }
  }
`;
