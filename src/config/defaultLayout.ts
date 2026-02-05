import type { DashboardLayout } from '../core/types';

/**
 * Configuración por defecto del layout del dashboard
 */
export const defaultLayout: DashboardLayout = [
  {
    id: 'w1',
    widgetType: 'kpiCard',
    position: 'left',
    config: {
      label: 'Open PRs',
      value: 12,
      trend: 'up',
      trendValue: 3,
      unit: '',
    },
  },
  {
    id: 'w2',
    widgetType: 'buildStatus',
    position: 'left',
    config: {
      maxItems: 5,
      highlightFailed: true,
      environment: 'staging',
    },
  },
  {
    id: 'w3',
    widgetType: 'errorFeed',
    position: 'right',
    config: {
      severity: 'error',
      maxItems: 10,
      showTimestamp: true,
    },
  },
  {
    id: 'w4',
    widgetType: 'chartWidget',
    position: 'full',
    config: {
      chartType: 'line',
      dataPoints: 7,
      showLegend: true,
      title: 'Builds per Day',
    },
  },
];
