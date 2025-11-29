import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/users/user.entity';

@ApiTags('User Profile') 
@ApiBearerAuth() 
@UseGuards(JwtAuthGuard) 
@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Post()
  @ApiOperation({ summary: 'Stwórz profil (Waga,Wzrost,Cel)'})
  @ApiResponse({ status: 201, description: 'Profil utworzony zapotrzebowanie obliczone'})
  @ApiResponse({ status: 400, description: 'Użytkownik ma juz profil'})
  create(
    @GetUser() user: User,
    @Body() dto: CreateUserProfileDto
  ) {
    return this.userProfileService.create(user, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Pobierz profil z moim zapotrzebowaniem'})
  @ApiResponse({ status: 200, description: 'Zwraca profil'})
  @ApiResponse({ status: 400, description: 'Profil nie istnieje'})
  getProfile(@GetUser() user: User) {
    return this.userProfileService.getProfile(user);
  }

  @Patch()
  @ApiOperation({ summary: 'Zaktulaizuj profil'})
  @ApiResponse({ status: 200, description: 'Profil zaktualizowany'})
  @ApiResponse({ status: 400, description: 'Nie udało sie zaktualizować profilu'})
  update(
    @GetUser() user: User,
    @Body() dto: UpdateUserProfileDto
  ) {
    return this.userProfileService.update(user, dto)
  }
}
