import { render, screen } from '@testing-library/react';
import DashboardShell from '../core/DashboardShell';
import type { DashboardLayout } from '../core/types';

describe('DashboardShell', () => {
  const mockLayout: DashboardLayout = [
    {
      id: 'w1',
      widgetType: 'kpiCard',
      position: 'left',
      config: {
        label: 'Test KPI',
        value: 100,
      },
    },
    {
      id: 'w2',
      widgetType: 'buildStatus',
      position: 'right',
      config: {
        maxItems: 3,
      },
    },
  ];

  it('renders widgets based on layout configuration', () => {
    render(<DashboardShell layout={mockLayout} />);
    
    // Verify that the widgets are rendered
    expect(screen.getByText(/Test KPI/i)).toBeInTheDocument();
    expect(screen.getByText(/Build Status/i)).toBeInTheDocument();
  });

  it('displays empty state when layout is empty', () => {
    render(<DashboardShell layout={[]} />);
    
    expect(
      screen.getByText(/No widgets configured/i)
    ).toBeInTheDocument();
  });

  it('handles unknown widget types gracefully', () => {
    const invalidLayout: DashboardLayout = [
      {
        id: 'w1',
        widgetType: 'unknownWidget',
        position: 'left',
        config: {},
      },
    ];

    render(<DashboardShell layout={invalidLayout} />);
    
    expect(
      screen.getByText(/Widget type "unknownWidget" not found/i)
    ).toBeInTheDocument();
  });
});
