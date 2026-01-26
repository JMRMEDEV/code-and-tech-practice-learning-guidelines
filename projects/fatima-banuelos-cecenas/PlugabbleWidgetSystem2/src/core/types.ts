import type { ReactNode } from 'react';

/**
 * Base configuration that all widgets must accept
 */
export interface WidgetProps<TConfig = Record<string, unknown>> {
  id: string;
  config: TConfig;
}

/**
 * Definition of a widget type in the registry
 */
export interface WidgetType<TConfig = Record<string, unknown>> {
  id: string;
  component: React.ComponentType<WidgetProps<TConfig>>;
  displayName: string;
  description?: string;
  defaultConfig: TConfig;
  icon?: ReactNode | string;
}

/**
 * Widget instance in the layout
 */
export interface WidgetInstance {
  id: string;
  widgetType: string;
  position: 'left' | 'right' | 'full';
  config: Record<string, unknown>;
}

/**
 * Complete dashboard layout configuration
 */
export type DashboardLayout = WidgetInstance[];

/**
 * Specific configurations for each widget type
 */
export interface KpiCardConfig {
  label: string;
  value: number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  unit?: string;
}

export interface BuildStatusConfig {
  maxItems: number;
  highlightFailed?: boolean;
  environment?: 'production' | 'staging' | 'development';
}

export interface ErrorFeedConfig {
  severity: 'error' | 'warning' | 'info';
  maxItems: number;
  showTimestamp?: boolean;
}

export interface ChartWidgetConfig {
  chartType: 'line' | 'bar' | 'area';
  dataPoints: number;
  showLegend?: boolean;
  title?: string;
}
