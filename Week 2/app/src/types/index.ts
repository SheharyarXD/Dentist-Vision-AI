/**
 * Type Definitions for DentalVisionAI
 */

export type Theme = 'light' | 'dark';

export type NavItem = {
  label: string;
  path: string;
  icon: string;
};

export type MetricCard = {
  title: string;
  value: string | number;
  subtitle: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: string;
};

export type PredictionResult = {
  id: number;
  label: string;
  confidence: number;
  imageUrl: string;
};

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
};
