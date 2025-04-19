const localOrigins = [
  'http://localhost:3021',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3022',
  'http://localhost:1935',
  'http://localhost:8000',
  'http://localhost:4200',
  'http://localhost:4300',
  'http://localhost:3021/v1/',
  'http://localhost:3021/v1/discord/auth',
  'http://localhost:3021/v1/twitter/auth',
  'http://localhost:3021/v1/twitch/auth',
  'http://localhost:3021/v1/kick/auth',
  'http://localhost:3021/v1/google/auth',
  'http://localhost:3021/v1/facebook/auth',
  'ws://localhost:3333/live/',
  'ws://localhost:3022/nexus',
];

const productionOrigins = [
  'https://api.beamify.online',
  'https://beamify.online',
  'https://ingest.beamify.online',
  'https://db.beamify.online',
  'https://discord.com',
  'https://kick.com',
  'https://x.com',
];

export function getCorsOrigins(env: string): string[] {
  return env === 'production' ? productionOrigins : localOrigins;
}
