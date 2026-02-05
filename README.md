# Pluggable Widget System - Developer Operations Dashboard

Un sistema de dashboard pluggable y configurable construido con React y TypeScript. Este proyecto demuestra una arquitectura frontend extensible donde los widgets se registran dinámicamente y se renderizan basándose en una configuración JSON.

## 🎯 Características Principales

- **Sistema de Registro de Widgets**: Los widgets se registran centralmente y se instancian dinámicamente
- **Renderizado Basado en Configuración**: El layout del dashboard se controla completamente mediante JSON
- **Editor de Configuración en Tiempo Real**: Interfaz para editar la configuración y ver cambios inmediatos
- **Lazy Loading**: Widgets pesados se cargan bajo demanda usando `React.lazy` y `Suspense`
- **Persistencia**: La configuración se guarda automáticamente en `localStorage`
- **Type-Safe**: Tipos TypeScript para todas las configuraciones y props de widgets
- **Accesible**: HTML semántico y soporte para navegación por teclado
- **Responsive**: Diseño adaptable con Tailwind CSS

## 🏗️ Arquitectura

### Estructura de Carpetas

```
src/
├── core/                    # Núcleo del sistema
│   ├── DashboardShell.tsx   # Shell principal que renderiza widgets
│   ├── WidgetRegistry.ts    # Registro central de widgets
│   └── types.ts             # Tipos TypeScript compartidos
├── widgets/                 # Implementaciones de widgets
│   ├── KpiCard/            # Widget de KPI
│   ├── BuildStatus/        # Widget de estado de builds
│   ├── ErrorFeed/          # Widget de feed de errores
│   └── ChartWidget/        # Widget de gráficos (lazy loaded)
├── components/             # Componentes compartidos
│   └── ConfigEditor/       # Editor de configuración
├── config/                 # Configuraciones
│   └── defaultLayout.ts    # Layout por defecto
├── hooks/                  # Custom hooks
│   └── useDashboardConfig.ts # Hook para gestión de configuración
├── utils/                  # Utilidades
│   └── mockData.ts         # Generadores de datos mock
└── __tests__/              # Tests
```

### Flujo de Datos

1. **Configuración**: El layout se define como un array de `WidgetInstance` en JSON
2. **Registro**: Los widgets se registran en `WidgetRegistry` con sus tipos y configuraciones por defecto
3. **Renderizado**: `DashboardShell` lee la configuración y renderiza widgets usando el registro
4. **Persistencia**: Los cambios se guardan en `localStorage` automáticamente

### Modelo de Datos

#### WidgetInstance
```typescript
{
  id: string;              // Identificador único
  widgetType: string;      // Tipo de widget (debe estar en el registro)
  position: 'left' | 'right' | 'full';  // Posición en el layout
  config: object;          // Configuración específica del widget
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

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- npm, yarn o pnpm

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

El proyecto estará disponible en `http://localhost:5173`

## 📦 Widgets Disponibles

### 1. KPI Card (`kpiCard`)
Muestra un indicador clave de rendimiento con valor y tendencia.

**Configuración:**
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
Lista de estados de builds recientes con información detallada.

**Configuración:**
```json
{
  "maxItems": 5,
  "highlightFailed": true,
  "environment": "staging"
}
```

### 3. Error Feed (`errorFeed`)
Feed de errores y logs recientes filtrados por severidad.

**Configuración:**
```json
{
  "severity": "error",
  "maxItems": 10,
  "showTimestamp": true
}
```

### 4. Chart Widget (`chartWidget`)
Gráfico de datos con diferentes tipos de visualización (línea, barras, área).

**Configuración:**
```json
{
  "chartType": "line",
  "dataPoints": 7,
  "showLegend": true,
  "title": "Builds per Day"
}
```

## 🔧 Agregar un Nuevo Widget

Para agregar un nuevo widget al sistema:

### 1. Crear el Componente del Widget

```typescript
// src/widgets/MyWidget/MyWidget.tsx
import { memo } from 'react';
import { WidgetProps, MyWidgetConfig } from '../../core/types';

const MyWidget = memo(function MyWidget({ config }: WidgetProps<MyWidgetConfig>) {
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2>{config.title}</h2>
      {/* Tu contenido aquí */}
    </section>
  );
});

export default MyWidget;
```

### 2. Definir el Tipo de Configuración

```typescript
// src/core/types.ts
export interface MyWidgetConfig {
  title: string;
  // ... otros campos
}
```

### 3. Registrar el Widget

```typescript
// src/core/WidgetRegistry.ts
import MyWidget from '../widgets/MyWidget/MyWidget';

// En el método registerWidgets():
this.register<MyWidgetConfig>({
  id: 'myWidget',
  component: MyWidget as ComponentType<WidgetProps<MyWidgetConfig>>,
  displayName: 'My Widget',
  description: 'Descripción del widget',
  defaultConfig: {
    title: 'Default Title',
  },
});
```

### 4. Usar en la Configuración

```json
{
  "id": "w5",
  "widgetType": "myWidget",
  "position": "left",
  "config": {
    "title": "Mi Widget Personalizado"
  }
}
```

## 🎨 Personalización

### Estilos

El proyecto usa Tailwind CSS. Puedes personalizar los estilos en:
- `tailwind.config.js` - Configuración de Tailwind
- `src/index.css` - Estilos globales

### Layout

El layout se controla mediante la propiedad `position` de cada widget:
- `left`: Columna izquierda (en pantallas grandes)
- `right`: Columna derecha (en pantallas grandes)
- `full`: Ancho completo

## 🧪 Testing

Los tests están ubicados en `src/__tests__/` y cubren:

- Renderizado del dashboard basado en configuración
- Registro de widgets
- Componentes individuales de widgets
- Manejo de errores (widgets desconocidos, configuraciones inválidas)

Ejecutar tests:
```bash
npm test
```

## 📝 Ejemplo de Configuración

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

## 🎯 Principios de Diseño

### Separación de Responsabilidades
- **DashboardShell**: Solo se encarga del layout y renderizado
- **WidgetRegistry**: Gestiona el registro y búsqueda de widgets
- **Widgets**: Componentes puros que reciben props y renderizan

### Extensibilidad
- Agregar un widget solo requiere crear el componente y registrarlo
- No se necesita modificar el shell ni otros widgets

### Type Safety
- Todos los tipos están definidos en TypeScript
- Las configuraciones son type-safe
- El registro valida tipos en tiempo de compilación

### Performance
- Widgets memoizados para evitar re-renders innecesarios
- Lazy loading para widgets pesados
- Datos mock generados eficientemente

## 🔍 Tecnologías Utilizadas

- **React 19** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Estilos utility-first
- **Jest** - Testing framework
- **React Testing Library** - Testing de componentes

## 📄 Licencia

Este proyecto es un ejemplo educativo y está disponible para uso libre.

## 🤝 Contribuciones

Este es un proyecto de demostración, pero las mejoras y sugerencias son bienvenidas:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📸 Capturas de Pantalla

El dashboard incluye:
- Header con título y descripción
- Editor de configuración colapsable
- Grid responsive con widgets en diferentes posiciones
- Soporte para modo oscuro
- Indicadores visuales para estados y tendencias

## 🚧 Mejoras Futuras

- [ ] Drag & drop para reordenar widgets
- [ ] Más tipos de gráficos
- [ ] Integración con APIs reales
- [ ] Temas personalizables
- [ ] Exportar/importar configuraciones
- [ ] Widgets con actualización en tiempo real
- [ ] Sistema de permisos por widget
- [ ] Modo de vista previa antes de aplicar cambios

---

**Desarrollado como parte de un desafío de arquitectura frontend** 🚀
