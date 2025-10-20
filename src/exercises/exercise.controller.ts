import { Controller, Post, Body, UseGuards, Get, Delete, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/user.entity';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CreateExerciseInput } from './dto/create-exercise.input';
import { ExerciseResponse } from './dto/exercise.response';
import { UpdateExerciseInput } from './dto/update-exercise.input';

@ApiTags('Exercises')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('exercises')
export class ExerciseController{
    constructor(private readonly exerciseService: ExerciseService) {}

    //@Post() – obsługuje metodę POST na /exercises
    //@Body() – pobiera dane wejściowe przesłane w 
    // ciele żądania (np. name, reps, weight)
    //@GetUser() – pobiera zalogowanego użytkownika
    //this.exerciseService.create(...) – wywołuje funkcję z 
    // serwisu, która zapisuje ćwiczenie w bazie
    //Swagger opisuje endpoint i jego odpowiedź (201 Created, typ danych)
    @Post()
    @ApiOperation({ summary: 'Dodaj nowe ćwiczenie do dnia tygodnia' })
    @ApiResponse({ status: 201, description: 'Ćwiczenie zostało dodane', type: ExerciseResponse })
    create(
        @Body() dto: CreateExerciseInput,
        @GetUser() user: User,
    ): Promise<ExerciseResponse> {
        return this.exerciseService.create(dto, user);
    }

    

    //@Get() – odpowiada na GET /exercises
    //@GetUser() – znowu wyciąga dane użytkownika z tokena
    //Wywołuje metodę z serwisu: findAllByUser(...), która pobiera 
    // wszystkie ćwiczenia tego użytkownika
    //Swagger opisuje odpowiedź HTTP 200 OK jako tablicę ćwiczeń
    @Get()
    @ApiOperation({ summary: 'Pobierz ćwiczenie zalogowanego użytkownika' })
    @ApiResponse({ status: 200, description: 'Lista ćwiczeń', type: [ExerciseResponse] })
    findAll(@GetUser() user: User): Promise<ExerciseResponse[]> {
        return this.exerciseService.findAllByUser(user.user_id);
    }

    @Patch(':id') 
    @ApiOperation({ summary: 'Zaktualizuj ćwiczenie po ID' })
    @ApiParam({ name: 'id', required: true, description: 'ID ćwiczenia' })
    @ApiResponse({ status: 200, description: 'Ćwiczenie zostało zaktualizowane', type: ExerciseResponse })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateExerciseInput,
        @GetUser() user: User,
    ): Promise<ExerciseResponse> {
        return this.exerciseService.updateExercise(id, user.user_id, dto);
    }


    @Delete(':id')
    @ApiOperation({ summary: 'Usuń cwiczenie po ID' })
    @ApiParam({ name: 'id', required: true, description: 'ID ćwiczenia' })
    @ApiResponse({ status: 200, description: 'Ćwiczenie zostało usunięte' })
    delete(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
        return this.exerciseService.deleteExercise(id, user.user_id);
    }
}