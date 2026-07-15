import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'SUPER_SECRET_KEY_DONT_USE_IN_PRODUCTION_123!', // We will move this to .env later
      signOptions: { expiresIn: '1d' }, // Token valid for 1 day
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}