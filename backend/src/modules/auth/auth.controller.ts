import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { RegisterDto } from '@/modules/auth/dto/register.dto';
import { LoginDto } from '@/modules/auth/dto/login.dto';
import { Response } from 'express';
import { CurrentUser } from '@/shared/decorators/auth.decorator';
import { AuthTokenGuard } from '@/shared/guards/auth-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async getAll() {
    const users = await this.authService.getUsers();
    return users
    
  }

  @Post('register')
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() body: RegisterDto,
  ) {
    const { accessToken, user } = await this.authService.register(body);
    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('access-token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return user;
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, user } = await this.authService.login(body);
   const isProd = process.env.NODE_ENV === 'production';

   res.cookie('access-token', accessToken, {
     httpOnly: true,
     secure: isProd,
     sameSite: isProd ? 'none' : 'lax',
     maxAge: 1000 * 60 * 60 * 24 * 7,
   });

    return user;
  }

  @Get('me')
  @UseGuards(AuthTokenGuard)
  async me(@CurrentUser() user: { id: string; email: string }) {
    return user;
  }

  @Post('logout')
  @UseGuards(AuthTokenGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access-token');
  }
}
