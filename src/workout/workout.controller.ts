import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateWorkoutInput } from './dto/create-workout.input';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/user.entity';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { create } from 'domain';
import { UpdateWorkoutDescriptionDto } from './dto/update-workout-description.dto';

@ApiTags('Workouts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workouts')
export class WorkoutController {
    constructor(private readonly workoutService: WorkoutService) {}

    @Post()
    @ApiOperation({ summary: 'Stwórz nowy trening' })
    create(@Body() dto: CreateWorkoutInput, @GetUser() user: User){
        return this.workoutService.create(dto, user);
    }

    @Get()
    @ApiOperation({ summary: 'Pobierz wszystkie treningi użytkownika' })
    findAll(@GetUser() user: User) {
        return this.workoutService.findAllByUser(user.user_id);
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
}