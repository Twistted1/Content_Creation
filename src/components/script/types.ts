export type Platform = 'YouTube' | 'Podcast' | 'Instagram' | 'TikTok' | 'LinkedIn' | 'Blog';
export type Tone = 'Conversational' | 'Professional' | 'Energetic' | 'Educational' | 'Storytelling';

export interface SectionData {
  id: string;
  type: 'HOOK' | 'INTRO' | 'MAIN' | 'CTA' | 'OUTRO';
  title: string;
  content: string;
  wordCount: number;
  duration: number; // in seconds
  status: 'completed' | 'in-progress' | 'pending';
  colorClass: string;
  icon: string;
}

export const INITIAL_SECTIONS: SectionData[] = [
  {
    id: 'hook',
    type: 'HOOK',
    title: 'Hook',
    content: "What if I told you that everything you knew about content creation was wrong? In the next 5 minutes...",
    wordCount: 26,
    duration: 10,
    status: 'completed',
    colorClass: 'bg-pink-500 text-pink-500',
    icon: 'fa-bolt'
  },
  {
    id: 'intro',
    type: 'INTRO',
    title: 'Introduction',
    content: "Hey everyone, welcome back to the channel. I'm [Your Name] and today we're diving...",
    wordCount: 16,
    duration: 6,
    status: 'completed',
    colorClass: 'bg-blue-500 text-blue-500',
    icon: 'fa-play'
  },
  {
    id: 'main',
    type: 'MAIN',
    title: 'Core Content',
    content: "Let's break this down into three key areas:\n\n1. Understanding the fundamentals...\n\n2. Applying the strategy...\n\n3. Measuring your results...",
    wordCount: 20,
    duration: 8,
    status: 'in-progress',
    colorClass: 'bg-purple-500 text-purple-500',
    icon: 'fa-layer-group'
  },
  {
    id: 'cta',
    type: 'CTA',
    title: 'Call to Action',
    content: "If you found this valuable, smash that like button and subscribe for more content like...",
    wordCount: 24,
    duration: 10,
    status: 'pending',
    colorClass: 'bg-orange-500 text-orange-500',
    icon: 'fa-bullseye'
  },
  {
    id: 'outro',
    type: 'OUTRO',
    title: 'Outro',
    content: "Thanks for watching. Don't forget to check out the links in the description. See you...",
    wordCount: 27,
    duration: 11,
    status: 'pending',
    colorClass: 'bg-teal-500 text-teal-500',
    icon: 'fa-check-circle'
  }
];
