# 🚀 ContentFlow Pro

**ContentFlow Pro** is an AI-powered content automation platform that helps creators generate ideas, write scripts, and produce videos in minutes.

---

## 🌟 Key Features
-   **AI Idea Generator**: Get viral content ideas tailored to your niche.
-   **Script Writer**: Generate structured scripts (Hook, Body, CTA) instantly.
-   **Video Production**: Create videos with AI voiceovers and images.
-   **Analytics**: Track your content performance across platforms.
-   **Monetization**: Integrated Stripe payments for subscription plans.

---

## 🛠️ Tech Stack
-   **Frontend**: React (Vite), TypeScript, Tailwind CSS
-   **Backend**: Firebase (Functions, Firestore, Storage, Auth, Hosting)
-   **Payments**: Stripe
-   **AI**: Google Gemini, OpenAI, ElevenLabs

---

## 🚀 Getting Started

### Prerequisites
-   Node.js (v20+)
-   Firebase CLI (`npm install -g firebase-tools`)
-   Stripe Account (for payments)

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/contentflow-pro.git
    cd contentflow-pro
    ```
2.  Install dependencies:
    ```bash
    npm install
    cd functions && npm install && cd ..
    ```
3.  Set up environment variables:
    -   Copy `.env.example` to `.env.local`
    -   Fill in your Firebase, Google, and AI API keys.

### Development
Start the local development server:
```bash
npm run dev
```

### Testing
Run the automated test suite:
```bash
npm run test
```

---

## 📦 Deployment

This project is configured for **Firebase Hosting**.

1.  **Build the project**:
    ```bash
    npm run build
    ```
2.  **Deploy to Firebase**:
    ```bash
    firebase deploy
    ```

**Note**: Ensure you have set your production secrets (e.g., Stripe key) using:
```bash
firebase functions:config:set stripe.secret="sk_live_..."
```

---

## 🗄️ Database Seeding

To initialize the database with product plans (Basic/Pro):
1.  Generate a Service Account Key from Firebase Console > Project Settings > Service Accounts.
2.  Save it as `scripts/service-account.json`.
3.  Run the seed script:
    ```bash
    node scripts/seed_products.js
    ```

---

## 📄 License
This project is licensed under the MIT License.
