# ContentFlow Pro Audit Report

## 1. Build and Type Errors
- **TypeScript compilation fails**:
  - `src/pages/Production.tsx`: `ProductionSessionData` interface lacks `imageStyle` and `imageSize` properties.
  - `src/pages/Publish.tsx`: `handleSchedulePost` is passed directly to an `onClick` event in `Publish.tsx` but its signature accepts `day?: number`, causing an incompatible type `MouseEvent`.
- **ESLint Errors/Warnings**: 133 errors and 12 warnings across the codebase.
  - Multiple components (`Login`, `Production`, `Publish`, `Teleprompter`, etc.) have "Unexpected any" usage (`@typescript-eslint/no-explicit-any`).
  - Several unused variables (`@typescript-eslint/no-unused-vars`) in `Podcast.tsx`, `Production.tsx`, `Publish.tsx`, `Script.tsx`, etc.
  - Missing dependencies in `useEffect` hooks in `Production.tsx`, `Profile.tsx`, `Teleprompter.tsx`, `Monetization.tsx`.
- **Test Errors**:
  - `App.test.tsx` fails because testing paths like `@/pages/Ideas` aren't resolved in Vitest without `vite-tsconfig-paths` loaded correctly, which means `vitest.config.ts` lacks the plugin.
  - After fixing `vitest.config.ts`, testing with a mock config surfaces an `auth/invalid-api-key` Firebase error.
  - After fixing the Firebase key error by mocking `firebase`, an error where `<Router>` is inside another `<Router>` surfaces in `App.test.tsx`.

## 2. Missing Features and UI Inconsistencies
- Many pages and features indicated in `ROADMAP.md` and `TESTING_GUIDE.md` may have "Mock Mode" functionalities that need better UX fallbacks or clearer error states (e.g. AI fallback features, mock simulation modes).
- Mobile responsiveness on advanced pages (e.g., `Production.tsx` complex layouts, Editor view with canvas/timeline) needs verification as noted in phase 3 of `ROADMAP.md`.
- `Profile.tsx` lacks complete implementation for avatar upload to a real storage and syncing across the app in edge cases.
- Missing AI Service API bindings: `Production Studio` uses simulated results when ElevenLabs/OpenAI APIs are not present.

## Suggested Fixes (Page-by-page plan)

### **A. Core Build and Config Fixes**
1. **`src/hooks/useProductionSession.ts`**: Add `imageStyle?: string` and `imageSize?: string` to `ProductionSessionData`.
2. **`src/pages/Publish.tsx`**: Update click handler `onClick={() => handleSchedulePost()}` instead of `onClick={handleSchedulePost}` where the button passes `MouseEvent`.
3. **`vitest.config.ts`**: Add `tsconfigPaths()` from `vite-tsconfig-paths`.
4. **`src/test/setup.ts`**: Add `vi.mock('firebase/auth', ...)` to mock `getAuth`, `onAuthStateChanged`, and others to run tests without a real API Key. Update `src/App.test.tsx` to just `<App />` to fix nested routers.

### **B. ESLint & Clean Up**
5. Go through `src/pages/` and `src/services/` to replace `any` types with explicit definitions (e.g., in `Production.tsx`, `Publish.tsx`).
6. Remove unused variables (`setGeneratedAudioUrl`, `previewVideoRef`, etc.).
7. Add missing dependencies to `useEffect` hooks (e.g. `recalcKPIs` in `Monetization.tsx`, `selectedVoice` in `Production.tsx`).

### **C. Feature Completion**
8. Check and confirm Firebase storage rules limit files properly and hook up the actual API services per the Roadmap phase 2 for Production Studio.
