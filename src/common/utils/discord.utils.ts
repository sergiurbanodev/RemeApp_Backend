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
