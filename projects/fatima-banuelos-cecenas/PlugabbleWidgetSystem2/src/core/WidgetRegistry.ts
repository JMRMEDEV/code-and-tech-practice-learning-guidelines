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

// Importaciones estáticas para widgets más ligeros
import KpiCard from '../widgets/KpiCard/KpiCard';
import BuildStatus from '../widgets/BuildStatus/BuildStatus';
import ErrorFeed from '../widgets/ErrorFeed/ErrorFeed';

// Lazy loading para el widget de gráficos (más pesado)
const ChartWidget = lazy(() => import('../widgets/ChartWidget/ChartWidget'));

/**
 * Registro central de widgets
 * Cada widget debe ser registrado aquí con su tipo, componente y configuración por defecto
 */
class WidgetRegistry {
  private widgets: Map<string, WidgetType> = new Map();

  constructor() {
    this.registerWidgets();
  }

  /**
   * Registra todos los widgets disponibles en el sistema
   */
  private registerWidgets(): void {
    // KPI Card Widget
    this.register<KpiCardConfig>({
      id: 'kpiCard',
      component: KpiCard as ComponentType<WidgetProps<KpiCardConfig>>,
      displayName: 'KPI Card',
      description: 'Muestra un indicador clave de rendimiento con valor y tendencia',
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
      description: 'Lista de estados de builds recientes',
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
      description: 'Feed de errores y logs recientes',
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
      description: 'Gráfico de datos con diferentes tipos de visualización',
      defaultConfig: {
        chartType: 'line',
        dataPoints: 7,
        showLegend: true,
        title: 'Builds per Day',
      },
    });
  }

  /**
   * Registra un nuevo widget en el registro
   */
  private register<TConfig = Record<string, unknown>>(
    widgetType: Omit<WidgetType<TConfig>, 'defaultConfig'> & { defaultConfig: TConfig }
  ): void {
    this.widgets.set(widgetType.id, widgetType as WidgetType);
  }

  /**
   * Obtiene un widget por su ID
   */
  getWidget(widgetId: string): WidgetType | undefined {
    return this.widgets.get(widgetId);
  }

  /**
   * Obtiene todos los widgets registrados
   */
  getAllWidgets(): WidgetType[] {
    return Array.from(this.widgets.values());
  }

  /**
   * Verifica si un widget existe en el registro
   */
  hasWidget(widgetId: string): boolean {
    return this.widgets.has(widgetId);
  }
}

// Exportar instancia singleton
export const widgetRegistry = new WidgetRegistry();
export default widgetRegistry;
