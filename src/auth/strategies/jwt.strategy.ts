import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as JwtStrategyBase } from 'passport-jwt'; 
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../guards/jwt-auth.guard'; 
@Injectable()
export class JwtStrategy extends PassportStrategy(JwtStrategyBase) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET must be defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(), 
        (req) => req?.cookies?.token,
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
      issuer: 'FitSpi',
      audience: 'client',
    });
  }
    //Metoda validate() jest wywoływana po weryfikacji 
    // tokenu – decyduje, jakie dane trafiają do @Request() 
    // jako req.user
    async validate(payload: JwtPayload){
        //Zwraca obiekt użytkownika – będzie on dostępny w 
        // kontrolerach pod @Req().user. 
        // Czyli np. req.user.email, req.user.role
        return { id: payload.sub, email: payload.email, role: payload.role};
    }
}