import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenExpiredError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private _configService: ConfigService) {
    const jwtSecret = _configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret, // Ensure this is always defined
    });
  }

  async validate(payload: any) {
    try {
      return { id: payload.sub, username: payload.username };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        // If the error is TokenExpiredError, handle it silently
      } else {
        // For all other errors, log them
        this.logger.error(`JWT validation failed: ${error.message}`);
      }
      throw error;
    }
  }
}
