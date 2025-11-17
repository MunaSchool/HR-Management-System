import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //  Enable global validation for all DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // Strip properties not in DTO
      forbidNonWhitelisted: true,   // Throw error for extra fields
      transform: true,              // Convert plain objects to class instances
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server running on http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
