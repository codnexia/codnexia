import { Body, Controller, Get, Patch, Post, Query, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
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

  // Generate an invite token for a new admin
  @UseGuards(JwtAuthGuard)
  @Post('invite')
  generateInvite(@Req() req: { user: { id: string; email: string } }) {
    return this.authService.generateInvite(req.user.id);
  }

  // List all invite tokens (paginated)
  @UseGuards(JwtAuthGuard)
  @Get('invites')
  getInvites(@Query() query: PaginationDto) {
    return this.authService.getInvites(query.page ?? 1, query.limit ?? 20);
  }
}
