import { useState, useCallback, memo } from 'react';
import type { DashboardLayout } from '../../core/types';

interface ConfigEditorProps {
  currentLayout: DashboardLayout;
  onApply: (layout: DashboardLayout) => void;
  onReset: () => void;
}

const ConfigEditor = memo(function ConfigEditor({
  currentLayout,
  onApply,
  onReset,
}: ConfigEditorProps) {
  const [jsonInput, setJsonInput] = useState(() =>
    JSON.stringify(currentLayout, null, 2)
  );
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleApply = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonInput) as DashboardLayout;
      
      // Basic validation
      if (!Array.isArray(parsed)) {
        throw new Error('Layout must be an array');
      }

      // Validate each widget structure
      for (const widget of parsed) {
        if (!widget.id || !widget.widgetType || !widget.position) {
          throw new Error('Each widget must have id, widgetType, and position');
        }
        if (!['left', 'right', 'full'].includes(widget.position)) {
          throw new Error('Position must be "left", "right", or "full"');
        }
      }

      setError(null);
      onApply(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  }, [jsonInput, onApply]);

  const handleReset = useCallback(() => {
    setJsonInput(JSON.stringify(currentLayout, null, 2));
    setError(null);
    onReset();
  }, [currentLayout, onReset]);

  return (
    <section
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md transition-all ${
        isExpanded ? 'p-6' : 'p-4'
      }`}
      aria-label="Configuration Editor"
    >
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Configuration Editor
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </header>

      {isExpanded && (
        <>
          <div className="mb-4">
            <label
              htmlFor="json-editor"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Layout Configuration (JSON)
            </label>
            <textarea
              id="json-editor"
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setError(null);
              }}
              className={`w-full h-64 p-3 font-mono text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
              aria-label="JSON configuration editor"
              aria-invalid={error !== null}
              aria-describedby={error ? 'json-error' : undefined}
            />
            {error && (
              <p
                id="json-error"
                className="mt-2 text-sm text-red-600 dark:text-red-400"
                role="alert"
              >
                Error: {error}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              aria-label="Apply configuration"
            >
              Apply Configuration
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              aria-label="Reset to default configuration"
            >
              Reset to Default
            </button>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Tip:</strong> Edit the JSON configuration above to add, remove, or
              rearrange widgets. Each widget needs: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">id</code>,{' '}
              <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">widgetType</code>,{' '}
              <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">position</code> (left/right/full), and{' '}
              <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">config</code>.
            </p>
          </div>
        </>
      )}
    </section>
  );
});

export default ConfigEditor;
