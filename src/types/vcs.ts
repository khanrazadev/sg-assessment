import { ReactNode } from 'react';

export type Category = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Detector {
  name: string;
  icon: ReactNode;
}

export interface Finding {
  id: number;
  category: Category;
  detector: Detector;
  provider: string;
  secret: string;
  occurrences: number;
  status: string[];
}
