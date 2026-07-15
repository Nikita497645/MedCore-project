import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth/auth.module'; // <-- Pointing to your actual AuthModule!

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.enableCors(); // Allows your frontend to talk to this backend
  await app.listen(3001);
  console.log('🚀 MedCore Backend is running on: http://localhost:3001');
}
bootstrap();