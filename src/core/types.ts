import type { ReactNode } from 'react';

/**
 * Configuración base que todos los widgets deben aceptar
 */
export interface WidgetProps<TConfig = Record<string, unknown>> {
  id: string;
  config: TConfig;
}

/**
 * Definición de un tipo de widget en el registro
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
 * Instancia de widget en el layout
 */
export interface WidgetInstance {
  id: string;
  widgetType: string;
  position: 'left' | 'right' | 'full';
  config: Record<string, unknown>;
}

/**
 * Configuración completa del layout del dashboard
 */
export type DashboardLayout = WidgetInstance[];

/**
 * Configuraciones específicas para cada tipo de widget
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
