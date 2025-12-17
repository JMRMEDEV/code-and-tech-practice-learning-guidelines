import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './common/pipes/validation.pipe';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend integration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new CustomValidationPipe());

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('CMS API')
    .setDescription('A lightweight Content Management System API built with NestJS and MongoDB')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'User registration and login')
    .addTag('Pages', 'Page management operations')
    .addTag('Sections', 'Section management within pages')
    .addTag('Publishing', 'Static page publishing operations')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 CMS API is running on http://localhost:${port}`);
  console.log(`📚 API Documentation available at http://localhost:${port}/api`);
  console.log(`📁 Published files will be stored in: ${process.cwd()}/published`);
}
bootstrap();