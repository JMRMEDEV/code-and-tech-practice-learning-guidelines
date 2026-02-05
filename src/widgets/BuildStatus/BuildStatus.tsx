import { memo, useMemo } from 'react';
import type { WidgetProps, BuildStatusConfig } from '../../core/types';
import { generateMockBuilds, formatTimestamp } from '../../utils/mockData';

interface BuildStatusProps extends WidgetProps<BuildStatusConfig> {}

const BuildStatus = memo(function BuildStatus({ config }: BuildStatusProps) {
  const { maxItems, highlightFailed, environment } = config;

  const builds = useMemo(() => {
    return generateMockBuilds(maxItems * 2)
      .filter((build) => {
        if (environment && build.project.toLowerCase() !== environment) {
          return false;
        }
        return true;
      })
      .slice(0, maxItems);
  }, [maxItems, environment]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <section
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
      aria-label="Build Status"
    >
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Build Status
        </h2>
        {environment && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Environment: {environment}
          </p>
        )}
      </header>
      <ul className="space-y-3" role="list">
        {builds.map((build) => (
          <li
            key={build.id}
            className={`p-3 rounded-md border ${
              highlightFailed && build.status === 'failed'
                ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-gray-900 dark:text-white">
                {build.project}
              </span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                  build.status
                )}`}
              >
                {build.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{build.branch}</span>
              <span>{formatTimestamp(build.timestamp)}</span>
            </div>
            {build.duration && (
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Duration: {build.duration}s
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
});

export default BuildStatus;
