import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Req,
  HttpCode,
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

@Controller('auth')
export class AuthController{
    constructor(private readonly authService: AuthService){}

@Post('register')
@ApiBody({ type: RegisterDto })
@ApiResponse({ status: 201, description: 'Zarejestrowano użytkownika' })
async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
 const { user, token } = await this.authService.register(dto);
 // res.cookie('token', token, { httpOnly: true, maxAge: 24*60*60*1000 });

  return { success: true, user, access_token: token };
}

//---------------------------------------------------------------------------------------------------------------------------

//Obsługuje zapytanie POST /auth/login. 
// ✔ Pobiera dane logowania (email, password) i wysyła do AuthService. 
// ✔ Jeśli dane są poprawne, zwraca token JWT oraz użytkownika. 

@Post('login')
@HttpCode(200)
@ApiBody({ type: LoginDto })
@ApiResponse({ status: 200, description: 'Zalogowano pomyślnie' })
async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
  const { user, access_token } = await this.authService.login(dto);

 /* res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000,
  });*/

  return { success: true, user, access_token };
}

//---------------------------------------------------------------------------------------------------------------------------

//wylogowanie uzytkownika usuwa ciasteczko i zwraca od 200

@Post('logout')
@ApiOperation({ summary: 'Wylogowano użytkownika' })
@ApiResponse({
    status: 200,
    description: 'Ciasteczko JWT zostało usunięte, wylogowano',
})
@ApiResponse({ 
    status: 500,
    description: 'Błąd serwera podczas wylogowania użytkownika',
})
logout(@Res ({ passthrough: true }) res: Response){
    res.clearCookie('token');
    return { success: true, message: 'Wylogowano pomyślnie' };
}

//---------------------------------------------------------------------------------------------------------------------------

//Endpoint GET /auth/currentUser zwraca dane użytkownika. 
// ✔ @UseGuards(JwtAuthGuard) → wymaga JWT, aby się zalogować. 
// ✔ Dekorator @GetUser() → pobiera dane użytkownika bezpośrednio z tokena.
@Get('currentUser')
@UseGuards(JwtAuthGuard) //JwtAuthGuard, który sprawdza, czy użytkownik jest zalogowany
@ApiOperation({ summary: 'Pobierz dane zalogowanego użytkownika' })
@ApiBearerAuth('access-token') // wymaga jwt do autoryzacji
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