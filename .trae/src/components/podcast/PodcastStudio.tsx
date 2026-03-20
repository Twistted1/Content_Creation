import { AudioMixer } from "./modules/AudioMixer";
import { BottomBar } from "./modules/BottomBar";
import { Header } from "./modules/Header";
import { MainScreen } from "./modules/MainScreen";
import { SidebarLeft } from "./modules/SidebarLeft";
import { SidebarRight } from "./modules/SidebarRight";
import { StudioProvider } from "./StudioContext";

export function PodcastStudio() {
  return (
    <StudioProvider>
      <div className="flex h-screen w-screen flex-col bg-[#05060A] text-slate-100 overflow-hidden font-sans select-none">
        <Header />
        
        <main className="flex min-h-0 flex-1 gap-3 p-3">
          <SidebarLeft />
          
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex min-h-0 flex-1 flex-col">
              <MainScreen />
            </div>
            <div className="shrink-0 h-[170px]">
              <AudioMixer />
            </div>
            <div className="shrink-0">
              <BottomBar />
            </div>
          </div>
          
          <SidebarRight />
        </main>
      </div>
    </StudioProvider>
  );
}
