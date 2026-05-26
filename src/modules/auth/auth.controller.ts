/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, HttpCode, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { DiscordAuthGuard } from './guards/discord-auth.guard';
import { User } from '@prisma/client';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Get('discord')
  @UseGuards(DiscordAuthGuard)
  discordLogin() {}

  @Get('discord/callback')
  @UseGuards(DiscordAuthGuard)
  discordCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    const { accessToken } = this.authService.generateJwt(user.id);
    const frontendUrl = this.config.getOrThrow('FRONTEND_URL');
    res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}`);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  getMe(@Req() req: Request) {
    return req.user;
  }
}
