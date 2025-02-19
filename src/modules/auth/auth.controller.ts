import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login.dto';
import { RecoverPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RegisterUserDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
 async register(@Body() user: RegisterUserDto) {
    return await this.authService.register(user);
  }

  @Post('/login')
 async login(@Body() credentials: LoginAuthDto) {
    return await this.authService.login(credentials);
  }

  @Post('/recovery-password')
 async recoveryPassword(@Body() recoverDto: RecoverPasswordDto) {
    return await this.authService.recoveryPassword(recoverDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/reset-password')
 async resetPassword(@Body() resetDto: ResetPasswordDto, @Req() req) {
    const id = req.user.userId;
    return await this.authService.resetPassword(resetDto, id);
  }
}
