import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-discord-auth';
import { AuthService } from '../auth.service';
import { DiscordProfileWithTokens } from '../types/discord-profile.type';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(private readonly authService: AuthService) {
    super({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      callbackUrl: process.env.DISCORD_CALLBACK_URL!,
      scope: ['identify', 'email', 'guilds'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const guildId = process.env.DISCORD_GUILD_ID!;
    const inGuild = profile.guilds?.some((g) => g.id === guildId) ?? false;

    if (!inGuild) {
      throw new UnauthorizedException(
        'Debes ser miembro de Reme para acceder al login.',
      );
    }

    const payload: DiscordProfileWithTokens = {
      ...profile,
      accessToken,
      refreshToken,
      tokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    return this.authService.handleDiscordLogin(payload);
  }
}
