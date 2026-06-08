import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { DiscordProfileWithTokens } from './types/discord-profile.type';
import { buildDiscordAvatarUrl } from 'src/common/utils/discord.utils';
import { buildDiscordBannerUrl } from '../../common/utils/discord.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async handleDiscordLogin(profile: DiscordProfileWithTokens) {
    const existing = await this.prisma.discordProfile.findUnique({
      where: { discordId: profile.id },
      include: { user: true },
    });

    if (existing) {
      await this.prisma.discordProfile.update({
        where: { discordId: profile.id },
        data: {
          username: profile.username,
          globalName: profile.global_name,
          avatarHash: profile.avatar ?? null,
          accessToken: profile.accessToken,
          refreshToken: profile.refreshToken,
          tokenExpiresAt: profile.tokenExpiresAt,
        },
      });
      return existing.user;
    }

    return this.prisma.user.create({
      data: {
        displayName: profile.global_name ?? profile.username,
        avatarUrl: buildDiscordAvatarUrl(profile.id, profile.avatar ?? null),
        bannerUrl: buildDiscordBannerUrl(profile.id, profile.banner ?? null),
        discordProfile: {
          create: {
            discordId: profile.id,
            username: profile.username,
            globalName: profile.global_name ?? null,
            discriminator: profile.discriminator ?? '',
            avatarHash: profile.avatar ?? null,
            bannerHash: profile.banner ?? null,
            accentColor: profile.accent_color ?? null,
            locale: profile.locale ?? null,
            premiumType: profile.premium_type ?? null,
            publicFlags: profile.public_flags ?? null,
            verified: profile.verified ?? false,
            email: profile.email ?? null,
            accessToken: profile.accessToken,
            refreshToken: profile.refreshToken,
            tokenExpiresAt: profile.tokenExpiresAt,
          },
        },
      },
    });
  }

  generateJwt(userId: string) {
    return { accessToken: this.jwt.sign({ sub: userId }) };
  }
}
