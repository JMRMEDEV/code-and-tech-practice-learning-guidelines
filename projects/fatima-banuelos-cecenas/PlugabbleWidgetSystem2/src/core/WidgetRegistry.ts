import { lazy } from 'react';
import type { ComponentType } from 'react';
import type {
  WidgetType,
  WidgetProps,
  KpiCardConfig,
  BuildStatusConfig,
  ErrorFeedConfig,
  ChartWidgetConfig,
} from './types';

// Static imports for lighter widgets
import KpiCard from '../widgets/KpiCard/KpiCard';
import BuildStatus from '../widgets/BuildStatus/BuildStatus';
import ErrorFeed from '../widgets/ErrorFeed/ErrorFeed';

// Lazy loading for the chart widget (heavier)
const ChartWidget = lazy(() => import('../widgets/ChartWidget/ChartWidget'));

/**
 * Central widget registry
 * Each widget must be registered here with its type, component and default configuration
 */
class WidgetRegistry {
  private widgets: Map<string, WidgetType> = new Map();

  constructor() {
    this.registerWidgets();
  }

  /**
   * Registers all available widgets in the system
   */
  private registerWidgets(): void {
    // KPI Card Widget
    this.register<KpiCardConfig>({
      id: 'kpiCard',
      component: KpiCard as ComponentType<WidgetProps<KpiCardConfig>>,
      displayName: 'KPI Card',
      description: 'Displays a key performance indicator with value and trend',
      defaultConfig: {
        label: 'Open PRs',
        value: 0,
        trend: 'neutral',
        unit: '',
      },
    });

    // Build Status Widget
    this.register<BuildStatusConfig>({
      id: 'buildStatus',
      component: BuildStatus as ComponentType<WidgetProps<BuildStatusConfig>>,
      displayName: 'Build Status',
      description: 'List of recent build statuses',
      defaultConfig: {
        maxItems: 5,
        highlightFailed: true,
        environment: 'staging',
      },
    });

    // Error Feed Widget
    this.register<ErrorFeedConfig>({
      id: 'errorFeed',
      component: ErrorFeed as ComponentType<WidgetProps<ErrorFeedConfig>>,
      displayName: 'Error Feed',
      description: 'Feed of recent errors and logs',
      defaultConfig: {
        severity: 'error',
        maxItems: 10,
        showTimestamp: true,
      },
    });

    // Chart Widget (lazy loaded)
    this.register<ChartWidgetConfig>({
      id: 'chartWidget',
      component: ChartWidget as ComponentType<WidgetProps<ChartWidgetConfig>>,
      displayName: 'Chart Widget',
      description: 'Data chart with different visualization types',
      defaultConfig: {
        chartType: 'line',
        dataPoints: 7,
        showLegend: true,
        title: 'Builds per Day',
      },
    });
  }

  /**
   * Registers a new widget in the registry
   */
  private register<TConfig = Record<string, unknown>>(
    widgetType: Omit<WidgetType<TConfig>, 'defaultConfig'> & { defaultConfig: TConfig }
  ): void {
    this.widgets.set(widgetType.id, widgetType as WidgetType);
  }

  /**
   * Gets a widget by its ID
   */
  getWidget(widgetId: string): WidgetType | undefined {
    return this.widgets.get(widgetId);
  }

  /**
   * Gets all registered widgets
   */
  getAllWidgets(): WidgetType[] {
    return Array.from(this.widgets.values());
  }

  /**
   * Checks if a widget exists in the registry
   */
  hasWidget(widgetId: string): boolean {
    return this.widgets.has(widgetId);
  }
}

// Export singleton instance
export const widgetRegistry = new WidgetRegistry();
export default widgetRegistry;
