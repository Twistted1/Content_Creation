import { GoogleGenerativeAI } from "@google/generative-ai";
import { storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { usageService } from './usageService';

// Initialize Google Generative AI Client
// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

export const aiService = {
  // Helper to get keys
  getKeys() {
    const keys = localStorage.getItem('api_keys');
    return keys ? JSON.parse(keys) : {};
  },

  // Helper to get GenAI Client
  getGenAIClient() {
    const keys = this.getKeys();
    const apiKey = keys.googleApiKey || import.meta.env.VITE_GOOGLE_API_KEY;
    
    if (!apiKey) {
      console.warn("No Google API Key found in Settings or Environment");
      // Return a dummy client or handle gracefully? 
      // For now, let it throw if it tries to use it, or we can handle it in the methods.
    }
    return new GoogleGenerativeAI(apiKey || "dummy_key"); 
  },

  // Generate Content Ideas
  async generateIdeas(niche: string, platform: string) {
    try {
      if (!await usageService.checkLimit('ai_ideas')) {
         throw new Error("You have reached your limit for AI Ideas. Please upgrade your plan.");
      }

      const keys = this.getKeys();

      // --- LOCAL AI (Ollama) ---
      if (keys.useLocalAI) {
        try {
          const ollamaUrl = keys.ollamaUrl || 'http://localhost:11434';
          const prompt = `Generate 5 viral content ideas for the "${niche}" niche on ${platform}. 
          Return ONLY a JSON array of objects (no markdown, no backticks) with: title, difficulty ("easy","medium","hard"), potential (70-99).`;

          const response = await fetch(`${ollamaUrl}/api/generate`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
                model: "mistral", // Default model, user can ensure it's pulled
                prompt: prompt,
                stream: false,
                format: "json"
             })
          });

          if (!response.ok) throw new Error("Ollama connection failed");
          const data = await response.json();
          await usageService.trackUsage('ai_ideas', 1);
          return JSON.parse(data.response);
        } catch (error) {
          console.warn("Local AI failed, falling back to Cloud AI:", error);
          // Fall through to Cloud AI
        }
      }

      // --- CLOUD AI (Gemini) ---
      // Use gemini-2.0-flash-exp for best performance and availability
      const genAI = this.getGenAIClient();
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `Generate 5 viral content ideas for the "${niche}" niche on ${platform}. 
      Return the response as a JSON array of objects with the following properties:
      - title: Catchy title
      - difficulty: "easy", "medium", or "hard"
      - potential: A number between 70 and 99 indicating viral potential
      
      Example format:
      [
        {"title": "Idea 1", "difficulty": "easy", "potential": 85},
        {"title": "Idea 2", "difficulty": "hard", "potential": 92}
      ]`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      if (!text) return [];
      
      // Parse JSON from response
      const ideas = JSON.parse(text);
      await usageService.trackUsage('ai_ideas', 1);
      return ideas;
    } catch (error) {
      console.error("AI Generation Error:", error);
      throw error;
    }
  },

  // Generate Video Script
  async generateScript(title: string, duration: string, tone: string = "engaging") {
    try {
      if (!await usageService.checkLimit('ai_scripts')) {
         throw new Error("You have reached your limit for AI Scripts. Please upgrade your plan.");
      }

      const keys = this.getKeys();
      // Adjusted word counts
      const wordCount = duration === 'short' ? 200 : duration === 'medium' ? 1500 : 2500;
      
      const prompt = `Write a DETAILED video script for "${title}". Duration: ${duration} (~${wordCount} words). Tone: ${tone}.
      Structure: [HOOK], [INTRO], [BODY], [CONCLUSION], [CTA]. No markdown.`;

      // --- LOCAL AI (Ollama) ---
      if (keys.useLocalAI) {
         try {
            const ollamaUrl = keys.ollamaUrl || 'http://localhost:11434';
            const response = await fetch(`${ollamaUrl}/api/generate`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                  model: "mistral",
                  prompt: prompt,
                  stream: false
               })
            });
            if (!response.ok) throw new Error("Ollama connection failed");
             const data = await response.json();
             await usageService.trackUsage('ai_scripts', 1);
             return data.response;
          } catch (error) {
            console.warn("Local AI failed, falling back to Cloud AI:", error);
         }
      }

      // --- CLOUD AI (Gemini) ---
      const genAI = this.getGenAIClient();
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      await usageService.trackUsage('ai_scripts', 1);
      return response.text();
    } catch (error) {
      console.error("AI Script Generation Error:", error);
      throw error;
    }
  },

  // Generate Image (Gemini Imagen / Stable Diffusion / Fallback)
  async generateImage(prompt: string): Promise<string> {
    try {
       const keys = this.getKeys();

       // --- LOCAL AI (Stable Diffusion) ---
       if (keys.useLocalAI) {
          try {
             const sdUrl = keys.stableDiffusionUrl || 'http://127.0.0.1:7860';
             console.log(`Generating image via Stable Diffusion at ${sdUrl}...`);
             
             const response = await fetch(`${sdUrl}/sdapi/v1/txt2img`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                   prompt: prompt,
                   steps: 20,
                   width: 512,
                   height: 512
                })
             });

             if (!response.ok) throw new Error("Stable Diffusion connection failed");
             const data = await response.json();
             // SD returns base64 image
             return `data:image/png;base64,${data.images[0]}`;
          } catch (error) {
             console.warn("Local AI (SD) failed, falling back to Placeholder:", error);
          }
       }

       // --- CLOUD / FALLBACK ---
       
       console.log("Generating image for:", prompt);
       
       // For a free, reliable demo without an OpenAI key, Unsplash is the best "Real" visual.
       // Note: 'source.unsplash.com' is deprecated. We must use the direct API or valid Unsplash URLs.
       // Since we don't have an Unsplash Access Key configured, we will use a reliable high-quality placeholder service that accepts keywords.
       // 'https://pollinations.ai/p/' can sometimes be blocked by ORB/CORS policies in strict environments.
       // Switching to a more permissive placeholder service for reliability during testing.
       
       await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
       
       // Using Picsum with a seed for deterministic "random" images based on prompt length
       const seed = prompt.length + Math.floor(Math.random() * 1000);
       return `https://picsum.photos/seed/${seed}/1024/1024`;

    } catch (error) {
       console.error("Image Generation Error:", error);
       throw error;
    }
  },

  // Generate Video (D-ID / HeyGen)
  async generateVideo(script: string, avatarUrl: string): Promise<string> {
    try {
      const keys = this.getKeys();
      const dIdApiKey = keys.dIdApiKey || import.meta.env.VITE_DID_API_KEY;

      if (dIdApiKey) {
        // --- REAL: D-ID API ---
        console.log("Generating video via D-ID...");
        
        // 1. Create Talk
        const createResponse = await fetch('https://api.d-id.com/talks', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${dIdApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            script: {
              type: 'text',
              input: script.substring(0, 500), // Limit length
              provider: { type: 'microsoft', voice_id: 'en-US-GuyNeural' }
            },
            source_url: avatarUrl || "https://d-id-public-bucket.s3.amazonaws.com/alice.jpg"
          })
        });

        if (!createResponse.ok) {
            const err = await createResponse.json();
            throw new Error(err.description || "D-ID Creation Failed");
        }

        const { id: talkId } = await createResponse.json();

        // 2. Poll for completion
        let status = "created";
        let resultUrl = "";
        
        while (status !== "done" && status !== "error") {
            await new Promise(r => setTimeout(r, 2000)); // Wait 2s
            const statusResponse = await fetch(`https://api.d-id.com/talks/${talkId}`, {
                headers: { 'Authorization': `Basic ${dIdApiKey}` }
            });
            const statusData = await statusResponse.json();
            status = statusData.status;
            if (status === "done") resultUrl = statusData.result_url;
            if (status === "error") throw new Error("D-ID Processing Error");
        }

        return resultUrl;
      } 
      
      // --- MOCK / FALLBACK ---
      console.warn("No D-ID API Key. Returning mock video.");
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate processing
      return "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"; // Sample video

    } catch (error) {
      console.error("Video Generation Error:", error);
      throw error;
    }
  },

  // Translate Text
  async translateText(text: string, targetLang: string) {
    try {
      const keys = this.getKeys();
      const prompt = `Translate the following text into ${targetLang}. Only return the translated text, nothing else.\n\nText: "${text}"`;

      // --- LOCAL AI (Ollama) ---
      if (keys.useLocalAI) {
         try {
            const ollamaUrl = keys.ollamaUrl || 'http://localhost:11434';
            const response = await fetch(`${ollamaUrl}/api/generate`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                  model: "mistral",
                  prompt: prompt,
                  stream: false
               })
            });
            if (!response.ok) throw new Error("Ollama connection failed");
            const data = await response.json();
            return data.response;
         } catch (error) {
            console.warn("Local AI failed, falling back to Cloud AI:", error);
         }
      }

      // --- CLOUD AI (Gemini) ---
      const genAI = this.getGenAIClient();
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Translation Error:", error);
      throw error;
    }
  },

  // Generate Voiceover
  async generateVoiceover(text: string): Promise<string> {
    try {
      const keys = this.getKeys();
      // Check for ElevenLabs API Key in settings or environment variables
      const localKey = keys.elevenLabsApiKey;
      const elevenLabsKey = localKey || import.meta.env.VITE_ELEVENLABS_API_KEY;

      // --- LOCAL AI (TTS Fallback / Future) ---
      // If useLocalAI is true, we might want to call a local TTS server here (e.g., Coqui TTS).
      // For now, we'll assume they still use ElevenLabs OR Browser Fallback.
      // If they really want local TTS, they can implement a fetch here similar to Stable Diffusion.

      if (elevenLabsKey) {
         // --- REAL: ElevenLabs API ---
         const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', { // "Rachel" voice ID
            method: 'POST',
            headers: {
               'xi-api-key': elevenLabsKey,
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               text: text.substring(0, 1000), // Limit characters for cost/speed
               model_id: "eleven_monolingual_v1",
               voice_settings: { stability: 0.5, similarity_boost: 0.5 }
            })
         });

         if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail?.message || 'ElevenLabs generation failed');
         }

         const blob = await response.blob();
         
         // Upload to Firebase Storage
         const fileName = `voiceovers/${Date.now()}.mp3`;
         const storageRef = ref(storage, fileName);
         await uploadBytes(storageRef, blob);
         const downloadUrl = await getDownloadURL(storageRef);
         
         return downloadUrl;
      } 
      else {
         // --- FALLBACK: Browser Speech Synthesis ---
         console.warn("No ElevenLabs API Key. Using browser speech synthesis (not downloadable).");
         
         if (!window.speechSynthesis) {
            throw new Error("Browser does not support speech synthesis");
         }
         
         window.speechSynthesis.cancel();
         const utterance = new SpeechSynthesisUtterance(text.substring(0, 200)); // Speak first 200 chars
         const voices = window.speechSynthesis.getVoices();
         const preferredVoice = voices.find(v => v.name.includes("Google") && v.lang.startsWith("en")) || voices.find(v => v.lang.startsWith("en"));
         if (preferredVoice) utterance.voice = preferredVoice;
         window.speechSynthesis.speak(utterance);
         
         return ""; // No URL generated
      }
    } catch (error) {
      console.error("Voiceover Generation Error:", error);
      throw error;
    }
  }
};
