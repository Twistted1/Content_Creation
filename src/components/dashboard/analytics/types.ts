export interface MetricData {
  id: string;
  title: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down';
  progressValue: number;
  progressColorClass: string;
}

export interface PulseCardData {
  id: string;
  type: 'anomaly' | 'opportunity' | 'risk';
  title: string;
  description: string;
  time: string;
  icon: string;
  colorClass: string;
}

export interface PerformanceData {
  platform: 'YouTube' | 'TikTok' | 'Instagram' | 'LinkedIn';
  labels: string[]; // e.g. "Mon", "Tue"
  dataPoints: number[]; // e.g. 100, 200
  total: string;
}

export interface HeatmapData {
  day: string; // "Mon", "Tue"
  hours: number[]; // Array of intensity values 0-100, representing 6 time slots
}

export interface FunnelStep {
  id: string;
  label: string;
  value: string;
  progress: number;
  colorClass: string; // e.g. "from-purple-500 to-indigo-500"
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface BenchmarkData {
  id: string;
  label: string;
  score: number;
  colorClass: string;
}
