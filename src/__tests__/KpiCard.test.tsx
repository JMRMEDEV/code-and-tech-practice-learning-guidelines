import { render, screen } from '@testing-library/react';
import KpiCard from '../widgets/KpiCard/KpiCard';
import type { KpiCardConfig } from '../core/types';

describe('KpiCard', () => {
  const mockConfig: KpiCardConfig = {
    label: 'Test KPI',
    value: 1234,
    trend: 'up',
    trendValue: 50,
    unit: 'items',
  };

  it('renders KPI card with correct values', () => {
    render(<KpiCard id="test-kpi" config={mockConfig} />);
    
    expect(screen.getByText('Test KPI')).toBeInTheDocument();
    // El formato puede variar según locale, así que buscamos el número de forma flexible
    expect(screen.getByText(/1234|1,234|1\.234/)).toBeInTheDocument();
    expect(screen.getByText(/items/i)).toBeInTheDocument();
  });

  it('displays trend indicator', () => {
    render(<KpiCard id="test-kpi" config={mockConfig} />);
    
    expect(screen.getByText(/↑/)).toBeInTheDocument();
    expect(screen.getByText(/50/)).toBeInTheDocument();
  });

  it('handles neutral trend', () => {
    const neutralConfig: KpiCardConfig = {
      ...mockConfig,
      trend: 'neutral',
    };
    
    render(<KpiCard id="test-kpi" config={neutralConfig} />);
    
    expect(screen.getByText(/→/)).toBeInTheDocument();
  });
});
