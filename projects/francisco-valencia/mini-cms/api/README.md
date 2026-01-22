# CMS API

A lightweight Content Management System API built with NestJS and MongoDB that allows authenticated users to create and manage pages with dynamic sections.

## Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 📄 **Page Management** - Create, read, update, and delete pages
- 🧩 **Dynamic Sections** - Support for text, image, and chart section types
- 📦 **Publishing System** - Generate static JSON snapshots for serverless deployment
- ✅ **Input Validation** - Comprehensive validation with detailed error messages
- 📚 **API Documentation** - Interactive Swagger/OpenAPI documentation
- 🏗️ **Clean Architecture** - Modular design with separation of concerns

## Tech Stack

- **Framework**: NestJS 10.x
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest with MongoDB Memory Server

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cms-api
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/cms-api
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
PORT=3000
FRONTEND_URL=http://localhost:3001
```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

The API will be available at:
- **API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api

## API Endpoints

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Pages (Protected)

All page endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

#### Create Page
```http
POST /pages
Content-Type: application/json

{
  "title": "My Awesome Page",
  "slug": "my-awesome-page"
}
```

#### Get All Pages
```http
GET /pages
```

#### Get Page by ID
```http
GET /pages/:id
```

#### Update Page
```http
PATCH /pages/:id
Content-Type: application/json

{
  "title": "Updated Title"
}
```

#### Delete Page
```http
DELETE /pages/:id
```

### Sections (Protected)

#### Create Section
```http
POST /sections
Content-Type: application/json

{
  "pageId": "507f1f77bcf86cd799439011",
  "type": "text",
  "data": {
    "heading": "Welcome",
    "body": "This is the content"
  }
}
```

Section types and their data structures:

**Text Section:**
```json
{
  "type": "text",
  "data": {
    "heading": "Section Title",
    "body": "Section content goes here"
  }
}
```

**Image Section:**
```json
{
  "type": "image",
  "data": {
    "url": "https://example.com/image.jpg",
    "caption": "Image description"
  }
}
```

**Chart Section:**
```json
{
  "type": "chart",
  "data": {
    "labels": ["Jan", "Feb", "Mar"],
    "values": [10, 20, 30]
  }
}
```

#### Get Sections for Page
```http
GET /sections/page/:pageId
```

#### Update Section
```http
PATCH /sections/:id
Content-Type: application/json

{
  "data": {
    "heading": "Updated Heading",
    "body": "Updated content"
  }
}
```

#### Delete Section
```http
DELETE /sections/:id
```

#### Reorder Sections
```http
POST /sections/page/:pageId/reorder
Content-Type: application/json

{
  "sectionIds": ["id1", "id2", "id3"]
}
```

### Publishing

#### Publish Page (Protected)
```http
POST /pages/:id/publish
```

#### Unpublish Page (Protected)
```http
DELETE /pages/:id/publish
```

#### Republish Page (Protected)
```http
POST /pages/:id/republish
```

#### Get Published Page (Public)
```http
GET /published/:slug
```

#### List Published Pages (Public)
```http
GET /published
```

## Architecture

The application follows a clean, modular architecture:

```
src/
├── auth/                 # Authentication module
│   ├── decorators/      # Custom decorators (CurrentUser)
│   ├── dto/             # Data transfer objects
│   ├── entities/        # User entity
│   ├── guards/          # JWT auth guard
│   ├── strategies/      # Passport JWT strategy
│   └── utils/           # Password hashing utilities
├── pages/               # Pages module
│   ├── dto/             # Page DTOs
│   ├── entities/        # Page entity
│   └── interfaces/      # Page interfaces
├── sections/            # Sections module
│   ├── dto/             # Section DTOs
│   ├── entities/        # Section entity
│   └── interfaces/      # Section interfaces
├── publish/             # Publishing module
│   ├── interfaces/      # Published page interfaces
│   └── services/        # File system service
├── common/              # Shared utilities
│   ├── filters/         # Global exception filter
│   └── pipes/           # Custom validation pipe
├── config/              # Configuration
│   ├── configuration.ts # App configuration
│   └── validation.ts    # Environment validation
└── main.ts              # Application entry point
```

## Testing

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:cov
```

### Run E2E Tests
```bash
npm run test:e2e
```

## Publishing System

The publishing system generates static JSON files that can be served without database queries:

1. **Publish a page**: Creates a JSON snapshot in the `/published` directory
2. **Access published page**: Use the public endpoint `/published/:slug`
3. **Republish**: Updates the existing JSON file with current data
4. **Unpublish**: Removes the JSON file

Published files are stored locally in the `published/` directory with the format:
```
published/
├── my-page-slug.json
├── another-page.json
└── ...
```

## Error Handling

The API uses standardized error responses:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/pages"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate slug)
- `500` - Internal Server Error

## Data Validation

All endpoints validate input data using DTOs with class-validator:

- Email format validation
- Password minimum length (6 characters)
- Slug format (lowercase with hyphens)
- Required fields enforcement
- Type checking for section data
- Array length validation for charts

## Security

- Passwords are hashed using bcrypt (12 salt rounds)
- JWT tokens for stateless authentication
- Protected routes require valid JWT token
- User ownership validation for resources
- Input sanitization and validation
- CORS configuration for frontend integration

## Development

### Project Structure
- Follow NestJS module-based architecture
- Use DTOs for all input/output
- Implement proper error handling
- Write tests for critical functionality
- Document API changes in Swagger

### Code Style
```bash
npm run format    # Format code with Prettier
npm run lint      # Lint code with ESLint
```

## Deployment

### Environment Variables
Ensure all required environment variables are set in production:
- `MONGODB_URI` - Production MongoDB connection string
- `JWT_SECRET` - Strong, unique secret key
- `PORT` - Server port (default: 3000)
- `FRONTEND_URL` - Frontend application URL for CORS

### Build for Production
```bash
npm run build
```

The compiled application will be in the `dist/` directory.

## Known Limitations

- Single user ownership model (no role-based permissions)
- Published files stored locally (not distributed CDN)
- No image upload functionality (URLs only)
- No page versioning or revision history
- No real-time collaboration features

## Potential Improvements

- [ ] Add role-based access control (admin, editor, viewer)
- [ ] Implement page versioning and revision history
- [ ] Add image upload with cloud storage integration
- [ ] Implement full-text search for pages and sections
- [ ] Add page templates and themes
- [ ] Implement draft/published workflow
- [ ] Add analytics and page view tracking
- [ ] Implement webhooks for publishing events
- [ ] Add rate limiting and request throttling
- [ ] Implement caching layer (Redis)
- [ ] Add Docker containerization
- [ ] Set up CI/CD pipeline
- [ ] Add comprehensive E2E tests
- [ ] Implement GraphQL API option

## License

MIT

## Support

For issues and questions, please open an issue on the repository.