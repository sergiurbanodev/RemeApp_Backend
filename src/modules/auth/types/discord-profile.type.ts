import type { Profile } from 'passport-discord-auth';

export interface DiscordProfileWithTokens extends Profile {
  accessToken: string;
  refreshToken: string;
  tokenExpiresAt: Date;
}
