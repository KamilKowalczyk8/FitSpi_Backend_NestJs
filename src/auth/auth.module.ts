import { Module} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { User } from '../users/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { MatchPasswords } from "./validators/match-passwords.validator";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),

        PassportModule.register({ defaultStrategy: 'jwt' }),

        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: '24h',
                    issuer: 'FitSpi',
                    audience: 'client',
                },
            }),
            inject: [ConfigService],
        })
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        JwtRefreshStrategy,
        MatchPasswords,     
    ],
    exports: [
        AuthService,
        PassportModule,
        JwtModule,
  ],
})
export class AuthModule {}
