import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Mini E-commerce API')
    .setDescription(
      `
## Mini E-commerce REST API

This API provides endpoints for a complete e-commerce system including:

- **Authentication**: Register, login, logout, and token refresh
- **Users**: User management with role-based access control
- **Categories**: Product category management
- **Products**: Product catalog with images, search, and filtering
- **Cart**: Shopping cart functionality
- **Orders**: Order creation and management
- **Addresses**: Delivery address management

### Authentication

Most endpoints require authentication. Use the \`/auth/login\` endpoint to obtain a JWT token, 
then include it in the Authorization header as \`Bearer <token>\`.

### Roles

- **admin**: Full access to all endpoints
- **customer**: Access to own resources (cart, orders, addresses)
    `,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management')
    .addTag('Roles', 'Role management')
    .addTag('Categories', 'Product categories')
    .addTag('Products', 'Product catalog')
    .addTag('Cart', 'Shopping cart')
    .addTag('Orders', 'Order management')
    .addTag('Addresses', 'Delivery addresses')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
