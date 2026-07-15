import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 1. Sign Up a New User
  async register(data: any) {
    const { email, password, firstName, lastName, role, hospitalId } = data;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('A user with this email already exists.');
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to PostgreSQL database via Prisma (matching your exact schema fields)
    const user = await this.prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        role,
        passwordHash: hashedPassword, // Uses passwordHash from your schema
        hospitalId, // Links user to their specific hospital tenant
      },
    });

    // Remove passwordHash from returned object for safety
    const { passwordHash: _, ...result } = user;
    return result;
  }

  // 2. Validate User & Generate JWT (Login)
  async login(credentials: any) {
    const { email, password } = credentials;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash); // Compares with passwordHash
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Generate JWT Token payload
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role, 
      hospitalId: user.hospitalId 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        hospitalId: user.hospitalId,
      },
    };
  }
}