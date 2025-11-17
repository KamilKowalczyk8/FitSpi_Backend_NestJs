import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateWorkoutInput } from './dto/create-workout.input';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/user.entity';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { create } from 'domain';
import { UpdateWorkoutDescriptionDto } from './dto/update-workout-description.dto';
import { AssignWorkoutDto } from './dto/assign-workout.dto';

@ApiTags('Workouts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workouts')
export class WorkoutController {
    constructor(private readonly workoutService: WorkoutService) {}

    @Post()
    @ApiOperation({ summary: 'Stwórz nowy trening (dla samego siebie)' })
    create(@Body() dto: CreateWorkoutInput, @GetUser() user: User){
        console.log('Zalogowany user:', user);
        return this.workoutService.create(dto, user);
    }

    @Get()
    @ApiOperation({ summary: 'Pobierz wszystkie treningi użytkownika' })
    findAll(@GetUser() user: User) {
        return this.workoutService.findAllByUser(user.user_id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Usuń dany trening' })
    deleteWorkout(@Param('id') id: number, @GetUser() user: User) {
        return this.workoutService.deleteWorkout(Number(id), user.user_id);
    }

    @Patch(':id/description')
    @ApiOperation({ summary: 'Edytuj tytuł danego treningu'})
    updateDescription(
        @Param('id') id: number,
        @Body() dto: UpdateWorkoutDescriptionDto,
        @GetUser() user: User,
    ){
        return this.workoutService.editNameWorkout(id, user.user_id, dto.description);
    }

    @Post(':workoutId/assign')
    @ApiOperation({ summary: '[TRENER] Przypisz (skopiuj) swój trening do podopiecznego' })
    assignWorkout(
        @GetUser() trainer: User,
        @Param('workoutId', ParseIntPipe) workoutId: number,
        @Body() dto: AssignWorkoutDto,
    ) {
    return this.workoutService.assignWorkoutToClient(
      trainer,
      workoutId,
      dto.clientId,
      new Date(dto.date),
    );
    }


    @Get('client/:clientId/from-trainer')
    @ApiOperation({ summary: 'Treningi które zostały stworzone przez trenera dla danego podopiecznego' })
    getClientWorkoutsFromTrainer(
        @Param('clientId', ParseIntPipe) clientId: number,
        @GetUser() trainer: User,
    ) {
        return this.workoutService.getWorkoutsCreatedForClient(
            trainer.user_id,
            clientId,
        );
    }
}