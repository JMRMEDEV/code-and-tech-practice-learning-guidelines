import { Suspense, memo } from 'react';
import type { DashboardLayout, WidgetInstance } from './types';
import { widgetRegistry } from './WidgetRegistry';

interface DashboardShellProps {
  layout: DashboardLayout;
}

const DashboardShell = memo(function DashboardShell({ layout }: DashboardShellProps) {
  const leftWidgets = layout.filter((w) => w.position === 'left');
  const rightWidgets = layout.filter((w) => w.position === 'right');
  const fullWidgets = layout.filter((w) => w.position === 'full');

  const renderWidget = (instance: WidgetInstance) => {
    const widgetType = widgetRegistry.getWidget(instance.widgetType);

    if (!widgetType) {
      return (
        <div
          key={instance.id}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
        >
          <p className="text-yellow-800 dark:text-yellow-200">
            Widget type "{instance.widgetType}" not found in registry
          </p>
        </div>
      );
    }

    const WidgetComponent = widgetType.component;

    // Determine if the widget needs lazy loading (ChartWidget)
    const needsSuspense = instance.widgetType === 'chartWidget';

    const widgetElement = (
      <WidgetComponent
        key={instance.id}
        id={instance.id}
        config={instance.config as never}
      />
    );

    if (needsSuspense) {
      return (
        <Suspense
          key={instance.id}
          fallback={
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          }
        >
          {widgetElement}
        </Suspense>
      );
    }

    return widgetElement;
  };

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Full-width widgets */}
        {fullWidgets.length > 0 && (
          <section className="space-y-4">
            {fullWidgets.map(renderWidget)}
          </section>
        )}

        {/* Two-column layout for left/right widgets */}
        {(leftWidgets.length > 0 || rightWidgets.length > 0) && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              {leftWidgets.map(renderWidget)}
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {rightWidgets.map(renderWidget)}
            </div>
          </section>
        )}

        {/* Empty state */}
        {layout.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No widgets configured. Use the config editor to add widgets.
            </p>
          </div>
        )}
      </div>
    </main>
  );
});

export default DashboardShell;
