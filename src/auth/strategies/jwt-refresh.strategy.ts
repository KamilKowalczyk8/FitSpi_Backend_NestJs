import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as JwtStrategyBase } from 'passport-jwt'; 
import { ConfigService } from '@nestjs/config';
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(JwtStrategyBase, 'jwt-refresh') {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_REFRESH_SECRET');
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET must be defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.refresh_token,
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
      issuer: 'your-app-name',
      audience: 'your-app-client',
    });
  }
  async validate(payload: any) {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
    