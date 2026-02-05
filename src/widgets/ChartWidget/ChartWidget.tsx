import { memo, useMemo } from 'react';
import type { WidgetProps, ChartWidgetConfig } from '../../core/types';
import { generateMockChartData } from '../../utils/mockData';

interface ChartWidgetProps extends WidgetProps<ChartWidgetConfig> {}

const ChartWidget = memo(function ChartWidget({ config }: ChartWidgetProps) {
  const { chartType, dataPoints, showLegend, title } = config;

  const data = useMemo(() => {
    return generateMockChartData(dataPoints, 0, 100);
  }, [dataPoints]);

  const maxValue = useMemo(() => {
    return Math.max(...data.map((d) => d.value), 1);
  }, [data]);

  const renderChart = () => {
    if (chartType === 'bar') {
      return (
        <div className="flex items-end justify-between gap-2 h-48">
          {data.map((point, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                style={{
                  height: `${(point.value / maxValue) * 100}%`,
                  minHeight: '4px',
                }}
                aria-label={`${point.label}: ${point.value}`}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                {point.label}
              </span>
            </div>
          ))}
        </div>
      );
    }

    if (chartType === 'area') {
      const points = data.map((point, index) => ({
        x: (index / (data.length - 1)) * 100,
        y: 100 - (point.value / maxValue) * 100,
        value: point.value,
        label: point.label,
      }));

      const pathData = points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ');

      return (
        <div className="h-48 relative">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path
              d={`${pathData} L 100 100 L 0 100 Z`}
              fill="url(#areaGradient)"
              className="stroke-blue-500 stroke-1"
            />
            <path
              d={pathData}
              fill="none"
              stroke="rgb(59, 130, 246)"
              strokeWidth="2"
            />
          </svg>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600 dark:text-gray-400 px-1">
            {data.map((point, index) => (
              <span key={index}>{point.label}</span>
            ))}
          </div>
        </div>
      );
    }

    // Default: line chart
    const points = data.map((point, index) => ({
      x: (index / (data.length - 1)) * 100,
      y: 100 - (point.value / maxValue) * 100,
      value: point.value,
      label: point.label,
    }));

    const pathData = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');

    return (
      <div className="h-48 relative">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          <path
            d={pathData}
            fill="none"
            stroke="rgb(59, 130, 246)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="2"
              fill="rgb(59, 130, 246)"
              className="hover:r-3 transition-all"
            />
          ))}
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600 dark:text-gray-400 px-1">
          {data.map((point, index) => (
            <span key={index}>{point.label}</span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
      aria-label={title || 'Chart Widget'}
    >
      {title && (
        <header className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
        </header>
      )}
      <div className="mb-4">{renderChart()}</div>
      {showLegend && (
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded ${
                chartType === 'bar'
                  ? 'bg-blue-500'
                  : chartType === 'area'
                  ? 'bg-gradient-to-b from-blue-500 to-blue-200'
                  : 'bg-blue-500'
              }`}
            />
            <span>Data Series</span>
          </div>
        </div>
      )}
    </section>
  );
});

export default ChartWidget;
