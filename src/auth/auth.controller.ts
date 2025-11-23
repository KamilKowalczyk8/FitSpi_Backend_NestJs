import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/user.entity';
import { ApiTags, ApiBody, ApiResponse, ApiCookieAuth, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from 'src/users/role.enum';

@ApiTags('Auth')
@Controller('auth')
export class AuthController{
    constructor(private readonly authService: AuthService){}

@Post('register')
@ApiBody({ type: RegisterDto })
@ApiOperation({ summary: 'Rejestracja nowego użytkownika' })
@ApiResponse({ status: 201, description: 'Zarejestrowano pomyślnie' })
@ApiResponse({ status: 400, description: 'Nieprawidłowe dane' })
async register(@Body()
dto: RegisterDto) {
    const data = await this.authService.register(dto);
    return { success: true, ...data };
}

//---------------------------------------------------------------------------------------------------------------------------

//Obsługuje zapytanie POST /auth/login. 
// ✔ Pobiera dane logowania (email, password) i wysyła do AuthService. 
// ✔ Jeśli dane są poprawne, zwraca token JWT oraz użytkownika. 

@Post('login')
@HttpCode(200)
@ApiBody({ type: LoginDto })
@ApiOperation({ summary: 'Logowanie użytkownika' })
@ApiResponse({ status: 200, description: 'Zalogowano pomyślnie' })
@ApiResponse({ status: 401, description: 'Błędny e-mail lub hasło' })
async login(@Body()
dto: LoginDto) {
  const data = await this.authService.login(dto);
  return { success: true, ...data };
}

//---------------------------------------------------------------------------------------------------------------------------


@Post('logout')
  @ApiOperation({ summary: 'Wylogowano użytkownika' })
  @ApiBearerAuth('access-token') 
  @UseGuards(JwtAuthGuard)
  logout(@GetUser() user: User) { 
      
      console.log(`❌ Użytkownik wylogowany: ${user.email} (ID: ${user.user_id})`);
      console.log(`🕒 Czas: ${new Date().toISOString()}`);
      
      return { success: true, message: 'Wylogowano pomyślnie' };
  }

//---------------------------------------------------------------------------------------------------------------------------

//Endpoint GET /auth/currentUser zwraca dane użytkownika. 
// ✔ @UseGuards(JwtAuthGuard) → wymaga JWT, aby się zalogować. 
// ✔ Dekorator @GetUser() → pobiera dane użytkownika bezpośrednio z tokena.
@Get('currentUser')
@UseGuards(JwtAuthGuard) 
@ApiOperation({ summary: 'Pobierz dane zalogowanego użytkownika' })
@ApiBearerAuth('access-token') 
@ApiResponse({
    status:200,
    description: 'Zwraca dane zalogowanego użytkownika',
})
@ApiResponse({
    status: 401,
    description: 'Brak tokena lub użytkownik nieautoryzowany',
})
getCurrentUser(@GetUser() user:User){
    return { success: true, user};
}

//---------------------------------------------------------------------------------------------------------------------------

//Obsługuje GET /auth/admin.  
//✔ Wymaga JWT (JwtAuthGuard), czyli tylko zalogowani użytkownicy mają dostęp. 
//✔ Sprawdza, czy użytkownik ma rolę admin. 
//✔ Jeśli użytkownik nie jest adminem → zwraca błąd.
@Get('admin')
@UseGuards(JwtAuthGuard)
@ApiOperation({ summary: 'Dostęp do panelu administratora' })
@ApiBearerAuth('acces-token')
@ApiResponse({
    status: 200,
    description: 'Użytkownik ma dostęp do panelu admina',
    content:{
        'application/json': {
            example:{
                success: true,
                message: 'Witaj w panelu admina',
            },
        },
    },
})
@ApiResponse({
    status: 403,
    description: 'Brak uprawnień do panelu admina',
    content:{
        'application/json': {
            example:{
                success: false,
                message: 'Brak dostępu',
            },
        },
    },
})
@ApiResponse({
    status: 401,
    description: 'Brak tokena lub użytkownik nieautoryzowany',
    content:{
        'application/json': {
            example:{
                success: false,
                message: 'Nieautoryzowane żądanie',
            },
        },
    },
})
adminPanel(@GetUser() user: User){
    if (user.role_id !== Role.Admin) {
        return { success: false, error: 'Brak dostępu' };
    }
    return { success: true, message: 'Witaj w panelu admina!' }; 
}
}