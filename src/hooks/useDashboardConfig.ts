import { useState, useEffect, useCallback } from 'react';
import type { DashboardLayout } from '../core/types';
import { defaultLayout } from '../config/defaultLayout';

const STORAGE_KEY = 'dashboard-layout-config';

/**
 * Hook para manejar la configuración del dashboard con persistencia en localStorage
 */
export function useDashboardConfig() {
  const [layout, setLayout] = useState<DashboardLayout>(() => {
    // Intentar cargar desde localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as DashboardLayout;
        // Validación básica
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to load config from localStorage:', error);
    }
    // Fallback a configuración por defecto
    return defaultLayout;
  });

  // Persistir cambios en localStorage
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
