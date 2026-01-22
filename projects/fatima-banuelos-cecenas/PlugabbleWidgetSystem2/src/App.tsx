import { useDashboardConfig } from './hooks/useDashboardConfig';
import DashboardShell from './core/DashboardShell';
import ConfigEditor from './components/ConfigEditor/ConfigEditor';

function App() {
  const { layout, updateLayout, resetToDefault } = useDashboardConfig();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Developer Operations Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Pluggable Widget System - Config-driven dashboard
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <ConfigEditor
          currentLayout={layout}
          onApply={updateLayout}
          onReset={resetToDefault}
        />
      </div>

      <DashboardShell layout={layout} />
    </div>
  );
}

export default App;
