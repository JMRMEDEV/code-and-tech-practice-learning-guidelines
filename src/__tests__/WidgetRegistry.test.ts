import { widgetRegistry } from '../core/WidgetRegistry';

describe('WidgetRegistry', () => {
  it('registers all default widgets', () => {
    const widgets = widgetRegistry.getAllWidgets();
    
    expect(widgets.length).toBeGreaterThan(0);
    expect(widgets.some((w) => w.id === 'kpiCard')).toBe(true);
    expect(widgets.some((w) => w.id === 'buildStatus')).toBe(true);
    expect(widgets.some((w) => w.id === 'errorFeed')).toBe(true);
    expect(widgets.some((w) => w.id === 'chartWidget')).toBe(true);
  });

  it('retrieves widget by ID', () => {
    const widget = widgetRegistry.getWidget('kpiCard');
    
    expect(widget).toBeDefined();
    expect(widget?.id).toBe('kpiCard');
    expect(widget?.displayName).toBe('KPI Card');
    expect(widget?.component).toBeDefined();
  });

  it('returns undefined for non-existent widget', () => {
    const widget = widgetRegistry.getWidget('nonExistent');
    
    expect(widget).toBeUndefined();
  });

  it('checks if widget exists', () => {
    expect(widgetRegistry.hasWidget('kpiCard')).toBe(true);
    expect(widgetRegistry.hasWidget('nonExistent')).toBe(false);
  });
});
