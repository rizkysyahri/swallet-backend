import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { SignUpDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/signin-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpData: SignUpDto) {
    const emailInUse = await this.prisma.user.findUnique({
      where: {
        email: signUpData.email,
      },
    });

    if (emailInUse) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(signUpData.password, 10);

    signUpData.password = hashedPassword;

    const user = await this.prisma.user.create({
      data: {
        ...signUpData,
      },
    });

    await this.prisma.profile.create({
      data: {
        userId: user.id,
      },
    });
  }

  async signIn(credentials: SignInDto) {
    const { email, password } = credentials;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }

    return this.generateUserTokens(user.id);
  }

  async generateUserTokens(userId) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '1d' });

    return {
      accessToken,
    };
  }
}
