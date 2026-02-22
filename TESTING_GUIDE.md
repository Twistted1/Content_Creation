# 🧪 ContentFlow Testing Guide (Commercial Readiness)

This guide is designed to help you efficiently validate the entire **ContentFlow** platform. As we prepare for "Go Live," this checklist ensures every commercial and functional aspect is working as expected.

## 🛠️ Phase 1: Environment Setup (Cost-Free Testing)
To test without incurring API costs (OpenAI/ElevenLabs), we have two options:

### Option A: Local AI Mode (Recommended for privacy/free)
1.  Go to **Settings** (click your avatar -> Settings).
2.  Scroll to **AI Services**.
3.  Enable **"Use Local AI (Ollama & SD)"**.
    *   *Note: This requires you to have Ollama running locally. If not, the app will fail to generate content.*

### Option B: Bring Your Own Key (BYOK) - **NEW**
1.  Go to **Settings**.
2.  Under **AI Services**, enter your **Google Gemini API Key** (and OpenAI/ElevenLabs if you have them).
3.  Click **Save Settings**.
    *   *Note: Keys are stored securely in your browser's local storage and are never sent to our servers.*

### Option C: Mock/Simulation Mode
If you don't have Local AI or API keys, the app has built-in fallbacks:
*   **Idea Generation**: Will return mock topics if the API fails.
*   **Voiceover**: Will simulate a successful generation if no key is present.
*   **Payments**: All Stripe interactions are currently simulated (Sandbox mode).

---

## 🚀 Phase 2: End-to-End Workflow Test (The "All-In-One" Loop)
Perform this loop to validate the core product value.

### 1. Idea Generation
*   [ ] Navigate to **Ideas**.
*   [ ] Enter a topic (e.g., "AI Trends 2024").
*   [ ] Click **Generate Ideas**.
*   [ ] **Verify**: 3 cards appear with titles and viral scores.
*   [ ] Click **"Generate Script"** on one card.
*   [ ] **Verify**: You are redirected to the Script page with the title pre-filled.

### 2. Script Writing
*   [ ] On the **Script** page, verify the title is there.
*   [ ] Select a template (e.g., "Educational").
*   [ ] Click **"Generate Script"**.
*   [ ] **Verify**: The text area fills with a structured script (Hook, Body, CTA).
*   [ ] Make a manual edit (type something).

### 3. Video Production (NEW)
*   [ ] Navigate to **Production**.
*   [ ] **Voice Over Tab**: Paste a sentence from your script and click **Play**.
    *   [ ] *Action*: Click **"Add to Editor Timeline"** when audio is generated.
*   [ ] **Image Gen Tab**: Enter a prompt and click **Generate**.
    *   [ ] *Action*: Click **"Add to Timeline"** on the generated image.
*   [ ] **Editor Tab**:
    *   [ ] **Verify**: You see the Timeline with your Image (Video Track) and Voice (Audio Track).
    *   [ ] Click **Play** on the Preview Player to watch your composition.
    *   [ ] Click **"Export & Schedule"**.
*   [ ] **Verify**: You are redirected to the **Publish** page.

### 4. Publishing & Distribution
*   [ ] On the **Publish** page, check the "Upcoming Summary" or Calendar.
*   [ ] **Verify**: Your "New Video Project" appears as a "Scheduled" post.
*   [ ] (Optional) Click "Schedule Post" manually to add another item.

### 5. Analytics & Performance
*   [ ] Navigate to **Analytics**.
*   [ ] **Verify**: The "Total Posts" count has increased based on your activities.
*   [ ] Check the "Daily Activity" chart to see your contribution for today.

---

## 💼 Phase 3: Commercial Polish Verification

### 1. Landing Page
*   [ ] Log out (Avatar -> Sign Out).
*   [ ] **Verify**: You see the "YOUR ALL-IN-ONE SOLUTION" Landing Page.
*   [ ] Click "Get Started" -> Verify it goes to Signup.

### 2. Monetization & Pricing
*   [ ] Log in (use `demo@contentflow.com` / `demo123`).
*   [ ] Navigate to **Monetization** (under "More" menu).
*   [ ] **Verify**: You can simulate plan upgrades and adjust usage assumptions (KPI Sandbox).
*   [ ] Navigate to **Pricing** and test the "Upgrade" simulation.

### 3. Legal Compliance
*   [ ] Scroll to the **Footer**.
*   [ ] Click **Privacy Policy**.
*   [ ] **Verify**: The policy page loads correctly.
*   [ ] Click **Terms of Service**.
*   [ ] **Verify**: The terms page loads correctly.

---

## 🐞 Troubleshooting
*   **Webcam/Mic Errors**: Ensure you have granted browser permissions. If testing on a server without devices, the app will fallback to "Avatar Mode" automatically.
*   **"Network Error"**: This usually means an API Key is missing or invalid in Settings.
*   **Login Issues**: Use the **Demo Account** (`demo@contentflow.com`) for a guaranteed entry.

---

**Status**: ✅ Ready for Commercial User Acceptance Testing (UAT).
