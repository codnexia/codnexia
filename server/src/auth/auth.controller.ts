import { Body, Controller, Get, Patch, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: { user: { id: string; email: string } }) {
    return this.authService.getProfile(req.user.id);
  }

  // Update admin profile
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(
    @Req() req: { user: { id: string; email: string } },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(req.user.id, dto);
  }

  // Issue a fresh token (call before current one expires)
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  refresh(@Req() req: { user: { id: string; email: string } }) {
    return this.authService.refresh(req.user.id, req.user.email);
  }
}
