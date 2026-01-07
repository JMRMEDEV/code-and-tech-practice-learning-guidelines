# CMS API Design Document

## Overview

The CMS API is a NestJS-based backend service that provides content management capabilities through RESTful endpoints. The system uses MongoDB for data persistence, JWT for authentication, and implements a local file-based publishing system for static content generation. The architecture follows NestJS best practices with modular design, dependency injection, and comprehensive validation.

## Architecture

The system follows a layered architecture pattern:

```
┌─────────────────────────────────────────┐
│              Controllers                │  ← HTTP Request Handling
├─────────────────────────────────────────┤
│               Services                  │  ← Business Logic
├─────────────────────────────────────────┤
│              Repositories               │  ← Data Access Layer
├─────────────────────────────────────────┤
│               MongoDB                   │  ← Data Persistence
└─────────────────────────────────────────┘
```

### Key Architectural Decisions

1. **Modular Structure**: Separate modules for Auth, Pages, Sections, and Publishing
2. **Repository Pattern**: Abstract data access for testability and maintainability
3. **DTO Validation**: Input/output validation using class-validator
4. **JWT Authentication**: Stateless authentication with guards
5. **File-based Publishing**: Local JSON generation for zero-cost publishing

## Components and Interfaces

### Authentication Module
- **AuthController**: Handles registration and login endpoints
- **AuthService**: Manages user authentication logic
- **JwtStrategy**: Passport strategy for JWT validation
- **AuthGuard**: Protects routes requiring authentication

### Pages Module
- **PagesController**: CRUD operations for pages
- **PagesService**: Business logic for page management
- **PagesRepository**: Data access for page entities

### Sections Module
- **SectionsController**: Section management within pages
- **SectionsService**: Section business logic and type validation
- **SectionsRepository**: Section data persistence

### Publishing Module
- **PublishController**: Triggers publishing operations
- **PublishService**: Generates static JSON files
- **FileSystemService**: Handles file operations

## Data Models

### User Entity
```typescript
interface User {
  _id: ObjectId;
  email: string;
  password: string; // hashed
  createdAt: Date;
  updatedAt: Date;
}
```

### Page Entity
```typescript
interface Page {
  _id: ObjectId;
  title: string;
  slug: string; // unique
  sections: Section[];
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

### Section Entity
```typescript
interface Section {
  _id: ObjectId;
  type: 'text' | 'image' | 'chart';
  order: number;
  data: TextData | ImageData | ChartData;
  pageId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface TextData {
  heading: string;
  body: string;
}

interface ImageData {
  url: string;
  caption: string;
}

interface ChartData {
  labels: string[];
  values: number[];
}
```

### Published Page Format
```typescript
interface PublishedPage {
  title: string;
  slug: string;
  sections: PublishedSection[];
  publishedAt: Date;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*
### Property Reflection

After reviewing all properties identified in the prework, several can be consolidated to eliminate redundancy:

**Consolidations:**
- Properties 1.1 and 1.2 (registration and login) can be combined into a comprehensive authentication property
- Properties 3.1, 3.2, and 3.3 (section creation by type) can be combined into a single section creation property
- Properties 5.1, 5.2, 5.3, and 5.5 (various validation scenarios) can be combined into a comprehensive validation property
- Properties 6.3 and 6.5 (error response formatting) can be combined with the validation property

**Retained Properties:**
- Authentication and JWT validation (combines 1.1, 1.2, 1.4, 1.5)
- Page CRUD operations (2.1, 2.2, 2.3, 2.4, 2.5)
- Section management (combines 3.1-3.5)
- Publishing system (4.1, 4.2, 4.3, 4.4, 4.5)
- Input validation and error handling (combines 5.1-5.5, 6.3, 6.5)
- Resource not found handling (6.4)

Property 1: Authentication round trip
*For any* valid user credentials, registering then logging in should return a valid JWT token that grants access to protected endpoints
**Validates: Requirements 1.1, 1.2, 1.4**

Property 2: JWT token validation
*For any* invalid or expired JWT token, protected endpoints should reject the request with appropriate authentication errors
**Validates: Requirements 1.5**

Property 3: Page CRUD consistency
*For any* page data, creating, reading, updating, and deleting operations should maintain data consistency and proper relationships
**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

Property 4: Section management integrity
*For any* section type (text, image, chart), creating, updating, and deleting sections should maintain proper page associations and data integrity
**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

Property 5: Publishing round trip
*For any* page with sections, publishing should generate a JSON file that contains equivalent data to the original page
**Validates: Requirements 4.1, 4.2, 4.3**

Property 6: Publishing lifecycle management
*For any* published page, republishing should update the file and deletion should remove the published file
**Validates: Requirements 4.4, 4.5**

Property 7: Input validation consistency
*For any* invalid input data across all endpoints, the API should reject requests with detailed validation errors and appropriate HTTP status codes
**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 6.3, 6.5**

Property 8: Resource not found handling
*For any* request for non-existent resources, the API should return 404 status with clear resource identification
**Validates: Requirements 6.4**

## Error Handling

The system implements comprehensive error handling at multiple levels:

### Validation Errors (400)
- DTO validation using class-validator
- Custom validation pipes for business rules
- Detailed field-level error messages

### Authentication Errors (401)
- Invalid credentials
- Missing or malformed JWT tokens
- Expired tokens

### Authorization Errors (403)
- Insufficient permissions
- Resource ownership validation

### Not Found Errors (404)
- Non-existent pages, sections, or users
- Clear resource identification in error messages

### Server Errors (500)
- Database connection issues
- File system errors during publishing
- Unexpected application errors

### Error Response Format
```typescript
interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}
```

## Testing Strategy

The testing approach combines unit testing and property-based testing to ensure comprehensive coverage:

### Unit Testing
- **Controllers**: Test HTTP request/response handling and validation
- **Services**: Test business logic and error conditions
- **Repositories**: Test data access patterns and MongoDB operations
- **Guards**: Test authentication and authorization logic
- **Pipes**: Test validation and transformation logic

Unit tests will use Jest with MongoDB Memory Server for isolated database testing.

### Property-Based Testing
Property-based testing will be implemented using **fast-check** library for JavaScript/TypeScript. This choice provides:
- Excellent TypeScript support and type inference
- Rich set of built-in generators for common data types
- Good integration with Jest testing framework
- Active maintenance and comprehensive documentation

Each property-based test will:
- Run a minimum of 100 iterations to ensure statistical confidence
- Use smart generators that constrain inputs to valid domains
- Include explicit comments linking to design document properties
- Use the format: `**Feature: cms-api, Property {number}: {property_text}**`

**Property Test Configuration:**
- Minimum iterations: 100
- Timeout per test: 30 seconds
- Shrinking enabled for minimal counterexamples
- Seed-based reproducibility for debugging

### Integration Testing
- End-to-end API testing with real MongoDB instance
- Authentication flow testing
- File system operations for publishing
- Error handling across module boundaries

### Test Organization
```
src/
├── auth/
│   ├── auth.controller.spec.ts
│   ├── auth.service.spec.ts
│   └── auth.property.spec.ts
├── pages/
│   ├── pages.controller.spec.ts
│   ├── pages.service.spec.ts
│   └── pages.property.spec.ts
└── test/
    ├── helpers/
    └── fixtures/
```

The testing strategy ensures both specific behavior validation through unit tests and general correctness guarantees through property-based testing, providing confidence in system reliability and maintainability.