# Project Analysis & Pre-Launch Action Plan

## 1. Project Overview
**Status:** MVP (Minimum Viable Product)
**Tech Stack:** React (Vite), TypeScript, Firebase (Auth, Firestore, Storage), Tailwind CSS.
**Core Features:**
- Authentication (Firebase)
- Idea Generation (Gemini/Ollama)
- Script Writing (Gemini/Ollama)
- Voiceover (ElevenLabs/Browser TTS)
- Podcast Studio (Visualizer implemented, Recording logic partial)
- Analytics (UI ready, Service ready, but connection is weak)

## 2. Critical Findings (Blockers)

### 🚨 Security Risks
- **API Keys:** Sensitive keys are managed via `localStorage` in some services (`aiService.ts`), which is insecure.
- **Protected Routes:** The `App.tsx` has `ProtectedRoute` commented out, meaning all internal pages are publicly accessible.
- **Environment Variables:** `.env.example` exists, but we need to ensure `.env.local` is properly populated and used exclusively.

### 💥 Stability & Integrity
- **Missing Logic:** The `Podcast.tsx` file has a placeholder `// ... (keep saveRecording)` but the function `saveRecording` is **undefined**. Clicking "Save" will fail.
- **Mock Data:** `Analytics.tsx` fetches real data but then overwrites it with mock/random data (e.g., `refreshData` function). It ignores the real `analyticsService` data for the charts.
- **Error Handling:** No global `ErrorBoundary` is implemented to catch app crashes.

## 3. Action Plan (Prioritized)

### Phase 1: Security Hardening (Immediate)
- [ ] **Enable Protected Routes:** Uncomment the `ProtectedRoute` wrapper in `App.tsx`.
- [ ] **Audit Environment Variables:** Ensure all API keys are loaded from `import.meta.env` and remove `localStorage` fallbacks for keys if possible.

### Phase 2: Feature Completion
- [ ] **Implement `saveRecording`:** Write the logic in `Podcast.tsx` to upload the recorded Blob to Firebase Storage and save the reference to Firestore.
- [ ] **Fix Analytics:** Refactor `Analytics.tsx` to use *only* real data from `analyticsService`. Remove random mock data generators.

### Phase 3: Stability
- [ ] **Global Error Boundary:** Create and implement an `ErrorBoundary` component wrapping the `App`.

## 4. Next Steps
I will begin by creating a Todo list to track these tasks and then start with **Phase 1: Security Hardening**.
