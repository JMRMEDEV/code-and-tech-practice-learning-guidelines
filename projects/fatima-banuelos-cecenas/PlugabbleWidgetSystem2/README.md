# Pluggable Widget System - Developer Operations Dashboard

A pluggable and configurable dashboard system built with React and TypeScript. This project demonstrates an extensible frontend architecture where widgets are registered dynamically and rendered based on JSON configuration.

## Key Features

- **Widget Registration System**: Widgets are registered centrally and instantiated dynamically
- **Configuration-Based Rendering**: The dashboard layout is fully controlled via JSON
- **Real-Time Configuration Editor**: Interface to edit configuration and see changes immediately
- **Lazy Loading**: Heavy widgets are loaded on demand using `React.lazy` and `Suspense`
- **Persistence**: Configuration is automatically saved to `localStorage`
- **Type-Safe**: TypeScript types for all configurations and widget props
- **Accessible**: Semantic HTML and keyboard navigation support
- **Responsive**: Adaptive design with Tailwind CSS

## Architecture

### Folder Structure

```
src/
├── core/                    # Core system
│   ├── DashboardShell.tsx   # Main shell that renders widgets
│   ├── WidgetRegistry.ts    # Central widget registry
│   └── types.ts             # Shared TypeScript types
├── widgets/                 # Widget implementations
│   ├── KpiCard/            # KPI widget
│   ├── BuildStatus/        # Build status widget
│   ├── ErrorFeed/          # Error feed widget
│   └── ChartWidget/        # Chart widget (lazy loaded)
├── components/             # Shared components
│   └── ConfigEditor/       # Configuration editor
├── config/                 # Configurations
│   └── defaultLayout.ts    # Default layout
├── hooks/                  # Custom hooks
│   └── useDashboardConfig.ts # Hook for configuration management
├── utils/                  # Utilities
│   └── mockData.ts         # Mock data generators
└── __tests__/              # Tests
```

### Data Flow

1. **Configuration**: The layout is defined as an array of `WidgetInstance` in JSON
2. **Registration**: Widgets are registered in `WidgetRegistry` with their types and default configurations
3. **Rendering**: `DashboardShell` reads the configuration and renders widgets using the registry
4. **Persistence**: Changes are saved to `localStorage` automatically

### Data Model

#### WidgetInstance
```typescript
{
  id: string;              // Unique identifier
  widgetType: string;      // Widget type (must exist in registry)
  position: 'left' | 'right' | 'full';  // Position in layout
  config: object;          // Widget-specific configuration
}
```

#### WidgetType
```typescript
{
  id: string;
  component: React.ComponentType;
  displayName: string;
  description?: string;
  defaultConfig: object;
  icon?: ReactNode | string;
}
```

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

The project will be available at `http://localhost:5173`

## Available Widgets

### 1. KPI Card (`kpiCard`)
Displays a key performance indicator with value and trend.

**Configuration:**
```json
{
  "label": "Open PRs",
  "value": 12,
  "trend": "up",
  "trendValue": 3,
  "unit": ""
}
```

### 2. Build Status (`buildStatus`)
List of recent build statuses with detailed information.

**Configuration:**
```json
{
  "maxItems": 5,
  "highlightFailed": true,
  "environment": "staging"
}
```

### 3. Error Feed (`errorFeed`)
Feed of recent errors and logs filtered by severity.

**Configuration:**
```json
{
  "severity": "error",
  "maxItems": 10,
  "showTimestamp": true
}
```

### 4. Chart Widget (`chartWidget`)
Data chart with different visualization types (line, bar, area).

**Configuration:**
```json
{
  "chartType": "line",
  "dataPoints": 7,
  "showLegend": true,
  "title": "Builds per Day"
}
```

## Adding a New Widget

To add a new widget to the system:

### 1. Create the Widget Component

```typescript
// src/widgets/MyWidget/MyWidget.tsx
import { memo } from 'react';
import { WidgetProps, MyWidgetConfig } from '../../core/types';

const MyWidget = memo(function MyWidget({ config }: WidgetProps<MyWidgetConfig>) {
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2>{config.title}</h2>
      {/* Your content here */}
    </section>
  );
});

export default MyWidget;
```

### 2. Define the Configuration Type

```typescript
// src/core/types.ts
export interface MyWidgetConfig {
  title: string;
  // ... other fields
}
```

### 3. Register the Widget

```typescript
// src/core/WidgetRegistry.ts
import MyWidget from '../widgets/MyWidget/MyWidget';

// In the registerWidgets() method:
this.register<MyWidgetConfig>({
  id: 'myWidget',
  component: MyWidget as ComponentType<WidgetProps<MyWidgetConfig>>,
  displayName: 'My Widget',
  description: 'Widget description',
  defaultConfig: {
    title: 'Default Title',
  },
});
```

### 4. Use in Configuration

```json
{
  "id": "w5",
  "widgetType": "myWidget",
  "position": "left",
  "config": {
    "title": "My Custom Widget"
  }
}
```

## Customization

### Styles

The project uses Tailwind CSS. You can customize styles in:
- `tailwind.config.js` - Tailwind configuration
- `src/index.css` - Global styles

### Layout

The layout is controlled via the `position` property of each widget:
- `left`: Left column (on large screens)
- `right`: Right column (on large screens)
- `full`: Full width

## Testing

Tests are located in `src/__tests__/` and cover:

- Dashboard rendering based on configuration
- Widget registry
- Individual widget components
- Error handling (unknown widgets, invalid configurations)

Run tests:
```bash
npm test
```

## Configuration Example

```json
[
  {
    "id": "w1",
    "widgetType": "kpiCard",
    "position": "left",
    "config": {
      "label": "Open PRs",
      "value": 12,
      "trend": "up",
      "trendValue": 3
    }
  },
  {
    "id": "w2",
    "widgetType": "buildStatus",
    "position": "left",
    "config": {
      "maxItems": 5,
      "highlightFailed": true,
      "environment": "staging"
    }
  },
  {
    "id": "w3",
    "widgetType": "errorFeed",
    "position": "right",
    "config": {
      "severity": "error",
      "maxItems": 10,
      "showTimestamp": true
    }
  },
  {
    "id": "w4",
    "widgetType": "chartWidget",
    "position": "full",
    "config": {
      "chartType": "line",
      "dataPoints": 7,
      "showLegend": true,
      "title": "Builds per Day"
    }
  }
]
```

## Design Principles

### Separation of Concerns
- **DashboardShell**: Only handles layout and rendering
- **WidgetRegistry**: Manages widget registration and lookup
- **Widgets**: Pure components that receive props and render

### Extensibility
- Adding a widget only requires creating the component and registering it
- No need to modify the shell or other widgets

### Type Safety
- All types are defined in TypeScript
- Configurations are type-safe
- Registry validates types at compile time

### Performance
- Memoized widgets to avoid unnecessary re-renders
- Lazy loading for heavy widgets
- Efficiently generated mock data

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styles
- **Jest** - Testing framework
- **React Testing Library** - Component testing

## License

This project is an educational example and is available for free use.

## Contributing

This is a demonstration project, but improvements and suggestions are welcome:

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Screenshots

The dashboard includes:
- Header with title and description
- Collapsible configuration editor
- Responsive grid with widgets in different positions
- Dark mode support
- Visual indicators for status and trends

## Future Improvements

- [ ] Drag & drop to reorder widgets
- [ ] More chart types
- [ ] Integration with real APIs
- [ ] Customizable themes
- [ ] Export/import configurations
- [ ] Real-time updating widgets
- [ ] Per-widget permission system
- [ ] Preview mode before applying changes

---

**Developed as part of a frontend architecture challenge**
