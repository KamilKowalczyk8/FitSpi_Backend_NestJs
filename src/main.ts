import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //globalny prefix dal endpointów np api/users 
  app.setGlobalPrefix('api');

  //ustawienia CORS dla frontend
  app.enableCors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET','POST','PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});

  //parsowanie ciasteczek JWT
  app.use(cookieParser());

  //walidacja danych wejsciowych
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // usuwa zbedne pola z obiektu
      forbidNonWhitelisted: true, // rzuca błąd, jeśli użytkownik wysyła niedozwolone dane
      transform: true, // automatycznie konwertuje typy na DTO
    }),
  );

  //swagger i obsługa kwt token
  const config = new DocumentBuilder()
    .setTitle('NestJs API')
    .setDescription('Dokumentacja API z JWT i OAuth 2.0')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

    //tworzenie  dokumentacji swagger
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    //uruchomienie serwera
    await app.listen(process.env.PORT || 4000);
    console.log(`🚀 Serwer działa na http://localhost:${process.env.PORT || 4000}`);
    console.log(`📚 Swagger: http://localhost:${process.env.PORT || 4000}
    /api/docs`);

    //Kod tworzy backend w NestJS i dodaje do niego kluczowe funkcje. 
    // ✔ Działa z zmiennymi środowiskowymi (.env), CORS i ciasteczkami. 
    // ✔ Swagger generuje dokumentację API (http://localhost:4000/api/docs). 
    // ✔ Globalna walidacja pilnuje poprawności danych użytkownika.
}
bootstrap();
