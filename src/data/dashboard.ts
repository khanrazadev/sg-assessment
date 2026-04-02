import { ChartDataItem } from '@/types/dashboard';

export const riskScoreData: ChartDataItem[] = [
  { name: 'Risk', value: 80, color: '#ef4444' },
  { name: 'Safe', value: 20, color: '#e5e7eb' },
];

export const secretsSeverityData: ChartDataItem[] = [
  { name: 'High',   value: 70, color: '#ff4d4f' },
  { name: 'Medium', value: 25, color: '#ffc53d' },
  { name: 'Low',    value: 5,  color: '#e5e7eb' },
];
