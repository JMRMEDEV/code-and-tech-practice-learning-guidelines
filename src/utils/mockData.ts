/**
 * Utilidades para generar datos mock para los widgets
 */

export interface BuildItem {
  id: string;
  project: string;
  status: 'success' | 'failed' | 'running' | 'pending';
  branch: string;
  timestamp: Date;
  duration?: number;
}

export interface ErrorLogItem {
  id: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  source: string;
  timestamp: Date;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

/**
 * Genera builds mock
 */
export function generateMockBuilds(count: number = 10): BuildItem[] {
  const statuses: BuildItem['status'][] = ['success', 'failed', 'running', 'pending'];
  const projects = ['Frontend', 'Backend', 'API', 'Mobile', 'Infrastructure'];
  const branches = ['main', 'develop', 'feature/auth', 'hotfix/bug-123', 'release/v2.0'];

  return Array.from({ length: count }, (_, i) => ({
    id: `build-${i + 1}`,
    project: projects[Math.floor(Math.random() * projects.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    branch: branches[Math.floor(Math.random() * branches.length)],
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    duration: Math.floor(Math.random() * 300) + 30,
  }));
}

/**
 * Genera logs de error mock
 */
export function generateMockErrorLogs(
  count: number = 20,
  severity?: 'error' | 'warning' | 'info'
): ErrorLogItem[] {
  const severities: ErrorLogItem['severity'][] = severity
    ? [severity]
    : ['error', 'warning', 'info'];
  const messages = [
    'Connection timeout to database',
    'Failed to fetch user data',
    'Invalid authentication token',
    'Rate limit exceeded',
    'Missing required field: email',
    'Service unavailable',
    'Validation error in request body',
    'Unauthorized access attempt',
    'Internal server error',
    'Resource not found',
  ];
  const sources = ['API', 'Frontend', 'Backend', 'Database', 'Auth Service'];

  return Array.from({ length: count }, (_, i) => ({
    id: `log-${i + 1}`,
    message: messages[Math.floor(Math.random() * messages.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
  }));
}

/**
 * Genera datos para gráficos
 */
export function generateMockChartData(
  count: number = 7,
  min: number = 0,
  max: number = 100
): ChartDataPoint[] {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return Array.from({ length: count }, (_, i) => ({
    label: labels[i] || `Day ${i + 1}`,
    value: Math.floor(Math.random() * (max - min + 1)) + min,
  }));
}

/**
 * Formatea una fecha para mostrar en la UI
 */
export function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
