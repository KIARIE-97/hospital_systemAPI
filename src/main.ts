import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './http.exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //protects app from well-known vulnerabilities by setting various HTTP headers
app.use(helmet())

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('HealthCare API')
    .setDescription(
      `
# 🏥 Hospital Management System API

A modern and secure REST API for managing healthcare operations, designed to streamline doctor-patient interactions, appointment scheduling — all backed by role-based authentication and claim based authorization.

---

## 🌟 Features Overview

This API empowers hospitals with endpoints to manage:

🔹 **Doctor Operations**  
 • Profile management  
 • Appointment history & availability   

🔹 **Patient Services**  
 • Registration & profile updates  
 • Appointment booking & tracking   

🔹 **Admin Dashboard**  
 • Full oversight on doctors, patients, appointments  
 • Contact query handling  
 • Session log monitoring and reporting  

🔹 **Authentication & Security**  
 • JWT-based login  
 • Role-based access control (Admin, Doctor, Patient)  
 • Session logs for login/logout activity  

---

## 🔐 Authentication Guide

This API uses **JWT Bearer tokens** to authenticate and authorize requests.
      **How to Authenticate:**
1. Send credentials to th login endpoint to receive a JWT token.
2. Include the token in the  header of your requests:
      \`Authorization: Bearer <your_token>\`
3. Use the token to access protected endpoints.
4. **Need to refresh?** use the refresh token endpoint to obtain a new access token.
---
      ## 📡 API Quick Info

      - **Base URL**: \`http://localhost:8000/api\`
      - **Content-Type**: \`application/json\`
          `,
    )

    .setVersion('1.0')
    .setTermsOfService('https://hospital.com/terms')
    .setContact(
      'API Support',
      'https://hospital.com/support',
      'api-support@myhospital.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addTag('auth', 'Authentication endpoints')
    .addTag('patients', 'Patient management endpoints')
    .addTag('doctors', 'Doctor management endpoints')
    .addTag('appointments', 'Appointment management endpoints')
    .addTag('contact-queries', 'Contact query management endpoints')
    .addTag('session-logs', 'Session log management endpoints')
    .addTag('admin', 'Admin management endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('seed', 'Database seeding endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none', // Collapse all sections by default
      filter: true, // Enable search filter
      showRequestDuration: true, // Show request duration
      tryItOutEnabled: true, // Enable "Try it out" button
    },
    customCss: `
    .swagger-ui .topbar { display: none; }    /* Hide the logo */
    .swagger-ui .info { margin-bottom: 20px; }
    .swagger-ui .info h1 { font-size: 24px; }
    .swagger-ui .opblock-tag { font-weight: bold; }
    .swagger-ui .opblock-summary { font-size: 18px; }
    .swagger-ui .opblock-description { font-size: 14px; }
    .swagger-ui .opblock-body { font-size: 14px; }
    .swagger-ui .responses { margin-top: 20px; }
    .swagger-ui .response { background-color: #f8f9fa; padding: 10px; border-radius: 5px; }
    .swagger-ui .response .response-body { font-size: 14px; }
    .swagger-ui .response .response-headers { font-size: 14px; }
  `,
    customSiteTitle: 'HealthCare API Documentation',
    customfavIcon: 'https://example.com/favicon.ico', // Replace with your favicon URL
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  // Register the global exception filter
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow<number>('PORT');

  await app.listen(PORT);
}
bootstrap();
