import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { Session } from './entities/session.entity';
import { DeviceInitDto, LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    private jwtService: JwtService,
  ) {}

  async deviceInit(deviceInitDto: DeviceInitDto) {
    // Return app configuration
    return {
      success: true,
      data: {
        tradingViewUrl: process.env.TRADING_VIEW_URL || 'https://trading.example.com',
        banners: [],
        languages: ['vi', 'en'],
        markets: [],
        topCoins: [],
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const { phone, email, password, username } = registerDto;

    // Check if user exists
    const existingUser = await this.userRepository.findOne({
      where: [{ phone }, { email }],
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepository.create({
      username,
      phone,
      email,
      passwordHash: hashedPassword,
      status: 'active',
    });

    await this.userRepository.save(user);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      success: true,
      data: {
        user: this.sanitizeUser(user),
        tokens,
        wallets: [],
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { phoneOrEmail, password } = loginDto;

    // Find user
    const user = await this.userRepository.findOne({
      where: [
        { phone: phoneOrEmail },
        { email: phoneOrEmail },
      ],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check user status
    if (user.status !== 'active') {
      throw new UnauthorizedException('Account is not active');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Create session
    await this.createSession(user.id, tokens.refreshToken);

    return {
      success: true,
      data: {
        user: this.sanitizeUser(user),
        tokens,
        wallets: [],
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      success: true,
      data: {
        user: this.sanitizeUser(user),
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userRepository.findOne({ where: { id: payload.sub } });

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      const tokens = await this.generateTokens(user);
      return {
        success: true,
        data: { tokens },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.sessionRepository.delete({ userId });
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, username: user.username };
    
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 1800, // 30 minutes
    };
  }

  private async createSession(userId: string, refreshToken: string) {
    const session = this.sessionRepository.create({
      userId,
      tokenHash: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    await this.sessionRepository.save(session);
  }

  private sanitizeUser(user: User) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}
