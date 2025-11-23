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
  Query,
} from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateWorkoutInput } from './dto/create-workout.input';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/user.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { create } from 'domain';
import { UpdateWorkoutDescriptionDto } from './dto/update-workout-description.dto';
import { AssignWorkoutDto } from './dto/assign-workout.dto';
import { WorkoutStatus } from './workout-status.enum';

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
    @ApiOperation({ summary: 'Pobierz treningi (domyślnie tylko zaakceptowane, chyba że podasz status)' })
    @ApiQuery({ name: 'status', enum: WorkoutStatus, required: false }) 
    findAll(
        @GetUser() user: User,
        @Query('status') status?: WorkoutStatus 
    ) {
        return this.workoutService.findAllByUser(user.user_id, status);
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


    @Post('user/:clientId')
    @ApiOperation({ summary: '[TRENER] Wyślij propozycję treningu do podopiecznego' })
    createForClient(
        @Param('clientId', ParseIntPipe) clientId: number,
        @Body() dto: CreateWorkoutInput,
        @GetUser() trainer: User,
    ) {
        return this.workoutService.createProposalForClient(dto, clientId, trainer.user_id)
    }
    @Patch(':id/send')
    @ApiOperation({ summary: '[TRENER] Wyślij szkic treningu do podopiecznego (Draft -> Pending)' })
    sendToClient(
        @Param('id', ParseIntPipe) workoutId: number,
        @GetUser() trainer: User,
    ) {
        return this.workoutService.sendWorkoutToClient(workoutId, trainer.user_id);
    }



    @Patch(':id/accept')
    @ApiOperation({ summary: '[KLIENT] Zaakceptuj trening i ustaw datę' })
    acceptProposal(
      @Param('id', ParseIntPipe) workoutId: number,
      @Body('date') dateString: string, 
      @GetUser() user: User
    ) {
      const date = new Date(dateString);
      return this.workoutService.acceptWorkout(workoutId, user.user_id, date);
    }
    @Patch(':id/reject')
    @ApiOperation({ summary: '[KLIENT] Odrzuć propozycję treningu' })
    rejectProposal(
        @Param('id', ParseIntPipe) workoutId: number,
        @GetUser() user: User,
    ) {
        return this.workoutService.rejectWorkout(workoutId, user.user_id);
    }
}