import {
  MetricData,
  PulseCardData,
  PerformanceData,
  HeatmapData,
  FunnelStep,
  ActionItem,
  BenchmarkData
} from './types';

export const metricCards: MetricData[] = [
  {
    id: 'total-reach',
    title: 'Total reach',
    value: '2.4M',
    trend: '+12.4% vs prev 7 days',
    trendDirection: 'up',
    progressValue: 75,
    progressColorClass: 'from-blue-500 to-indigo-500',
  },
  {
    id: 'engagement-rate',
    title: 'Engagement rate',
    value: '6.8%',
    trend: '+1.2% vs prev 7 days',
    trendDirection: 'up',
    progressValue: 60,
    progressColorClass: 'from-purple-500 to-pink-500',
  },
  {
    id: 'conversion',
    title: 'Est. Conversion',
    value: '4.6K',
    trend: '-2.1% vs prev 7 days',
    trendDirection: 'down',
    progressValue: 40,
    progressColorClass: 'from-cyan-400 to-blue-500',
  },
  {
    id: 'save-rate',
    title: 'Save & Share rate',
    value: '12.4%',
    trend: '+4.3% vs prev 7 days',
    trendDirection: 'up',
    progressValue: 85,
    progressColorClass: 'from-orange-400 to-red-500',
  }
];

export const pulseCards: PulseCardData[] = [
  {
    id: 'anomaly-1',
    type: 'anomaly',
    title: 'Real-time Anomaly',
    description: 'Your recent YouTube short "Hook formulas" is showing 300% higher velocity than your 30-day average.',
    time: '2h ago',
    icon: 'fa-chart-line',
    colorClass: 'text-blue-400 bg-blue-400/10 border-blue-500/20',
  },
  {
    id: 'opportunity-1',
    type: 'opportunity',
    title: 'Opportunity Detected',
    description: 'Audience retention is peaking at the 12-second mark. Consider placing your primary CTA earlier.',
    time: '5h ago',
    icon: 'fa-lightbulb',
    colorClass: 'text-purple-400 bg-purple-400/10 border-purple-500/20',
  },
  {
    id: 'risk-1',
    type: 'risk',
    title: 'Performance Risk',
    description: 'LinkedIn engagement has dropped below median for 2 consecutive posts. Review topic alignment.',
    time: '1d ago',
    icon: 'fa-exclamation-triangle',
    colorClass: 'text-red-400 bg-red-400/10 border-red-500/20',
  }
];

export const performanceData: PerformanceData[] = [
  {
    platform: 'YouTube',
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    dataPoints: [20, 45, 30, 80, 60, 110, 95],
    total: '846.2K Views'
  },
  {
    platform: 'TikTok',
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    dataPoints: [50, 70, 40, 90, 85, 130, 120],
    total: '1.2M Views'
  },
  {
    platform: 'Instagram',
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    dataPoints: [30, 50, 45, 60, 55, 80, 75],
    total: '520.1K Views'
  },
  {
    platform: 'LinkedIn',
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    dataPoints: [80, 110, 95, 100, 85, 40, 30],
    total: '124.5K Views'
  }
];

// Heatmap mock data: 6 time blocks per day (e.g. Early Morning, Morning, Noon, Afternoon, Evening, Night)
// Values 0-100 represent intensity
export const heatmapData: HeatmapData[] = [
  { day: 'Mon', hours: [10, 20, 30, 50, 80, 40] },
  { day: 'Tue', hours: [15, 30, 40, 60, 90, 50] },
  { day: 'Wed', hours: [10, 25, 45, 55, 85, 60] },
  { day: 'Thu', hours: [20, 35, 50, 70, 95, 75] },
  { day: 'Fri', hours: [30, 40, 60, 80, 100, 90] },
  { day: 'Sat', hours: [40, 60, 80, 90, 70, 50] },
  { day: 'Sun', hours: [35, 55, 75, 85, 60, 40] }
];

export const funnelSteps: FunnelStep[] = [
  {
    id: 'impressions',
    label: 'Impressions',
    value: '1.24M',
    progress: 100,
    colorClass: 'from-indigo-600 to-purple-500'
  },
  {
    id: 'views',
    label: 'Views',
    value: '486K',
    progress: 75,
    colorClass: 'from-cyan-400 to-blue-500'
  },
  {
    id: 'engaged',
    label: 'Engaged',
    value: '93.1K',
    progress: 45,
    colorClass: 'from-emerald-400 to-teal-500'
  },
  {
    id: 'clicks',
    label: 'Clicks',
    value: '21.8K',
    progress: 25,
    colorClass: 'from-orange-400 to-red-500'
  },
  {
    id: 'conversions',
    label: 'Conversions',
    value: '4.6K',
    progress: 10,
    colorClass: 'from-pink-500 to-rose-500'
  }
];

export const actionItems: ActionItem[] = [
  {
    id: 'action-1',
    title: 'Duplicate the winning YouTube hook into next week\'s hero publish',
    description: 'The current opener structure is outperforming the category benchmark by 25 points.',
    icon: 'fa-video'
  },
  {
    id: 'action-2',
    title: 'Re-cut one underperforming video with a faster first 8 seconds',
    description: 'Retention loss starts before the promise lands — fix pacing, not topic.',
    icon: 'fa-play'
  },
  {
    id: 'action-3',
    title: 'Pull the strongest LinkedIn comments into a carousel narrative',
    description: 'Your audience is giving you language that can become the next hook set.',
    icon: 'fa-comment-alt'
  },
  {
    id: 'action-4',
    title: 'Schedule Thursday and Friday launches into the Publish queue',
    description: 'Audience intent and click-through both peak in the same window this period.',
    icon: 'fa-calendar-alt'
  }
];

export const benchmarkData: BenchmarkData[] = [
  {
    id: 'hook',
    label: 'Hook strength',
    score: 86,
    colorClass: 'from-purple-500 to-cyan-400'
  },
  {
    id: 'retention',
    label: 'Retention quality',
    score: 73,
    colorClass: 'from-purple-500 to-cyan-400'
  },
  {
    id: 'comment',
    label: 'Comment depth',
    score: 69,
    colorClass: 'from-purple-500 to-cyan-400'
  },
  {
    id: 'cta',
    label: 'CTA efficiency',
    score: 64,
    colorClass: 'from-purple-500 to-cyan-400'
  }
];
