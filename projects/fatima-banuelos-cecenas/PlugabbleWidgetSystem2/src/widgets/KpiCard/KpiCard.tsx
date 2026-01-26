import { memo } from 'react';
import type { WidgetProps, KpiCardConfig } from '../../core/types';

interface KpiCardProps extends WidgetProps<KpiCardConfig> {}

const KpiCard = memo(function KpiCard({ config }: KpiCardProps) {
  const { label, value, trend, trendValue, unit } = config;

  const getTrendIcon = () => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600 dark:text-green-400';
    if (trend === 'down') return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <section
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
      aria-label={`KPI: ${label}`}
    >
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        {label}
      </h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">
          {value.toLocaleString()}
          {unit && <span className="text-lg ml-1">{unit}</span>}
        </span>
        {trend && trendValue !== undefined && (
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {getTrendIcon()} {Math.abs(trendValue)}
          </span>
        )}
      </div>
    </section>
  );
});

export default KpiCard;
