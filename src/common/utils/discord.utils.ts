export function buildDiscordAvatarUrl(
  discordId: string,
  avatarHash: string | null,
  size: 64 | 128 | 256 | 512 = 128,
): string {
  if (!avatarHash) {
    const index = (BigInt(discordId) >> 22n) % 6n;
    return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
  }

  const ext = avatarHash.startsWith('a_') ? 'gif' : 'webp';
  return `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.${ext}?size=${size}`;
}

export function buildDiscordBannerUrl(
  discordId: string,
  bannerHash: string | null,
  size: 512 | 1024 | 2048 = 512,
): string | null {
  if (!bannerHash) return null;
  const ext = bannerHash.startsWith('a_') ? 'gif' : 'webp';
  return `https://cdn.discordapp.com/banners/${discordId}/${bannerHash}.${ext}?size=${size}`;
}
