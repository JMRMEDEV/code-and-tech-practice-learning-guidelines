import { memo, useMemo } from 'react';
import type { WidgetProps, ErrorFeedConfig } from '../../core/types';
import { generateMockErrorLogs, formatTimestamp } from '../../utils/mockData';

interface ErrorFeedProps extends WidgetProps<ErrorFeedConfig> {}

const ErrorFeed = memo(function ErrorFeed({ config }: ErrorFeedProps) {
  const { severity, maxItems, showTimestamp } = config;

  const logs = useMemo(() => {
    return generateMockErrorLogs(maxItems * 2, severity).slice(0, maxItems);
  }, [maxItems, severity]);

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'error':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'info':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'border-gray-300 bg-gray-50 dark:bg-gray-700/50';
    }
  };

  const getSeverityIcon = (sev: string) => {
    switch (sev) {
      case 'error':
        return '🔴';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '•';
    }
  };

  return (
    <section
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
      aria-label="Error Feed"
    >
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Error Feed
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Severity: {severity}
        </p>
      </header>
      <ul className="space-y-2 max-h-96 overflow-y-auto" role="list">
        {logs.map((log) => (
          <li
            key={log.id}
            className={`p-3 rounded-md border-l-4 ${getSeverityColor(
              log.severity
            )}`}
          >
            <div className="flex items-start gap-2">
              <span className="text-lg" aria-label={log.severity}>
                {getSeverityIcon(log.severity)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white break-words">
                  {log.message}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
                  <span>{log.source}</span>
                  {showTimestamp && (
                    <>
                      <span>•</span>
                      <span>{formatTimestamp(log.timestamp)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
});

export default ErrorFeed;
