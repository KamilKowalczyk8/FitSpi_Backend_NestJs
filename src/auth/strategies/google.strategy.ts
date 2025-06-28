import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as GoogleStrategyBase, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(GoogleStrategyBase, 'google') {
  constructor(configService: ConfigService) {
    //pobieranie wartosci z pliku .env
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL');

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error('Missing Google OAuth environment variables');
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
      passReqToCallback: false,
    });
  }
    async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { name, emails } = profile;

    return {
            //Zwracasz dane użytkownika w formacie, który 
            // będzie dostępny jako req.user wewnątrz 
            // aplikacji – gotowe do np. zapisania w bazie lub 
            // utworzenia sesji.
            email: emails?.[0]?.value,
            firstName: name?.givenName,
            lastName: name?.familyName,
            accessToken,
    };
  }
}