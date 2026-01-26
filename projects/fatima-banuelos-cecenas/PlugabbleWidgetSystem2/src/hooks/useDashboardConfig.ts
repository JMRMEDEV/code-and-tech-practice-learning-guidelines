import { useState, useEffect, useCallback } from 'react';
import type { DashboardLayout } from '../core/types';
import { defaultLayout } from '../config/defaultLayout';

const STORAGE_KEY = 'dashboard-layout-config';

/**
 * Hook to handle dashboard configuration with localStorage persistence
 */
export function useDashboardConfig() {
  const [layout, setLayout] = useState<DashboardLayout>(() => {
    // Try to load from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as DashboardLayout;
        // Basic validation
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to load config from localStorage:', error);
    }
    // Fallback to default configuration
    return defaultLayout;
  });

  // Persist changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
    } catch (error) {
      console.warn('Failed to save config to localStorage:', error);
    }
  }, [layout]);

  const updateLayout = useCallback((newLayout: DashboardLayout) => {
    setLayout(newLayout);
  }, []);

  const resetToDefault = useCallback(() => {
    setLayout(defaultLayout);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }, []);

  return {
    layout,
    updateLayout,
    resetToDefault,
  };
}
