import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '../users/role.enum';

@ApiTags('Auth')
@Injectable()
export class AuthService{

private readonly PASSWORD_POLICY = {
    minLength: 8,
    requireUpper: true,
    requireLower: true,
    requireNumber: true,
    requireSpecial: true,
};

constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
) {}

private validatePassword(password: string): { valid: boolean; errors?: string[] }{
    const errors: string[] = [];


    if (password.length < this.PASSWORD_POLICY.minLength)
        errors.push(`Hasło musi mieć co najmniej ${this.PASSWORD_POLICY.minLength} znaków`);
    
    if (this.PASSWORD_POLICY.requireUpper && !/[A-Z]/.test(password))
        errors.push('Hasło musi zawierać wielką literę');

    if (this.PASSWORD_POLICY.requireLower && !/[a-z]/.test(password))
        errors.push('Hasło musi zawierać małą literę');

    if (this.PASSWORD_POLICY.requireNumber && !/[0-9]/.test(password))
        errors.push('Hasło musi zawierać cyfrę');

    if (this.PASSWORD_POLICY.requireSpecial && !/[@$!%*?&]/.test(password))
        errors.push('Hasło musi zawierać znak specjalny');

 return errors.length === 0 ? { valid: true } : { valid: false, errors };
}


@Post('register')
@ApiOperation({ summary: 'Rejestracja nowego użytkownika' })
@ApiResponse({ status: 201, description: 'Zarejestrowano pomyślnie' })
@ApiResponse({ status: 400, description: 'Nieprawidłowe dane' })
async register(@Body() dto: RegisterDto){
    const email = dto.email.trim().toLowerCase();

    const passwordValidation = this.validatePassword(dto.password);
    if (!passwordValidation.valid) {
        throw new BadRequestException(
            `Nieprawidłowe hasło: ${passwordValidation.errors?.join(', ')}`,
        )
    }

    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing){
        throw new BadRequestException('Email jest już zajęty');
    }

    //haszowanie hasła im wieksza liczba tym wieksze bezpieczenstwo lecz wolniejsza aplikacja
    const hashed = await bcrypt.hash(dto.password, 12);

    const user = this.userRepo.create({
        first_name: dto.first_name.trim(),
        last_name: dto.last_name.trim(),
        email,
        password: hashed,
        is_active: true,
        role_id: Role.User,
    });

    //zapisuje do bazy nowego uzytkownika
    await this.userRepo.save(user);

    //generowanie tokena jwt
    const token = this.generateToken(user);

    return { user: this.safeUser(user), token };
}


@Post('login')
  @ApiOperation({ summary: 'Logowanie użytkownika' })
  @ApiResponse({ status: 200, description: 'Zalogowano pomyślnie' })
  @ApiResponse({ status: 401, description: 'Błędny e-mail lub hasło' })
  async login(@Body() dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

console.log('🔍 Email z żądania:', email);

    const user = await this.userRepo.findOne({ where: { email }});
    if (!user || !user.is_active){
        throw new UnauthorizedException('Nieprawidłowe dane logowania');
    }
    console.log('📌 Wprowadzane hasło:', dto.password);
    console.log('📌 Hash z bazy:', user.password);
    console.log('👤 Użytkownik z bazy:', user);
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
        throw new UnauthorizedException('Nieprawidłowe dane logowania');
    }

 console.log('🔐 Czy hasło pasuje:', isMatch);
    const token = this.generateToken(user);

    return { user: this.safeUser(user), access_token: token };

  }


 public generateToken(user: User): string {
    const payload: JwtPayload = {
        sub: user.user_id,
        email: user.email,
        role: user.role_id,
    };

    const token = this.jwtService.sign(payload, {
        expiresIn: '24h',
        issuer: 'FitSpi',
        audience: 'your-app-client',
    });

    console.log('✅ Token wygenerowany:', token);

    return token;
}


    private safeUser(user: User){
        const { password, ...safeData } = user;
        return safeData;
    }
}



