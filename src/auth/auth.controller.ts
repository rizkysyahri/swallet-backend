import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/create-auth.dto';
import { SignInDto } from './dto/signin-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto)
  }

  @Post('signin')
  async signIn(@Body() credentials: SignInDto) {
    return await this.authService.signIn(credentials)
  }
}
