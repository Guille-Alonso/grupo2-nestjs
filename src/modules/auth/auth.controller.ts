//import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
//import { CreateUserDto } from '../users/dto/create-user.dto';
//import { LoginAuthDto } from './dto/login.dto';
//import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
//import { RecoverPasswordDto, ResetPasswordDto } from './dto/auth.dto';
//import { JwtAuthGuard } from './guards/jwt.guard';


//@ApiTags('Autentification')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /*@ApiOperation({ summary: 'Register  a new user' })
  @ApiBody({ type: CreateUserDto })
  @Post('/register')
  register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginAuthDto })
  @Post('/login')
  login(@Body() credentials: LoginAuthDto) {
    return this.authService.login(credentials);
  
  @Post('/recover-password')
  recoverPassword(@Body() recoverDto: RecoverPasswordDto) {
    return this.authService.recoveryPassword(recoverDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/reset-password')
  resetPassword(@Body() resetDto: ResetPasswordDto, @Req() req) {
    const id = req.user.userId;
    return this.authService.resetPassword(resetDto, id);
  }
    }*/
}
