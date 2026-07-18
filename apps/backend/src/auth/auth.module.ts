import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service'; // Added this

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'SUPER_SECRET_KEY_DONT_USE_IN_PRODUCTION_123!', // We will move this to .env later
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, PrismaService], // Added PrismaService here
  controllers: [AuthController],
})
export class AuthModule {}